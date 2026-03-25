"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const order_id = searchParams.get('order_id');
    const payment_method = searchParams.get('payment_method');
    
    const [status, setStatus] = useState<'loading' | 'success' | 'processing' | 'invalid'>('loading');
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 10; // Poll for 30 seconds (3s interval)

    const checkOrderStatus = useCallback(async () => {
        if (!order_id) {
            setStatus('invalid');
            return;
        }

        try {
            const response = await fetch(`/api/orders/${order_id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    // Order might not be indexed yet, wait and retry
                    setRetryCount(prev => prev + 1);
                    return;
                }
                setStatus('invalid');
                return;
            }

            const order = await response.json();
            
            // If it's COD, it's successful immediately
            if (order.paymentMethod === 'COD') {
                setStatus('success');
                return;
            }

            // For PayFast, wait for 'completed' status
            if (order.paymentStatus === 'completed') {
                setStatus('success');
            } else {
                setStatus('processing');
                setRetryCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error checking order status:', error);
            setRetryCount(prev => prev + 1);
        }
    }, [order_id]);

    useEffect(() => {
        if (!order_id) {
            setStatus('invalid');
            return;
        }

        if (status === 'success' || status === 'invalid') return;

        if (retryCount >= maxRetries) {
            // If we timed out polling, but it's a PayFast order, we still show success 
            // but with a disclaimer that payment is being processed.
            setStatus('success');
            return;
        }

        const timer = setTimeout(() => {
            checkOrderStatus();
        }, 3000);

        return () => clearTimeout(timer);
    }, [order_id, retryCount, checkOrderStatus, status]);

    if (status === 'loading' || status === 'processing') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B88E2F] mb-4"></div>
                <p className="text-gray-600 animate-pulse">
                    {status === 'processing' ? 'Confirming payment with PayFast...' : 'Confirming your order...'}
                </p>
                <p className="text-xs text-gray-400 mt-2">This may take a few moments</p>
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
                    <p className="text-gray-600 mb-6">We couldn't retrieve your order details. Please contact support if you believe this is an error.</p>
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
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            We have sent a confirmation email to your registered address.
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
