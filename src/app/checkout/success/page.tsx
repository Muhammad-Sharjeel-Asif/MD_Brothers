"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');
    const order_id = searchParams.get('order_id');
    
    const [status, setStatus] = useState<'loading' | 'success' | 'invalid'>('loading');

    useEffect(() => {
        if (session_id) {
            // Simple check just verifying we have IDs, server handles actual secure update via webhook.
            // In a more robust setup, you could ping a Next.js endpoint to retrieve the session securely.
            setStatus('success');
        } else if (order_id) {
            setStatus('success'); // Fallback for non-stripe payments
        } else {
            setStatus('invalid');
        }
    }, [session_id, order_id]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B88E2F]"></div>
            </div>
        );
    }

    if (status === 'invalid') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-500 text-2xl">❌</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Order Data</h1>
                    <p className="text-gray-600 mb-6">We couldn't verify this order session.</p>
                    <Link href="/" className="inline-block w-full bg-[#B88E2F] text-white py-3 rounded-lg font-semibold hover:bg-[#a37d2a] transition-colors">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F1E7] flex items-center justify-center px-4 py-20">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your order has been placed successfully.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Order Summary</h2>
                    {order_id && (
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Order ID</span>
                            <span className="text-gray-900 font-medium font-mono text-sm">{order_id}</span>
                        </div>
                    )}
                    {session_id && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Payment Ref</span>
                            <span className="text-gray-900 font-medium font-mono text-sm break-all">{session_id.substring(0, 16)}...</span>
                        </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            We will send a confirmation email with order details shortly.
                        </p>
                    </div>
                </div>

                <Link href="/" className="inline-block w-full bg-[#B88E2F] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#a37d2a] transition-colors duration-300 shadow-md hover:shadow-lg">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
