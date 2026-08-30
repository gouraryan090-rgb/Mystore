export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");

    console.log("-> Searching orders for email:", email, "phone:", phone);

    let query = {};
    
    if (email && phone) {
      query = {
        $or: [
          { email: { $regex: new RegExp(`^${email.trim()}$`, "i") } },
          { "shippingAddress.email": { $regex: new RegExp(`^${email.trim()}$`, "i") } },
          { phone: phone.trim() },
          { "shippingAddress.phone": phone.trim() }
        ]
      };
    } else if (email) {
      query = {
        $or: [
          { email: { $regex: new RegExp(`^${email.trim()}$`, "i") } },
          { "shippingAddress.email": { $regex: new RegExp(`^${email.trim()}$`, "i") } }
        ]
      };
    } else if (phone) {
      query = {
        $or: [
          { phone: phone.trim() },
          { "shippingAddress.phone": phone.trim() }
        ]
      };
    }

    // Sabhi orders fetch karke console me check karenge ki kya match ho raha hai
    const orders = await Order.find(query).sort({ createdAt: -1 });
    
    console.log(`-> Found ${orders.length} orders for query`);

    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error) {
    console.error("My Orders API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}