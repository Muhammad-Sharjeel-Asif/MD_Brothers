import React from 'react';

interface OrderItem {
  quantity: number;
  price: number;
  productTitle?: string;
}

interface Order {
  orderId?: string;
  _id: string;
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
  shippingCost?: number;
  orderDate: string;
  paymentMethod: string;
}

const OrderInvoice: React.FC<{ order: Order }> = ({ order }) => {
  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  return (
    <div className="p-8 bg-white text-black font-sans max-w-[800px] mx-auto border border-gray-200 print:border-none print:p-0 print:max-w-none">
      <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">MD BROTHERS</h1>
          <p className="text-sm text-gray-600">Your Trusted eCommerce Partner</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">INVOICE</h2>
          <p className="text-sm font-semibold mt-1">{order.orderId || order._id.toUpperCase()}</p>
          <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-10">
        <div>
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Billed To:</h3>
          <p className="font-bold">{order.customer.firstName} {order.customer.lastName}</p>
          <p className="text-sm">{order.customer.address}</p>
          <p className="text-sm">{order.customer.city}</p>
          <p className="text-sm">{order.customer.phone}</p>
          <p className="text-sm">{order.customer.email}</p>
        </div>
        <div className="text-right">
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Payment Details:</h3>
          <p className="text-sm"><span className="font-semibold">Method:</span> {order.paymentMethod}</p>
          <p className="text-sm"><span className="font-semibold">Date:</span> {new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
      </div>

      <table className="w-full mb-10 border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200 text-left text-xs font-bold uppercase text-gray-500">
            <th className="py-3 px-2">Description</th>
            <th className="py-3 px-2 text-center">Qty</th>
            <th className="py-3 px-2 text-right">Unit Price</th>
            <th className="py-3 px-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <tr key={idx} className="text-sm">
              <td className="py-4 px-2 font-medium">{item.productTitle || 'Product'}</td>
              <td className="py-4 px-2 text-center">{item.quantity}</td>
              <td className="py-4 px-2 text-right">Rs. {item.price.toFixed(2)}</td>
              <td className="py-4 px-2 text-right font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-full max-w-[250px] space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal:</span>
            <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Delivery Charges:</span>
            <span className="font-medium">Rs. {(order.shippingCost || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t-2 border-gray-900 pt-2 mt-2">
            <span>Total:</span>
            <span className="text-[#B88E2F]">Rs. {order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
        <p>Thank you for shopping with MD Brothers!</p>
        <p className="mt-1">For any queries, please contact our support team.</p>
      </div>
    </div>
  );
};

export default OrderInvoice;
