import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { adminClient } from "@/sanity/lib/adminClient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!adminClient.config().projectId || !adminClient.config().dataset) {
      console.error("Sanity client is missing projectId or dataset configuration.");
      return NextResponse.json(
        { success: false, error: "Service configuration error. Please try again later." },
        { status: 503 }
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

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Failed to fetch user orders:", error.message || error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
