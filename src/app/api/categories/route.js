import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

// GET: Fetch all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({});
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new Category or Sub-category
export async function POST(req) {
  try {
    await connectDB();
    const { name, type, parentCategory, image } = await req.json();

    if (!name || !type) {
      return NextResponse.json({ success: false, error: "Name and type are required!" }, { status: 400 });
    }

    const newCategory = new Category({
      name,
      type,
      parentCategory: type === "subcategory" ? parentCategory : null,
      image: image || "",
    });

    await newCategory.save();
    return NextResponse.json({ success: true, message: "Successfully created!", data: newCategory });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing Category or Sub-category
export async function PUT(req) {
  try {
    await connectDB();
    const { id, name, type, parentCategory, image } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Category ID is required for updating!" }, { status: 400 });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        type,
        parentCategory: type === "subcategory" ? parentCategory : null,
        image: image || "",
      },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({ success: false, error: "Category not found!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Successfully updated!", data: updatedCategory });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Delete an existing Category or Sub-category
export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Category ID is required for deletion!" }, { status: 400 });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({ success: false, error: "Category not found!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Successfully deleted!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}