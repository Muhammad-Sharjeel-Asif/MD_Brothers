"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PaymentCancelled() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const order_id = searchParams.get('order_id');
    const [status, setStatus] = useState<'cancelling' | 'cancelled' | 'error'>('cancelling');
    const cancelFired = useRef(false);

    useEffect(() => {
        if (!order_id || cancelFired.current) return;
        
        cancelFired.current = true;

        const terminateOrder = async () => {
            try {
                const response = await fetch('/api/payment/cancel', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId: order_id }),
                });

                if (response.ok) {
                    setStatus('cancelled');
                } else {
                    setStatus('error');
                    console.error("Cancellation API failed to execute cleanly.");
                }
            } catch (error) {
                console.error("Network error during checkout cancellation API execution", error);
                setStatus('error');
            }
        };

        terminateOrder();
    }, [order_id]);

    if (!order_id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full text-center border border-gray-100">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Session Parameter</h2>
                    <p className="text-sm text-gray-500 mb-6">We could not resolve your checkout instance explicitly.</p>
                    <button onClick={() => router.push('/')} className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors w-full">
                        Return to Homepage
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F1E7] flex items-center justify-center px-4 py-16">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-lg w-full text-center border border-gray-100">
                
                {status === 'cancelling' ? (
                     <div className="flex flex-col items-center py-6">
                         <div className="w-12 h-12 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin mb-4" />
                         <p className="text-gray-600 font-medium">Reverting active checkout status...</p>
                     </div>
                ) : (
                     <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 mb-6 relative">
                              <svg className="h-10 w-10 text-orange-600 z-10" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <div className="absolute inset-0 rounded-full border-4 border-orange-100 animate-ping"></div>
                         </div>
                         
                         <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Payment Cancelled</h1>
                         <p className="text-base text-gray-600 mb-8 max-w-sm mx-auto">
                              Your checkout process for order <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 text-sm font-semibold">#{order_id}</span> has been cleanly interrupted. You can easily retry your payment when you are ready.
                         </p>

                         <div className="space-y-3">
                             <button
                                 onClick={() => router.push('/checkout')}
                                 className="w-full flex items-center justify-center gap-2 bg-[#B88E2F] hover:bg-[#a37d2a] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
                             >
                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                 Retry Payment
                             </button>
                             <button
                                 onClick={() => router.push('/cart')}
                                 className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200 transition-colors"
                             >
                                 Return to Cart
                             </button>
                         </div>
                     </div>
                )}

            </div>
        </div>
    );
}
