"use client";

import React from "react";
import Link from "next/link";

const RefundPolicyPage = () => {
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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Return & Refund Policy</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Last Updated: {currentDate}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-1 bg-[#B88E2F] mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">We Stand Behind Our Products</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            At <strong>MD Brothers Edu</strong>, we aim to provide high-quality school furniture and equipment. If you are not satisfied with your purchase, we have a straightforward return and refund process to ensure your peace of mind.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto">

          {/* 1. Returns */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">1. Returns</h2>
            </div>

            <div className="bg-[#F9F1E7] rounded-xl p-8 mb-6">
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                We want you to be completely satisfied with your purchase. If you need to return an item, please follow our return guidelines:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">Return Window</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Items can be returned within <strong>7 days</strong> of delivery. The product must be unused, in its original condition, and in the original packaging.</p>
                </div>

                <div className="bg-white rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">Eligibility</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Product must not have been installed, assembled, or modified. All tags, labels, and accessories must be intact and included.</p>
                </div>

                <div className="bg-white rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">How to Initiate</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Contact us via email at <strong>info@mdbrothersedu.com</strong> or call us with your order number and reason for return.</p>
                </div>

                <div className="bg-white rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">Non-Returnable Items</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Custom-made items, clearance products, and items marked as &quot;Final Sale&quot; cannot be returned or exchanged.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Refunds */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">2. Refunds</h2>
            </div>

            <div className="bg-[#F9F1E7] rounded-xl p-8 mb-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#B88E2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Refund Process
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#B88E2F] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Refund will be processed after our team inspects the returned product
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#B88E2F] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Refunds are issued to the original payment method
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#B88E2F] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Processing time: 5-7 business days after approval
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#B88E2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Important Notes
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Delivery charges are non-refundable
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Return shipping cost is borne by the customer
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Items damaged due to misuse are not eligible
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Damaged Items */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">3. Damaged or Defective Items</h2>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                If you receive a <strong>damaged or defective</strong> item, please take the following steps:
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Contact Us Within 48 Hours</h4>
                    <p className="text-gray-600 text-sm">Report the damage within 48 hours of receiving your order with clear photos/videos as proof.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Keep the Original Packaging</h4>
                    <p className="text-gray-600 text-sm">Do not dispose of the packaging until the issue is resolved. We may need it for the return process.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Replacement or Full Refund</h4>
                    <p className="text-gray-600 text-sm">We will arrange a replacement at no extra cost or issue a full refund including shipping charges.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Shipping & Delivery */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">4. Shipping & Delivery</h2>
            </div>

            <div className="bg-[#F9F1E7] rounded-xl p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                We deliver across Pakistan. Below are our standard shipping details:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-6 h-6 text-[#B88E2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="font-semibold text-gray-800">Delivery Areas</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#B88E2F] rounded-full flex-shrink-0"></span>
                      <strong>Karachi:</strong> 2-4 working days
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#B88E2F] rounded-full flex-shrink-0"></span>
                      <strong>Other Cities:</strong> 4-7 working days
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#B88E2F] rounded-full flex-shrink-0"></span>
                      <strong>Bulk Orders:</strong> Timeline may vary
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-6 h-6 text-[#B88E2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-semibold text-gray-800">Order Processing</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#B88E2F] rounded-full flex-shrink-0"></span>
                      Orders processed within 1-2 business days
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#B88E2F] rounded-full flex-shrink-0"></span>
                      Shipping charges vary by product size & location
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#B88E2F] rounded-full flex-shrink-0"></span>
                      Tracking info provided via WhatsApp/SMS
                    </li>
                  </ul>
                </div>
              </div>
              <p className="mt-6 text-gray-600 text-sm">
                For detailed shipping information, please visit our{" "}
                <Link href="/shipping-policy" className="text-[#B88E2F] hover:underline font-semibold">
                  Shipping Policy
                </Link>{" "}
                page.
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-[#B88E2F] to-[#a37d2a] rounded-xl p-10 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Need Help with a Return?</h3>
            <p className="text-lg mb-6 opacity-90">
              Our customer support team is here to assist you with any questions about returns, refunds, or exchanges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@mdbrothersedu.com"
                className="bg-white text-[#B88E2F] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@mdbrothersedu.com
              </a>
              <a
                href="tel:03XXXXXXXXX"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition inline-flex items-center justify-center gap-2"
              >
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

export default RefundPolicyPage;
