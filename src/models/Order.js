import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "guest_user" },
    items: Array,
    shippingAddress: Object,
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: "Pending" },
    status: { 
      type: String, 
      default: "Pending" // Yeh admin ke "All" / unmarked orders ke liye hoga
    },
    totalAmount: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);