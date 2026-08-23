export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order nahi mila!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Single Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const body = await request.json();
    const { newStatus } = body;

    if (!newStatus) {
      return NextResponse.json(
        { success: false, message: "New status zaroori hai!" },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: newStatus, orderStatus: newStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order database mein nahi mila!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Order status updated successfully", data: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Order Status API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}