import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountPercentage: { type: Number, required: true }, // e.g., 10%
    minOrderAmount: { type: Number, required: true },    // e.g., ₹500 ke upar hi lagega
    couponFor: { 
      type: String, 
      enum: ["all", "new", "old"], 
      default: "all" 
    }, // "all" = Every user, "new" = New users only, "old" = Existing users only
    validTill: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);