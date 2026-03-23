"use client";

import React from 'react';
import Link from 'next/link';

export default function CheckoutCancelPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <div className="text-red-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-[#333333]">Payment Cancelled</h1>
                <p className="text-gray-600 mb-8">
                    Your payment process was cancelled or failed. Your order has not been completed.
                </p>
                <div className="flex flex-col gap-4">
                    <Link href="/checkout" className="w-full bg-[#B88E2F] hover:bg-[#a37d2a] text-white font-bold py-3 px-4 rounded transition">
                        Try Again
                    </Link>
                    <Link href="/cart" className="w-full bg-white border border-[#B88E2F] text-[#B88E2F] font-bold py-3 px-4 rounded transition hover:bg-[#f9f9f9]">
                        Return to Cart
                    </Link>
                </div>
            </div>
        </div>
    );
}
