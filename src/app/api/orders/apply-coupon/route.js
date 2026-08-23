import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    await dbConnect();
    const { code, totalAmount, userEmail } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, message: "Please enter a coupon code." }, { status: 400 });
    }

    // 1. Check coupon in database
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return NextResponse.json({ success: false, message: "Invalid coupon code!" }, { status: 400 });
    }

    // 2. Check expiry date
    if (coupon.validTill && new Date() > new Date(coupon.validTill)) {
      return NextResponse.json({ success: false, message: "This coupon has expired!" }, { status: 400 });
    }

    // 3. Check Minimum Order Amount
    if (totalAmount < coupon.minOrderAmount) {
      return NextResponse.json({ 
        success: false, 
        message: `This coupon is only applicable on orders of ₹${coupon.minOrderAmount} or more!` 
      }, { status: 400 });
    }

    // 4. Safe User Order Count Check
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
        message: "This coupon is only for new users (You have already placed an order)." 
      }, { status: 400 });
    }

    if (coupon.couponFor === "old" && userOrderCount === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "This coupon is only for existing users." 
      }, { status: 400 });
    }

    // Calculate discount when all conditions pass
    const discountAmount = Math.round((totalAmount * coupon.discountPercentage) / 100);
    const finalAmount = totalAmount - discountAmount;

    return NextResponse.json({
      success: true,
      message: `${coupon.discountPercentage}% discount applied successfully!`,
      discountPercentage: coupon.discountPercentage,
      discountAmount,
      finalAmount,
    }, { status: 200 });

  } catch (error) {
    console.error("Apply Coupon Error:", error);
    return NextResponse.json({ success: false, message: error.message || "A server error occurred." }, { status: 500 });
  }
}