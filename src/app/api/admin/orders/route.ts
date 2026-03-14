import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/sanity/lib/adminClient";

export async function GET() {
  try {
    const orders = await adminClient.fetch(`*[_type == "order"] | order(orderDate desc) {
      _id, customer, items, totalPrice, status, paymentMethod, orderDate
    }`);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }
    const result = await adminClient.patch(id).set({ status }).commit();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
