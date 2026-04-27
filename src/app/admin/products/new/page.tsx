"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/useAdminAuth";

interface Category {
  _id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const { authenticatedFetch } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    sku: "",
    discountPercentage: "",
    isNew: false,
    categoryId: "",
    tags: "",
    slug: "",
  });

  useEffect(() => {
    authenticatedFetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageAssetId = "";
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const uploadRes = await authenticatedFetch("/api/admin/upload", { 
          method: "POST", 
          body: fd,
        });
        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error || "Image upload failed");
        }
        const uploadData = await uploadRes.json();
        imageAssetId = uploadData.assetId;
      } else {
        throw new Error("Please upload a product image");
      }

      if (!form.categoryId) {
        throw new Error("Please select a category");
      }

      const body = {
        ...form,
        price: Number(form.price),
        discountPercentage: Number(form.discountPercentage) || 0,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        imageAssetId,
      };

      const res = await authenticatedFetch("/api/admin/products", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const errorData = await res.json();
        const msg = errorData.error || "Unknown error";
        if (msg.includes("Authentication required")) {
          alert(`Authentication Error: The server could not find your session. \n\nPossible solutions:\n1. Refresh the page.\n2. Log out and log back in.\n3. Ensure you are not in Incognito mode with third-party cookies blocked.`);
        } else {
          alert(`Failed to create product: ${msg}`);
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error creating product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-[#B88E2F] transition-colors flex items-center gap-1 mb-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
              <input
                type="text" required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
                placeholder="Product title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
              <input
                type="text" value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm font-mono"
                placeholder="product-slug"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
            <textarea
              required value={form.description} rows={4}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm resize-none"
              placeholder="Product description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($) *</label>
              <input
                type="number" required min="0" step="0.01" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU *</label>
              <input
                type="text" required value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm font-mono"
                placeholder="SKU-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount %</label>
              <input
                type="number" min="0" max="100" value={form.discountPercentage}
                onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
              >
                <option value="">Select category</option>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))
                ) : (
                  <option disabled>No categories found - Please create one first</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
              <input
                type="text" value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox" id="isNew" checked={form.isNew}
              onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-[#B88E2F] focus:ring-[#B88E2F]"
            />
            <label htmlFor="isNew" className="text-sm font-medium text-gray-700">Mark as New Product</label>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-5">Product Image</h2>
          <div className="flex items-center gap-6">
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-xl object-cover border-2 border-gray-100" />
            )}
            <label className="flex-1 flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#B88E2F] hover:bg-[#F9F1E7]/30 transition-colors">
              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-500">Click to upload image</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit" disabled={saving}
            className="inline-flex items-center gap-2 bg-[#B88E2F] hover:bg-[#8C6D23] text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : "Create Product"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
