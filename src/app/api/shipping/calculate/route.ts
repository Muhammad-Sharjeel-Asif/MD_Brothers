import { NextResponse } from 'next/server';
import { getSanityClient } from '@/sanity/lib/client';

export async function POST(req: Request) {
  try {
    const { cartTotal, city } = await req.json();

    const client = getSanityClient();
    if (!client) {
      return NextResponse.json({ error: 'Sanity client not initialized' }, { status: 500 });
    }

    // Fetch shipping settings and zones
    const [settings, zones] = await Promise.all([
      client.fetch(`*[_type == "shippingSettings"][0]`),
      client.fetch(`*[_type == "shippingZone"]`)
    ]);

    let shippingCost = (settings?.baseShippingCharge || 0) + (settings?.perOrderCharge || 0);
    let deliveryTime = "3-5 days"; // Default

    // Check for free shipping threshold
    if (settings?.freeShippingThreshold && cartTotal >= settings.freeShippingThreshold) {
      return NextResponse.json({ 
        shippingCost: 0, 
        deliveryTime, 
        isFree: true,
        threshold: settings.freeShippingThreshold
      });
    }

    // Check if city belongs to a specific zone
    if (city && zones && zones.length > 0) {
      const zone = zones.find((z: any) => 
        z.cities?.some((c: string) => c.toLowerCase() === city.toLowerCase())
      );

      if (zone) {
        shippingCost = zone.shippingCost;
        deliveryTime = zone.deliveryTimeEstimate;
      }
    }

    return NextResponse.json({ 
      shippingCost, 
      deliveryTime, 
      isFree: false,
      threshold: settings?.freeShippingThreshold 
    });

  } catch (error) {
    console.error('Error calculating shipping:', error);
    return NextResponse.json({ error: 'Failed to calculate shipping' }, { status: 500 });
  }
}
