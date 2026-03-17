import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/sanity/lib/adminClient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await adminClient.fetch(`*[_type == "order"] | order(orderDate desc) {
      _id, customer, items, totalPrice, status, paymentStatus, paymentMethod, orderDate, deliveryAgent, deliveryConfirmedAt,
      gateway, transactionId, paymentTimestamp, stripeSessionId, paymentLogs,
      "proofImageUrl": proofImage.asset->url
    }`);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, paymentStatus, deliveryAgent } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    if (deliveryAgent) updates.deliveryAgent = deliveryAgent;

    // Automated Hooks
    if (status === 'delivered') {
        updates.paymentStatus = 'completed';
        updates.deliveryConfirmedAt = (new Date()).toISOString();
    } else if (status === 'dispatched' && deliveryAgent) {
        // Ensure standard properties apply when dispatching a rider
        updates.deliveryAgent = deliveryAgent;
    }

    const result = await adminClient.patch(id).set(updates).commit();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to update order in API", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
