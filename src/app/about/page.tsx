"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-[#B88E2F] to-[#a37d2a] mt-20 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">About MD Brothers</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Your Trusted Partner for School Supplies & Institutional Services in Pakistan
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Who We Are</h2>
              <div className="w-20 h-1 bg-[#B88E2F] mb-6"></div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                <strong>MD Brothers</strong> is a leading provider of school supplies and institutional services in Pakistan. We specialize in delivering quality educational materials, furniture, and comprehensive solutions for schools, colleges, universities, and corporate institutions.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                With years of experience in the education sector, we understand the unique needs of educational institutions. From classroom furniture to laboratory equipment, from stationery supplies to complete institutional setup - we provide end-to-end solutions that help institutions focus on what matters most: education.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our commitment to quality, competitive pricing, and reliable service has made us a preferred partner for hundreds of schools and institutions across Pakistan.
              </p>
            </div>
            <div className="relative">
              <div className="bg-[#F9F1E7] rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Services</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-[#B88E2F] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">School Furniture & Supplies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-[#B88E2F] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Institutional Equipment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-[#B88E2F] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Lab & Library Setup</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-[#B88E2F] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Bulk Supply Solutions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-[#B88E2F] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Complete School Setup</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder/Owner Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#F9F1E7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Founder</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The visionary leader behind MD Brothers success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-[#B88E2F] to-[#a37d2a] rounded-2xl p-2 shadow-2xl">
                  <div className="bg-white rounded-xl overflow-hidden aspect-square">
                    <Image
                      src="/images/founder.jpg"
                      alt="Founder - MD Brothers"
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=500&h=500&fit=crop";
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#B88E2F]/20 rounded-full -z-10"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#B88E2F]/30 rounded-full -z-10"></div>
            </div>

            {/* Content Side */}
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Usman Ali</h3>
              <p className="text-[#B88E2F] font-semibold text-lg mb-6">MD Brothers Edu</p>

              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Welcome to MD Brothers! With a deep passion for education and years of experience in institutional services, I established this company with a vision to become Pakistan's most trusted partner for schools and educational institutions.
                </p>
                <p>
                  Our mission is simple: to provide quality school supplies, furniture, and institutional services at competitive prices. We believe that every educational institution deserves access to premium products that enhance the learning experience for students.
                </p>
                <p>
                  At MD Brothers, we don't just sell products - we build relationships. Our clients trust us because we deliver on our promises, provide reliable service, and always prioritize their needs. From small schools to large universities, we treat every client with the same dedication and professionalism.
                </p>
                <p>
                  Thank you for considering MD Brothers for your institutional needs. We look forward to serving you and contributing to the success of your educational institution.
                </p>
              </div>

              {/* Contact Info */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">0337-8063707</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">info@mdbrothers.edu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products & Services Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions for educational institutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-[#F9F1E7] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">School Furniture</h3>
              <p className="text-gray-600">
                Desks, chairs, tables, cabinets, and complete classroom furniture sets for schools, colleges, and universities.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-[#F9F1E7] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Lab Equipment</h3>
              <p className="text-gray-600">
                Complete laboratory setup including equipment, furniture, and supplies for physics, chemistry, and biology labs.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-[#F9F1E7] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Stationery Supplies</h3>
              <p className="text-gray-600">
                Bulk stationery supplies for institutions including notebooks, pens, papers, art supplies, and educational materials.
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-[#F9F1E7] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Library Setup</h3>
              <p className="text-gray-600">
                Complete library solutions including bookshelves, reading furniture, and book supplies for schools and institutions.
              </p>
            </div>

            {/* Service 5 */}
            <div className="bg-[#F9F1E7] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Science Lab Setup</h3>
              <p className="text-gray-600">
                Turnkey science laboratory solutions with equipment, furniture, chemicals, and supplies for complete setup.
              </p>
            </div>

            {/* Service 6 */}
            <div className="bg-[#F9F1E7] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Complete School Setup</h3>
              <p className="text-gray-600">
                End-to-end solutions for new schools including furniture, equipment, supplies, and complete infrastructure setup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To be Pakistan's most trusted partner for educational institutions by providing quality school supplies, furniture, and institutional services at competitive prices. We are committed to supporting the education sector by delivering reliable products and services that enhance learning environments.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-[#B88E2F] rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To become the leading provider of school supplies and institutional services across Pakistan. We aim to expand our reach to serve more educational institutions while maintaining our commitment to quality, affordability, and exceptional customer service.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">Why Choose MD Brothers?</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-[#F9F1E7] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Quality Products</h4>
                <p className="text-gray-600 text-sm">Premium school supplies</p>
              </div>

              <div className="bg-[#F9F1E7] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Best Prices</h4>
                <p className="text-gray-600 text-sm">Competitive rates</p>
              </div>

              <div className="bg-[#F9F1E7] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Fast Delivery</h4>
                <p className="text-gray-600 text-sm">Across Pakistan</p>
              </div>

              <div className="bg-[#F9F1E7] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Reliable Service</h4>
                <p className="text-gray-600 text-sm">Trusted by 500+ schools</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Partner With Us?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're setting up a new school or need supplies for your existing institution, MD Brothers is here to help. Contact us today for a free consultation and quotation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/923378063707"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#25D366] hover:bg-[#20BA5C] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              WhatsApp Us
            </a>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-[#B88E2F] text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white font-semibold rounded-xl transition-colors"
            >
              Get Free Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-8">Serving All Types of Institutions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="text-3xl mb-2">🏫</div>
              <p className="text-gray-700 font-medium">Schools</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="text-3xl mb-2">🎓</div>
              <p className="text-gray-700 font-medium">Colleges</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="text-3xl mb-2">🏛️</div>
              <p className="text-gray-700 font-medium">Universities</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="text-3xl mb-2">🏢</div>
              <p className="text-gray-700 font-medium">Institutions</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
