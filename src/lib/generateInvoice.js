import { jsPDF } from "jspdf";

export const generateReceiptPDF = (order) => {
  const doc = new jsPDF();
  
  const darkBg = [11, 15, 25];         
  const neonCyan = [6, 182, 212];      
  const textLight = [241, 245, 249];   
  const textGray = [148, 163, 184];    

  // --- FUTURISTIC HEADER BANNER ---
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 45, "F");

  doc.setFillColor(...neonCyan);
  doc.rect(0, 42, 210, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...textLight);
  doc.text("ZENTROBAZAAR", 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...neonCyan);
  doc.text("NEXT-GEN DIGITAL TAX INVOICE", 14, 27);

  doc.setFontSize(8);
  doc.setTextColor(...textGray);
  doc.text("Nawa City, Rajasthan - 341509", 196, 14, { align: "right" });
  doc.text("Email: zentrobazaar.shop@gmail.com", 196, 20, { align: "right" });
  doc.text("GSTIN: NA", 196, 26, { align: "right" });
  doc.text("Mobile: +91 7378200781", 196, 32, { align: "right" });

  let currentY = 55;

  // --- ORDER & SHIPPING INFO ---
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, 88, 38, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...darkBg);
  doc.text("ORDER METADATA", 20, currentY + 8);

  const isOnline = order.paymentMethod === "Online" || order.paymentMethod === "ONLINE" || order.paymentMethod === "Cashfree";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...textGray);
  doc.text(`Order ID: #${order._id}`, 20, currentY + 15);
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Recent";
  doc.text(`Timestamp: ${orderDate}`, 20, currentY + 21);
  doc.text(`Payment Type: ${isOnline ? "Prepaid (Online)" : "COD"}`, 20, currentY + 27);
  doc.text(`Payment Status: ${order.paymentStatus || "Pending"}`, 20, currentY + 33);

  doc.roundedRect(108, currentY, 88, 38, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...darkBg);
  doc.text("CUSTOMER & DESTINATION", 114, currentY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...textGray);
  doc.text(`Name: ${order.shippingAddress?.name || "Customer"}`, 114, currentY + 15);
  doc.text(`Phone: ${order.shippingAddress?.phone || "N/A"}`, 114, currentY + 21);
  doc.text(`Email: ${order.shippingAddress?.email || order.email || "N/A"}`, 114, currentY + 27, { maxWidth: 78 });
  doc.text(`Address: ${order.shippingAddress?.address || "Nawa City"}`, 114, currentY + 33, { maxWidth: 78 });

  currentY += 44;

  // --- PREPAID TRANSACTION DETAILS BOX (If applicable) ---
  if (isOnline && order.cashfreeOrderId) {
    doc.setFillColor(240, 253, 244); // light green tint
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(14, currentY, 182, 16, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(22, 101, 52);
    doc.text("PREPAID TRANSACTION DETAILS", 18, currentY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(21, 128, 61);
    doc.text(`Gateway: Cashfree | Ref / Transaction ID: ${order.cashfreeOrderId}`, 18, currentY + 12);

    currentY += 22;
  }

  // --- TABLE HEADER ---
  doc.setFillColor(...darkBg);
  doc.rect(14, currentY, 182, 9, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...textLight);
  doc.text("ITEM DESCRIPTION", 18, currentY + 6);
  doc.text("QTY", 120, currentY + 6);
  doc.text("PRICE", 145, currentY + 6);
  doc.text("TOTAL", 175, currentY + 6);

  currentY += 9;

  // --- ITEMS LOOP ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const items = order.items || [];

  items.forEach((item, index) => {
    const title = item.title || item.name || item.productName || "Product Item";
    const qty = item.quantity || item.qty || 1;
    const price = item.offerPrice || item.price || 0;
    const itemTotal = qty * price;

    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, 182, 11, "F");
    }

    doc.setTextColor(...darkBg);
    doc.text(title, 18, currentY + 7, { maxWidth: 95 });
    doc.text(String(qty), 120, currentY + 7);
    doc.text(`Rs. ${price}`, 145, currentY + 7);
    doc.text(`Rs. ${itemTotal}`, 175, currentY + 7);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(14, currentY + 11, 196, currentY + 11);

    currentY += 11;
  });

  currentY += 6;

  // --- CALCULATIONS ---
  const subtotal = order.totalAmount || items.reduce((acc, item) => acc + (item.quantity || item.qty || 1) * (item.offerPrice || item.price || 0), 0);
  const shipping = order.shippingFee || 0;
  const grandTotal = subtotal + shipping;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...textGray);
  doc.text("Subtotal:", 135, currentY);
  doc.setTextColor(...darkBg);
  doc.text(`Rs. ${subtotal}`, 175, currentY);

  currentY += 6;
  doc.setTextColor(...textGray);
  doc.text("Shipping Fee:", 135, currentY);
  doc.setTextColor(...darkBg);
  doc.text(`Rs. ${shipping}`, 175, currentY);

  currentY += 8;
  doc.setFillColor(...darkBg);
  doc.roundedRect(125, currentY - 3, 71, 11, 1.5, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("GRAND TOTAL:", 130, currentY + 4);
  doc.text(`Rs. ${grandTotal}`, 190, currentY + 4, { align: "right" });

  // --- FOOTER ---
  const footerY = 275;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, footerY - 5, 196, footerY - 5);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(...textGray);
  doc.text("THANK YOU FOR SHOPPING WITH ZENTROBAZAAR • SYSTEM GENERATED SECURE INVOICE", 105, footerY, { align: "center" });

  doc.save(`ZentroBazaar-Invoice-${order._id}.pdf`);
};