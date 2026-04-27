"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/useAdminAuth";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  pendingOrders: number;
  activeDiscounts: number;
}

interface RecentOrder {
  _id: string;
  customer: { firstName: string; lastName: string; email: string };
  totalPrice: number;
  status: string;
  paymentMethod: string;
  orderDate: string;
}

export default function AdminDashboard() {
  const { authenticatedFetch } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>({ totalProducts: 0, totalCategories: 0, pendingOrders: 0, activeDiscounts: 0 });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [deliverySettings, setDeliverySettings] = useState({
    deliveryCharges: 250,
    freeShippingThreshold: 5000,
    deliveryDiscount: 0,
    freeShipping: false,
    shippingMessage: "Fast delivery nationwide!",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [prodRes, catRes, ordRes, discRes, settingsRes] = await Promise.all([
          authenticatedFetch("/api/admin/products"),
          authenticatedFetch("/api/admin/categories"),
          authenticatedFetch("/api/admin/orders"),
          authenticatedFetch("/api/admin/discounts"),
          authenticatedFetch("/api/admin/settings"),
        ]);
        const products = await prodRes.json();
        const categories = await catRes.json();
        const orders = await ordRes.json();
        const discounts = await discRes.json();
        const settings = await settingsRes.json();

        setStats({
          totalProducts: products.length || 0,
          totalCategories: categories.length || 0,
          pendingOrders: (orders || []).filter((o: any) => o.status === "pending").length,
          activeDiscounts: (discounts || []).filter((d: any) => d.isActive).length,
        });
        setRecentOrders((orders || []).slice(0, 5));

        if (settings && !settings.error) {
          setDeliverySettings({
            deliveryCharges: settings.deliveryCharges || 250,
            freeShippingThreshold: settings.freeShippingThreshold || 5000,
            deliveryDiscount: settings.deliveryDiscount || 0,
            freeShipping: settings.freeShipping || false,
            shippingMessage: settings.shippingMessage || "Fast delivery nationwide!",
          });
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, href: "/admin/products", color: "from-blue-500 to-blue-600", icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { label: "Categories", value: stats.totalCategories, href: "/admin/categories", color: "from-emerald-500 to-emerald-600", icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
    { label: "Pending Orders", value: stats.pendingOrders, href: "/admin/orders", color: "from-amber-500 to-amber-600", icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: "Active Discounts", value: stats.activeDiscounts, href: "/admin/discounts", color: "from-purple-500 to-purple-600", icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await authenticatedFetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deliverySettings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      alert("Delivery settings updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving settings");
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s an overview of your store.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="group">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}>
                  {card.icon}
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-[#B88E2F] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Delivery Pricing Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#B88E2F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Delivery Pricing Controls
          </h2>
          <button 
            disabled={savingSettings}
            onClick={handleSaveSettings}
            className="text-sm bg-[#B88E2F] hover:bg-[#8C6D23] text-white px-4 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            {savingSettings ? "Saving..." : "Save Changes"}
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Base Charge (Rs)</label>
            <input 
              type="number" 
              value={deliverySettings.deliveryCharges}
              onChange={(e) => setDeliverySettings({...deliverySettings, deliveryCharges: Number(e.target.value)})}
              className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#B88E2F] focus:border-[#B88E2F] outline-none transition"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Discount (Rs)</label>
            <input 
              type="number" 
              value={deliverySettings.deliveryDiscount}
              onChange={(e) => setDeliverySettings({...deliverySettings, deliveryDiscount: Number(e.target.value)})}
              className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#B88E2F] focus:border-[#B88E2F] outline-none transition"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Free Threshold (Rs)</label>
            <input 
              type="number" 
              value={deliverySettings.freeShippingThreshold}
              onChange={(e) => setDeliverySettings({...deliverySettings, freeShippingThreshold: Number(e.target.value)})}
              className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#B88E2F] focus:border-[#B88E2F] outline-none transition"
              min="0"
            />
          </div>
          <div className="flex flex-col justify-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={deliverySettings.freeShipping}
                  onChange={(e) => setDeliverySettings({...deliverySettings, freeShipping: e.target.checked})}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${deliverySettings.freeShipping ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${deliverySettings.freeShipping ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <span className="text-sm font-semibold text-gray-700">Override: Free Shipping</span>
            </label>
            <p className="text-[10px] text-gray-500 mt-1 pl-1">If enabled, delivery is entirely free.</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-[#B88E2F] hover:text-[#8C6D23] font-medium transition-colors">
            View All →
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{order.customer?.firstName} {order.customer?.lastName}</p>
                      <p className="text-xs text-gray-500">{order.customer?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">${order.totalPrice?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{order.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-sm">No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
