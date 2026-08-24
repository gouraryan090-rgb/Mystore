export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const newOrder = await Order.create({
      items: body.items,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentStatus || "Pending",
      totalAmount: body.totalAmount,
      orderStatus: "Placed",
    });

    // --- Gmail Nodemailer Email Logic ---
    try {
      const customerEmail = body.email || body.userEmail || newOrder.shippingAddress?.email;
      
      if (customerEmail) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const itemsHtml = (newOrder.items || [])
          .map(
            (item) => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; color: #333;">${item.name || item.title || "Product"} (x${item.quantity || 1})</td>
              <td style="padding: 10px; text-align: right; color: #333;">₹${(item.price || item.offerPrice || 0) * (item.quantity || 1)}</td>
            </tr>
          `
          )
          .join("");

        const mailOptions = {
          from: `"Zentro Bazaar" <${process.env.EMAIL_USER}>`,
          to: customerEmail,
          subject: `Order Confirmed! 🎉 #${newOrder._id.toString()}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
              <h2 style="color: #2563eb; text-align: center;">Order Successful!</h2>
              <p>Hi <b>${newOrder.shippingAddress?.fullName || "Valued Customer"}</b>,</p>
              <p>Thank you for shopping with us! Your order has been successfully placed.</p>
              
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 4px 0;"><b>Order ID:</b> ${newOrder._id.toString()}</p>
                <p style="margin: 4px 0;"><b>Payment Method:</b> ${newOrder.paymentMethod || "COD"}</p>
              </div>

              <h3 style="color: #111827; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Product Details</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #f3f4f6; text-align: left;">
                    <th style="padding: 10px;">Item</th>
                    <th style="padding: 10px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <h3 style="color: #111827; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Amount Breakup</h3>
              <div style="font-size: 14px; color: #374151;">
                <p style="display: flex; justify-content: space-between; margin: 6px 0;"><span>Grand Total:</span> <b>₹${newOrder.totalAmount}</b></p>
              </div>

              <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px;">
                Thank you for ordering from Zentro Bazaar!
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Confirmation Email Sent Successfully via Gmail!");
      }
    } catch (emailErr) {
      console.error("❌ Gmail Sending Error:", emailErr);
    }
    // ------------------------------------

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