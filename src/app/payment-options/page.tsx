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
          {/* Easypaisa */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-16 bg-white rounded-xl overflow-hidden">
                <Image
                  src="/images/payment-options/easypaisa.png"
                  alt="Easypaisa"
                  width={80}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Easypaisa</h2>
                <p className="text-sm text-gray-500">Mobile Wallet - Pakistan's #1 Payment Solution</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Easypaisa is Pakistan's leading mobile banking service. You can easily send money from your Easypaisa account to our registered mobile account. Fast, secure, and convenient - your payment is confirmed instantly through SMS notification.
            </p>
          </div>

          {/* JazzCash */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-16 bg-white rounded-xl overflow-hidden">
                <Image
                  src="/images/payment-options/jazzcash.png"
                  alt="JazzCash"
                  width={80}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">JazzCash</h2>
                <p className="text-sm text-gray-500">Mobile Financial Service - Quick & Easy</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              JazzCash offers a simple way to send money directly from your JazzCash mobile account. With just a few taps on your phone, you can complete your payment securely. Instant confirmation and real-time transaction tracking available.
            </p>
          </div>

          {/* Bank Transfer */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-16 bg-white rounded-xl overflow-hidden">
                <Image
                  src="/images/payment-options/bank-transfer.png"
                  alt="Bank Transfer"
                  width={80}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Bank Transfer</h2>
                <p className="text-sm text-gray-500">Direct Bank Transfer - All Major Banks</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Transfer payment directly to our bank account from any major bank including HBL, Meezan, Askari, Standard Chartered, and others. Traditional bank transfer method for those who prefer direct banking. Orders are processed once payment is confirmed.
            </p>
          </div>

          {/* Credit / Debit Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-16 bg-white rounded-xl overflow-hidden">
                <Image
                  src="/images/payment-options/visa.png"
                  alt="Credit Debit Card"
                  width={80}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Credit / Debit Card</h2>
                <p className="text-sm text-gray-500">All Major Cards Accepted - Visa & Mastercard</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Pay securely using your credit or debit card. We accept all Visa and Mastercard cards. Our payment gateway is fully secure and PCI compliant. Your card details are protected with industry-standard encryption. Complete checkout in just a few clicks.
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
              Pay cash when your order arrives at your doorstep. Available across Pakistan for your convenience. No advance payment required - simply pay the delivery amount when you receive your products. Additional charges may apply for COD orders.
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
              <p>All payments must be completed before order dispatch. For bank transfers, orders are processed after payment confirmation (may take 1-2 business days).</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#B88E2F] rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p>Please share the payment transaction screenshot/ID via WhatsApp or email after completing the payment for faster processing.</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#B88E2F] rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p>Easypaisa and JazzCash transfers are confirmed instantly. Orders are processed within 24 hours on working days.</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#B88E2F] rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p>For international payments, only Visa and Mastercard cards are accepted through our secure payment gateway.</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#B88E2F] rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p>Cash on Delivery (COD) is available nationwide. Additional charges of Rs. 150 may apply for COD orders.</p>
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
