export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const newOrder = await Order.create({
      items: body.items,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentStatus || "Pending",
      totalAmount: body.totalAmount,
      orderStatus: "Placed",
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Order placed successfully!", 
        orderId: newOrder._id.toString() 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Create Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}