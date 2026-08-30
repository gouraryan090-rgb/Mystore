import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET(request) {
  try {
    await dbConnect();
    const result = await Order.deleteMany({});
    return NextResponse.json({ success: true, message: `${result.deletedCount} orders deleted successfully.` }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}