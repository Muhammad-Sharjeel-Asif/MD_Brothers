"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Category {
  _id: string;
  name: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
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
    Promise.all([
      fetch(`/api/admin/products/${id}`).then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]).then(([product, cats]) => {
      setCategories(cats);
      setForm({
        title: product.title || "",
        description: product.description || "",
        price: String(product.price || ""),
        sku: product.sku || "",
        discountPercentage: String(product.dicountPercentage || ""),
        isNew: product.isNew || false,
        categoryId: product.categoryId || "",
        tags: (product.tags || []).join(", "),
        slug: product.slug || "",
      });
      if (product.imageUrl) setImagePreview(product.imageUrl);
      setLoading(false);
    }).catch((err) => { console.error(err); setLoading(false); });
  }, [id]);

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
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const uploadData = await uploadRes.json();
        imageAssetId = uploadData.assetId;
      }

      const body: any = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        sku: form.sku,
        discountPercentage: Number(form.discountPercentage) || 0,
        isNew: form.isNew,
        categoryId: form.categoryId,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        slug: form.slug,
      };
      if (imageAssetId) body.imageAssetId = imageAssetId;

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) router.push("/admin/products");
      else alert("Failed to update product");
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    } finally {
      setSaving(false);
    }
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
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-[#B88E2F] transition-colors flex items-center gap-1 mb-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
              <input type="text" required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
              <input type="text" value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
            <textarea required value={form.description} rows={4}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($)</label>
              <input type="number" required min="0" step="0.01" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU</label>
              <input type="text" required value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount %</label>
              <input type="number" min="0" max="100" value={form.discountPercentage}
                onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
              >
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
              <input type="text" value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isNew" checked={form.isNew}
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
              <span className="text-sm text-gray-500">{imageFile ? "Change image" : "Click to upload new image"}</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 bg-[#B88E2F] hover:bg-[#8C6D23] text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md disabled:opacity-50"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
            ) : "Update Product"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
