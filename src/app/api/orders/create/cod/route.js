// src/app/api/orders/create/cod/route.js
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product"; // Stock check aur reduce karne ke liye[cite: 7]
import { sendOrderEmail } from "@/lib/mailer"; //[cite: 7]
import { createShiprocketOrder } from "@/lib/shiprocket"; //[cite: 7]

export async function POST(request) {
  try {
    await dbConnect(); //[cite: 7]

    const body = await request.json(); //[cite: 7]

    const formattedItems = (body.items || []).map((item) => ({
      _id: item.productId || item._id,
      productId: item.productId || item._id,
      title: item.title || item.name || item.productName || "Product Item", //[cite: 7]
      quantity: item.quantity || item.qty || 1, //[cite: 7]
      offerPrice: item.offerPrice || item.price || 0,
      price: item.offerPrice || item.price || 0,
      images: item.images || (item.imageUrl ? [item.imageUrl] : []), //[cite: 7]
      selectedColor: item.selectedColor || item.variant || null,
      selectedSize: item.selectedSize || null,
      imageUrl: item.imageUrl || (item.images && item.images[0]) || "",
    }));

    const customerEmail = body.email || body.shippingAddress?.email || ""; //[cite: 7]
    const customerUserId = body.userId || customerEmail || "guest_user"; //[cite: 7]
    const customerPhone = body.shippingAddress?.phone || "9999999999"; //[cite: 7]
    const orderAmount = Number(body.totalAmount); //[cite: 7]

    if (!orderAmount || orderAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid order amount." },
        { status: 400 }
      ); //[cite: 7]
    }

    // Step 1: Check stock availability for all items before creating order
    for (const item of formattedItems) {
      const prodId = item._id;
      const product = await Product.findById(prodId);

      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product not found: ${item.title}` },
          { status: 404 }
        );
      }

      const reqQty = item.quantity;
      const size = item.selectedSize;
      const color = item.selectedColor;

      if (size && color) {
        const variant = product.sizeStockVariants.find(
          (v) => v.size === size && v.color === color
        );
        if (!variant || variant.stock < reqQty) {
          return NextResponse.json(
            {
              success: false,
              message: `Insufficient stock for ${item.title} (Size: ${size}, Color: ${color})`,
            },
            { status: 400 }
          );
        }
      } else if (size) {
        const variant = product.sizeStockVariants.find(
          (v) => v.size === size && (!v.color || v.color === "")
        );
        if (!variant || variant.stock < reqQty) {
          return NextResponse.json(
            {
              success: false,
              message: `Insufficient stock for ${item.title} (Size: ${size})`,
            },
            { status: 400 }
          );
        }
      } else {
        if (product.stock < reqQty) {
          return NextResponse.json(
            {
              success: false,
              message: `Insufficient stock for ${item.title}`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Step 2: Reduce stock accurately for variants, sizes, or single products
    for (const item of formattedItems) {
      const prodId = item._id;
      const reqQty = item.quantity;
      const size = item.selectedSize;
      const color = item.selectedColor;

      if (size && color) {
        await Product.updateOne(
          { _id: prodId, "sizeStockVariants.size": size, "sizeStockVariants.color": color },
          { $inc: { "sizeStockVariants.$.stock": -reqQty } }
        );
      } else if (size) {
        await Product.updateOne(
          { _id: prodId, "sizeStockVariants.size": size, $or: [{ color: "" }, { color: null }] },
          { $inc: { "sizeStockVariants.$.stock": -reqQty } }
        );
      } else {
        await Product.updateOne(
          { _id: prodId },
          { $inc: { stock: -reqQty } }
        );
      }
    }

    // Create COD Order in Database
    const codOrder = await Order.create({
      items: formattedItems,
      shippingAddress: body.shippingAddress,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      status: "Placed",
      totalAmount: orderAmount,
      email: customerEmail,
      userId: customerUserId,
    }); //[cite: 7]

    const codOrderIdStr = codOrder._id.toString(); //[cite: 7]

    // Automatically push COD order to Shiprocket
    try {
      const shiprocketResponse = await createShiprocketOrder({
        orderId: codOrderIdStr,
        shippingAddress: body.shippingAddress,
        items: formattedItems,
        email: customerEmail,
        subtotal: body.subtotal || orderAmount,
        paymentMethod: "COD",
      });

      if (shiprocketResponse && shiprocketResponse.order_id) {
        codOrder.shiprocketOrderId = shiprocketResponse.order_id;
        await codOrder.save();
      }
    } catch (shiprocketErr) {
      console.error("Shiprocket COD Order Push Error:", shiprocketErr);
    } //[cite: 7]

    // Send Email Notification with PDF Invoice
    if (customerEmail) {
      sendOrderEmail(
        customerEmail,
        codOrderIdStr,
        "created",
        {
          customerName: codOrder.shippingAddress?.name || "Customer",
          phone: customerPhone,
          address: codOrder.shippingAddress?.address || "N/A",
          items: codOrder.items,
          amount: codOrder.totalAmount,
          totalAmount: codOrder.totalAmount,
          paymentMethod: "COD"
        }
      ).catch((err) =>
        console.error("Background COD email error:", err)
      );
    } //[cite: 7]

    return NextResponse.json(
      {
        success: true,
        message: "COD Order placed successfully and pushed to Shiprocket!",
        orderId: codOrderIdStr,
      },
      { status: 200 }
    ); //[cite: 7]

  } catch (error) {
    console.error("COD Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    ); //[cite: 7]
  }
}