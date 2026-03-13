"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomerTestimonials = () => {
  const testimonials = [
    {
      rating: 5,
      text: "The study table I ordered for my daughter is perfect! Excellent quality and the delivery was super fast. Highly recommend MD Brothers for all educational furniture needs.",
      name: "Sarah Ahmed",
    },
    {
      rating: 5,
      text: "Bought office chairs for our entire school staff. The comfort level is amazing and the pricing was very competitive. Great customer service too!",
      name: "Rashid Ali",
    },
    {
      rating: 4,
      text: "The whiteboard I purchased is of excellent quality. Easy to clean and the markers write smoothly. Perfect for my classroom. Will order more soon.",
      name: "Fatima Khan",
    },
    {
      rating: 5,
      text: "Ordered a complete classroom set including desks and chairs. The packaging was secure and everything arrived in perfect condition. Very satisfied!",
      name: "Mohammad Ali",
    },
    {
      rating: 4,
      text: "The library shelving units are sturdy and well-designed. Exactly what we needed for our school library. Assembly was easy too.",
      name: "Ayesha Malik",
    },
    {
      rating: 4,
      text: "Amazing quality at affordable prices! The student chairs I bought are durable and comfortable. MD Brothers EDU never disappoints.",
      name: "Hassan Raza",
    },
    {
      rating: 5,
      text: "Quick delivery and excellent product quality. The teacher's desk I ordered has ample storage and looks professional. Very happy with my purchase!",
      name: "Zara Sheikh",
    },
    {
      rating: 5,
      text: "Ordered a conference table for our office. The finish is premium and it fits perfectly in our meeting room. Excellent service from start to finish.",
      name: "Amna Hussain",
    },
    {
      rating: 4,
      text: "The bunk beds for our hostel are amazing! Students love them and they're very durable. Best decision to buy from MD Brothers EDU.",
      name: "Waseem Akram",
    },
    {
      rating: 5,
      text: "Perfect study chair for my home office! The ergonomic design helps me work long hours without back pain. Fast delivery and great packaging.",
      name: "Hira Fatima",
    },
    {
      rating: 4,
      text: "The science lab tables are exactly what our school needed. Chemical resistant and very sturdy. Excellent customer service and quick delivery!",
      name: "Bilal",
    }
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Function to render stars
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300 fill-gray-300'
        }`}
      />
    ));
  };

  // Calculate max index
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  // Go to previous
  const prev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  // Go to next
  const next = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  // Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, itemsPerView]);

  // Pause on hover
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) return;
    const interval = setInterval(() => {
      // Paused - don't auto scroll
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      next();
    }
    if (touchEnd - touchStart > 50) {
      prev();
    }
  };

  return (
    <section className="py-16 px-4 bg-[#F9F1E7] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
            Hear From Our Customers
          </h2>
          <p className="text-gray-600 mt-2">What our valued customers say about us</p>
          <div className="w-20 h-0.5 bg-[#B88E2F] mx-auto mt-4"></div>
        </div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 p-3 rounded-full bg-white hover:bg-[#B88E2F] hover:text-white transition-all duration-300 shadow-lg border border-gray-200 hover:border-[#B88E2F] hidden md:block"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 p-3 rounded-full bg-white hover:bg-[#B88E2F] hover:text-white transition-all duration-300 shadow-lg border border-gray-200 hover:border-[#B88E2F] hidden md:block"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Testimonials Carousel */}
          <div
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3"
              >
                <div className="bg-white rounded-2xl p-6 h-full hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#B88E2F]">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-6">
                    {testimonial.text}
                  </p>

                  {/* Horizontal Line */}
                  <hr className="border-t border-gray-100 mb-4" />

                  {/* Customer Name & Location */}
                  <div>
                    <p className="text-gray-900 font-semibold text-base">
                      {testimonial.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="flex items-center justify-center gap-4 mt-6 md:hidden">
          <button
            onClick={prev}
            className="p-3 rounded-full bg-white hover:bg-[#B88E2F] hover:text-white transition-all duration-300 shadow-sm border border-gray-200 hover:border-[#B88E2F]"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Pagination Dots */}
          <div className="flex gap-2">
            {Array.from({ length: testimonials.length }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#B88E2F] w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-3 rounded-full bg-white hover:bg-[#B88E2F] hover:text-white transition-all duration-300 shadow-sm border border-gray-200 hover:border-[#B88E2F]"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Pagination Dots */}
        <div className="hidden md:flex justify-center gap-2 mt-6">
          {Array.from({ length: testimonials.length - itemsPerView + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-[#B88E2F] w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;