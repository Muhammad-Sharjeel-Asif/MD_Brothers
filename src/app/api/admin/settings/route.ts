import { NextResponse } from "next/server";
import { getAdminClient } from "@/sanity/lib/adminClient";
import { requireAdmin, isAuthContext } from "@/lib/auth";

export async function GET() {
  const authResult = await requireAdmin();
  if (!isAuthContext(authResult)) return authResult;

  try {
    const client = getAdminClient();
    if (!client) return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    const settings = await client.fetch(`*[_type == "shippingSettings"][0]`);
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const authResult = await requireAdmin();
  if (!isAuthContext(authResult)) return authResult;

  try {
    const body = await req.json();
    const { deliveryCharges, freeShippingThreshold, shippingMessage } = body;

    const client = getAdminClient();
    if (!client) return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    
    // Find existing settings document or create a new one
    const existing = await client.fetch(`*[_type == "shippingSettings"][0]`);
    
    if (existing) {
      await client.patch(existing._id).set({
        deliveryCharges: Number(deliveryCharges),
        freeShippingThreshold: Number(freeShippingThreshold),
        shippingMessage
      }).commit();
    } else {
      await client.create({
        _type: 'shippingSettings',
        deliveryCharges: Number(deliveryCharges),
        freeShippingThreshold: Number(freeShippingThreshold),
        shippingMessage
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
