import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { customerName, phone, address, productId, productTitle, amount } = body;

    if (!customerName || !phone || !address || !productId) {
      return NextResponse.json(
        { success: false, error: "Saari details bharna zaroori hai!" },
        { status: 400 }
      );
    }

    const newOrder = await Order.create({
      customerName,
      phone,
      address,
      productId,
      productTitle,
      amount,
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}