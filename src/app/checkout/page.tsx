"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Feature from '@/components/Feature';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useCartContext } from '@/context/CartContext';

const CheckOutPage = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { cart, cartTotal, clearCart } = useCartContext();
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    country: 'Pakistan',
    streetAddress: '',
    city: '',
    province: 'Punjab',
    zipCode: '',
    phone: '',
    email: '',
  });

  const [shippingCost, setShippingCost] = React.useState(0);
  const [baseShippingCharge, setBaseShippingCharge] = React.useState(0);
  const [shippingDiscount, setShippingDiscount] = React.useState(0);
  const [isFreeShipping, setIsFreeShipping] = React.useState(false);
  const [deliveryTime, setDeliveryTime] = React.useState('');
  const [shippingThreshold, setShippingThreshold] = React.useState<number | null>(null);

  const PAKISTANI_PROVINCES = [
    "Punjab",
    "Sindh",
    "Khyber Pakhtunkhwa",
    "Balochistan",
    "Islamabad Capital Territory",
    "Azad Kashmir",
    "Gilgit-Baltistan"
  ];

  const PAKISTANI_CITIES = [
    "Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", "Peshawar", "Multan", "Hyderabad",
    "Islamabad", "Quetta", "Bahawalpur", "Sargodha", "Sialkot", "Sukkur", "Larkana", "Sheikhupura",
    "Rahim Yar Khan", "Jhang", "Dera Ghazi Khan", "Gujrat", "Sahiwal", "Wah Cantonment", "Mardan",
    "Kasur", "Okara", "Mingora", "Nawabshah", "Chiniot", "Kotri", "Kāmoke", "Hafizabad", "Sadiqabad",
    "Mirpur Khas", "Burewala", "Kohat", "Khanewal", "Muzaffargarh", "Abbottabad", "Muridke", "Jhelum",
    "Shikarpur", "Jacobabad", "Muzaffarabad"
  ].sort();

  const [paymentMethod, setPaymentMethod] = React.useState('Cash On Delivery');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [payfastPayload, setPayfastPayload] = React.useState<Record<string, string> | null>(null);
  const [isPayFastAvailable, setIsPayFastAvailable] = React.useState(true);
  const payfastFormRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    const checkConfig = async () => {
      try {
        const res = await fetch('/api/shipping/settings');
        const data = await res.json();
        setIsPayFastAvailable(!!data.isPayFastConfigured);
      } catch (err) {
        console.warn("Failed to check configuration settings", err);
        setIsPayFastAvailable(false);
      }
    };
    checkConfig();
  }, []);

  React.useEffect(() => {
    if (payfastPayload && payfastFormRef.current) {
        payfastFormRef.current.submit();
    }
  }, [payfastPayload]);

  // Calculate Shipping
  React.useEffect(() => {
    const calculateShipping = async () => {
      try {
        const res = await fetch('/api/shipping/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartTotal, city: formData.city }),
        });
        const data = await res.json();
        if (data.shippingCost !== undefined) {
          setShippingCost(data.shippingCost);
          setBaseShippingCharge(data.baseCharge || 0);
          setShippingDiscount(data.discount || 0);
          setIsFreeShipping(data.isFree || false);
          setDeliveryTime(data.deliveryTime);
          setShippingThreshold(data.threshold);
        }
      } catch (err) {
        console.error("Failed to calculate shipping", err);
      }
    };

    calculateShipping();
  }, [formData.city, cartTotal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.email || !formData.phone || !formData.streetAddress || !formData.city || !formData.province) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Generate unique idempotency key to prevent double checkout clicks or network retry duplicates
    const idempotencyKey = crypto.randomUUID();

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.streetAddress}, ${formData.city}, ${formData.province}`,
            city: formData.city,
            zipCode: formData.zipCode,
          },
          items: cart,
          totalPrice: cartTotal + shippingCost,
          shippingCost: shippingCost,
          paymentMethod: paymentMethod,
          idempotencyKey: idempotencyKey,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (paymentMethod === 'PayFast') {
          // Initiate PayFast
          const payfastResponse = await fetch('/api/payfast/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: cartTotal + shippingCost,
              orderId: data.orderId,
              customerData: formData,
            }),
          });
          const payfastData = await payfastResponse.json();
          if (payfastData.success && payfastData.payload) {
             setPayfastPayload(payfastData.payload);
             return; // State update triggers form submission effect
          } else {
             alert('Failed to initialize PayFast payment.');
             setIsSubmitting(false);
          }
        } else {
          alert("Order placed successfully!");
          clearCart();
          router.push(`/checkout/success?order_id=${data.orderId}`);
        }
      } else {
        alert("Failed to place order: " + data.error);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while placing your order.");
      setIsSubmitting(false);
    }
  };

  // Redirect to cart if cart is empty
  React.useEffect(() => {
    if (cart.length === 0 && !isSubmitting) {
      router.push('/cart');
    }
  }, [cart, router, isSubmitting]);

  // Show sign-in prompt if user is not signed in
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B88E2F]"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to proceed with your purchase and complete your order.
          </p>
          <SignInButton mode="modal">
            <button className="w-full bg-[#B88E2F] hover:bg-[#a37d2a] text-white font-bold py-3 px-4 rounded transition">
              Sign In to Continue
            </button>
          </SignInButton>
          <p className="text-sm text-gray-500 mt-4">
            Don't have an account? Sign up to create one
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <Image
          src={"/images/checkout.png"}
          alt="checkout"
          width={1440}
          height={316}
          className="w-full h-auto mt-20"
        />
      </div>
      <div className="container mx-auto px-4 lg:px-12 mt-16">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
          {/* Left Side: Billing Form */}
          <div className="w-full lg:w-[60%]">
            <h1 className="text-xl font-semibold mb-6">Billing Details</h1>

            {/* Contact Information */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/40 focus:border-[#B88E2F] transition"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/40 focus:border-[#B88E2F] transition"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/40 focus:border-[#B88E2F] transition"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="tel"
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/40 focus:border-[#B88E2F] transition"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">
                Delivery Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/40 focus:border-[#B88E2F] transition"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Town / City <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/40 focus:border-[#B88E2F] transition bg-white"
                  >
                    <option value="">Select City</option>
                    {PAKISTANI_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                    Province <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/40 focus:border-[#B88E2F] transition bg-white"
                  >
                    {PAKISTANI_PROVINCES.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country / Region
                  </label>
                  <input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/40 focus:border-[#B88E2F] transition"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/40 focus:border-[#B88E2F] transition"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Order Summary */}
          <div className="w-full lg:w-[35%]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-3">
                <h2 className="text-[24px] font-semibold">Product</h2>
                {cart.map((item, index) => (
                  <p key={item._id} className="text-[#333333]">
                    {item.title} <span className="text-black">X {item.quantity}</span>
                  </p>
                ))}
                <span className="font-semibold">Subtotal</span>
                <span className="font-semibold">Shipping</span>
                {shippingDiscount > 0 && !isFreeShipping && <span className="font-semibold text-green-600">Discount</span>}
                <span className="font-semibold text-lg">Total</span>
              </div>
              <div className="flex flex-col gap-3 text-right">
                <h2 className="text-[24px] font-semibold text-white select-none">Subtotal</h2>
                {cart.map((item) => (
                  <span key={item._id}>
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </span>
                ))}
                <span>Rs. {cartTotal.toFixed(2)}</span>
                <span className={isFreeShipping ? 'text-green-600 font-medium' : ''}>
                  {isFreeShipping ? 'FREE' : `Rs. ${baseShippingCharge.toFixed(2)}`}
                  {deliveryTime && <div className="text-[10px] text-gray-500">Est. {deliveryTime}</div>}
                </span>
                {shippingDiscount > 0 && !isFreeShipping && (
                  <span className="text-green-600 font-medium">- Rs. {shippingDiscount.toFixed(2)}</span>
                )}
                <span className="text-[#B88E2F] text-[24px] font-semibold">
                  Rs. {(cartTotal + shippingCost).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="border-b border-[#D9D9D9] w-full mt-6"></div>
            <div className="mt-8 space-y-4">
              {/* Cash On Delivery */}
              <div className="flex flex-col gap-2">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setPaymentMethod('Cash On Delivery')}
                >
                  <div className={`rounded-full flex-shrink-0 w-[14px] h-[14px] ${paymentMethod === 'Cash On Delivery' ? 'bg-black' : 'border border-[#9F9F9F]'}`}></div>
                  <h1 className={`text-[18px] font-semibold ${paymentMethod === 'Cash On Delivery' ? 'text-black' : 'text-[#333333]'}`}>Cash On Delivery</h1>
                </div>
                {paymentMethod === 'Cash On Delivery' && (
                  <p className="text-[#333333] pl-6 text-sm">
                    Pay with cash upon delivery.
                  </p>
                )}
              </div>

              {/* PayFast */}
              <div className="flex flex-col gap-2">
                <div
                  className={`flex items-center gap-3 ${isPayFastAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                  onClick={() => isPayFastAvailable && setPaymentMethod('PayFast')}
                >
                  <div className={`rounded-full flex-shrink-0 w-[14px] h-[14px] ${paymentMethod === 'PayFast' ? 'bg-black' : 'border border-[#9F9F9F]'}`}></div>
                  <h1 className={`text-[18px] font-semibold ${paymentMethod === 'PayFast' ? 'text-black' : 'text-[#333333]'}`}>
                    PayFast {!isPayFastAvailable && <span className="text-xs font-normal text-red-500">(Temporarily Unavailable)</span>}
                  </h1>
                </div>
                {paymentMethod === 'PayFast' && isPayFastAvailable && (
                  <p className="text-[#333333] pl-6 text-sm">
                    Pay securely using PayFast module.
                  </p>
                )}
                {!isPayFastAvailable && (
                   <p className="text-red-500 pl-6 text-xs italic">
                     Online payment is currently unavailable. Please use Cash on Delivery.
                   </p>
                )}
              </div>
            </div>
            <div className="mt-10">
              <button
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="w-full lg:w-[318px] h-[64px] border border-black rounded-2xl hover:bg-black hover:text-white transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Place order'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {payfastPayload && (
        <form
          ref={payfastFormRef}
          action={process.env.NEXT_PUBLIC_PAYFAST_MODE === 'live' ? 'https://www.payfast.co.za/eng/process' : 'https://sandbox.payfast.co.za/eng/process'}
          method="POST"
          style={{ display: 'none' }}
        >
          {Object.entries(payfastPayload).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value as string} />
          ))}
        </form>
      )}

      <Feature />
    </>
  );
};

export default CheckOutPage;
