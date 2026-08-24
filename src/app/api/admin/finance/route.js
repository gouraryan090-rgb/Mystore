import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET(request) {
  try {
    await connectDB();

    // URL se query parameters (jaise date filter) read karein
    const { searchParams } = new URL(request.url);
    const filterType = searchParams.get("filter") || "all"; // all, today, week, month, custom
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const orders = await Order.find({}).lean();

    let totalRevenue = 0;
    let totalProfit = 0;
    let totalOrdersCount = 0;
    let cancelledOrdersCount = 0;

    const monthlyData = {};
    const categoryData = {}; // Main Category breakdown
    const subCategoryData = {}; // Sub-Category breakdown
    const paymentModeData = { Online: 0, COD: 0 };
    const categoryCancelCount = {};

    const now = new Date();

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt || Date.now());

      // Date Filtering Logic
      if (filterType === "today") {
        if (orderDate.toDateString() !== now.toDateString()) return;
      } else if (filterType === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (orderDate < weekAgo) return;
      } else if (filterType === "month") {
        if (orderDate.getMonth() !== now.getMonth() || orderDate.getFullYear() !== now.getFullYear()) return;
      } else if (filterType === "custom" && startDate && endDate) {
        if (orderDate < new Date(startDate) || orderDate > new Date(endDate)) return;
      }

      const status = (order.orderStatus || order.status || "Pending").toLowerCase();
      
      // Items aur Categories process karein
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const cat = item.category || item.productCategory || "Uncategorized";
          const subCat = item.subCategory || "General";

          if (status === "cancelled") {
            categoryCancelCount[cat] = (categoryCancelCount[cat] || 0) + 1;
          }
        });
      }

      if (status === "cancelled") {
        cancelledOrdersCount += 1;
        return; // Skip cancelled orders from revenue calculation
      }

      totalOrdersCount += 1;
      const orderAmount = Number(order.totalAmount || order.total || order.grandTotal || 0);
      totalRevenue += orderAmount;

      // Payment Mode tracking
      const paymentMethod = (order.paymentMethod || order.paymentMode || "COD").toLowerCase();
      if (paymentMethod.includes("online") || paymentMethod.includes("cashfree") || paymentMethod.includes("razorpay") || paymentMethod.includes("prepaid")) {
        paymentModeData.Online += orderAmount;
      } else {
        paymentModeData.COD += orderAmount;
      }

      // Profit Calculation
      let orderProfit = 0;
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const itemPrice = Number(item.price || item.offerPrice || 0);
          const itemQty = Number(item.quantity || 1);
          
          // Agar product mein costPrice diya hai toh wo use karein, warna 25% margin
          const itemCost = Number(item.costPrice || (itemPrice * 0.75));
          orderProfit += (itemPrice - itemCost) * itemQty;

          // Category-wise Breakdown
          const category = item.category || item.productCategory || "Uncategorized";
          categoryData[category] = (categoryData[category] || 0) + (itemPrice * itemQty);

          // Sub-Category Breakdown
          const subCategory = item.subCategory || "General Sub";
          subCategoryData[subCategory] = (subCategoryData[subCategory] || 0) + (itemPrice * itemQty);
        });
      } else {
        orderProfit = orderAmount * 0.25;
      }
      totalProfit += orderProfit;

      // Monthly Breakdown
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthYear = `${monthNames[orderDate.getMonth()]} ${orderDate.getFullYear()}`;
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + orderAmount;
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalProfit: Math.round(totalProfit),
        totalOrdersCount,
        cancelledOrdersCount,
      },
      monthlyData,
      categoryData,
      subCategoryData,
      paymentModeData,
      categoryCancelCount,
    });
  } catch (error) {
    console.error("Advanced Finance API Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}