"use client";

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { paymentConfig } from '@/config/paymentConfig';

export default function BankTransferPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const order_id = searchParams.get('order_id');

    const [transactionRef, setTransactionRef] = useState('');
    const [proofImage, setProofImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProofImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!order_id) {
            alert('Invalid order reference missing.');
            return;
        }

        if (!transactionRef || !proofImage) {
            alert('Please provide both the transaction reference ID and a screenshot of the payment proof.');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('orderId', order_id);
            formData.append('transactionReference', transactionRef);
            formData.append('proofImage', proofImage);

            const response = await fetch('/api/payment/bank-transfer/submit', {
                method: 'POST',
                body: formData, // the browser sets correct multipart/form-data boundary automatically
            });

            const data = await response.json();

            if (data.success) {
                // Redirect user to the general success page natively letting them know their payment is processing
                router.push(`/checkout/success?order_id=${order_id}&session_id=${transactionRef}`);
            } else {
                alert('Failed to submit proof: ' + data.error);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Error submitting bank transfer proof:', error);
            alert('An unexpected error occurred during submission.');
            setIsSubmitting(false);
        }
    };

    if (!order_id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Invalid Access</h2>
                    <p className="text-gray-600 mb-6">No order reference provided.</p>
                    <button onClick={() => router.push('/')} className="bg-[#B88E2F] text-white px-6 py-2 rounded">
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F1E7] flex items-center justify-center px-4 py-16">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-2xl w-full">
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Complete Your Payment</h1>
                <p className="text-gray-600 text-center mb-10">
                    Order <span className="font-mono font-semibold text-black">#{order_id}</span> is awaiting payment.
                </p>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Left: Bank Details */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-[#B88E2F]">Our Bank Details</h2>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Bank Name</p>
                                <p className="font-medium text-gray-900">{paymentConfig.bankTransfer.bankName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Account Title</p>
                                <p className="font-medium text-gray-900">{paymentConfig.bankTransfer.accountTitle}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Account Number</p>
                                <p className="font-medium font-mono text-gray-900">{paymentConfig.bankTransfer.accountNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">IBAN</p>
                                <p className="font-medium font-mono text-gray-900">{paymentConfig.bankTransfer.iban}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Branch</p>
                                <p className="font-medium text-gray-900">{paymentConfig.bankTransfer.branch}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Submission Form */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-[#B88E2F]">Submit Proof</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Transaction Reference ID *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={transactionRef}
                                    onChange={(e) => setTransactionRef(e.target.value)}
                                    placeholder="e.g. 1029384756"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent outline-none transition"
                                />
                                <p className="text-xs text-gray-500 mt-1">Found on your bank receipt or SMS setup.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Screenshot *
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg relative overflow-hidden group">
                                    <div className="space-y-1 text-center">
                                        {!previewUrl ? (
                                            <>
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-gray-600 justify-center">
                                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#B88E2F] hover:text-[#a37d2a] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#B88E2F]">
                                                        <span>Upload a file</span>
                                                        <input id="file-upload" name="file-upload" type="file" required accept="image/jpeg, image/png, image/webp" className="sr-only" onChange={handleFileChange} />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                                            </>
                                        ) : (
                                            <div className="relative">
                                                <img src={previewUrl} alt="Proof Preview" className="max-h-32 mx-auto rounded-md object-cover" />
                                                <label className="absolute inset-0 w-full h-full cursor-pointer bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md backdrop-blur-sm">
                                                    <span className="text-white font-medium text-sm">Change Image</span>
                                                    <input type="file" className="sr-only" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !transactionRef || !proofImage}
                                className="w-full bg-[#B88E2F] hover:bg-[#a37d2a] text-white font-bold py-4 px-4 rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting Proof...' : 'Submit Payment Proof'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
                    <p>Your order will only be processed once the funds have cleared in our account.</p>
                </div>
            </div>
        </div>
    );
}
