import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ["category", "subcategory"], required: true },
  parentCategory: { type: String, default: null }, // Agar subcategory hai toh parent category ka naam yahan aayega
  image: { type: String, default: "" }, // Category ki image ka URL yahan save hoga
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);