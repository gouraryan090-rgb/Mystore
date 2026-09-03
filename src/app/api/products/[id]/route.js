import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const body = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        originalPrice: body.originalPrice,
        offerPrice: body.offerPrice,
        category: body.category,
        subCategory: body.subCategory,
        images: body.images,
        imageUrl: body.imageUrl,
        sizes: body.sizes,
        colorVariants: body.colorVariants,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Product updated successfully", data: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}