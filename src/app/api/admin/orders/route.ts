import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/sanity/lib/adminClient";
import { requireAdmin, isAuthContext } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAdmin();
  if (!isAuthContext(authResult)) return authResult;

  try {
    const orders = await adminClient.fetch(`*[_type == "order"] | order(orderDate desc) {
      _id, orderId, customer, 
      items[] {
        quantity,
        price,
        "productTitle": product->name
      }, 
      totalPrice, status, paymentStatus, paymentMethod, orderDate, deliveryAgent, deliveryConfirmedAt,
      gateway, transactionId, paymentTimestamp, paymentLogs,
      "proofImageUrl": proofImage.asset->url
    }`);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const authResult = await requireAdmin();
  if (!isAuthContext(authResult)) return authResult;

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
        updates.deliveryAgent = deliveryAgent;
    }

    const result = await adminClient.patch(id).set(updates).commit();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to update order in API", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
