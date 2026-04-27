"use client";

import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/useAdminAuth";

interface Discount {
  _id: string;
  title: string;
  type: string;
  value: number;
  bulkThreshold?: number;
  isActive: boolean;
  activeRange?: { startDate: string; endDate: string };
  appliesTo?: { _id: string; _type: string; title?: string; name?: string }[];
}

export default function DiscountsPage() {
  const { authenticatedFetch } = useAdminAuth();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    type: "percentage",
    value: "",
    bulkThreshold: "",
    isActive: true,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const res = await authenticatedFetch("/api/admin/discounts");
      const data = await res.json();
      setDiscounts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authenticatedFetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ title: "", type: "percentage", value: "", bulkThreshold: "", isActive: true, startDate: "", endDate: "" });
        setShowForm(false);
        fetchDiscounts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const typeLabels: Record<string, string> = {
    percentage: "Percentage (%)",
    fixed: "Fixed Amount ($)",
    bulk: "Bulk Threshold",
  };

  const typeColors: Record<string, string> = {
    percentage: "bg-purple-100 text-purple-800",
    fixed: "bg-blue-100 text-blue-800",
    bulk: "bg-amber-100 text-amber-800",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discounts</h1>
          <p className="text-sm text-gray-500 mt-1">{discounts.length} total discounts</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-[#B88E2F] hover:bg-[#8C6D23] text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-md shadow-[#B88E2F]/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showForm ? "Cancel" : "Add Discount"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 max-w-lg space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">New Discount</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
            <input type="text" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
              placeholder="e.g., Summer Sale 2024"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Type *</label>
              <select value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="bulk">Bulk Threshold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Value *</label>
              <input type="number" required min="0" value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
                placeholder={form.type === "percentage" ? "10" : "5.00"}
              />
            </div>
          </div>
          {form.type === "bulk" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum Quantity</label>
              <input type="number" min="1" value={form.bulkThreshold}
                onChange={(e) => setForm({ ...form, bulkThreshold: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
                placeholder="5"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
              <input type="datetime-local" value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
              <input type="datetime-local" value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-[#B88E2F] focus:ring-[#B88E2F]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
          </div>
          <button type="submit" disabled={saving}
            className="bg-[#B88E2F] hover:bg-[#8C6D23] text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create Discount"}
          </button>
        </form>
      )}

      {/* Discount List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {discounts.map((disc) => (
          <div key={disc._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{disc.title}</h3>
              <span className={`w-3 h-3 rounded-full ${disc.isActive ? "bg-green-500" : "bg-gray-300"}`} title={disc.isActive ? "Active" : "Inactive"} />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[disc.type] || "bg-gray-100 text-gray-800"}`}>
                {typeLabels[disc.type] || disc.type}
              </span>
              <span className="text-lg font-bold text-gray-900">
                {disc.type === "percentage" ? `${disc.value}%` : `$${disc.value}`}
              </span>
            </div>
            {disc.type === "bulk" && disc.bulkThreshold && (
              <p className="text-xs text-gray-500 mb-2">Min. quantity: {disc.bulkThreshold}</p>
            )}
            {disc.activeRange?.startDate && (
              <p className="text-xs text-gray-400">
                {new Date(disc.activeRange.startDate).toLocaleDateString()} — {new Date(disc.activeRange.endDate).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {discounts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">No discounts yet. Create one to get started.</p>
        </div>
      )}
    </div>
  );
}
