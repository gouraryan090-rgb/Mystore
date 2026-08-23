import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, default: "" }, // <--- Yeh nayi field add kar di hai
    images: { type: [String], default: [] },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// Delete existing model to prevent overwrite warning during development
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

export default mongoose.model("Product", ProductSchema);