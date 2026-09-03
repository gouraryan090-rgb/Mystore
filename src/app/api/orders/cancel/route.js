export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { sendOrderEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    await dbConnect();
    const { orderId, reason } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID not found." },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found in the database." },
        { status: 404 }
      );
    }

    if (order.orderStatus === "Cancelled" || order.status === "Cancelled") {
      return NextResponse.json(
        { success: false, message: "Order is already cancelled." },
        { status: 400 }
      );
    }

    // Normalize items array (support both multi-item cart and single item fallback)
    let orderItems = order.items;
    if (!orderItems || orderItems.length === 0) {
      if (order.productId) {
        orderItems = [{
          _id: order.productId,
          productId: order.productId,
          title: order.productTitle,
          quantity: 1,
          selectedColor: null,
          selectedSize: null,
        }];
      }
    }

    // Stock restore logic for all items (variants, sizes, and single products)
    if (orderItems && orderItems.length > 0) {
      for (let item of orderItems) {
        const prodId = item._id || item.productId;
        const reqQty = item.quantity || 1;
        const size = item.selectedSize;
        const color = item.selectedColor;

        if (prodId) {
          if (size && color) {
            // Size aur Colour dono hain toh variant stock plus karein
            await Product.updateOne(
              { _id: prodId, "sizeStockVariants.size": size, "sizeStockVariants.color": color },
              { $inc: { "sizeStockVariants.$.stock": reqQty } }
            );
          } else if (size) {
            // Sirf Size hai toh variant stock plus karein jahan color empty hai
            await Product.updateOne(
              { _id: prodId, "sizeStockVariants.size": size, $or: [{ color: "" }, { color: null }] },
              { $inc: { "sizeStockVariants.$.stock": reqQty } }
            );
          } else {
            // Single normal product
            await Product.updateOne(
              { _id: prodId },
              { $inc: { stock: reqQty } }
            );
          }
        }
      }
    }

    // Update both status fields to prevent any frontend mismatch
    order.orderStatus = "Cancelled";
    order.status = "Cancelled"; 
    order.cancellationReason = reason || "User cancelled within 24 hours";
    await order.save();

    // Items map karke ensure karein ki title hamesha sahi property se uthe
    const formattedItems = (order.items || []).map((item) => ({
      ...item,
      title: item.title || item.name || item.productName || "Product Item",
    }));

    // Customer email fetch karein
    const customerEmail = order.shippingAddress?.email || order.email;

    if (customerEmail) {
      sendOrderEmail(customerEmail, order._id.toString(), "cancelled", { 
        customerName: order.shippingAddress?.name || "Customer",
        phone: order.shippingAddress?.phone || "N/A",
        address: order.shippingAddress?.address || "N/A",
        items: formattedItems,
        amount: order.totalAmount,
        totalAmount: order.totalAmount,
        reason: order.cancellationReason 
      }).catch((err) => console.error("Background cancellation email error:", err));
    }

    return NextResponse.json(
      { success: true, message: "Order successfully cancelled and stock restored!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cancel Order API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}