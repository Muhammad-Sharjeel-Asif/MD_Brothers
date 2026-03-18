import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { adminClient } from "@/sanity/lib/adminClient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const orders = await adminClient.fetch(
      `*[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
        _id,
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
        deliveryConfirmedAt
      }`,
      { userId }
    );

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
