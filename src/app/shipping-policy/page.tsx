"use client";

import React from "react";

const ShippingPolicyPage = () => {
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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Shipping Policy</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Last Updated: {currentDate}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-1 bg-[#B88E2F] mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Delivering Across Pakistan</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            At <strong>MD Brothers Edu</strong>, we ensure your school furniture, lab equipment, and supplies reach you safely and on time. We deliver to all major cities and towns across Pakistan.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto">

          {/* 1. Delivery Time */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">1. Delivery Time</h2>
            </div>

            <div className="bg-[#F9F1E7] rounded-xl p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="w-14 h-14 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Karachi</h3>
                  <p className="text-3xl font-bold text-[#B88E2F] mb-2">2-4</p>
                  <p className="text-gray-600 text-sm">Working Days</p>
                </div>

                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="w-14 h-14 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Other Cities</h3>
                  <p className="text-3xl font-bold text-[#B88E2F] mb-2">4-7</p>
                  <p className="text-gray-600 text-sm">Working Days</p>
                </div>

                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="w-14 h-14 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Bulk Orders</h3>
                  <p className="text-3xl font-bold text-[#B88E2F] mb-2">Custom</p>
                  <p className="text-gray-600 text-sm">Timeline Varies</p>
                </div>
              </div>
              <p className="mt-6 text-gray-600 text-sm text-center">
                * For bulk orders (schools/colleges/institutions), delivery time may vary based on order volume and location.
              </p>
            </div>
          </div>

          {/* 2. Shipping Charges */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">2. Shipping Charges</h2>
            </div>

            <div className="bg-[#F9F1E7] rounded-xl p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                Shipping charges vary depending on the product size, weight, and delivery location. Below are the general guidelines:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Small Items</h3>
                    <p className="text-gray-600 text-sm">Stationery, books, small tools &mdash; standard courier rates apply</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Furniture & Equipment</h3>
                    <p className="text-gray-600 text-sm">Desks, chairs, whiteboards &mdash; freight/cargo charges based on dimensions</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Bulk Orders</h3>
                    <p className="text-gray-600 text-sm">Special discounted shipping rates for schools and institutions</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Free Shipping</h3>
                    <p className="text-gray-600 text-sm">Available on select orders &mdash; check product page for details</p>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-gray-600 text-sm text-center">
                Exact shipping charges will be calculated and communicated before order confirmation.
              </p>
            </div>
          </div>

          {/* 3. Order Processing */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">3. Order Processing</h2>
            </div>

            <div className="bg-[#F9F1E7] rounded-xl p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-1 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Order Confirmation</h3>
                      <p className="text-gray-600 text-sm">You will receive an order confirmation via email/WhatsApp within 24 hours.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Processing</h3>
                      <p className="text-gray-600 text-sm">Orders are processed and packed within 1-2 business days.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Shipment</h3>
                      <p className="text-gray-600 text-sm">Once shipped, tracking details will be shared via WhatsApp/SMS.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">4</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Delivery</h3>
                      <p className="text-gray-600 text-sm">Cash on Delivery (COD) available. Please inspect your order upon delivery.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Important Notes */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">4. Important Notes</h2>
            </div>

            <div className="bg-gradient-to-r from-[#B88E2F] to-[#a37d2a] rounded-xl p-8 text-white">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Delivery times are estimates and may vary due to weather, logistics, or high-demand periods</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>We are not responsible for delays caused by courier partners</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Please inspect your order at the time of delivery and report issues immediately</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Bulk and institutional orders may require advance payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-[#F9F1E7] rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Have Shipping Questions?</h3>
            <p className="text-gray-600 mb-4">
              Contact us for delivery estimates on specific products or locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:info@mdbrothersedu.com" className="text-[#B88E2F] hover:underline font-semibold flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@mdbrothersedu.com
              </a>
              <a href="tel:03XXXXXXXXX" className="text-[#B88E2F] hover:underline font-semibold flex items-center justify-center gap-2">
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

export default ShippingPolicyPage;
