import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // Aapke project ka jo bhi mongodb connection import ho
import mongoose from "mongoose";

// Mongoose Schema for Extra Charges
const ExtraChargeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  chargeFor: { type: String, default: "both" },
  maxOrderPrice: { type: Number, required: true },
  paymentMethod: { type: String, default: "ALL" },
});

const ExtraCharge = mongoose.models.ExtraCharge || mongoose.model("ExtraCharge", ExtraChargeSchema);

// GET: Sabhi extra charges fetch karne ke liye
export async function GET() {
  try {
    await connectDB();
    const charges = await ExtraCharge.find({});
    return NextResponse.json({ success: true, data: charges }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Naya extra charge banane ke liye
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newCharge = await ExtraCharge.create(body);
    return NextResponse.json({ success: true, data: newCharge }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Charge delete karne ke liye
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID nahi mili!" }, { status: 400 });
    }

    await ExtraCharge.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}