"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchSanityData } from "@/app/actions/sanity";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  searchProducts,
  type SearchableProduct,
  type SearchResult,
} from "@/lib/fuzzySearch";
import { useCartContext } from "@/context/CartContext";



// ─── Debounce hook ───────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

// ─── Product Card ────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: SearchableProduct }) {
  const { addToCart } = useCartContext();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (adding) return;
    setAdding(true);
    addToCart({ ...product, quantity: 1 } as any);
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 400);
  };

  return (
    <div className="bg-[#F4F5F7] shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <Link href={`/${product.slug}`} className="relative h-52 w-full mb-4">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover rounded-md"
        />
      </Link>

      <div className="flex-1 flex flex-col">
        <Link href={`/${product.slug}`}>
          <h2 className="text-[24px] font-semibold text-[#3A3A3A] hover:text-[#B88E2F] transition-colors line-clamp-1">
            {product.title}
          </h2>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2 mt-2">
          {product.description}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between">
            <p className="text-[20px] font-semibold text-gray-900">
              ${product.price}
            </p>
            {product.discountPercentage > 0 && (
              <span className="text-red-500 text-sm font-medium">
                -{product.discountPercentage}% OFF
              </span>
            )}
          </div>
          {product.sku && (
            <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>
          )}
          {product.categoryName && (
            <p className="text-xs text-[#B88E2F] mt-0.5">
              {product.categoryName}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {product.tags?.map((tag, i) => (
          <span
            key={i}
            className="text-[10px] bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        className={`mt-4 w-full rounded-md py-3 px-11 transition-all duration-300 ${
          added
            ? "bg-green-600 text-white"
            : adding
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-[#7A6D3A] text-white hover:bg-[#B88E2F]"
        }`}
        onClick={handleAdd}
        disabled={adding}
      >
        {adding ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Adding
          </span>
        ) : added ? (
          <span className="flex items-center justify-center">
            <svg
              className="w-4 h-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Added
          </span>
        ) : (
          "Add to Cart"
        )}
      </button>
    </div>
  );
}

// ─── Main Search Component ───────────────────────────────────────────────────

const ProductSearch = () => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [allProducts, setAllProducts] = useState<SearchableProduct[]>([]);
  const [result, setResult] = useState<SearchResult>({
    products: [],
    matchType: "exact",
  });
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const debouncedQuery = useDebounce(searchTerm, 300);

  // Sync URL param → search input
  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  // Fetch all products once
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAll = async () => {
      try {
        const query = `*[_type == "product"] {
          _id,
          title,
          price,
          description,
          "discountPercentage": coalesce(discountPercentage, 0),
          "imageUrl": productImage.asset->url,
          tags,
          "slug": slug.current,
          "categoryName": category->name,
          "sku": coalesce(sku, "")
        }`;
        const data: SearchableProduct[] | null = await fetchSanityData(query);
        if (!data) {
          setAllProducts([]);
          return;
        }
        setAllProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Run fuzzy search whenever debounced query or product list changes
  useEffect(() => {
    if (allProducts.length === 0) return;

    if (!debouncedQuery.trim()) {
      setResult({ products: [], matchType: "exact" });
      return;
    }

    const res = searchProducts(debouncedQuery, allProducts);
    setResult(res);
  }, [debouncedQuery, allProducts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="mt-28 min-h-[60vh]">
      {/* Search Input */}
      <div className="relative w-max mx-auto mb-10">
        <input
          type="search"
          name="search"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="relative peer z-10 bg-transparent w-[22rem] sm:w-96 h-12 rounded-full border border-gray-300 cursor-pointer hover:cursor-text focus:cursor-text outline-none pl-12 pr-4 focus:border-[#B88E2F] transition-all"
          placeholder="Search products, categories, SKU..."
        />
        <div className="absolute left-4 inset-y-0 my-auto h-6 w-6 pointer-events-none">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <svg
            className="animate-spin h-8 w-8 text-[#B88E2F]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}

      {/* Results */}
      {!isLoading && debouncedQuery.trim() !== "" && (
        <div className="product-list px-4 sm:px-8 lg:px-16">
          {/* Match-type indicator */}
          {result.matchType === "fuzzy" && (
            <p className="text-center text-gray-500 mb-4 text-sm">
              Showing closest matches for{" "}
              <span className="font-semibold text-[#B88E2F]">
                &ldquo;{debouncedQuery}&rdquo;
              </span>
            </p>
          )}

          {result.matchType === "category" && result.matchedCategory && (
            <p className="text-center text-gray-500 mb-4 text-sm">
              No exact products matched. Showing products from category{" "}
              <span className="font-semibold text-[#B88E2F]">
                &ldquo;{result.matchedCategory}&rdquo;
              </span>
            </p>
          )}

          {result.matchType === "recommended" && (
            <div className="col-span-full py-10 flex flex-col items-center justify-center text-gray-400 mb-6">
              <svg
                className="w-16 h-16 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-xl font-medium text-gray-600">
                No products found for &ldquo;{debouncedQuery}&rdquo;
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Here are some recommended products you might like
              </p>
            </div>
          )}

          {/* Section title */}
          <h1 className="text-[#333333] text-[30px] text-center font-bold mb-6">
            {result.matchType === "recommended"
              ? "Recommended Products"
              : "Search Results"}
          </h1>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {result.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state — no query entered */}
      {!isLoading && debouncedQuery.trim() === "" && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg
            className="w-16 h-16 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-xl">
            Type a product name, category, or SKU to search
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Page wrapper with Suspense for useSearchParams ──────────────────────────

export default function SearchPage() {
  return (
    <React.Suspense
      fallback={
        <div className="mt-28 text-center">Loading search results...</div>
      }
    >
      <ProductSearch />
    </React.Suspense>
  );
}
