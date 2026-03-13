"use client";
import React from "react";
import sanityClient from "@sanity/client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const client = sanityClient({
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
  productImage: {
    asset: {
      _ref: string;
    };
  };
  tags: string[];
  slug: string;
  Image: string;
  categoryName: string;
  sku: string;
}

const ProductSearch = () => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = React.useState(queryParam);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `
          *[_type == "product" && (title match "${searchTerm}*" || category->name match "${searchTerm}*" || sku match "${searchTerm}*")] {
            _id,
            title,
            price,
            description,
            discountPercentage,
            "imageUrl": productImage.asset->url,
            tags,
            "slug": slug.current,
            "categoryName": category->name,
            "sku": sku
          }`;
        const results = await client.fetch(query);
        setFilteredProducts(results);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      }
    };

    if (searchTerm.trim() !== "") {
      fetchData();
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm]);

  return (
    <div className="mt-28">
      {/* Search Form */}
      <div className="relative w-max mx-auto mb-10">
        <input
          type="search"
          name="search"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="relative peer z-10 bg-transparent w-96 h-12 rounded-full border border-gray-300 cursor-pointer hover:cursor-text focus:cursor-text outline-none pl-12 pr-4 focus:border-[#B88E2F] transition-all"
          placeholder="Search..."
        />
        <div className="absolute left-4 inset-y-0 my-auto h-6 w-6 pointer-events-none">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Product List */}
      <div className="product-list p-4">
        <h1 className="text-[#333333] text-[30px] text-center font-bold mb-6">Our Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-[#F4F5F7] shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
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
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">{product.description}</p>
                  <div className="mt-auto pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[20px] font-semibold text-gray-900">${product.price}</p>
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
                      <p className="text-xs text-[#B88E2F] mt-0.5">{product.categoryName}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="text-[10px] bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
               <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
               <p className="text-xl">No products matched your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function SearchPage() {
  return (
    <React.Suspense fallback={<div className="mt-28 text-center">Loading search results...</div>}>
      <ProductSearch />
    </React.Suspense>
  );
}
