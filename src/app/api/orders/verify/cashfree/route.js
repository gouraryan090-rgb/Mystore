export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { orderId, cashfree_order_id } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    // Call Cashfree API to check payment status
    const cashfreeEnv = process.env.CASHFREE_ENVIRONMENT || "TEST";
    const cashfreeBaseUrl = cashfreeEnv === "PRODUCTION" 
      ? `https://api.cashfree.com/pg/orders/${orderId}` 
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    const cashfreeResponse = await fetch(cashfreeBaseUrl, {
      method: "GET",
      headers: {
        "x-client-id": process.env.CASHFREE_CLIENT_ID || process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET || process.env.NEXT_PUBLIC_CASHFREE_CLIENT_SECRET,
        "x-api-version": process.env.CASHFREE_API_VERSION || "2022-09-01",
      },
    });

    const cashfreeData = await cashfreeResponse.json();

    if (cashfreeResponse.ok && cashfreeData.order_status === "PAID") {
      order.paymentStatus = "Paid";
      order.status = "Processing";
      order.paymentId = cashfreeData.cf_payment_id || cashfree_order_id;
      await order.save();

      return NextResponse.json(
        { success: true, message: "Payment verified successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Payment is not paid or failed.", data: cashfreeData },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Cashfree Verification Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}