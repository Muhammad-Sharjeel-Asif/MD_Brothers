import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/sanity/lib/adminClient";
import { requireAdmin, isAuthContext } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAdmin();
  if (!isAuthContext(authResult)) return authResult;

  try {
    const products = await adminClient.fetch(`*[_type == "product"] | order(_createdAt desc) {
      _id,
      title,
      price,
      description,
      "imageUrl": productImage.asset->url,
      tags,
      dicountPercentage,
      isNew,
      "categoryName": category->name,
      "categoryId": category->_id,
      sku,
      "slug": slug.current,
      _createdAt
    }`);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireAdmin();
  if (!isAuthContext(authResult)) return authResult;

  try {
    const body = await req.json();
    const doc: any = {
      _type: "product",
      title: body.title,
      slug: { _type: "slug", current: body.slug || body.title.toLowerCase().replace(/\s+/g, "-") },
      description: body.description,
      price: Number(body.price),
      tags: body.tags || [],
      dicountPercentage: Number(body.discountPercentage) || 0,
      isNew: body.isNew || false,
      sku: body.sku,
    };

    if (body.categoryId) {
      doc.category = { _type: "reference", _ref: body.categoryId };
    }

    if (body.imageAssetId) {
      doc.productImage = { _type: "image", asset: { _type: "reference", _ref: body.imageAssetId } };
    }

    const result = await adminClient.create(doc);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
