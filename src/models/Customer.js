import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number },
  imageUrl: { type: String },
  quantity: { type: Number, default: 1 }
});

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    cart: { type: [CartItemSchema], default: [] }, // 🛒 Yeh database me cart items save rakhega
  },
  { timestamps: true }
);

if (mongoose.models.Customer) {
  delete mongoose.models.Customer;
}

export default mongoose.model("Customer", CustomerSchema);