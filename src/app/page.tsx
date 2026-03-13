import Link from "next/link";
import Image from "next/image";
import Homeproducts from "../app/query/Homeproducts/page";
import dynamic from "next/dynamic";
import MDPromise from "@/components/home/promise";
import CustomerTestimonials from "@/components/home/customer";

const page = () => {

  const LazyComponent = dynamic(() => import('../app/query/Homeproducts/page'), {
    ssr: false,
  });

  return (
    <>
      <div className="relative bg-gray-50">
        {/* Hero Image */}

        <div className="w-full">
          <Image
            src="/images/hero-sec.png"
            alt="hero-section"
            width={1440}
            height={316}
            sizes="(max-width: 768px) 100vw, 100vw"
            className="w-full h-auto mt-20 "
            priority
             fetchPriority="high"
          />
        </div>

       {/* Text Content */}
<div className="absolute top-1/2 right-2 md:right-20 transform -translate-y-1/2 bg-[#EFE7D6] p-3 sm:p-6 md:p-14 rounded-lg shadow-lg max-w-full md:max-w-lg text-left">
  <h1 className="text-[12px] sm:text-lg md:text-3xl font-bold text-[#5A4815] mt-2 sm:mt-3 md:mt-4 mb-2 sm:mb-4">
    Complete School & Office Supply Solutions 
  </h1>
  <p className="text-gray-600 mb-2 sm:mb-6 text-[8px] sm:text-xs md:text-base leading-relaxed sm:leading-normal">
    <span className="text-[#4A3A12] block sm:inline">Providing high-quality stationery, lab equipment, school furniture, and</span> 
    <span className="text-[#4A3A12] block sm:inline"> renovation services for educational</span> 
  </p>
  <Link href={'/shop'}>
    <button className="bg-[#8C6D23] rounded text-white text-[10px] sm:text-sm md:text-lg px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 hover:bg-[#70561C] transition shadow-lg">
      View Products
    </button>
  </Link>
</div>
      </div>

      {/* Browse the Range Section */}
      <section className="py-10">
  <h1 className="text-[#333333] text-2xl sm:text-3xl font-bold text-center mt-10">
    Browse The Range
  </h1>
  <p className="text-center text-gray-700 mt-4">
   Browse our collection of stationery, lab equipment, and school furniture for educational institutions.
  </p>
  <div className="flex flex-wrap items-center justify-center mt-16 gap-8">
    {["Stationery Supplies", "Lab Equipment", "School Furniture"].map((category, index) => (
      <div
        key={index}
        className="flex flex-col items-center max-w-[300px] sm:max-w-full"
      >
        <Image
          src={`/images/img${index + 1}.jpg`}
          alt={`Explore our ${category} collection`}
          width={381}
          height={480}
          className="w-full h-auto rounded-md hover:scale-105 transition-transform duration-300"
          quality={75}
          loading="lazy" // Lazy-load images
        />
        <h2 className="text-center text-xl sm:text-2xl font-medium mt-6 text-[#333333]">
          {category}
        </h2>
      </div>
    ))}
  </div>
</section>


      {/* Our Products Section */}
      <section>
        <h1 className="text-[#333333] text-[40px] text-center font-bold mt-14 mb-6">
          Our Products
        </h1>
        <Homeproducts />
        <div className="flex items-center justify-center mt-6">
          <Link href={"/shop"}>
            <button className="w-[245px] h-[48px] bg-[#FFFFFF] border border-[#946F27] text-[#946F27] hover:bg-[#946F27] hover:text-white">
              Show More
            </button>
          </Link>
        </div>
      </section>

      {/* Inspiration Section - Complete School Solutions */}
      <section className="py-16 lg:py-20 bg-[#FCF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Complete School Solutions
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-md">
                We provide complete supply and renovation solutions for schools including furniture, lab setup, and classroom improvement.
              </p>
              <Link href="/explorerrooms">
                <button className="bg-[#B88E2F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#8C6D23] transition-colors duration-300">
                  Learn More
                </button>
              </Link>
            </div>

            {/* Right Images Collage */}
            <div className="order-1 lg:order-2">
              <div className="relative grid grid-cols-2 gap-4">
                <div className="mt-8">
                  <Image
                    src="/images/img6.jpg"
                    alt="Classroom Setup"
                    width={404}
                    height={582}
                    className="w-full h-64 lg:h-96 object-cover rounded-2xl shadow-lg"
                  />
                </div>
                <div>
                  <Image
                    src="/images/img5.jpg"
                    alt="Lab Equipment"
                    width={372}
                    height={486}
                    className="w-full h-64 lg:h-96 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MDPromise/>
      <CustomerTestimonials/>

    </>
  );
};

export default page;
