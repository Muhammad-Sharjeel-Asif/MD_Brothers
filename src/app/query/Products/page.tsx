"use client";

import React, { useState } from "react";
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

interface Project {
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
  categoryName: string; // Updated from category
  slug: string;
}

const ProductCards: React.FC = () => {
  const { addToCart } = useCartContext();
  const [products, setProducts] = React.useState<Project[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [productsPerPage] = React.useState<number>(8);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set());

  const fetchProducts = async () => {
    try {
      const query = `*[_type == "product"] {
        _id,
        title,
        price,
        description,
        discountPercentage,
        "imageUrl": productImage.asset->url,
        tags,
        "categoryName": category->name,
        "slug": slug.current
      }`;

      const data: Project[] = await sanity.fetch(query);

      const allCategories = Array.from(
        new Set(data.map((product) => product.categoryName).filter(Boolean))
      );

      const sortedCategories = ["All", ...allCategories.sort()];
      setCategories(sortedCategories);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    if (addingItems.has(product._id)) return;

    setAddingItems(prev => new Set(prev).add(product._id));
    addToCart({ ...product, quantity: 1 });

    setTimeout(() => {
      setAddingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
      setAddedItems(prev => new Set(prev).add(product._id));

      setTimeout(() => {
        setAddedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(product._id);
          return newSet;
        });
      }, 2000);
    }, 400);
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.categoryName === selectedCategory);

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <h1 className="text-[#333333] text-[40px] text-center font-bold mt-6 mb-6">
        Our Products
      </h1>

      {/* Category Filter */}
      <div className="flex justify-center mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 rounded-md border border-gray-300 shadow-sm"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols gap-6">
        {currentProducts.map((product) => (
          <div
            key={product._id}
            className="bg-[#F4F5F7] shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/${product.slug}`}>
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={285}
                height={301}
                className="w-full h-80 object-cover rounded-md"
              />
            </Link>
            <div className="mt-4">
              <h2 className="text-[24px] font-semibold text-[#3A3A3A] ml-2 mt-4">
                {product.title}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-1 ml-2">
                {product.description}
              </p>
              <div>
                <p className="text-[20px] font-semibold mr-6 ml-2">
                  $ {product.price}
                </p>
                {product.discountPercentage > 0 && (
                  <span className="text-red-500 text-sm">
                    -{product.discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-3">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-slate-300 line-clamp-1 text-black rounded-full px-3 py-1 whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-col items-center justify-between h-full">
              <button
                className={`mt-4 w-full rounded-md py-3 px-11 transition-all duration-300 ${addedItems.has(product._id)
                  ? 'bg-green-600 text-white'
                  : addingItems.has(product._id)
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-[#7A6D3A] text-white hover:bg-[#B88E2F]'
                  }`}
                onClick={() => handleAddToCart(product)}
                disabled={addingItems.has(product._id)}
              >
                {addingItems.has(product._id) ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding
                  </span>
                ) : addedItems.has(product._id) ? (
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added
                  </span>
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 mt-14">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Previous
          </button>
        )}

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`w-[60px] h-[60px] flex items-center justify-center rounded-full ${currentPage === index + 1 ? "bg-[#B88E2F] text-white" : "bg-gray-300"} rounded-md hover:bg-gray-400`}
          >
            {index + 1}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="w-[60px] h-[60px] bg-[#F9F1E7] flex items-center justify-center hover:bg-[#B88E2F] hover:text-white"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCards;
