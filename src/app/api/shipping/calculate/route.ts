import { NextResponse } from 'next/server';
import { getSanityClient } from '@/sanity/lib/client';

export async function POST(req: Request) {
  try {
    const { cartTotal, city } = await req.json();

    const client = getSanityClient();
    if (!client) {
      return NextResponse.json({ 
        shippingCost: 250, // Standard default fallback
        deliveryTime: "3-7 days", 
        isFree: false,
        threshold: null 
      });
    }

    // Fetch shipping settings and zones
    const [settings, zones] = await Promise.all([
      client.fetch(`*[_type == "shippingSettings"][0]`),
      client.fetch(`*[_type == "shippingZone"]`)
    ]);

    let deliveryTime = "3-5 days"; // Default
    let baseCharge = settings?.deliveryCharges || 0;
    let discount = settings?.deliveryDiscount || 0;

    // Check if city belongs to a specific zone
    if (city && zones && zones.length > 0) {
      const zone = zones.find((z: any) => 
        z.cities?.some((c: string) => c.toLowerCase() === city.toLowerCase())
      );

      if (zone) {
        baseCharge = zone.shippingCost;
        deliveryTime = zone.deliveryTimeEstimate;
      }
    }

    // Global free shipping override OR free shipping threshold reached
    const isFree = settings?.freeShipping || (settings?.freeShippingThreshold && cartTotal >= settings.freeShippingThreshold);

    if (isFree) {
      return NextResponse.json({ 
        shippingCost: 0, 
        baseCharge,
        discount: 0,
        deliveryTime, 
        isFree: true,
        threshold: settings?.freeShippingThreshold
      });
    }

    const finalShippingCost = Math.max(0, baseCharge - discount);

    return NextResponse.json({ 
      shippingCost: finalShippingCost, 
      baseCharge,
      discount,
      deliveryTime, 
      isFree: false,
      threshold: settings?.freeShippingThreshold 
    });

  } catch (error) {
    console.error('Error calculating shipping:', error);
    return NextResponse.json({ error: 'Failed to calculate shipping' }, { status: 500 });
  }
}
