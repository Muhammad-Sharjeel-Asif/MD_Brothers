import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminClient } from '@/sanity/lib/adminClient';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, orderId } = body;

        // Fetch prices securely from Sanity
        const itemIds = items.map((item: any) => item._id);
        const products = await adminClient.fetch(`*[_type == "product" && _id in $ids]`, { ids: itemIds });

        let totalAmount = 0;

        items.forEach((item: any) => {
            const product = products.find((p: any) => p._id === item._id);
            if (!product) {
                throw new Error(`Product not found: ${item.title}`);
            }
            totalAmount += product.price * item.quantity;
        });

        // Easypaisa expects the amount to be a precise decimal string like "100.0" (or depending on exact integration format, usually formatted standard)
        // Here we format to 1 decimal place standard "amount.0"
        const amount = totalAmount.toFixed(1);

        const storeId = process.env.EASYPAISA_STORE_ID || '';
        const hashKey = process.env.EASYPAISA_HASH_KEY || ''; // Usually 16, 24, or 32 bytes for AES
        const returnUrl = process.env.EASYPAISA_RETURN_URL || `${request.headers.get('origin')}/api/payment/easypaisa/callback`;

        // Generate Transaction Reference (Must be unique, typically 6-16 digits/chars)
        const date = new Date();
        const orderRefNum = 'EP' + date.getTime().toString().substring(5); // Make it a bit shorter
        
        // Expiry Date (Format: YYYYMMDD HHMMSS)
        const pad = (n: number) => n < 10 ? '0' + n : n;
        date.setHours(date.getHours() + 1); // 1 hour expiry
        const expiryDate = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())} ${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;

        // Standard Easypaisa Web Checkout fields array for signing: Amount, OrderRefNum, StoreId
        // String to encrypt -> "Amount&OrderRefNum&StoreId"
        const hashString = `amount=${amount}&orderRefNum=${orderRefNum}&postBackURL=${returnUrl}&storeId=${storeId}`;
        
        // Encrypt with AES-128-ECB
        // Node's crypto library accepts key directly if it matches required length (16 bytes = 128 bit).
        let encryptedHash = '';
        if (hashKey) {
            try {
                // Ensure key is right length for standard AES-128-ECB, padding may be necessary depending on the key given by easypaisa
                const keyBuffer = Buffer.from(hashKey, 'utf8');
                const cipher = crypto.createCipheriv('aes-128-ecb', keyBuffer, null);
                let encrypted = cipher.update(hashString, 'utf8', 'base64');
                encrypted += cipher.final('base64');
                encryptedHash = encrypted;
            } catch (err) {
                 console.error('Easypaisa Encryption Error fallback:', err);
                 // Fallback if the key doesn't match AES-128-ECB requirements (e.g., testing mode without real AES key)
                 encryptedHash = "INVALID_HASH_KEY";
            }
        }

        // Build Payload
        const payload: Record<string, string> = {
            "storeId": storeId,
            "orderId": orderId,
            "transactionAmount": amount,
            "transactionType": "MA", // Web checkout Masterpass/Accounts
            "mobileAmount": "account", // Or "MA"
            "emailAddress": "customer@example.com",
            "orderRefNum": orderRefNum,
            "merchantHashedReq": encryptedHash,
            "autoRedirect": "0", // 1 to redirect automatically, 0 for button
            "paymentMethod": "InitialRequest",
            "postBackURL": returnUrl,
            "bankIdentificationNumber": "",
        };

        await adminClient.patch(orderId).setIfMissing({ paymentLogs: [] }).append('paymentLogs', [{
            _key: crypto.randomUUID(),
            gateway: 'Easypaisa',
            eventType: 'payment initiated',
            transactionId: orderRefNum,
            status: 'pending',
            timestamp: new Date().toISOString()
        }]).commit();

        return NextResponse.json({ success: true, payload });

    } catch (error: any) {
        console.error('Easypaisa Initiation Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
