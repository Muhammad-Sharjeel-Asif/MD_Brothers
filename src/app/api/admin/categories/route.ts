import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/sanity/lib/adminClient";
import { requireAdmin, isAuthContext } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAdmin();
  if (!isAuthContext(authResult)) return authResult;

  try {
    const categories = await adminClient.fetch(`*[_type == "category"] | order(name asc) {
      _id, name, "slug": slug.current, description,
      "imageUrl": image.asset->url,
      "productCount": count(*[_type == "product" && references(^._id)])
    }`);
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireAdmin();
  if (!isAuthContext(authResult)) return authResult;

  try {
    const body = await req.json();
    const doc: any = {
      _type: "category",
      name: body.name,
      slug: { _type: "slug", current: body.slug || body.name.toLowerCase().replace(/\s+/g, "-") },
      description: body.description || "",
    };
    if (body.imageAssetId) {
      doc.image = { _type: "image", asset: { _type: "reference", _ref: body.imageAssetId } };
    }
    const result = await adminClient.create(doc);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
