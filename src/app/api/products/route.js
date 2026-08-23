import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";

// GET: Fetch all products
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Add a new product
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const newProduct = await Product.create({
      title: body.title,
      description: body.description,
      originalPrice: body.originalPrice,
      offerPrice: body.offerPrice,
      category: body.category,
      subCategory: body.subCategory, // <-- subCategory is added here
      images: body.images,
      imageUrl: body.images?.[0] || "", // For fallback
    });

    return NextResponse.json(
      { success: true, message: "Product added successfully!", data: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add Product Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing product
export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required for update" },
        { status: 400 }
      );
    }

    // If images are being updated, update imageUrl as well
    if (updateData.images && updateData.images.length > 0) {
      updateData.imageUrl = updateData.images[0];
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Product updated successfully!", data: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Product Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Product deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Product Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}