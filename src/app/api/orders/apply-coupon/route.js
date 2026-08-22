import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    await dbConnect();
    const { code, totalAmount, userEmail } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, message: "Kripya coupon code darj karein." }, { status: 400 });
    }

    // 1. Coupon database me check karein
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return NextResponse.json({ success: false, message: "Amanya (Invalid) coupon code!" }, { status: 400 });
    }

    // 2. Expiry date check karein
    if (coupon.validTill && new Date() > new Date(coupon.validTill)) {
      return NextResponse.json({ success: false, message: "Yeh coupon expire ho chuka hai!" }, { status: 400 });
    }

    // 3. Min Order Amount check karein
    if (totalAmount < coupon.minOrderAmount) {
      return NextResponse.json({ 
        success: false, 
        message: `Yeh coupon kam se kam ₹${coupon.minOrderAmount} ke order par hi lag sakta hai!` 
      }, { status: 400 });
    }

    // 4. Safe User Order Count Check (Agar email na ho toh 0 maan lo)
    let userOrderCount = 0;
    if (userEmail && userEmail !== "customer@example.com") {
      try {
        userOrderCount = await Order.countDocuments({ 
          $or: [{ userEmail: userEmail }, { "shippingAddress.email": userEmail }, { "shippingAddress.phone": userEmail }] 
        });
      } catch (err) {
        console.log("Order count skip error:", err);
      }
    }

    if (coupon.couponFor === "new" && userOrderCount > 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Yeh coupon sirf naye users ke liye hai (Aapka pehle order ho chuka hai)." 
      }, { status: 400 });
    }

    if (coupon.couponFor === "old" && userOrderCount === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Yeh coupon sirf purane/existing users ke liye hai." 
      }, { status: 400 });
    }

    // Sabhi conditions pass hone par discount calculate karein
    const discountAmount = Math.round((totalAmount * coupon.discountPercentage) / 100);
    const finalAmount = totalAmount - discountAmount;

    return NextResponse.json({
      success: true,
      message: `${coupon.discountPercentage}% discount lag gaya hai!`,
      discountPercentage: coupon.discountPercentage,
      discountAmount,
      finalAmount,
    }, { status: 200 });

  } catch (error) {
    console.error("Apply Coupon Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server error ho gaya." }, { status: 500 });
  }
}