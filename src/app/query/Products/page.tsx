"use client";

import React, { useState, useEffect, useMemo } from "react";
import sanityClient from "@sanity/client";
import Image from "next/image";
import { useCartContext } from "@/context/CartContext";
import Link from "next/link";

const sanity = sanityClient({
  projectId: "2srh4ekv",
  dataset: "productions",
  token: "skz6lWFJkAgpfrjXgwK8Tb6UBsTpRcSwzsQawON5Qps118XQdODrtVLdyXySTgJqC7rhPUKAOzb9prGs2aORcV0IICFN6pLKCLW2G0P7u5rExc8E92fzYp0UMuro6VpCzm51svtpWMCniHWaEiZAeJApDrYyIXgO5Uar4GLM2QPxFsswwZnU",
  useCdn: true,
});

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  discountPercentage: number;
  imageUrl: string;
  productImage: { asset: { _ref: string } };
  tags: string[];
  categoryName: string;
  slug: string;
  _createdAt: string;
}

type SortOption = "newest" | "price-asc" | "price-desc" | "best-selling";

const ProductCards: React.FC = () => {
  const { addToCart } = useCartContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);

  // Sort state
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // UI state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `*[_type == "product"] | order(_createdAt desc) {
          _id, title, price, description, discountPercentage,
          "imageUrl": productImage.asset->url,
          tags,
          "categoryName": category->name,
          "slug": slug.current,
          _createdAt
        }`;
        const data: Product[] = await sanity.fetch(query);

        const allCategories = Array.from(
          new Set(data.map((p) => p.categoryName).filter(Boolean))
        );
        setCategories(["All", ...allCategories.sort()]);

        const highest = Math.max(...data.map((p) => p.price), 0);
        const ceilPrice = Math.ceil(highest / 100) * 100 || 1000;
        setMaxPrice(ceilPrice);
        setPriceRange([0, ceilPrice]);

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Reset page when filters/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, showDiscountedOnly, sortBy]);

  // Filter + Sort pipeline
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.categoryName === selectedCategory);
    }

    // Price range filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Discount filter
    if (showDiscountedOnly) {
      result = result.filter((p) => p.discountPercentage && p.discountPercentage > 0);
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime());
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "best-selling":
        // Prioritize discounted products as a proxy for best-selling
        result.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
        break;
    }

    return result;
  }, [products, selectedCategory, priceRange, showDiscountedOnly, sortBy]);

  // Pagination
  const totalPages = Math.ceil(processedProducts.length / productsPerPage);
  const currentProducts = processedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleAddToCart = (product: Product) => {
    if (addingItems.has(product._id)) return;
    setAddingItems((prev) => new Set(prev).add(product._id));
    addToCart({ ...product, quantity: 1 });
    setTimeout(() => {
      setAddingItems((prev) => { const s = new Set(prev); s.delete(product._id); return s; });
      setAddedItems((prev) => new Set(prev).add(product._id));
      setTimeout(() => {
        setAddedItems((prev) => { const s = new Set(prev); s.delete(product._id); return s; });
      }, 2000);
    }, 400);
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setPriceRange([0, maxPrice]);
    setShowDiscountedOnly(false);
    setSortBy("newest");
  };

  const hasActiveFilters = selectedCategory !== "All" || priceRange[0] > 0 || priceRange[1] < maxPrice || showDiscountedOnly;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* ─── Toolbar ─── */}
      <div className="bg-[#F9F1E7] rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#B88E2F] hover:text-[#B88E2F] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {hasActiveFilters && <span className="w-2 h-2 bg-[#B88E2F] rounded-full" />}
          </button>

          {/* Result count */}
          <span className="text-sm text-gray-500">
            Showing {processedProducts.length} of {products.length} products
          </span>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 underline transition-colors">
              Clear all
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]/20 outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="best-selling">Best Selling</option>
          </select>
        </div>
      </div>

      {/* ─── Filters Panel ─── */}
      {filtersOpen && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-in slide-in-from-top-2">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]/20 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price Range: ${priceRange[0]} — ${priceRange[1]}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range" min={0} max={maxPrice} step={10}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
                className="flex-1 accent-[#B88E2F]"
              />
              <input
                type="range" min={0} max={maxPrice} step={10}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
                className="flex-1 accent-[#B88E2F]"
              />
            </div>
          </div>

          {/* Discount Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Special</label>
            <label className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg border border-gray-200 hover:border-[#B88E2F] transition-colors">
              <input
                type="checkbox"
                checked={showDiscountedOnly}
                onChange={(e) => setShowDiscountedOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#B88E2F] focus:ring-[#B88E2F]"
              />
              <span className="text-sm text-gray-700">Discounted Only</span>
              <span className="text-xs text-red-500 font-medium">SALE</span>
            </label>
          </div>

          {/* Quick Category Chips */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Filter</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#B88E2F] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-[#F9F1E7] hover:text-[#B88E2F]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Product Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <div
            key={product._id}
            className="bg-[#F4F5F7] rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col"
          >
            {/* Image */}
            <Link href={`/${product.slug}`} className="relative overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={285}
                height={301}
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.discountPercentage > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    -{product.discountPercentage}%
                  </span>
                )}
              </div>
            </Link>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-lg font-semibold text-[#3A3A3A] line-clamp-1">{product.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-1 mt-1">{product.description}</p>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-xl font-bold text-[#3A3A3A]">${product.price}</span>
                {product.discountPercentage > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(0)}
                  </span>
                )}
              </div>

              {product.categoryName && (
                <span className="text-xs text-[#B88E2F] font-medium mt-2">{product.categoryName}</span>
              )}

              {/* Add to Cart */}
              <button
                className={`mt-auto w-full rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 mt-4 ${
                  addedItems.has(product._id)
                    ? "bg-green-600 text-white"
                    : addingItems.has(product._id)
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#7A6D3A] text-white hover:bg-[#B88E2F]"
                }`}
                onClick={() => handleAddToCart(product)}
                disabled={addingItems.has(product._id)}
              >
                {addingItems.has(product._id) ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding...
                  </span>
                ) : addedItems.has(product._id) ? (
                  <span className="flex items-center justify-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added!
                  </span>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {currentProducts.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No products found</h3>
          <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search criteria.</p>
          <button onClick={clearFilters} className="px-5 py-2 bg-[#B88E2F] text-white rounded-lg text-sm font-medium hover:bg-[#8C6D23] transition-colors">
            Reset Filters
          </button>
        </div>
      )}

      {/* ─── Pagination ─── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2.5 rounded-lg bg-[#F9F1E7] text-sm font-medium text-gray-700 hover:bg-[#B88E2F] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
            .map((page, idx, arr) => (
              <React.Fragment key={page}>
                {idx > 0 && arr[idx - 1] !== page - 1 && (
                  <span className="px-2 text-gray-400">…</span>
                )}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-[#B88E2F] text-white shadow-md"
                      : "bg-[#F9F1E7] text-gray-700 hover:bg-[#B88E2F] hover:text-white"
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2.5 rounded-lg bg-[#F9F1E7] text-sm font-medium text-gray-700 hover:bg-[#B88E2F] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCards;
