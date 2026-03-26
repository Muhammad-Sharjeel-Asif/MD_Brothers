"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Feature from "@/components/Feature";
import OrderInvoice from "@/components/OrderInvoice";

interface OrderItem {
  quantity: number;
  price: number;
  productTitle?: string;
  productImage?: string;
}

interface Order {
  _id: string;
  orderId?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  items: OrderItem[];
  totalPrice: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingCost?: number;
  orderDate: string;
  deliveryAgent?: string;
  deliveryConfirmedAt?: string;
  gateway?: string;
  transactionId?: string;
}

const statusSteps = [
  { key: "pending", label: "Order Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  pending_payment: "bg-orange-100 text-orange-800",
  awaiting_bank_transfer: "bg-purple-100 text-purple-800",
  processing: "bg-blue-100 text-blue-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  dispatched: "bg-teal-100 text-teal-800",
  delivered: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function getStepIndex(status: string): number {
  const map: Record<string, number> = {
    pending: 0,
    pending_payment: 0,
    awaiting_bank_transfer: 0,
    paid: 1,
    processing: 1,
    shipped: 2,
    dispatched: 2,
    delivered: 3,
    completed: 3,
  };
  return map[status] ?? 0;
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/my-orders");
      return;
    }
    if (isSignedIn) {
      fetchOrder();
    }
  }, [isSignedIn, isLoaded]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else if (res.status === 403) {
        setError("You don't have access to this order.");
      } else if (res.status === 404) {
        setError("Order not found.");
      } else {
        setError("Failed to load order details.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B88E2F]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Oops!</h1>
          <p className="text-gray-600 mb-6 text-sm">{error}</p>
          <Link
            href="/my-orders"
            className="inline-block bg-[#B88E2F] hover:bg-[#a37d2a] text-white font-medium py-2.5 px-6 rounded-xl transition-colors"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <>
      <div>
        <Image
          src="/images/cart-img.png"
          alt="order-detail"
          width={1440}
          height={316}
          className="w-full h-auto mt-20"
        />
      </div>

      <div className="container mx-auto px-4 lg:px-12 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/my-orders"
              className="text-sm text-[#B88E2F] hover:text-[#a37d2a] font-medium transition-colors mb-2 inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to My Orders
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {order.orderId || `Order #${order._id.slice(-8).toUpperCase()}`}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on{" "}
              {new Date(order.orderDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#B88E2F] text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white transition-all rounded-xl text-sm font-semibold shadow-sm no-print"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Invoice
            </button>
            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        {/* Status Timeline */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-6">Order Progress</h2>
            <div className="flex items-center justify-between relative">
              {/* Progress bar background */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full mx-12"></div>
              {/* Progress bar fill */}
              <div
                className="absolute top-5 left-0 h-1 bg-[#B88E2F] rounded-full mx-12 transition-all duration-500"
                style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%`, maxWidth: "calc(100% - 6rem)" }}
              ></div>

              {statusSteps.map((step, idx) => (
                <div key={step.key} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      idx <= currentStep
                        ? "bg-[#B88E2F] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {idx < currentStep ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium text-center ${idx <= currentStep ? "text-[#B88E2F]" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6 text-center">
            <p className="text-red-700 font-semibold">This order has been cancelled.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Products */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Products Ordered</h2>
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-[#FAFAFA] rounded-xl p-3">
                  {item.productImage && (
                    <Image
                      src={item.productImage}
                      alt={item.productTitle || "Product"}
                      width={56}
                      height={56}
                      className="rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.productTitle || "Product"}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="text-xl font-bold text-[#B88E2F]">
                Rs. {order.totalPrice?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Delivery Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Delivery Information</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Name:</span>{" "}
                  <span className="font-medium text-gray-900">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Phone:</span>{" "}
                  <span className="font-medium text-gray-900">{order.customer?.phone || "—"}</span>
                </p>
                <p>
                  <span className="text-gray-500">Address:</span>{" "}
                  <span className="font-medium text-gray-900">{order.customer?.address || "—"}</span>
                </p>
                <p>
                  <span className="text-gray-500">City:</span>{" "}
                  <span className="font-medium text-gray-900">{order.customer?.city || "—"}</span>
                </p>
                {order.deliveryAgent && (
                  <p>
                    <span className="text-gray-500">Delivery Agent:</span>{" "}
                    <span className="font-medium text-teal-700">{order.deliveryAgent}</span>
                  </p>
                )}
                {order.deliveryConfirmedAt && (
                  <p>
                    <span className="text-gray-500">Delivered At:</span>{" "}
                    <span className="font-medium text-green-700">
                      {new Date(order.deliveryConfirmedAt).toLocaleString()}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Payment Information</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Method:</span>{" "}
                  <span className="font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
                </p>
                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  <span className={`font-semibold capitalize ${order.paymentStatus === "completed" ? "text-green-600" : "text-orange-600"}`}>
                    {order.paymentStatus || "pending"}
                  </span>
                </p>
                {order.gateway && (
                  <p>
                    <span className="text-gray-500">Gateway:</span>{" "}
                    <span className="font-medium text-gray-900">{order.gateway}</span>
                  </p>
                )}
                {order.transactionId && (
                  <p>
                    <span className="text-gray-500">Transaction ID:</span>{" "}
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{order.transactionId}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Feature />
      
      {/* Hidden Invoice for Printing */}
      <div className="hidden">
        <div className="print-only">
          <OrderInvoice order={order as any} />
        </div>
      </div>
    </>
  );
}
