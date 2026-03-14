"use client";

import React, { useEffect, useState } from "react";

interface Order {
  _id: string;
  customer: { firstName: string; lastName: string; email: string; phone: string; address: string; city: string; zipCode: string };
  items: { product: any; quantity: number; price: number }[];
  totalPrice: number;
  status: string;
  paymentMethod: string;
  orderDate: string;
}

const statuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  paid: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === "all" ? "bg-[#B88E2F] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          All ({orders.length})
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${filter === s ? "bg-[#B88E2F] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {s} ({orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {filtered.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Order Header */}
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{order.customer?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-bold text-gray-900">${order.totalPrice?.toFixed(2)}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize border ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                  {order.status}
                </span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === order._id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === order._id && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Customer Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Phone:</span> {order.customer?.phone || "—"}</p>
                      <p><span className="font-medium">Address:</span> {order.customer?.address || "—"}</p>
                      <p><span className="font-medium">City:</span> {order.customer?.city || "—"}</p>
                      <p><span className="font-medium">ZIP:</span> {order.customer?.zipCode || "—"}</p>
                      <p><span className="font-medium">Payment:</span> <span className="capitalize">{order.paymentMethod}</span></p>
                      <p><span className="font-medium">Date:</span> {order.orderDate ? new Date(order.orderDate).toLocaleString() : "—"}</p>
                    </div>
                  </div>

                  {/* Update Status */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Update Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(order._id, s)}
                          disabled={updating === order._id || order.status === s}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors border ${
                            order.status === s
                              ? "bg-[#B88E2F] text-white border-[#B88E2F]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-[#B88E2F] hover:text-[#B88E2F]"
                          } disabled:opacity-50`}
                        >
                          {updating === order._id ? "..." : s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">No orders found.</p>
        </div>
      )}
    </div>
  );
}
