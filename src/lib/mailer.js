import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to generate PDF Invoice Buffer
async function generateInvoicePDF(orderData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      let buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // --- Header ---
      doc.fontSize(20).fillColor("#0f172a").text("ZENTROBAZAAR", { align: "right" });
      doc.fontSize(10).fillColor("#64748b").text("Invoice / Receipt", { align: "right" });
      doc.moveDown();

      // --- Order & Customer Info ---
      doc.fontSize(12).fillColor("#0f172a").text(`Order ID: #${orderData.orderId}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.text(`Status: ${orderData.type === "cancelled" ? "Cancelled" : "Confirmed"}`);
      doc.moveDown();

      doc.text("Shipping Details:");
      doc.fontSize(10).fillColor("#334155");
      doc.text(`Name: ${orderData.customerName || "N/A"}`);
      doc.text(`Phone: ${orderData.phone || "N/A"}`);
      doc.text(`Address: ${orderData.address || "N/A"}`);
      doc.moveDown(2);

      // --- Table Headers ---
      doc.fontSize(12).fillColor("#0f172a").text("Order Items:", { underline: true });
      doc.moveDown(0.5);

      // Table columns setup
      const tableTop = doc.y;
      doc.fontSize(10).fillColor("#64748b");
      doc.text("Product", 50, tableTop);
      doc.text("Qty", 350, tableTop, { width: 50, align: "right" });
      doc.text("Price", 420, tableTop, { width: 100, align: "right" });

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor("#cbd5e1").stroke();

      let position = tableTop + 25;
      doc.fontSize(10).fillColor("#0f172a");

      // Loop through items
      const items = orderData.items || [{ productTitle: orderData.productTitle || "Product", quantity: 1, price: orderData.amount }];
      
      items.forEach((item) => {
        doc.text(item.productTitle || item.name || "Product", 50, position, { width: 280 });
        doc.text(item.quantity || 1, 350, position, { width: 50, align: "right" });
        doc.text(`₹${item.price || orderData.amount || 0}`, 420, position, { width: 100, align: "right" });
        position += 20;
      });

      doc.moveTo(50, position + 5).lineTo(550, position + 5).strokeColor("#cbd5e1").stroke();
      position += 15;

      // --- Amount Breakup ---
      const subtotal = orderData.amount || items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
      const shipping = orderData.shippingPrice || 0;
      const tax = orderData.taxPrice || 0;
      const total = subtotal + shipping + tax;

      doc.text(`Subtotal: ₹${subtotal}`, 350, position, { width: 170, align: "right" });
      position += 18;
      if (shipping > 0) {
        doc.text(`Shipping: ₹${shipping}`, 350, position, { width: 170, align: "right" });
        position += 18;
      }
      if (tax > 0) {
        doc.text(`Tax: ₹${tax}`, 350, position, { width: 170, align: "right" });
        position += 18;
      }

      doc.fontSize(12).fillColor("#0f172a");
      doc.text(`Total Amount: ₹${total}`, 350, position + 5, { width: 170, align: "right" });

      // --- Footer ---
      doc.moveDown(4);
      doc.fontSize(10).fillColor("#64748b").text("Thank you for shopping with ZentroBazaar!", { align: "center" });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function sendOrderEmail(toEmail, orderId, type, details = {}) {
  let subject = "";
  let htmlContent = "";

  // Products HTML list formatting
  const items = details.items || [{ productTitle: details.productTitle || "Product", quantity: 1, price: details.amount }];
  let productsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.productTitle || item.name || "Product"}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity || 1}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${item.price || details.amount || 0}</td>
    </tr>
  `).join("");

  let subtotal = details.amount || items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  if (type === "created") {
    subject = `Order Confirmed! #${orderId} - ZentroBazaar`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #16a34a;">Thank you for your order!</h2>
        <p>Your order <strong>#${orderId}</strong> has been successfully placed.</p>
        
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
          ${details.shippingPrice ? `<p><strong>Shipping:</strong> ₹${details.shippingPrice}</p>` : ""}
          ${details.taxPrice ? `<p><strong>Tax:</strong> ₹${details.taxPrice}</p>` : ""}
          <p style="font-size: 16px; color: #0f172a;"><strong>Total Amount: ₹${details.totalAmount || subtotal}</strong></p>
        </div>

        <p>We have attached your official PDF invoice with this email.</p>
        <p>We will notify you once it ships.</p>
        <br/>
        <p>Regards,<br/><strong>ZentroBazaar Team</strong></p>
      </div>
    `;
  } else if (type === "cancelled") {
    subject = `Order Cancelled #${orderId} - ZentroBazaar`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #dc2626;">Order Cancelled</h2>
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
          <p style="font-size: 16px; color: #dc2626;"><strong>Total Refundable Amount: ₹${details.totalAmount || subtotal}</strong></p>
        </div>

        <p>Updated cancellation invoice is attached herewith.</p>
        <br/>
        <p>Regards,<br/><strong>ZentroBazaar Team</strong></p>
      </div>
    `;
  }

  try {
    // Generate PDF Buffer
    const pdfBuffer = await generateInvoicePDF({ orderId, type, ...details });

    await transporter.sendMail({
      from: `"ZentroBazaar" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: htmlContent,
      attachments: [
        {
          filename: `Invoice-${orderId}.pdf`,
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