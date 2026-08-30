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

    // Frontend se bheja gaya email, shippingAddress ka email, ya body se userId/email capture karein
    const customerEmail = body.email || body.shippingAddress?.email || "";
    const customerUserId = body.userId || customerEmail || "guest_user";
    const customerPhone = body.shippingAddress?.phone || "9999999999";
    const orderAmount = Number(body.totalAmount);

    if (!orderAmount || orderAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid order amount." },
        { status: 400 }
      );
    }

    // Create COD Order in Database with explicit email and userId
    const codOrder = await Order.create({
      items: formattedItems,
      shippingAddress: body.shippingAddress,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      status: "Placed",
      totalAmount: orderAmount,
      email: customerEmail,
      userId: customerUserId, // Yahan ab proper user id/email save hogi
    });

    const codOrderIdStr = codOrder._id.toString();

    // Send Email Notification with PDF Invoice
    if (customerEmail) {
      sendOrderEmail(
        customerEmail,
        codOrderIdStr,
        "created",
        {
          customerName: codOrder.shippingAddress?.name || "Customer",
          phone: customerPhone,
          address: codOrder.shippingAddress?.address || "N/A",
          items: codOrder.items,
          amount: codOrder.totalAmount,
          totalAmount: codOrder.totalAmount,
          paymentMethod: "COD"
        }
      ).catch((err) =>
        console.error("Background COD email error:", err)
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "COD Order placed successfully!",
        orderId: codOrderIdStr,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("COD Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}