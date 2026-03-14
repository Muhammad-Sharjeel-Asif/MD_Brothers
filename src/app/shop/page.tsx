import Image from "next/image";
import Feature from "@/components/Feature";
import Products from "../query/Products/page";

const ShopPage = () => {
  return (
    <>
      <div>
        <Image
          src={"/images/shop.svg"}
          alt="shop"
          width={1440}
          height={316}
          className="w-full h-auto mt-20"
        />
      </div>

      {/* Products Section with integrated filters & sorting */}
      <Products />

      <Feature />
    </>
  );
};

export default ShopPage;
