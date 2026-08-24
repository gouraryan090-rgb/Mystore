import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET(request) {
  try {
    await connectDB();

    // Saare orders database se fetch karein
    const orders = await Order.find({}).lean();

    let totalRevenue = 0;
    let totalProfit = 0;
    let totalOrdersCount = 0;
    let cancelledOrdersCount = 0;
    const monthlyData = {};
    const categoryData = {};

    orders.forEach((order) => {
      // Status check (agar order cancelled hai, toh revenue mein count nahi hoga)
      const status = order.orderStatus || order.status || "Pending";
      
      if (status.toLowerCase() === "cancelled") {
        cancelledOrdersCount += 1;
        return; // Skip cancelled orders
      }

      totalOrdersCount += 1;

      // Revenue calculate karein (order ke totalAmount ya total se)
      const orderAmount = Number(order.totalAmount || order.total || order.grandTotal || 0);
      totalRevenue += orderAmount;

      // Estimated Profit
      let orderProfit = 0;
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const itemPrice = Number(item.price || 0);
          const itemQty = Number(item.quantity || 1);
          orderProfit += (itemPrice * 0.25) * itemQty;
        });
      } else {
        orderProfit = orderAmount * 0.25;
      }
      totalProfit += orderProfit;

      // Monthly Revenue Breakdown
      const orderDate = new Date(order.createdAt || Date.now());
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthYear = `${monthNames[orderDate.getMonth()]} ${orderDate.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear] += orderAmount;

      // Category-wise Sales Breakdown
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const category = item.category || item.productCategory || item.categoryName || item.cat || "Uncategorized";
          const itemTotal = Number(item.price || 0) * Number(item.quantity || 1);
          
          if (!categoryData[category]) {
            categoryData[category] = 0;
          }
          categoryData[category] += itemTotal;
        });
      }
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
    });
  } catch (error) {
    console.error("Error in finance API:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}