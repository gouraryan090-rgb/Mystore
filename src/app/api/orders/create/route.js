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

    const customerEmail =
      body.shippingAddress?.email || body.email || "customer@example.com";

    const customerPhone =
      body.shippingAddress?.phone || "9999999999";

    const isOnlinePayment =
      body.paymentMethod === "Online" ||
      body.paymentMethod === "ONLINE" ||
      body.paymentMethod === "Cashfree";

    let paymentSessionId = null;
    let cashfreeOrderId = null;
    let tempOrderIdStr = null;

    // --------------------------------------------------
    // 1. CREATE LOCAL ORDER
    // --------------------------------------------------

    const initialOrder = await Order.create({
      items: formattedItems,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      paymentStatus: "Pending",
      status: isOnlinePayment ? "Payment Pending" : "Placed",
      totalAmount: Number(body.totalAmount) || 0,
    });

    tempOrderIdStr = initialOrder._id.toString();

    // Cashfree order ID
    cashfreeOrderId = `order_${tempOrderIdStr}`;

    // --------------------------------------------------
    // 2. CASHFREE ORDER CREATION
    // --------------------------------------------------

    if (isOnlinePayment) {
      const clientId = process.env.CASHFREE_CLIENT_ID;
      const clientSecret = process.env.CASHFREE_SECRET_KEY;

      // Environment variables check
      if (!clientId || !clientSecret) {
        console.error("Cashfree credentials are missing.");

        await Order.findByIdAndDelete(initialOrder._id);

        return NextResponse.json(
          {
            success: false,
            message:
              "Cashfree credentials are missing. Check CASHFREE_CLIENT_ID and CASHFREE_SECRET_KEY in .env.local",
          },
          { status: 500 }
        );
      }

      const orderAmount = Number(body.totalAmount);

      if (!orderAmount || orderAmount <= 0) {
        await Order.findByIdAndDelete(initialOrder._id);

        return NextResponse.json(
          {
            success: false,
            message: "Invalid order amount.",
          },
          { status: 400 }
        );
      }

      const cashfreeRes = await fetch(
        "https://sandbox.cashfree.com/pg/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "x-client-id": clientId,
            "x-client-secret": clientSecret,
            "x-api-version": "2026-01-01",
          },

          body: JSON.stringify({
            order_id: cashfreeOrderId,
            order_amount: orderAmount,
            order_currency: "INR",

            customer_details: {
              customer_id: customerEmail
                .replace(/[^a-zA-Z0-9_-]/g, "_")
                .slice(0, 50),

              customer_phone: customerPhone,
              customer_email: customerEmail,
            },

            order_meta: {
              return_url: `${
                process.env.NEXT_PUBLIC_BASE_URL ||
                "http://localhost:3000"
              }/checkout/payment?order_id=${tempOrderIdStr}`,
            },
          }),
        }
      );

      const cashfreeData = await cashfreeRes.json();

      // --------------------------------------------------
      // 3. CASHFREE RESPONSE CHECK
      // --------------------------------------------------

      if (
        cashfreeRes.ok &&
        cashfreeData.payment_session_id
      ) {
        paymentSessionId = cashfreeData.payment_session_id;

        // Save Cashfree order ID in MongoDB
        await Order.findByIdAndUpdate(initialOrder._id, {
          cashfreeOrderId: cashfreeOrderId,
        });
      } else {
        console.error(
          "Cashfree API Detailed Error:",
          cashfreeData
        );

        // Cashfree order creation failed,
        // so remove the temporary local order.
        await Order.findByIdAndDelete(initialOrder._id);

        return NextResponse.json(
          {
            success: false,
            message:
              cashfreeData.message ||
              "Failed to initialize Cashfree payment",
            cashfreeError: cashfreeData,
          },
          { status: 400 }
        );
      }
    }

    // --------------------------------------------------
    // 4. COD EMAIL
    // --------------------------------------------------

    if (customerEmail && !isOnlinePayment) {
      sendOrderEmail(
        customerEmail,
        tempOrderIdStr,
        "created",
        {
          customerName:
            initialOrder.shippingAddress?.name ||
            "Customer",

          phone: customerPhone,

          address:
            initialOrder.shippingAddress?.address ||
            "N/A",

          items: initialOrder.items,

          amount: initialOrder.totalAmount,

          totalAmount: initialOrder.totalAmount,
        }
      ).catch((err) =>
        console.error(
          "Background email error:",
          err
        )
      );
    }

    // --------------------------------------------------
    // 5. SUCCESS RESPONSE
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        message: "Order initialized successfully!",

        orderId: tempOrderIdStr,

        payment_session_id: paymentSessionId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API Create Order Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Server Error",
      },
      { status: 500 }
    );
  }
}

