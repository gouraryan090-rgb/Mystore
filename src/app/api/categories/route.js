import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

// GET: Saari categories fetch karne ke liye
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({});
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Nayi Category ya Sub-category create karne ke liye
export async function POST(req) {
  try {
    await connectDB();
    const { name, type, parentCategory } = await req.json();

    if (!name || !type) {
      return NextResponse.json({ success: false, error: "Name aur Type dena zaroori hai!" }, { status: 400 });
    }

    const newCategory = new Category({
      name,
      type,
      parentCategory: type === "subcategory" ? parentCategory : null,
    });

    await newCategory.save();
    return NextResponse.json({ success: true, message: "Successfully created!", data: newCategory });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}