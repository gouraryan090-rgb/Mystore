import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to generate PDF buffer dynamically matching your frontend invoice layout
function generateInvoicePDFBuffer(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // Colors
      const primaryColor = "#6366f1";
      const textColor = "#0f172a";
      const grayColor = "#64748b";

      // Header - Brand & Title
      doc.fillColor(primaryColor).fontSize(22).font("Helvetica-Bold").text("ZENTROBAZAAR", 40, 40);
      doc.fillColor(grayColor).fontSize(10).font("Helvetica").text("Digital Tax Invoice / Receipt", 40, 68);

      // Company Info (Right aligned)
      doc.fontSize(9).text("Nawa City, Rajasthan - 341509", 400, 40, { align: "right" });
      doc.text("Email: zentrobazaar.shop@gmail.com", 400, 55, { align: "right" });
      doc.text("Mobile: +91 7378200781", 400, 70, { align: "right" });

      // Divider Line
      doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(40, 95).stroke();

      // Order Details & Shipping Info
      doc.fillColor(textColor).fontSize(11).font("Helvetica-Bold").text("Order Details:", 40, 110);
      doc.fontSize(10).font("Helvetica");
      doc.text(`Order ID: #${order._id}`, 40, 128);
      doc.text(`Date: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent"}`, 40, 145);
      doc.text(`Payment Method: ${order.paymentMethod || "COD"}`, 40, 162);

      doc.font("Helvetica-Bold").text("Shipping Address:", 320, 110);
      doc.font("Helvetica");
      doc.text(`Name: ${order.shippingAddress?.name || "Customer"}`, 320, 128);
      doc.text(`Phone: ${order.shippingAddress?.phone || "N/A"}`, 320, 145);
      doc.text(`Address: ${order.shippingAddress?.address || "Nawa City"}`, 320, 162, { width: 235 });

      // Table Header Background
      doc.rect(40, 205, 515, 24).fill("#f1f5f9");

      // Table Header Texts
      doc.fillColor(textColor).fontSize(10).font("Helvetica-Bold");
      doc.text("Item Description", 50, 212);
      doc.text("Qty", 380, 212);
      doc.text("Price", 435, 212);
      doc.text("Total", 495, 212);

      // Items Loop
      let startY = 240;
      doc.font("Helvetica");
      const items = order.items || [];
      
      items.forEach((item) => {
        const title = item.title || "Product Item";
        const qty = item.quantity || item.qty || 1;
        const price = item.offerPrice || item.price || 0;
        const itemTotal = qty * price;

        doc.fillColor(textColor).text(title, 50, startY, { width: 310 });
        doc.text(String(qty), 380, startY);
        doc.text(`Rs. ${price}`, 435, startY);
        doc.text(`Rs. ${itemTotal}`, 495, startY);
        
        startY += 25;
      });

      // Divider Line below items
      doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(40, startY + 5).stroke();
      startY += 20;

      const subtotal = order.totalAmount || items.reduce((acc, item) => acc + (item.quantity || item.qty || 1) * (item.offerPrice || item.price || 0), 0);
      const shipping = order.shippingFee || 0;
      const grandTotal = subtotal + shipping;

      // Totals
      doc.font("Helvetica");
      doc.text("Subtotal:", 380, startY);
      doc.text(`Rs. ${subtotal}`, 495, startY);

      startY += 18;
      doc.text("Shipping Fee:", 380, startY);
      doc.text(`Rs. ${shipping}`, 495, startY);

      startY += 22;
      doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(11);
      doc.text("Grand Total:", 380, startY);
      doc.text(`Rs. ${grandTotal}`, 495, startY);

      // Footer Note
      startY += 50;
      doc.fillColor(grayColor).font("Helvetica-Oblique").fontSize(9);
      doc.text("Thank you for shopping with ZENTROBAZAAR! This is a computer-generated receipt.", 40, startY);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Main Email Trigger Function
export async function sendOrderEmail(toEmail, orderId, type = "created", orderDetails = {}) {
  try {
    // Agar orderDetails me items ya amount missing hain, toh database se fetch kar lo
    let orderData = orderDetails;
    if (!orderData.items || !orderData.totalAmount) {
      const Order = (await import("@models/Order")).default;
      const foundOrder = await Order.findById(orderId);
      if (foundOrder) {
        orderData = foundOrder.toObject();
      }
    }

    // PDF Buffer generate karein jo exactly frontend invoice jaisa hoga
    const pdfBuffer = await generateInvoicePDFBuffer({
      _id: orderId,
      ...orderData
    });

    const isCancelled = type === "cancelled";
    const subject = isCancelled 
      ? `Order Cancelled - #${orderId} | ZentroBazaar`
      : `Order Confirmed! #${orderId} | ZentroBazaar`;

    const htmlContent = isCancelled
      ? `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a;">
          <h2 style="color: #ef4444;">Order Successfully Cancelled</h2>
          <p>Hi <b>${orderData.shippingAddress?.name || "Customer"}</b>,</p>
          <p>Your order <b>#${orderId}</b> has been successfully cancelled as requested.</p>
          <p><b>Reason:</b> ${orderData.cancellationReason || "User request"}</p>
          <p>Please find attached your updated cancellation receipt/invoice PDF.</p>
          <br/>
          <p>Thanks,<br/><b>Team ZentroBazaar</b></p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a;">
          <h2 style="color: #4f46e5;">Thank You for Your Order!</h2>
          <p>Hi <b>${orderData.shippingAddress?.name || "Customer"}</b>,</p>
          <p>Your order <b>#${orderId}</b> has been successfully placed and is currently being processed.</p>
          <p>Please find attached your official digital tax invoice receipt PDF.</p>
          <br/>
          <p>Thanks for shopping with us!<br/><b>Team ZentroBazaar</b></p>
        </div>
      `;

    const mailOptions = {
      from: `"ZentroBazaar" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: htmlContent,
      attachments: [
        {
          filename: `ZentroBazaar-Invoice-${orderId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Receipt email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error("Error sending order email with PDF:", error);
  }
}