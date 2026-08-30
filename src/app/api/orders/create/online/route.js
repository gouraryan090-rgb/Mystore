export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { sendOrderEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const formattedItems = (body.items || []).map((item) => ({
      title: item.title || item.name || item.productName || "Product Item",
      quantity: item.quantity || item.qty || 1,
      price: item.offerPrice || item.price || 0,
      images: item.images || (item.imageUrl ? [item.imageUrl] : []),
      variant: item.variant || item.selectedColor || "",
    }));

    const customerEmail = body.email || body.shippingAddress?.email || "customer@example.com";
    const customerPhone = body.shippingAddress?.phone || "9999999999";
    const orderAmount = Number(body.totalAmount);

    if (!orderAmount || orderAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid order amount." },
        { status: 400 }
      );
    }

    // Create Pending Online Order in Database with explicit email
    const onlineOrder = await Order.create({
      items: formattedItems,
      shippingAddress: body.shippingAddress,
      paymentMethod: "Online",
      paymentStatus: "Pending",
      status: "Pending Payment",
      totalAmount: orderAmount,
      email: customerEmail,
    });

    const orderIdStr = onlineOrder._id.toString();

    // Cashfree Payment Session Generation Logic
    const cashfreeEnv = process.env.CASHFREE_ENVIRONMENT || "TEST";
    const cashfreeBaseUrl = cashfreeEnv === "PRODUCTION" 
      ? "https://api.cashfree.com/pg/orders" 
      : "https://sandbox.cashfree.com/pg/orders";

    const cashfreePayload = {
      order_id: orderIdStr,
      order_amount: orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerEmail.replace(/[^a-zA-Z0-9]/g, "_"),
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_name: onlineOrder.shippingAddress?.name || "Customer",
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/orders/${orderIdStr}?order_id=${orderIdStr}`,
      },
    };

    const cashfreeResponse = await fetch(cashfreeBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
        "x-api-version": process.env.CASHFREE_API_VERSION || "2022-09-01",
      },
      body: JSON.stringify(cashfreePayload),
    });

    const cashfreeData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok || !cashfreeData.payment_session_id) {
      console.error("Cashfree Error:", cashfreeData);
      return NextResponse.json(
        { success: false, message: cashfreeData.message || "Failed to initialize payment gateway." },
        { status: 400 }
      );
    }

    // Update order with payment session id if needed
    onlineOrder.paymentSessionId = cashfreeData.payment_session_id;
    await onlineOrder.save();

    return NextResponse.json(
      {
        success: true,
        payment_session_id: cashfreeData.payment_session_id,
        orderId: orderIdStr,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Online Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}