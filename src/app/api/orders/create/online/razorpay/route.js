export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Razorpay from "razorpay";
import { sendOrderEmail } from "@/lib/mailer";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper function to push order to Shiprocket
async function createShiprocketOrder(newOrder, body) {
  try {
    const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }),
    });
    const authData = await authRes.json();
    if (!authRes.ok || !authData.token) {
      console.error("Shiprocket Authentication Failed:", authData);
      return;
    }
    const token = authData.token;

    const srItems = (body.items || []).map((item) => ({
      name: item.title || item.name || item.productName || "Product",
      sku: item.sku || item.productId || item._id || "SKUGO",
      units: item.quantity || item.qty || 1,
      selling_price: item.offerPrice !== undefined ? item.offerPrice : (item.price || 0),
      discount: 0,
      tax: 0,
      hsn: item.hsn || "",
    }));

    const addressParts = (body.shippingAddress?.address || "").split(",");
    const address1 = addressParts[0] || body.shippingAddress?.address || "N/A";
    const address2 = addressParts.slice(1).join(",") || "";

    const shiprocketPayload = {
      order_id: newOrder._id.toString(),
      order_date: new Date().toISOString().slice(0, 10) + " " + new Date().toTimeString().slice(0, 8),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary",
      channel_id: process.env.SHIPROCKET_CHANNEL_ID || "",
      comment: "Created automatically from Next.js store (Razorpay)",
      billing_customer_name: body.shippingAddress?.name || "Customer",
      billing_last_name: "",
      billing_address: address1,
      billing_address_2: address2,
      billing_city: body.shippingAddress?.city || "City",
      billing_pincode: body.shippingAddress?.pincode || "110001",
      billing_state: body.shippingAddress?.state || "State",
      billing_country: body.shippingAddress?.country || "India",
      billing_email: body.email || body.shippingAddress?.email || "customer@example.com",
      billing_phone: body.shippingAddress?.phone || "9999999999",
      shipping_is_billing: true,
      order_items: srItems,
      payment_method: "Prepaid",
      sub_total: newOrder.totalAmount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    const srOrderRes = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(shiprocketPayload),
    });

    const srOrderData = await srOrderRes.json();
    if (srOrderRes.ok) {
      console.log("Order successfully pushed to Shiprocket (Razorpay):", srOrderData.order_id);
    } else {
      console.error("Shiprocket Order Creation Error:", srOrderData);
    }
  } catch (err) {
    console.error("Shiprocket Integration Exception:", err);
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const formattedItems = (body.items || []).map((item) => {
      const itemPrice = item.offerPrice !== undefined ? item.offerPrice : (item.price || 0);
      return {
        _id: item.productId || item._id,
        productId: item.productId || item._id,
        title: item.title || item.name || item.productName || "Product Item",
        offerPrice: itemPrice,
        price: itemPrice,
        quantity: item.quantity || item.qty || 1,
        selectedColor: item.selectedColor || item.variant || null,
        selectedSize: item.selectedSize || null,
        imageUrl: item.imageUrl || (item.images?.[0] || ""),
        images: item.images || (item.imageUrl ? [item.imageUrl] : []),
      };
    });

    const customerEmail = body.email || body.shippingAddress?.email || "customer@example.com";
    const customerUserId = body.userId || customerEmail || "guest_user";
    const orderAmount = Number(body.totalAmount);

    if (!orderAmount || orderAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid order amount." },
        { status: 400 }
      );
    }

    // Step 1: Check stock availability for all items before initiating payment
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

    // Step 3: Create order in MongoDB first to obtain a valid 24-character hex ObjectId
    const newOrder = await Order.create({
      items: formattedItems,
      shippingAddress: body.shippingAddress,
      paymentMethod: "Prepaid",
      paymentStatus: "Pending",
      status: "Pending",
      totalAmount: orderAmount,
      email: customerEmail,
      userId: customerUserId,
    });

    const mongoOrderId = newOrder._id.toString();

    // Step 4: Push order to Shiprocket immediately upon MongoDB creation
    createShiprocketOrder(newOrder, body);

    // Step 5: Send Email Notification with PDF Invoice in background
    if (customerEmail) {
      sendOrderEmail(
        customerEmail,
        mongoOrderId,
        "created",
        {
          customerName: newOrder.shippingAddress?.name || "Customer",
          phone: newOrder.shippingAddress?.phone || "9999999999",
          address: newOrder.shippingAddress?.address || "N/A",
          items: newOrder.items,
          amount: newOrder.totalAmount,
          totalAmount: newOrder.totalAmount,
          paymentMethod: "Prepaid"
        }
      ).catch((err) =>
        console.error("Background Razorpay email error:", err)
      );
    }

    // Step 6: Create Razorpay order
    const options = {
      amount: Math.round(orderAmount * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_${mongoOrderId}`,
      notes: {
        orderId: mongoOrderId,
        email: customerEmail,
      },
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(options);
    } catch (rzpErr) {
      console.error("Razorpay API Exception:", rzpErr);
    }

    if (!razorpayOrder || !razorpayOrder.id) {
      // Clean up database document and restore stock if Razorpay gateway fails
      for (const item of formattedItems) {
        const prodId = item._id;
        const reqQty = item.quantity;
        const size = item.selectedSize;
        const color = item.selectedColor;

        if (size && color) {
          await Product.updateOne(
            { _id: prodId, "sizeStockVariants.size": size, "sizeStockVariants.color": color },
            { $inc: { "sizeStockVariants.$.stock": reqQty } }
          );
        } else if (size) {
          await Product.updateOne(
            { _id: prodId, "sizeStockVariants.size": size, $or: [{ color: "" }, { color: null }] },
            { $inc: { "sizeStockVariants.$.stock": reqQty } }
          );
        } else {
          await Product.updateOne(
            { _id: prodId },
            { $inc: { stock: reqQty } }
          );
        }
      }

      await Order.findByIdAndDelete(mongoOrderId);
      return NextResponse.json(
        { success: false, message: "Failed to initialize Razorpay order." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        razorpay_order_id: razorpayOrder.id,
        orderId: mongoOrderId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}