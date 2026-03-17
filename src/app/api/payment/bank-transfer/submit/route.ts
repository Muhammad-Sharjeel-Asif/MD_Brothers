import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/lib/adminClient';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        
        const orderId = formData.get('orderId') as string;
        const transactionReference = formData.get('transactionReference') as string;
        const proofImage = formData.get('proofImage') as File;

        if (!orderId || !transactionReference || !proofImage) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Convert the File out of FormData into an ArrayBuffer then Buffer for Sanity Upload
        const arrayBuffer = await proofImage.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload the image asset to Sanity
        const asset = await adminClient.assets.upload('image', buffer, {
            filename: proofImage.name || 'payment_proof.jpg',
            contentType: proofImage.type || 'image/jpeg',
        });

        // Patch the order document
        // Update transactionId and link the uploaded asset reference
        await adminClient.patch(orderId).set({
            transactionId: transactionReference,
            proofImage: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: asset._id,
                }
            }
        }).commit();

        return NextResponse.json({ success: true, message: 'Proof submitted successfully' });

    } catch (error: any) {
        console.error('Bank Transfer Submission Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error while uploading proof.' },
            { status: 500 }
        );
    }
}
