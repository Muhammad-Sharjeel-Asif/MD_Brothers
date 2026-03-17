import { NextResponse } from "next/server";
import { adminClient } from "@/sanity/lib/adminClient";

export const dynamic = "force-dynamic";

interface OrderItem {
  productId: string;
  productTitle: string;
  categoryName: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customer: { firstName: string; lastName: string; email: string };
  items: OrderItem[];
  totalPrice: number;
  status: string;
  paymentMethod: string;
  orderDate: string;
}

export async function GET() {
  try {
    const [orders, products, categories] = await Promise.all([
      adminClient.fetch(`*[_type == "order"] | order(orderDate desc) {
        _id,
        customer,
        "items": items[] {
          "productId": product->_id,
          "productTitle": product->title,
          "categoryName": product->category->name,
          quantity,
          price
        },
        totalPrice,
        status,
        paymentMethod,
        orderDate
      }`),
      adminClient.fetch(`*[_type == "product"] { _id, title, price, "categoryName": category->name }`),
      adminClient.fetch(`*[_type == "category"] { _id, name, "productCount": count(*[_type == "product" && references(^._id)]) }`),
    ]);

    // ===== SALES REPORT =====
    const completedOrders = (orders as Order[]).filter((o) => o.status !== "cancelled");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const totalOrders = completedOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Revenue over time (last 30 days, grouped by day)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const revenueByDay: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      revenueByDay[key] = 0;
    }
    completedOrders.forEach((o) => {
      if (o.orderDate) {
        const key = new Date(o.orderDate).toISOString().split("T")[0];
        if (revenueByDay[key] !== undefined) {
          revenueByDay[key] += o.totalPrice || 0;
        }
      }
    });
    const revenueTimeline = Object.entries(revenueByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({ date, revenue }));

    // ===== PRODUCT PERFORMANCE =====
    const productStats: Record<string, { title: string; unitsSold: number; revenue: number }> = {};
    completedOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const id = item.productId || "unknown";
        if (!productStats[id]) {
          productStats[id] = { title: item.productTitle || "Unknown", unitsSold: 0, revenue: 0 };
        }
        productStats[id].unitsSold += item.quantity || 0;
        productStats[id].revenue += (item.price || 0) * (item.quantity || 0);
      });
    });
    const topProducts = Object.entries(productStats)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    // ===== CATEGORY PERFORMANCE =====
    const categoryStats: Record<string, { name: string; totalSales: number; unitsSold: number }> = {};
    completedOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const cat = item.categoryName || "Uncategorized";
        if (!categoryStats[cat]) {
          categoryStats[cat] = { name: cat, totalSales: 0, unitsSold: 0 };
        }
        categoryStats[cat].totalSales += (item.price || 0) * (item.quantity || 0);
        categoryStats[cat].unitsSold += item.quantity || 0;
      });
    });
    const categoryPerformance = Object.values(categoryStats).sort((a, b) => b.totalSales - a.totalSales);
    // Merge product counts from categories fetch
    const categoryWithCounts = categoryPerformance.map((cp) => {
      const found = (categories as any[]).find((c) => c.name === cp.name);
      return { ...cp, productCount: found?.productCount || 0 };
    });

    // ===== CUSTOMER REPORT =====
    const customerMap: Record<string, { email: string; name: string; totalSpent: number; orderCount: number; firstOrder: string }> = {};
    completedOrders.forEach((o) => {
      const email = o.customer?.email || "unknown";
      if (!customerMap[email]) {
        customerMap[email] = {
          email,
          name: `${o.customer?.firstName || ""} ${o.customer?.lastName || ""}`.trim() || email,
          totalSpent: 0,
          orderCount: 0,
          firstOrder: o.orderDate || "",
        };
      }
      customerMap[email].totalSpent += o.totalPrice || 0;
      customerMap[email].orderCount += 1;
      if (o.orderDate && (!customerMap[email].firstOrder || o.orderDate < customerMap[email].firstOrder)) {
        customerMap[email].firstOrder = o.orderDate;
      }
    });
    const allCustomers = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
    const repeatCustomers = allCustomers.filter((c) => c.orderCount > 1).length;
    const newCustomersLast30 = allCustomers.filter((c) => {
      if (!c.firstOrder) return false;
      return new Date(c.firstOrder) >= thirtyDaysAgo;
    }).length;

    return NextResponse.json({
      sales: {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        revenueTimeline,
      },
      products: {
        topProducts: topProducts.slice(0, 10),
        totalProducts: (products as any[]).length,
      },
      categories: {
        performance: categoryWithCounts,
        totalCategories: (categories as any[]).length,
      },
      customers: {
        totalCustomers: allCustomers.length,
        topCustomers: allCustomers.slice(0, 10),
        repeatCustomers,
        newCustomers: allCustomers.length - repeatCustomers,
        newCustomersLast30,
      },
    });
  } catch (error) {
    console.error("Reports error:", error);
    return NextResponse.json({ error: "Failed to generate reports" }, { status: 500 });
  }
}
