import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "guest_user" },
    email: { type: String, default: "" }, // Yahan email field add karna zaroori hai
    items: Array,
    shippingAddress: Object,
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: "Pending" },
    status: { 
      type: String, 
      default: "Pending"
    },
    totalAmount: Number,
    cashfreeOrderId: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);