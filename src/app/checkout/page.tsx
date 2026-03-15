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
    companyName: '',
    country: 'Pakistan',
    streetAddress: '',
    city: '',
    province: 'Western Province',
    zipCode: '',
    phone: '',
    email: '',
    additionalInfo: ''
  });

  const [paymentMethod, setPaymentMethod] = React.useState('Direct Bank Transfer');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [jazzCashPayload, setJazzCashPayload] = React.useState<Record<string, string> | null>(null);
  const jazzCashFormRef = React.useRef<HTMLFormElement>(null);
  const [easypaisaPayload, setEasypaisaPayload] = React.useState<Record<string, string> | null>(null);
  const easypaisaFormRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (jazzCashPayload && jazzCashFormRef.current) {
        jazzCashFormRef.current.submit();
    }
  }, [jazzCashPayload]);
  
  React.useEffect(() => {
    if (easypaisaPayload && easypaisaFormRef.current) {
        easypaisaFormRef.current.submit();
    }
  }, [easypaisaPayload]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.email || !formData.phone || !formData.streetAddress) {
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
          totalPrice: cartTotal,
          paymentMethod: paymentMethod,
          idempotencyKey: idempotencyKey,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (paymentMethod === 'Credit / Debit Card') {
          // Initiate Stripe Checkout
          const stripeResponse = await fetch('/api/checkout/stripe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: cart,
              orderId: data.orderId,
              customerEmail: formData.email,
            }),
          });
          const stripeData = await stripeResponse.json();
          if (stripeData.url) {
            window.location.href = stripeData.url;
            return; // Exit here
          } else {
            alert("Failed to initialize Stripe checkout.");
            setIsSubmitting(false);
          }
        } else if (paymentMethod === 'JazzCash') {
          // Initiate JazzCash
          const jazzResponse = await fetch('/api/payment/jazzcash/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: cart,
              orderId: data.orderId,
              customerData: formData,
            }),
          });
          const jazzData = await jazzResponse.json();
          if (jazzData.success && jazzData.payload) {
             setJazzCashPayload(jazzData.payload);
             return; // State update triggers form submission effect
          } else {
             alert('Failed to initialize JazzCash payment.');
             setIsSubmitting(false);
          }
        } else if (paymentMethod === 'Easypaisa') {
          // Initiate Easypaisa
          const easypaisaResponse = await fetch('/api/payment/easypaisa/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: cart,
              orderId: data.orderId,
            }),
          });
          const easypaisaData = await easypaisaResponse.json();
          if (easypaisaData.success && easypaisaData.payload) {
             setEasypaisaPayload(easypaisaData.payload);
             return; // Trigger form submission 
          } else {
             alert('Failed to initialize Easypaisa payment.');
             setIsSubmitting(false);
          }
        } else if (paymentMethod === 'Direct Bank Transfer') {
          // Redirect to Custom Bank Details and Proof Submission logic
          clearCart();
          router.push(`/checkout/bank-transfer?order_id=${data.orderId}`);
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
            <h1 className="text-[36px] font-semibold mb-5">Billing details</h1>
            <div className="flex flex-wrap items-center justify-start gap-6">
              <div className="w-full sm:w-auto">
                <label>
                  First Name
                  <br />
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full sm:w-[211px] h-[75px] border border-black rounded-md mt-2 px-4"
                  />
                </label>
              </div>
              <div className="w-full sm:w-auto">
                <label>
                  Last Name
                  <br />
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full sm:w-[211px] h-[75px] border border-black rounded-md mt-2 px-4"
                  />
                </label>
              </div>
            </div>

            <br />
            Company Name (Optional)
            <br />
            <br />
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              type="text"
              className="w-full lg:w-[453px] h-[75px] border border-black rounded-md px-4"
            />
            <br />
            <br />
            Country / Region
            <br />
            <br />
            <div className="relative w-full lg:w-[453px] h-[75px]">
              <input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                type="text"
                className="w-full h-full border border-black rounded-md pl-4 pr-10"
              />
              <Image
                src={"/images/arr-ico.png"}
                alt="arrow-icon"
                width={20}
                height={20}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              />
            </div>
            <br />
            Street address
            <br />
            <br />
            <input
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              type="text"
              className="w-full lg:w-[453px] h-[75px] border border-black rounded-md px-4"
            />
            <br />
            <br />
            Town / City
            <br />
            <br />
            <input
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              type="text"
              className="w-full lg:w-[453px] h-[75px] border border-black rounded-md px-4"
            />
            <br />
            <br />
            Province
            <br />
            <br />
            <div className="relative w-full lg:w-[453px] h-[75px]">
              <input
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                placeholder="Western Province"
                type="text"
                className="w-full h-full border border-black rounded-md pl-4 pr-10 text-[#333333]"
              />
              <Image
                src={"/images/arr-ico.png"}
                alt="arrow-icon"
                width={20}
                height={20}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              />
            </div>
            <br />
            ZIP code
            <br />
            <br />
            <input
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              type="text"
              className="w-full lg:w-[453px] h-[75px] border border-black rounded-md px-4"
            />
            <br />
            <br />
            Phone
            <br />
            <br />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              type="text"
              className="w-full lg:w-[453px] h-[75px] border border-black rounded-md px-4"
            />
            <br />
            <br />
            Email address
            <br />
            <br />
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="text"
              className="w-full lg:w-[453px] h-[75px] border border-black rounded-md px-4"
            />
            <br />
            <br />
            Additional information
            <br />
            <br />
            <input
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              placeholder="Additional information"
              type="text"
              className="w-full lg:w-[453px] h-[75px] border border-black rounded-md text-[#333333] pl-4"
            />
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
                <span className="font-semibold">Total</span>
              </div>
              <div className="flex flex-col gap-3 text-right">
                <h2 className="text-[24px] font-semibold">Subtotal</h2>
                {cart.map((item) => (
                  <span key={item._id}>
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </span>
                ))}
                <span>Rs. {cartTotal.toFixed(2)}</span>
                <span className="text-[#B88E2F] text-[24px] font-semibold">
                  Rs. {cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="border-b border-[#D9D9D9] w-full mt-6"></div>
            <div className="mt-8 space-y-4">
              {/* Direct Bank Transfer */}
              <div className="flex flex-col gap-2">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setPaymentMethod('Direct Bank Transfer')}
                >
                  <div className={`rounded-full flex-shrink-0 w-[14px] h-[14px] ${paymentMethod === 'Direct Bank Transfer' ? 'bg-black' : 'border border-[#9F9F9F]'}`}></div>
                  <h1 className={`text-[18px] font-semibold ${paymentMethod === 'Direct Bank Transfer' ? 'text-black' : 'text-[#333333]'}`}>Direct Bank Transfer</h1>
                </div>
                {paymentMethod === 'Direct Bank Transfer' && (
                  <p className="text-[#333333] pl-6 text-sm">
                    Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
                  </p>
                )}
              </div>

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

              {/* JazzCash */}
              <div className="flex flex-col gap-2">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setPaymentMethod('JazzCash')}
                >
                  <div className={`rounded-full flex-shrink-0 w-[14px] h-[14px] ${paymentMethod === 'JazzCash' ? 'bg-black' : 'border border-[#9F9F9F]'}`}></div>
                  <h1 className={`text-[18px] font-semibold ${paymentMethod === 'JazzCash' ? 'text-black' : 'text-[#333333]'}`}>JazzCash</h1>
                </div>
                {paymentMethod === 'JazzCash' && (
                  <p className="text-[#333333] pl-6 text-sm">
                    Pay securely using your JazzCash mobile wallet.
                  </p>
                )}
              </div>

              {/* Easypaisa */}
              <div className="flex flex-col gap-2">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setPaymentMethod('Easypaisa')}
                >
                  <div className={`rounded-full flex-shrink-0 w-[14px] h-[14px] ${paymentMethod === 'Easypaisa' ? 'bg-black' : 'border border-[#9F9F9F]'}`}></div>
                  <h1 className={`text-[18px] font-semibold ${paymentMethod === 'Easypaisa' ? 'text-black' : 'text-[#333333]'}`}>Easypaisa</h1>
                </div>
                {paymentMethod === 'Easypaisa' && (
                  <p className="text-[#333333] pl-6 text-sm">
                    Pay securely using your Easypaisa mobile wallet.
                  </p>
                )}
              </div>

              {/* Credit / Debit Card */}
              <div className="flex flex-col gap-2">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setPaymentMethod('Credit / Debit Card')}
                >
                  <div className={`rounded-full flex-shrink-0 w-[14px] h-[14px] ${paymentMethod === 'Credit / Debit Card' ? 'bg-black' : 'border border-[#9F9F9F]'}`}></div>
                  <h1 className={`text-[18px] font-semibold ${paymentMethod === 'Credit / Debit Card' ? 'text-black' : 'text-[#333333]'}`}>Credit / Debit Card</h1>
                </div>
                {paymentMethod === 'Credit / Debit Card' && (
                  <p className="text-[#333333] pl-6 text-sm">
                    Pay securely using your Visa or Mastercard. You will be redirected to the secure payment gateway to complete your purchase.
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

      {jazzCashPayload && (
        <form
          ref={jazzCashFormRef}
          // Defaulting to sandbox URL, switch to 'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/' for production
          action="https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/"
          method="POST"
          style={{ display: 'none' }}
        >
          {Object.entries(jazzCashPayload).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value as string} />
          ))}
        </form>
      )}

      {easypaisaPayload && (
        <form
          ref={easypaisaFormRef}
          // Switch to EasyPaisa sandbox or live URL upon actual credentials. Normally: https://easypay.easypaisa.com.pk/easypay/Index.jsf
          action="https://easypay.easypaisa.com.pk/easypay/Index.jsf"
          method="POST"
          style={{ display: 'none' }}
        >
          {Object.entries(easypaisaPayload).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value as string} />
          ))}
        </form>
      )}

      <Feature />
    </>
  );
};

export default CheckOutPage;
