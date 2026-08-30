import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    await dbConnect();
    const { orderIds, status } = await request.json();

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ success: false, message: "No orders selected." }, { status: 400 });
    }

    if (!status) {
      return NextResponse.json({ success: false, message: "Status is required." }, { status: 400 });
    }

    // Saare selected orders ka status update kar do
    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: { status: status } }
    );

    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} orders updated successfully.`,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}