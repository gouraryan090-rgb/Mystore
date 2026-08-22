import mongoose from "mongoose";

const ExtraChargeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Charge Name (e.g., COD Fee, Packaging Fee)
  price: { type: Number, required: true }, // Charge Amount
  chargeFor: { type: String, enum: ["new", "old", "both"], default: "both" }, // User type
  maxOrderPrice: { type: Number, required: true }, // Isse kam ya barabar ke order par lagega (Order under price)
  paymentMethod: { type: String, enum: ["ALL", "COD", "RAZORPAY"], default: "ALL" }, // Kahan apply karna hai
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.ExtraCharge || mongoose.model("ExtraCharge", ExtraChargeSchema);