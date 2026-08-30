export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { customerName, phone, address, productId, productTitle, amount, email, shippingAddress, items, totalAmount, paymentMethod } = body;

    const finalEmail = email || shippingAddress?.email;
    const finalAmount = amount || totalAmount;

    const newOrder = await Order.create({
      customerName: customerName || shippingAddress?.name,
      phone: phone || shippingAddress?.phone,
      address: address || shippingAddress?.address,
      productId,
      productTitle,
      amount: finalAmount,
      totalAmount: finalAmount,
      email: finalEmail,
      shippingAddress: shippingAddress || { name: customerName, phone, address, email: finalEmail },
      items: items || [{ title: productTitle, price: finalAmount, quantity: 1 }],
      paymentMethod: paymentMethod || "COD",
      status: "Placed"
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (err) {
    console.error("Order Create Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    let query = {};
    if (email) {
      query = {
        $or: [
          { email: { $regex: new RegExp(`^${email.trim()}$`, "i") } },
          { "shippingAddress.email": { $regex: new RegExp(`^${email.trim()}$`, "i") } }
        ]
      };
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}