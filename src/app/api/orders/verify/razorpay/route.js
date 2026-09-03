export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import crypto from "crypto";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!orderId || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing required payment parameters." },
        { status: 400 }
      );
    }

    // Generate HMAC SHA256 signature using Razorpay Key Secret
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      const order = await Order.findById(orderId);
      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found." },
          { status: 404 }
        );
      }

      // Update order payment status in database
      order.paymentStatus = "Paid";
      order.status = "Processing";
      order.paymentId = razorpay_payment_id;
      await order.save();

      return NextResponse.json(
        { success: true, message: "Payment verified successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature." },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}