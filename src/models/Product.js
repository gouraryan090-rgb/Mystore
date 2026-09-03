import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, default: "" },
    images: { type: [String], default: [] },
    imageUrl: { type: String, default: "" },
    sizes: { type: [String], default: [] },
    colorVariants: [
      {
        color: { type: String },
        images: { type: [String], default: [] },
        stock: { type: Number, default: 10 }
      }
    ],
    sizeStockVariants: [
      {
        size: { type: String },
        color: { type: String },
        stock: { type: Number, default: 10 }
      }
    ],
    stock: { type: Number, default: 10 } // Overall stock for single products (phones, etc.) or fallback
  },
  { timestamps: true }
);

// Delete existing model to prevent overwrite warning during development
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

export default mongoose.model("Product", ProductSchema);