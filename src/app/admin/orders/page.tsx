"use client";

import React, { useEffect, useState } from "react";

interface Order {
  _id: string;
  customer: { firstName: string; lastName: string; email: string; phone: string; address: string; city: string; zipCode: string };
  items: { product: any; quantity: number; price: number }[];
  totalPrice: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  deliveryAgent?: string;
  deliveryConfirmedAt?: string;
  gateway?: string;
  transactionId?: string;
  paymentTimestamp?: string;
  proofImageUrl?: string;
  orderDate: string;
  paymentLogs?: { _key: string, gateway: string, eventType: string, transactionId: string, status: string, timestamp: string }[];
}

const statuses = ["pending", "pending_payment", "awaiting_bank_transfer", "processing", "paid", "shipped", "dispatched", "delivered", "completed", "cancelled"];
const paymentStatuses = ["pending", "completed", "failed"];
const paymentMethods = ["COD", "PayFast"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  pending_payment: "bg-orange-100 text-orange-800 border-orange-200",
  awaiting_bank_transfer: "bg-purple-100 text-purple-800 border-purple-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  paid: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  dispatched: "bg-teal-100 text-teal-800 border-teal-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    paymentStatus: "all",
    paymentMethod: "all"
  });
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [agentInput, setAgentInput] = useState<Record<string, string>>({});

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

  const updateStatus = async (id: string, updates: Partial<Order>) => {
    setUpdating(id);
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      fetchOrders(); // refresh cleanly when states get interdependent
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter((o) => {
    if (filters.status !== "all" && o.status !== filters.status) return false;
    if (filters.paymentStatus !== "all" && o.paymentStatus !== filters.paymentStatus) return false;
    if (filters.paymentMethod !== "all" && o.paymentMethod !== filters.paymentMethod) return false;
    return true;
  });

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
      <div className="space-y-4 mb-6">
        <div>
           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Status</p>
           <div className="flex flex-wrap gap-2">
             <button
               onClick={() => setFilters({ ...filters, status: "all" })}
               className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${filters.status === "all" ? "bg-[#B88E2F] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
             >
               All
             </button>
             {statuses.map((s) => (
               <button
                 key={s}
                 onClick={() => setFilters({ ...filters, status: s })}
                 className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filters.status === s ? "bg-[#B88E2F] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
               >
                 {s.replace('_', ' ')}
               </button>
             ))}
           </div>
        </div>

        <div>
           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Status</p>
           <div className="flex flex-wrap gap-2">
             <button
               onClick={() => setFilters({ ...filters, paymentStatus: "all" })}
               className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${filters.paymentStatus === "all" ? "bg-[#B88E2F] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
             >
               All
             </button>
             {paymentStatuses.map((s) => (
               <button
                 key={`ps-${s}`}
                 onClick={() => setFilters({ ...filters, paymentStatus: s })}
                 className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filters.paymentStatus === s ? "bg-[#B88E2F] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
               >
                 {s}
               </button>
             ))}
           </div>
        </div>
        
        <div>
           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Method</p>
           <div className="flex flex-wrap gap-2">
             <button
               onClick={() => setFilters({ ...filters, paymentMethod: "all" })}
               className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${filters.paymentMethod === "all" ? "bg-[#B88E2F] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
             >
               All
             </button>
             {paymentMethods.map((s) => (
               <button
                 key={`pm-${s}`}
                 onClick={() => setFilters({ ...filters, paymentMethod: s })}
                 className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filters.paymentMethod === s ? "bg-[#B88E2F] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
               >
                 {s}
               </button>
             ))}
           </div>
        </div>
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
                  {/* Customer & Payment Info */}
                  <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Customer Details</h4>
                        <div className="space-y-1 text-sm text-gray-600 bg-white p-4 rounded-xl border border-gray-100">
                          <p><span className="font-medium">Phone:</span> {order.customer?.phone || "—"}</p>
                          <p><span className="font-medium">Address:</span> {order.customer?.address || "—"}</p>
                          <p><span className="font-medium">City:</span> {order.customer?.city || "—"}</p>
                          <p><span className="font-medium">ZIP:</span> {order.customer?.zipCode || "—"}</p>
                          <p><span className="font-medium">Date:</span> {order.orderDate ? new Date(order.orderDate).toLocaleString() : "—"}</p>
                          {order.deliveryAgent && <p><span className="font-medium text-teal-700">Delivery Agent:</span> {order.deliveryAgent}</p>}
                          {order.deliveryConfirmedAt && <p><span className="font-medium text-teal-700">Delivery Configured:</span> {new Date(order.deliveryConfirmedAt).toLocaleString()}</p>}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Payment Details</h4>
                        <div className="space-y-1 text-sm text-gray-600 bg-white p-4 rounded-xl border border-gray-100">
                          <p><span className="font-medium">Method:</span> <span className="capitalize">{order.paymentMethod}</span></p>
                          <p><span className="font-medium">Status:</span> <span className={`capitalize font-semibold ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>{order.paymentStatus || 'pending'}</span></p>
                          {order.gateway && <p><span className="font-medium">Gateway:</span> {order.gateway}</p>}
                          {order.transactionId && <p><span className="font-medium">Transaction ID:</span> <span className="text-xs bg-gray-100 px-1 py-0.5 rounded">{order.transactionId}</span></p>}
                          {order.paymentTimestamp && <p><span className="font-medium">Logged At:</span> {new Date(order.paymentTimestamp).toLocaleString()}</p>}
                        </div>
                        
                        {order.proofImageUrl && (
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Bank Transfer Proof</h4>
                                <div className="border border-gray-200 p-2 rounded-xl bg-white relative group overflow-hidden">
                                     {/* eslint-disable-next-line @next/next/no-img-element */}
                                     <img src={order.proofImageUrl} alt="Payment Proof" className="w-full h-auto max-h-48 object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]" />
                                     <a href={order.proofImageUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                         <span className="text-white text-sm font-medium flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            View Full Screen
                                         </span>
                                     </a>
                                </div>
                            </div>
                        )}
                    </div>
                  </div>

                  {/* Payment Timeline */}
                  {order.paymentLogs && order.paymentLogs.length > 0 && (
                      <div className="col-span-1 md:col-span-2 mb-2">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Payment Timeline</h4>
                          <div className="bg-white border border-gray-100 rounded-xl overflow-x-auto shadow-sm">
                              <table className="min-w-full divide-y divide-gray-200 text-sm">
                                  <thead className="bg-[#B88E2F]/10">
                                      <tr>
                                          <th className="px-4 py-3 text-left font-medium text-[#B88E2F]">Time</th>
                                          <th className="px-4 py-3 text-left font-medium text-[#B88E2F]">Gateway</th>
                                          <th className="px-4 py-3 text-left font-medium text-[#B88E2F]">Event</th>
                                          <th className="px-4 py-3 text-left font-medium text-[#B88E2F]">Status</th>
                                          <th className="px-4 py-3 text-left font-medium text-[#B88E2F]">Trx ID</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 bg-white">
                                      {order.paymentLogs.map(log => (
                                          <tr key={log._key} className="hover:bg-gray-50 transition-colors">
                                              <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                                              <td className="px-4 py-3 text-gray-600 font-medium">{log.gateway}</td>
                                              <td className="px-4 py-3 font-medium capitalize text-gray-800">{log.eventType}</td>
                                              <td className="px-4 py-3">
                                                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${log.status === 'success' || log.status === 'completed' ? 'bg-green-100 text-green-700' : log.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                      {log.status}
                                                  </span>
                                              </td>
                                              <td className="px-4 py-3 text-gray-500 font-mono text-xs max-w-[150px] truncate">{log.transactionId || '—'}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  )}

                  {/* Update Status */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Update Order Status</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {statuses.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                              const updateData: any = { status: s };
                              if (s === 'dispatched' && agentInput[order._id]) {
                                  updateData.deliveryAgent = agentInput[order._id];
                              }
                              updateStatus(order._id, updateData);
                          }}
                          disabled={updating === order._id || order.status === s}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors border ${
                            order.status === s
                              ? "bg-[#B88E2F] text-white border-[#B88E2F]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-[#B88E2F] hover:text-[#B88E2F]"
                          } disabled:opacity-50`}
                        >
                          {updating === order._id ? "..." : s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Set Delivery Agent (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. Courier Tracker, Rider Name"
                            value={agentInput[order._id] || ''}
                            onChange={(e) => setAgentInput({ ...agentInput, [order._id]: e.target.value })}
                            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B88E2F] focus:border-[#B88E2F] outline-none"
                        />
                    </div>

                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Override Payment Status</h4>
                    <div className="flex flex-wrap gap-2">
                        {paymentStatuses.map((ps) => (
                            <button
                              key={`ps-${ps}`}
                              onClick={() => updateStatus(order._id, { paymentStatus: ps })}
                              disabled={updating === order._id || order.paymentStatus === ps}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors border ${
                                order.paymentStatus === ps
                                  ? "bg-green-600 text-white border-green-600"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-green-600 hover:text-green-600"
                              } disabled:opacity-50`}
                            >
                              {updating === order._id ? "..." : ps.replace('_', ' ')}
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
