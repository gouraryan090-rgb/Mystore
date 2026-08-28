import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req) {
  try {
    await dbConnect();
    
    // URL se email query parameter extract karein
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    let query = {};
    if (email) {
      query.email = email; // Agar aapke schema me field ka naam alag hai (jaise customerEmail), toh yahan change kar lena
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}