"use client";

import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/useAdminAuth";

interface ReportsData {
  sales: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    revenueTimeline: { date: string; revenue: number }[];
  };
  products: {
    topProducts: { id: string; title: string; unitsSold: number; revenue: number }[];
    totalProducts: number;
  };
  categories: {
    performance: { name: string; totalSales: number; unitsSold: number; productCount: number }[];
    totalCategories: number;
  };
  customers: {
    totalCustomers: number;
    topCustomers: { email: string; name: string; totalSpent: number; orderCount: number }[];
    repeatCustomers: number;
    newCustomers: number;
    newCustomersLast30: number;
  };
}

const tabs = [
  { id: "sales", label: "Sales", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
  { id: "products", label: "Products", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { id: "categories", label: "Categories", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
  { id: "customers", label: "Customers", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
];

export default function ReportsPage() {
  const { authenticatedFetch } = useAdminAuth();
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("sales");

  useEffect(() => {
    authenticatedFetch("/api/admin/reports")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Crunching the numbers...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12 text-gray-500">Failed to load reports.</div>;
  }

  const maxRevenue = Math.max(...data.sales.revenueTimeline.map((d) => d.revenue), 1);
  const maxCatSales = Math.max(...data.categories.performance.map((c) => c.totalSales), 1);
  const maxProductRev = Math.max(...data.products.topProducts.map((p) => p.revenue), 1);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">Analytical insights about your store&apos;s performance.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: `$${data.sales.totalRevenue.toFixed(2)}`, color: "from-emerald-500 to-emerald-600", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
          { label: "Total Orders", value: data.sales.totalOrders, color: "from-blue-500 to-blue-600", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
          { label: "Avg Order Value", value: `$${data.sales.avgOrderValue.toFixed(2)}`, color: "from-amber-500 to-amber-600", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
          { label: "Total Customers", value: data.customers.totalCustomers, color: "from-purple-500 to-purple-600", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-[#B88E2F] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* ===== SALES ===== */}
        {activeTab === "sales" && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue — Last 30 Days</h3>
              <div className="flex items-end gap-[2px] h-48">
                {data.sales.revenueTimeline.map((day) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center justify-end group relative">
                    <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {day.date}: ${day.revenue.toFixed(0)}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-[#B88E2F] to-[#D4A843] rounded-t-sm hover:from-[#8C6D23] hover:to-[#B88E2F] transition-all cursor-pointer min-h-[2px]"
                      style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, 1)}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>{data.sales.revenueTimeline[0]?.date}</span>
                <span>{data.sales.revenueTimeline[data.sales.revenueTimeline.length - 1]?.date}</span>
              </div>
            </div>
          </>
        )}

        {/* ===== PRODUCTS ===== */}
        {activeTab === "products" && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
                <p className="text-sm text-gray-500">{data.products.totalProducts} total products</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Rank</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Units Sold</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase w-1/3">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.products.topProducts.map((product, i) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            i === 0 ? "bg-yellow-100 text-yellow-800" : i === 1 ? "bg-gray-200 text-gray-700" : i === 2 ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-500"
                          }`}>{i + 1}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.unitsSold}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">${product.revenue.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div className="bg-gradient-to-r from-[#B88E2F] to-[#D4A843] h-2.5 rounded-full transition-all" style={{ width: `${(product.revenue / maxProductRev) * 100}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.products.topProducts.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500 text-sm">No product sales data yet.</div>
              )}
            </div>
          </>
        )}

        {/* ===== CATEGORIES ===== */}
        {activeTab === "categories" && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Category Revenue Comparison</h3>
              <p className="text-sm text-gray-500 mb-5">{data.categories.totalCategories} total categories</p>
              <div className="space-y-4">
                {data.categories.performance.map((cat, i) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          i === 0 ? "bg-[#B88E2F] text-white" : "bg-gray-100 text-gray-600"
                        }`}>{i + 1}</span>
                        <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">{cat.unitsSold} units</span>
                        <span className="text-gray-500">{cat.productCount} products</span>
                        <span className="font-semibold text-gray-900">${cat.totalSales.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${i === 0 ? "bg-gradient-to-r from-[#B88E2F] to-[#D4A843]" : "bg-gradient-to-r from-gray-300 to-gray-400"}`}
                        style={{ width: `${(cat.totalSales / maxCatSales) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {data.categories.performance.length === 0 && (
                <div className="py-12 text-center text-gray-500 text-sm">No category sales data yet.</div>
              )}
            </div>
          </>
        )}

        {/* ===== CUSTOMERS ===== */}
        {activeTab === "customers" && (
          <>
            {/* Customer Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm text-gray-500">Repeat Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.customers.repeatCustomers}</p>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${data.customers.totalCustomers > 0 ? (data.customers.repeatCustomers / data.customers.totalCustomers) * 100 : 0}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{data.customers.totalCustomers > 0 ? ((data.customers.repeatCustomers / data.customers.totalCustomers) * 100).toFixed(0) : 0}% of total</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm text-gray-500">New Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.customers.newCustomers}</p>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${data.customers.totalCustomers > 0 ? (data.customers.newCustomers / data.customers.totalCustomers) * 100 : 0}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{data.customers.totalCustomers > 0 ? ((data.customers.newCustomers / data.customers.totalCustomers) * 100).toFixed(0) : 0}% of total</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm text-gray-500">New (Last 30 Days)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.customers.newCustomersLast30}</p>
                <p className="text-xs text-gray-400 mt-3">Recent acquisitions</p>
              </div>
            </div>

            {/* Top Customers Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Top Customers by Spend</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Rank</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Orders</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.customers.topCustomers.map((cust, i) => (
                      <tr key={cust.email} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            i === 0 ? "bg-yellow-100 text-yellow-800" : i === 1 ? "bg-gray-200 text-gray-700" : i === 2 ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-500"
                          }`}>{i + 1}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{cust.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{cust.email}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F9F1E7] text-[#B88E2F]">
                            {cust.orderCount} {cust.orderCount === 1 ? "order" : "orders"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">${cust.totalSpent.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.customers.topCustomers.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500 text-sm">No customer data yet.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
