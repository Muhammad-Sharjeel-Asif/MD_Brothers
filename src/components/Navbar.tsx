"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartContext } from "@/context/CartContext";
import { ClerkLoaded, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, removeFromCart, cartTotal } = useCartContext();
  const { user } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen || cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [menuOpen, cartOpen]);

  const role = (user?.publicMetadata as any)?.role;
  const isAdmin = role === 'admin' || user?.emailAddresses[0]?.emailAddress === 'msharjeelasif@gmail.com';

  const menuItems = [
    {
      href: "/",
      label: "Home",
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    },
    ...(isAdmin ? [{
      href: "/admin",
      label: "Admin Dashboard",
      icon: <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    }] : []),
    {
      href: "/shop",
      label: "Shop",
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
    },
    {
      href: "/about",
      label: "About",
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      href: "/blog",
      label: "Blog",
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
    },
    {
      href: "/contact",
      label: "Contact",
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
    },
    {
      href: "/support",
      label: "Support",
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full h-[80px] bg-white flex items-center justify-between px-4 md:px-8 lg:px-16 shadow-md z-50">
      {/* Logo Section */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={160}
            height={40}
            className="w-auto h-auto ml-2 sm:ml-4 cursor-pointer"
          />
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 text-gray-800">
        <Link href="/" className="hover:text-[#B88E2F] transition font-medium">
          Home
        </Link>
        {isAdmin && (
          <Link href="/admin" className="text-red-600 hover:text-red-800 transition font-bold">
            Dashboard
          </Link>
        )}
        <Link href="/shop" className="hover:text-[#B88E2F] transition font-medium">
          Shop
        </Link>
        <Link href="/about" className="hover:text-[#B88E2F] transition font-medium">
          About
        </Link>
        <Link href="/blog" className="hover:text-[#B88E2F] transition font-medium">
          Blog
        </Link>
        <Link href="/contact" className="hover:text-[#B88E2F] transition font-medium">
          Contact
        </Link>
        <Link href="/support" className="hover:text-[#B88E2F] transition font-medium">
          Support
        </Link>
      </div>

      {/* Actions (Cart, Search, Favorites, Auth) */}
      <div className="hidden sm:flex items-center space-x-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40 lg:w-64 pl-4 pr-10 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#B88E2F] transition-all duration-300"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[#B88E2F] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Favorites - Only for logged in users */}
        <ClerkLoaded>
          {user && (
            <Link href="/asgaard-sofa">
              <svg className="w-6 h-6 text-gray-700 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
          )}
        </ClerkLoaded>

        {/* Cart - Available for all users */}
        <div className="relative">
          <button
            onClick={toggleCart}
            className="p-2 rounded-full hover:bg-[#F9F1E7] transition-colors duration-300 group"
            aria-label="Open cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700 group-hover:text-[#B88E2F] transition-colors duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </button>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#B88E2F] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow-md">
              {cart.length}
            </span>
          )}
        </div>

        {/* Auth: UserButton or SignIn */}
        <ClerkLoaded>
          {user ? (
            <UserButton afterSignOutUrl="/">
              <UserButton.MenuItems>
                <UserButton.Link label="My Orders" labelIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} href="/my-orders" />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-[#B88E2F] hover:bg-[#a37d2a] text-white text-sm font-medium rounded-lg transition-colors">
                Sign In
              </button>
            </SignInButton>
          )}
        </ClerkLoaded>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden flex items-center gap-3">
        {/* Search */}
        <Link href="/search">
          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </Link>

        {/* Cart */}
        <div className="relative">
          <button
            onClick={toggleCart}
            aria-label="Open cart"
            className="p-2 rounded-full hover:bg-[#F9F1E7] transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </button>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#B88E2F] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow-md">
              {cart.length}
            </span>
          )}
        </div>

        {/* Hamburger Menu */}
        <button
          aria-label="Toggle menu"
          className="p-2 rounded-lg hover:bg-[#F9F1E7] transition-colors duration-300 relative"
          onClick={toggleMenu}
        >
          <div className="flex flex-col gap-1.5">
            <span className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Menu Header */}
        <div className="bg-gradient-to-r from-[#B88E2F] to-[#8C6D23] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={120}
              height={30}
              className="brightness-0 invert"
            />
          </div>
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Section */}
        <div className="px-6 py-4 bg-[#F9F1E7] border-b border-gray-200">
          <ClerkLoaded>
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <UserButton afterSignOutUrl="/" />
                  <div>
                    <p className="font-semibold text-gray-900">Welcome back!</p>
                    <p className="text-sm text-gray-600">{user.firstName || user.emailAddresses[0]?.emailAddress.split('@')[0]}</p>
                  </div>
                </div>
                <Link
                  href="/my-orders"
                  onClick={toggleMenu}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white hover:bg-[#B88E2F]/10 transition-colors text-sm font-medium text-gray-700"
                >
                  <svg className="w-5 h-5 text-[#B88E2F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                  My Orders
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Welcome to MD Brothers</p>
                  <p className="text-sm text-gray-600">Sign in for better experience</p>
                </div>
                <SignInButton mode="modal">
                  <button className="bg-[#B88E2F] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#8C6D23] transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            )}
          </ClerkLoaded>
        </div>

        {/* Mobile Search */}
        <div className="px-6 py-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B88E2F] transition-all duration-300"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4 px-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={toggleMenu}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-[#F9F1E7] transition-all duration-200 group"
              >
                <div className="text-gray-500 group-hover:text-[#B88E2F] transition-colors">
                  {item.icon}
                </div>
                <span className="font-medium text-gray-800 group-hover:text-[#B88E2F] transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-gray-200"></div>

          {/* Additional Links */}
          <div className="space-y-1">
            <Link
              href="/payment-options"
              onClick={toggleMenu}
              className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-[#F9F1E7] transition-all duration-200 group"
            >
              <svg className="w-6 h-6 text-gray-500 group-hover:text-[#B88E2F] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="font-medium text-gray-800 group-hover:text-[#B88E2F] transition-colors">
                Payment Options
              </span>
            </Link>

            <Link
              href="/privacy-policy"
              onClick={toggleMenu}
              className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-[#F9F1E7] transition-all duration-200 group"
            >
              <svg className="w-6 h-6 text-gray-500 group-hover:text-[#B88E2F] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium text-gray-800 group-hover:text-[#B88E2F] transition-colors">
                Privacy Policy
              </span>
            </Link>
          </div>
        </div>

        {/* Menu Footer */}
        <div className="px-6 py-4 bg-[#F9F1E7] border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            © {new Date().getFullYear()} MD Brothers EDU
          </p>
        </div>
      </div>

      {/* Sliding Cart */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-250 ease-in-out ${cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          onClick={toggleCart}
        />

        {/* Cart Sidebar */}
        <div
          className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-lg z-50 flex flex-col will-change-transform transition-transform duration-250 ease-in-out ${cartOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Cart Header */}
          <div className="bg-gradient-to-r from-[#B88E2F] to-[#8C6D23] text-white px-5 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              <h2 className="text-lg font-bold">Your Cart</h2>
              {cart.length > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {cart.length}
                </span>
              )}
            </div>
            <button
              onClick={toggleCart}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {cart.length > 0 ? (
              <>
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="bg-[#FAFAFA] rounded-lg p-3 flex items-center gap-3"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={56}
                      height={56}
                      className="rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 text-sm truncate">{item.title}</h3>
                      <p className="text-[#B88E2F] font-semibold text-sm mt-0.5">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="mt-1 text-red-500 hover:text-red-700 text-xs transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-[#F9F1E7] rounded-full flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-[#B88E2F]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Your cart is empty</h3>
                <p className="text-gray-500 text-sm">Add some products to get started!</p>
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50 p-3 space-y-2">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-lg font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
              <Link
                href="/cart"
                onClick={toggleCart}
                className="block w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2.5 px-4 rounded-lg text-center transition-colors"
              >
                View Full Cart
              </Link>
              {user ? (
                <Link
                  href="/checkout"
                  onClick={toggleCart}
                  className="block w-full bg-[#B88E2F] hover:bg-[#a37d2a] text-white font-bold py-2.5 px-4 rounded-lg text-center transition-colors"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <SignInButton mode="modal" forceRedirectUrl="/cart">
                  <button className="w-full bg-[#B88E2F] hover:bg-[#a37d2a] text-white font-bold py-2.5 px-4 rounded-lg transition-colors">
                    Sign In to Checkout
                  </button>
                </SignInButton>
              )}
            </div>
          )}
        </div>
      </>
    </nav>
  );
};

export default Navbar;
