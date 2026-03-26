import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getAdminClient } from "@/sanity/lib/adminClient";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "m.sharjeelasif1435@gmail.com";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    if (user?.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const client = getAdminClient();
    if (!client) return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    const settings = await client.fetch(`*[_type == "shippingSettings"][0]`);
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    if (user?.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
