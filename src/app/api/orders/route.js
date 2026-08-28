import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { customerName, phone, address, productId, productTitle, amount, email } = body;

    if (!customerName || !phone || !address || !productId) {
      return NextResponse.json(
        { success: false, error: "All details are required!" },
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
      email, // Order create hote waqt email bhi save karein
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    
    // URL query se email nikalein
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    let query = {};
    if (email) {
      // Agar email di gayi hai toh sirf usi user ke orders filter karein
      query = {
        $or: [
          { email: email },
          { "shippingAddress.email": email }
        ]
      };
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}