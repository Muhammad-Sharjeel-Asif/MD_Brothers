"use client";

import React from 'react';
import Image from 'next/image';

const PaymentOptionsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F1E7] to-white pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Payment Options
          </h1>
          <p className="text-lg text-gray-600">
            We offer multiple secure payment methods for your convenience
          </p>
          <div className="w-24 h-1 bg-[#B88E2F] mx-auto mt-6"></div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-8">
          {/* PayFast */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-16 bg-white rounded-xl overflow-hidden">
                <Image
                  src="/images/payment-options/visa.png"
                  alt="PayFast"
                  width={80}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Online Payment (PayFast)</h2>
                <p className="text-sm text-gray-500">Secure Online Transactions - Visa & Mastercard</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Pay securely using our PayFast payment gateway. We accept all Visa and Mastercard debit and credit cards. Your transaction is encrypted and processed instantly, allowing for faster order fulfillment.
            </p>
          </div>

          {/* Cash on Delivery */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-16 bg-white rounded-xl overflow-hidden">
                <Image
                  src="/images/payment-options/cod.png"
                  alt="Cash on Delivery"
                  width={80}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Cash on Delivery</h2>
                <p className="text-sm text-gray-500">Pay When You Receive - Available Nationwide</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Pay cash when your order arrives at your doorstep. Available across Pakistan for your convenience. No advance payment required - simply pay the delivery amount when you receive your products.
            </p>
          </div>
        </div>

        {/* Payment Policy */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Policy</h2>

          <div className="space-y-4 text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#B88E2F] rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p>For online payments via PayFast, orders are processed immediately upon successful transaction confirmation.</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#B88E2F] rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p>Cash on Delivery (COD) is available nationwide. Please ensure you have the exact change ready for the courier at the time of delivery.</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#B88E2F] rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p>All transactions on our website are secure and encrypted to protect your financial information.</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center bg-[#B88E2F] rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-2">Need Payment Assistance?</h3>
          <p className="text-white/90 mb-4">Our team is here to help you with any payment-related queries</p>
          <a
            href="/contact"
            className="inline-block bg-white text-[#B88E2F] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptionsPage;
