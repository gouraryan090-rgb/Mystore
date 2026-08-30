import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to generate professional PDF Invoice Buffer using PDFKit
async function generateInvoicePDF(orderData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      let buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const isOnline = orderData.paymentMethod === "Online" || orderData.paymentMethod === "ONLINE" || orderData.paymentMethod === "Cashfree";

      // --- Header Banner ---
      doc.rect(0, 0, 612, 85).fill("#0b0f19");
      doc.fontSize(20).fillColor("#f1f5f9").text("ZENTROBAZAAR", 40, 20);
      doc.fontSize(9).fillColor("#06b6d4").text("NEXT-GEN DIGITAL TAX INVOICE", 40, 48);

      doc.fontSize(8).fillColor("#94a3b8");
      doc.text("Nawa City, Rajasthan - 341509", 400, 15, { align: "right" });
      doc.text("Email: zentrobazaar.shop@gmail.com", 400, 27, { align: "right" });
      doc.text("GSTIN: NA", 400, 39, { align: "right" });
      doc.text("Mobile: +91 7378200781", 400, 51, { align: "right" });

      doc.moveDown(3);
      let currentY = 100;

      // --- Metadata & Customer Box ---
      doc.roundedRect(40, currentY, 250, 75, 4).stroke("#cbd5e1");
      doc.fontSize(9).fillColor("#0b0f19").font("Helvetica-Bold").text("ORDER METADATA", 50, currentY + 10);
      doc.font("Helvetica").fontSize(8).fillColor("#475569");
      doc.text(`Order ID: #${orderData.orderId}`, 50, currentY + 25);
      const orderDate = orderData.createdAt ? new Date(orderData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString();
      doc.text(`Date: ${orderDate}`, 50, currentY + 38);
      doc.text(`Payment Type: ${isOnline ? "Prepaid (Online)" : "COD"}`, 50, currentY + 51);

      doc.roundedRect(302, currentY, 270, 75, 4).stroke("#cbd5e1");
      doc.font("Helvetica-Bold").fontSize(9).fillColor("#0b0f19").text("CUSTOMER DETAILS", 312, currentY + 10);
      doc.font("Helvetica").fontSize(8).fillColor("#475569");
      doc.text(`Name: ${orderData.customerName || orderData.shippingAddress?.name || "Customer"}`, 312, currentY + 25);
      doc.text(`Phone: ${orderData.phone || orderData.shippingAddress?.phone || "N/A"}`, 312, currentY + 38);
      doc.text(`Address: ${orderData.address || orderData.shippingAddress?.address || "Nawa City"}`, 312, currentY + 51, { width: 250 });

      currentY += 88;

      // --- Prepaid Transaction Box (If applicable) ---
      if (isOnline && (orderData.cashfreeOrderId || orderData.transactionId)) {
        doc.roundedRect(40, currentY, 532, 25, 4).fillAndStroke("#f0fdf4", "#bbf7d0");
        doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#166534").text("PREPAID TRANSACTION DETAILS", 50, currentY + 8);
        doc.font("Helvetica").fontSize(8).fillColor("#15803d");
        doc.text(`Gateway: Cashfree | Ref ID: ${orderData.cashfreeOrderId || orderData.transactionId}`, 220, currentY + 8);
        currentY += 35;
      }

      // --- Table Headers ---
      doc.rect(40, currentY, 532, 20).fill("#0b0f19");
      doc.fillColor("#f1f5f9").font("Helvetica-Bold").fontSize(8.5);
      doc.text("ITEM DESCRIPTION", 50, currentY + 6);
      doc.text("QTY", 370, currentY + 6, { width: 40, align: "center" });
      doc.text("PRICE", 420, currentY + 6, { width: 60, align: "right" });
      doc.text("TOTAL", 490, currentY + 6, { width: 70, align: "right" });

      currentY += 20;

      // --- Loop Items ---
      doc.font("Helvetica").fontSize(8.5);
      const items = orderData.items || [{ productTitle: orderData.productTitle || "Product", quantity: 1, price: orderData.amount }];

      items.forEach((item, index) => {
        const title = item.productTitle || item.title || item.name || "Product";
        const qty = item.quantity || item.qty || 1;
        const price = item.price || item.offerPrice || 0;
        const total = qty * price;

        if (index % 2 === 0) {
          doc.rect(40, currentY, 532, 18).fill("#f8fafc");
        }

        doc.fillColor("#0b0f19");
        doc.text(title, 50, currentY + 5, { width: 310 });
        doc.text(String(qty), 370, currentY + 5, { width: 40, align: "center" });
        doc.text(`Rs. ${price}`, 420, currentY + 5, { width: 60, align: "right" });
        doc.text(`Rs. ${total}`, 490, currentY + 5, { width: 70, align: "right" });

        doc.moveTo(40, currentY + 18).lineTo(572, currentY + 18).strokeColor("#e2e8f0").stroke();
        currentY += 18;
      });

      currentY += 15;

      // --- Totals Calculation ---
      const subtotal = orderData.amount || items.reduce((acc, item) => acc + ((item.price || item.offerPrice || 0) * (item.quantity || item.qty || 1)), 0);
      const shipping = orderData.shippingFee || orderData.shippingPrice || 0;
      const grandTotal = subtotal + shipping;

      doc.font("Helvetica").fontSize(8.5).fillColor("#64748b");
      doc.text("Subtotal:", 400, currentY, { width: 80, align: "right" });
      doc.fillColor("#0b0f19").text(`Rs. ${subtotal}`, 490, currentY, { width: 70, align: "right" });
      currentY += 15;

      doc.fillColor("#64748b").text("Shipping Fee:", 400, currentY, { width: 80, align: "right" });
      doc.fillColor("#0b0f19").text(`Rs. ${shipping}`, 490, currentY, { width: 70, align: "right" });
      currentY += 20;

      doc.roundedRect(392, currentY, 180, 22, 3).fill("#0b0f19");
      doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(9);
      doc.text("GRAND TOTAL:", 400, currentY + 7, { width: 80, align: "right" });
      doc.text(`Rs. ${grandTotal}`, 485, currentY + 7, { width: 75, align: "right" });

      // --- Footer ---
      doc.fontSize(7.5).font("Helvetica-Oblique").fillColor("#94a3b8");
      doc.text("THANK YOU FOR SHOPPING WITH ZENTROBAZAAR • SYSTEM GENERATED SECURE INVOICE", 40, 780, { align: "center", width: 532 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function sendOrderEmail(toEmail, orderId, type, details = {}) {
  let subject = "";
  let htmlContent = "";

  const items = details.items || [{ productTitle: details.productTitle || "Product", quantity: 1, price: details.amount }];
  let productsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.productTitle || item.title || item.name || "Product"}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity || item.qty || 1}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${item.price || item.offerPrice || details.amount || 0}</td>
    </tr>
  `).join("");

  let subtotal = details.amount || items.reduce((acc, item) => acc + ((item.price || item.offerPrice || 0) * (item.quantity || item.qty || 1)), 0);
  const isOnline = details.paymentMethod === "Online" || details.paymentMethod === "ONLINE" || details.paymentMethod === "Cashfree";

  if (type === "created") {
    subject = `Order Confirmed! #${orderId} - ZentroBazaar`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #16a34a; margin-top: 0;">Thank you for your order!</h2>
        <p>Your order <strong>#${orderId}</strong> has been successfully placed via <strong>${isOnline ? "Prepaid (Online)" : "COD"}</strong>.</p>
        
        ${isOnline && details.cashfreeOrderId ? `<p style="background: #f0fdf4; padding: 10px; border-radius: 6px; color: #166534; font-size: 13px;"><strong>Transaction ID:</strong> ${details.cashfreeOrderId}</p>` : ""}

        <h3 style="margin-top: 20px; border-bottom: 2px solid #cbd5e1; padding-bottom: 5px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8fafc; text-align: left;">
              <th style="padding: 8px;">Product</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
        </table>

        <div style="text-align: right; font-size: 14px; margin-bottom: 20px;">
          <p><strong>Subtotal:</strong> ₹${subtotal}</p>
          ${details.shippingFee ? `<p><strong>Shipping:</strong> ₹${details.shippingFee}</p>` : ""}
          <p style="font-size: 16px; color: #0f172a;"><strong>Total Amount: ₹${details.totalAmount || (subtotal + (details.shippingFee || 0))}</strong></p>
        </div>

        <p>Your official tax invoice PDF is attached to this email.</p>
        <p>We will notify you once your order ships.</p>
        <br/>
        <p>Regards,<br/><strong>ZentroBazaar Team</strong></p>
      </div>
    `;
  } else if (type === "cancelled") {
    subject = `Order Cancelled #${orderId} - ZentroBazaar`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #dc2626; margin-top: 0;">Order Cancelled</h2>
        <p>Your order <strong>#${orderId}</strong> has been successfully cancelled.</p>
        <p><strong>Reason:</strong> ${details.reason || "Customer request"}</p>
        
        <h3 style="margin-top: 20px; border-bottom: 2px solid #cbd5e1; padding-bottom: 5px;">Cancelled Order Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8fafc; text-align: left;">
              <th style="padding: 8px;">Product</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
        </table>

        <div style="text-align: right; font-size: 14px; margin-bottom: 20px;">
          <p style="font-size: 16px; color: #dc2626;"><strong>Total Amount: ₹${details.totalAmount || subtotal}</strong></p>
        </div>

        <p>Updated invoice is attached herewith.</p>
        <br/>
        <p>Regards,<br/><strong>ZentroBazaar Team</strong></p>
      </div>
    `;
  }

  try {
    const pdfBuffer = await generateInvoicePDF({ orderId, type, ...details });

    await transporter.sendMail({
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
    });
    console.log(`Email with PDF invoice sent successfully to ${toEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}