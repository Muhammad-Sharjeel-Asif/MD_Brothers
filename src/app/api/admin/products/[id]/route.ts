import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/sanity/lib/adminClient";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await adminClient.fetch(
      `*[_type == "product" && _id == $id][0] {
        _id, title, price, description, "imageUrl": productImage.asset->url,
        tags, dicountPercentage, isNew, "categoryId": category->_id,
        "categoryName": category->name, sku, "slug": slug.current
      }`,
      { id: params.id }
    );
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    let patch = adminClient.patch(params.id);

    if (body.title) patch = patch.set({ title: body.title });
    if (body.description) patch = patch.set({ description: body.description });
    if (body.price !== undefined) patch = patch.set({ price: Number(body.price) });
    if (body.tags) patch = patch.set({ tags: body.tags });
    if (body.discountPercentage !== undefined) patch = patch.set({ dicountPercentage: Number(body.discountPercentage) });
    if (body.isNew !== undefined) patch = patch.set({ isNew: body.isNew });
    if (body.sku) patch = patch.set({ sku: body.sku });
    if (body.slug) patch = patch.set({ slug: { _type: "slug", current: body.slug } });
    if (body.categoryId) patch = patch.set({ category: { _type: "reference", _ref: body.categoryId } });
    if (body.imageAssetId) patch = patch.set({ productImage: { _type: "image", asset: { _type: "reference", _ref: body.imageAssetId } } });

    const result = await patch.commit();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await adminClient.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
