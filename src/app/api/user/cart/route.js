import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Customer from "@/models/Customer";

// MongoDB connection helper (agar aapke project me pehle se hai toh aap use import bhi kar sakte hain)
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// 1. GET: User ka saved cart fetch karne ke liye
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return NextResponse.json({ success: true, cart: [] });
    }

    return NextResponse.json({ success: true, cart: customer.cart });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST: Cart update/save karne ke liye (Jab bhi user add/remove kare)
export async function POST(req) {
  try {
    await connectDB();
    const { email, cart } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
    }

    // Customer dhoondo, agar nahi hai toh create kar do, aur cart update karo
    const updatedCustomer = await Customer.findOneAndUpdate(
      { email },
      { $set: { cart } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, cart: updatedCustomer.cart });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}