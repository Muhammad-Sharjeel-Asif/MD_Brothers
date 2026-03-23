import { NextResponse } from 'next/server';
import { getSanityClient } from '@/sanity/lib/client';

export async function GET() {
  const client = getSanityClient();
  if (!client) {
    return NextResponse.json({ error: 'Sanity client not initialized' }, { status: 500 });
  }

  try {
    const settings = await client.fetch(`*[_type == "shippingSettings"][0]`);
    const zones = await client.fetch(`*[_type == "shippingZone"]`);

    return NextResponse.json({ settings, zones });
  } catch (error) {
    console.error('Error fetching shipping settings:', error);
    return NextResponse.json({ error: 'Failed to fetch shipping settings' }, { status: 500 });
  }
}
