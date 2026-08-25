import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }, // 📱 Phone number field
    topic: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "Pending" }, // 🔄 Status field (Pending / Resolved)
  },
  { timestamps: true }
);

export default mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", ContactMessageSchema);