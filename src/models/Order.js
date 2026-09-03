import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "guest_user" },
    email: { type: String, default: "" },
    items: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: { type: String, required: true },
        offerPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        selectedColor: { type: String, default: null },
        selectedSize: { type: String, default: null },
        imageUrl: { type: String, default: "" },
      }
    ],
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