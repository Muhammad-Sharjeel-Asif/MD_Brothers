import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { adminClient } from "@/sanity/lib/adminClient";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;

    const order = await adminClient.fetch(
      `*[_type == "order" && _id == $id][0] {
        _id,
        clerkUserId,
        customer,
        items[] {
          quantity,
          price,
          "productTitle": product->name,
          "productImage": product->imageUrl
        },
        totalPrice,
        status,
        paymentStatus,
        paymentMethod,
        orderDate,
        deliveryAgent,
        deliveryConfirmedAt,
        gateway,
        transactionId
      }`,
      { id }
    );

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Security: ensure the order belongs to this user
    if (order.clerkUserId !== userId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
