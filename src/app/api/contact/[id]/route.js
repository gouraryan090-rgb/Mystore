import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

// 🔍 GET: Specific query ko ID ke zariye fetch karne ke liye
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const message = await ContactMessage.findById(id);

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message nahi mila." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: message },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Query ka status update karne ke liye (Click to Resolve / Pending)
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    );

    if (!updatedMessage) {
      return NextResponse.json(
        { success: false, message: "Message nahi mila." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedMessage },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🗑️ DELETE: Specific query ko ID ke zariye delete karne ke liye
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const deletedMessage = await ContactMessage.findByIdAndDelete(id);

    if (!deletedMessage) {
      return NextResponse.json(
        { success: false, message: "Message nahi mila." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Query successfully delete ho gayi!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}