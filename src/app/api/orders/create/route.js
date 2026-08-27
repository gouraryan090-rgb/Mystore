export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { sendOrderEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Yahan items ko map karke ensure karein ki 'title' hamesha sahi property se uthe
    const formattedItems = (body.items || []).map((item) => ({
      title: item.title || item.name || item.productName || "Product Item",
      quantity: item.quantity || item.qty || 1,
      price: item.offerPrice || item.price || 0,
      images: item.images || [item.imageUrl] || [],
      variant: item.variant || item.selectedColor || ""
    }));

    const newOrder = await Order.create({
      items: formattedItems,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentStatus || "Pending",
      totalAmount: body.totalAmount,
      orderStatus: "Placed",
    });

    const customerEmail = body.shippingAddress?.email || body.email;

    if (customerEmail) {
      sendOrderEmail(customerEmail, newOrder._id.toString(), "created", {
        customerName: newOrder.shippingAddress?.name || "Customer",
        phone: newOrder.shippingAddress?.phone || "N/A",
        address: newOrder.shippingAddress?.address || "N/A",
        items: newOrder.items,
        amount: newOrder.totalAmount,
        totalAmount: newOrder.totalAmount,
      }).catch((err) =>
        console.error("Background email error:", err)
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Order placed successfully!", 
        orderId: newOrder._id.toString() 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Create Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}