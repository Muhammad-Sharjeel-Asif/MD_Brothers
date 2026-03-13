"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Shield, RefreshCw, Truck, Award, ChevronLeft, ChevronRight } from 'lucide-react';

const MDPromise = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const promises = [
    {
      icon: <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-[#B88E2F]" strokeWidth={1.5} />,
      title: "No Questions Asked Returns",
      description: "MD Brothers EDU Promise",
    //   linkText: "Learn More →",
      linkUrl: "/returns"
    },
    {
      icon: <Award className="w-8 h-8 sm:w-10 sm:h-10 text-[#B88E2F]" strokeWidth={1.5} />,
      title: "Easy 7 Days Replacement",
      description: "MD Brothers EDU Promise",
    //   linkText: "Learn More →",
      linkUrl: "/replacement"
    },
    {
      icon: <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-[#B88E2F]" strokeWidth={1.5} />,
      title: "FREE Shipping",
      description: "MD Brothers EDU Promise",
    //   linkText: "Learn More →",
      linkUrl: "/shipping"
    },
    {
      icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#B88E2F]" strokeWidth={1.5} />,
      title: "Easy Warranty Claim",
      description: "MD Brothers EDU Promise",
    //   linkText: "Learn More →",
      linkUrl: "/warranty"
    }
  ];

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const hasContent = container.scrollWidth > container.clientWidth;
      const canScrollRight = container.scrollWidth - container.clientWidth - container.scrollLeft > 1;

      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(hasContent && canScrollRight);
    }
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
      // Wait for smooth scroll to complete before checking scroll position
      setTimeout(() => checkScroll(), 300);
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
      // Wait for smooth scroll to complete before checking scroll position
      setTimeout(() => checkScroll(), 300);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Check scroll position on mount and scroll
      checkScroll();
      container.addEventListener('scroll', checkScroll);

      return () => {
        container.removeEventListener('scroll', checkScroll);
      };
    }
  }, []);

  // Auto-scroll functionality - only on mobile
  useEffect(() => {
    const container = scrollContainerRef.current;
    // Don't run auto-scroll if container doesn't exist or if on desktop (container is hidden)
    if (!container || window.innerWidth >= 768) return;

    let scrollInterval: string | number | NodeJS.Timeout | undefined;
    let isPaused = false;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!isPaused && container) {
          // Check if we can scroll more
          if (container.scrollLeft + container.clientWidth < container.scrollWidth - 1) {
            container.scrollBy({ left: 200, behavior: 'smooth' });
            // Update scroll state after smooth scroll completes
            setTimeout(() => checkScroll(), 300);
          } else {
            // Scroll back to start
            container.scrollTo({ left: 0, behavior: 'smooth' });
            // Update scroll state after smooth scroll completes
            setTimeout(() => checkScroll(), 300);
          }
        }
      }, 3000);
    };

    const pauseOnHover = () => { isPaused = true; };
    const resumeOnLeave = () => { isPaused = false; };

    container.addEventListener('mouseenter', pauseOnHover);
    container.addEventListener('mouseleave', resumeOnLeave);
    container.addEventListener('touchstart', pauseOnHover);
    container.addEventListener('touchend', resumeOnLeave);

    startAutoScroll();

    return () => {
      clearInterval(scrollInterval);
      container.removeEventListener('mouseenter', pauseOnHover);
      container.removeEventListener('mouseleave', resumeOnLeave);
      container.removeEventListener('touchstart', pauseOnHover);
      container.removeEventListener('touchend', resumeOnLeave);
    };
  }, []);

  return (
    <section className="py-16 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
            MD Brother's EDU Promise
          </h2>
          <div className="w-20 h-0.5 bg-[#B88E2F] mx-auto"></div>
        </div>

        {/* Promise Cards Container */}
        <div className="relative">
          {/* Scrollable Container - Mobile Only */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth md:hidden"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {promises.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[calc(50%-0.5rem)] snap-start"
              >
                <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#B88E2F] bg-white h-full">
                  {/* Icon */}
                  <div className="mb-4 p-4 rounded-full bg-[#F9F1E7] transition-colors duration-300">
                    {item.icon}
                  </div>

                  {/* Description */}
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                    {item.description}
                  </p>

                  {/* Title */}
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {item.title}
                  </h3>

                  {/* Learn More Link */}
                  <a
                    href={item.linkUrl}
                    className="inline-flex items-center text-sm text-[#B88E2F] hover:text-gray-900 transition-colors duration-200"
                  >
                    {/* <span>{item.linkText}</span> */}
                    <svg
                      className="w-4 h-4 ml-1 transform hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Grid (fallback) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {promises.map((item, index) => (
              <div
                key={`desktop-${index}`}
                className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#B88E2F] bg-white"
              >
                <div className="mb-4 p-4 rounded-full bg-[#F9F1E7] transition-colors duration-300">
                  {item.icon}
                </div>
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  {item.description}
                </p>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {item.title}
                </h3>
                <a
                  href={item.linkUrl}
                  className="inline-flex items-center text-sm text-[#B88E2F] hover:text-gray-900 transition-colors duration-200"
                >
                  {/* <span>{item.linkText}</span>
                  <svg
                    className="w-4 h-4 ml-1 transform hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg> */}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MDPromise;
