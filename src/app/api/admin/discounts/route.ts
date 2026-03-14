import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/sanity/lib/adminClient";

export async function GET() {
  try {
    const discounts = await adminClient.fetch(`*[_type == "discount"] | order(_createdAt desc) {
      _id, title, type, value, bulkThreshold, isActive, activeRange,
      "appliesTo": appliesTo[]->{ _id, _type, title, name }
    }`);
    return NextResponse.json(discounts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch discounts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const doc: any = {
      _type: "discount",
      title: body.title,
      type: body.type,
      value: Number(body.value),
      isActive: body.isActive !== false,
    };
    if (body.type === "bulk") doc.bulkThreshold = Number(body.bulkThreshold);
    if (body.startDate && body.endDate) {
      doc.activeRange = { startDate: body.startDate, endDate: body.endDate };
    }
    if (body.appliesTo && body.appliesTo.length > 0) {
      doc.appliesTo = body.appliesTo.map((ref: any) => ({
        _type: "reference",
        _ref: ref._id || ref,
        _key: Math.random().toString(36).substring(2, 8),
      }));
    }
    const result = await adminClient.create(doc);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create discount" }, { status: 500 });
  }
}
