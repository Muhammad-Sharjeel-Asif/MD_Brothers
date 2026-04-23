"use client";

import React from "react";
import Link from "next/link";

const TermsPage = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-[#B88E2F] to-[#a37d2a] mt-20 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Last Updated: {currentDate}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-1 bg-[#B88E2F] mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Please Read Carefully</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            By using <strong>MDbrothersedu.com</strong>, you agree to the following terms and conditions. These terms govern your use of our website, products, and services. We recommend reading them thoroughly before placing an order.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto">

          {/* 1. General Terms */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">1. General Terms</h2>
            </div>

            <div className="bg-[#F9F1E7] rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-5 flex items-start gap-4">
                  <svg className="w-5 h-5 text-[#B88E2F] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800">Pricing</h3>
                    <p className="text-gray-600 text-sm">All prices are subject to change without prior notice. Prices displayed at the time of order placement are final.</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 flex items-start gap-4">
                  <svg className="w-5 h-5 text-[#B88E2F] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800">Order Acceptance</h3>
                    <p className="text-gray-600 text-sm">We reserve the right to cancel any order due to stock unavailability, pricing errors, or suspected fraud.</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 flex items-start gap-4">
                  <svg className="w-5 h-5 text-[#B88E2F] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800">Product Variations</h3>
                    <p className="text-gray-600 text-sm">Product colors and designs may slightly vary from the images shown due to photography and manufacturing differences.</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 flex items-start gap-4">
                  <svg className="w-5 h-5 text-[#B88E2F] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800">Accurate Information</h3>
                    <p className="text-gray-600 text-sm">Customers must provide accurate and complete information including name, phone number, and delivery address.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Website Usage */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">2. Website Usage</h2>
            </div>

            <div className="bg-[#F9F1E7] rounded-xl p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                When using MDbrothersedu.com, you agree to the following:
              </p>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Legal Use Only</h3>
                    <p className="text-gray-600 text-sm">You agree not to use our website for any illegal activities or to harm other users or the website&apos;s functionality.</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Intellectual Property</h3>
                    <p className="text-gray-600 text-sm">All content on this website, including text, images, logos, and designs, is the property of MD Brothers Edu and may not be reproduced without permission.</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Account Responsibility</h3>
                    <p className="text-gray-600 text-sm">You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Orders & Payments */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">3. Orders & Payments</h2>
            </div>

            <div className="bg-[#F9F1E7] rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#B88E2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Payment Methods
                  </h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#B88E2F] rounded-full flex-shrink-0 mt-2"></span>
                      Cash on Delivery (COD)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#B88E2F] rounded-full flex-shrink-0 mt-2"></span>
                      Bank Transfer
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#B88E2F] rounded-full flex-shrink-0 mt-2"></span>
                      JazzCash / EasyPaisa
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#B88E2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Order Terms
                  </h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#B88E2F] rounded-full flex-shrink-0 mt-2"></span>
                      Orders are confirmed upon successful placement
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#B88E2F] rounded-full flex-shrink-0 mt-2"></span>
                      Bulk orders may require advance payment
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#B88E2F] rounded-full flex-shrink-0 mt-2"></span>
                      Prices include applicable taxes unless stated
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Limitation of Liability */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">4. Limitation of Liability</h2>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <p className="text-gray-600 leading-relaxed">
                MD Brothers Edu shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability for any claim shall not exceed the amount paid by the customer for the specific product or service in question.
              </p>
            </div>
          </div>

          {/* Related Policies */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Related Policies</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/privacy-policy" className="bg-[#F9F1E7] rounded-xl p-6 text-center hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#8C6D23] transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Privacy Policy</h3>
                <p className="text-gray-600 text-sm">How we protect your data</p>
              </Link>

              <Link href="/refund-policy" className="bg-[#F9F1E7] rounded-xl p-6 text-center hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#8C6D23] transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Return & Refund</h3>
                <p className="text-gray-600 text-sm">Our return and refund process</p>
              </Link>

              <Link href="/shipping-policy" className="bg-[#F9F1E7] rounded-xl p-6 text-center hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#8C6D23] transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Shipping Policy</h3>
                <p className="text-gray-600 text-sm">Delivery and shipping details</p>
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-[#B88E2F] to-[#a37d2a] rounded-xl p-10 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Questions About Our Terms?</h3>
            <p className="text-lg mb-6 opacity-90">
              If you have any questions regarding these terms, feel free to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:info@mdbrothersedu.com" className="bg-white text-[#B88E2F] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@mdbrothersedu.com
              </a>
              <a href="tel:03XXXXXXXXX" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition inline-flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13 2.257a1 1 0 001.21-.502l4.493-1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
                </svg>
                03XXXXXXXXX
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsPage;
