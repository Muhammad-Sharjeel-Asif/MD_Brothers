"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartContext } from "../context/CartContext";
import { useUser, SignInButton } from "@clerk/nextjs";

interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const Carts: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCartContext();
  const { isSignedIn, isLoaded } = useUser();
  const [shippingSettings, setShippingSettings] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/shipping/settings');
        const data = await res.json();
        if (data.settings) {
          setShippingSettings(data.settings);
        }
      } catch (err) {
        console.error("Failed to fetch shipping settings", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-xl lg:text-3xl font-bold mb-6 text-center lg:text-left">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cart Items Section */}
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
          {cart.length > 0 ? (
            <>
              {/* Table Headers (hidden on small screens) */}
              <div className="hidden lg:grid grid-cols-4 font-semibold text-slate-700 bg-[#FAF4EB] py-3 px-4 rounded-t-md">
                <span>Product</span>
                <span className="text-center">Price</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Subtotal</span>
              </div>

              {/* Cart Items */}
              <ul className="space-y-6">
                {cart.map((item: CartItem) => (
                  <li
                    key={item._id}
                    className="flex flex-col lg:grid lg:grid-cols-4 items-center gap-4 bg-white shadow-sm p-4 rounded-md"
                  >
                    {/* Product */}
                    <div className="flex items-center space-x-4 w-full lg:w-auto">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={50}
                        height={50}
                        className="rounded-md"
                      />
                      <p className="font-medium text-slate-900">{item.title}</p>
                    </div>

                    {/* Price */}
                    <p className="text-slate-600 text-center lg:text-left w-full lg:w-auto">
                      Rs. {item.price.toFixed(2)}
                    </p>

                    {/* Quantity */}
                    <div className="flex justify-center lg:justify-start w-full lg:w-auto">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item._id, parseInt(e.target.value, 10))
                        }
                        className="w-12 border rounded text-center"
                      />
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="flex justify-between lg:justify-end items-center w-full lg:w-auto">
                      <p className="text-slate-900">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-center text-slate-500 py-10">
              Your cart is empty. Add some items to get started!
            </p>
          )}
        </div>

        {/* Cart Totals Section */}
        <div className="bg-[#F9F1E7] w-full p-6 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-semibold text-center mb-6">Cart Totals</h2>

          {shippingSettings?.freeShippingThreshold && (
            <div className="mb-6 p-4 bg-white rounded-lg border border-[#B88E2F]/20">
              {cartTotal >= shippingSettings.freeShippingThreshold ? (
                <p className="text-green-600 font-medium text-center text-sm">
                  🎉 Your order qualifies for FREE shipping!
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-slate-700 text-sm font-medium">
                    Add <span className="text-[#B88E2F]">Rs. {(shippingSettings.freeShippingThreshold - cartTotal).toFixed(0)}</span> more for <span className="font-bold">FREE Shipping</span>
                  </p>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#B88E2F] h-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, (cartTotal / shippingSettings.freeShippingThreshold) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm lg:text-base">Subtotal</p>
              <p className="text-sm lg:text-base">Rs. {cartTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-4">
              <p className="text-sm lg:text-base font-semibold">Total</p>
              <p className="text-sm lg:text-base font-semibold text-[#B88E2F]">
                Rs. {cartTotal.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            {isLoaded && isSignedIn ? (
              <Link href="/checkout">
                <button className="w-full lg:w-auto px-6 py-3 border border-black rounded-2xl text-sm lg:text-base font-medium hover:bg-black hover:text-white transition">
                  Proceed to Checkout
                </button>
              </Link>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">
                  Please sign in to proceed with checkout
                </p>
                <SignInButton mode="modal" forceRedirectUrl="/checkout">
                  <button className="w-full lg:w-auto px-6 py-3 bg-[#B88E2F] hover:bg-[#a37d2a] text-white rounded-2xl text-sm lg:text-base font-medium transition">
                    Sign In to Checkout
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carts;
