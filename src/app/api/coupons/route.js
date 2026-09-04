import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function GET() {
  try {
    await dbConnect();
    // Sirf active coupons fetch honge checkout ke liye
    const coupons = await Coupon.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: coupons }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}