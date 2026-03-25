import { NextResponse } from 'next/server';
import { getSanityClient } from '@/sanity/lib/client';

export async function GET() {
  const client = getSanityClient();
  if (!client) {
    return NextResponse.json({ settings: null, zones: [] });
  }

  try {
    const settings = await client.fetch(`*[_type == "shippingSettings"][0]`);
    const zones = await client.fetch(`*[_type == "shippingZone"]`);

    return NextResponse.json({ settings, zones });
  } catch (error) {
    console.error('Error fetching shipping settings:', error);
    // Return empty results instead of crashing/erroring
    return NextResponse.json({ settings: null, zones: [] });
  }
}
