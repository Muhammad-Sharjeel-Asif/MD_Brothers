import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminClient } from '@/sanity/lib/adminClient';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, orderId, customerData } = body;

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

        // Amount must be in paisas (amount * 100) and an exact string length representation is preferred but not strictly required if accurate
        // Standard is typically rupees * 100 for decimals
        const amount = Math.round(totalAmount * 100).toString();

        const merchantId = process.env.JAZZCASH_MERCHANT_ID || '';
        const password = process.env.JAZZCASH_PASSWORD || '';
        const integritySalt = process.env.JAZZCASH_INTEGERITY_SALT || '';
        const returnUrl = process.env.JAZZCASH_RETURN_URL || `${request.headers.get('origin')}/api/payment/jazzcash/callback`;

        // Generate Transaction Reference (Must be unique)
        const date = new Date();
        const txnRefNo = 'T' + date.getTime().toString();
        
        // Format YYYYMMDDHHMMSS
        const pad = (n: number) => n < 10 ? '0' + n : n;
        const txnDateTime = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
        // Usually expiry is 1 hour later
        date.setHours(date.getHours() + 1);
        const txnExpiryDateTime = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;

        // Build Payload
        const payload: Record<string, string> = {
            "pp_Language": "EN",
            "pp_MerchantID": merchantId,
            "pp_SubMerchantID": "",
            "pp_Password": password,
            "pp_BankID": "TBANK",
            "pp_ProductID": "RETL",
            "pp_TxnRefNo": txnRefNo,
            "pp_Amount": amount,
            "pp_TxnCurrency": "PKR",
            "pp_TxnDateTime": txnDateTime,
            "pp_BillReference": orderId,
            "pp_Description": `Payment for Order ${orderId}`,
            "pp_TxnExpiryDateTime": txnExpiryDateTime,
            "pp_ReturnURL": returnUrl,
            "pp_SecureHash": "",
            "ppmpf_1": "1",
            "ppmpf_2": "2",
            "ppmpf_3": "3",
            "ppmpf_4": "4",
            "ppmpf_5": "5",
        };

        // Compute Secure Hash
        // Sort keys alphabetically
        const sortedKeys = Object.keys(payload).sort();
        
        // Exclude pp_SecureHash from the hash string calculation
        let hashString = integritySalt;
        sortedKeys.forEach((key) => {
            if (key !== 'pp_SecureHash' && payload[key] !== '' && payload[key] !== null) {
                hashString += '&' + payload[key];
            }
        });

        const secureHash = crypto
            .createHmac('sha256', integritySalt)
            .update(hashString)
            .digest('hex')
            .toUpperCase();

        payload.pp_SecureHash = secureHash;

        await adminClient.patch(orderId).setIfMissing({ paymentLogs: [] }).append('paymentLogs', [{
            _key: crypto.randomUUID(),
            gateway: 'JazzCash',
            eventType: 'payment initiated',
            transactionId: txnRefNo,
            status: 'pending',
            timestamp: new Date().toISOString()
        }]).commit();

        return NextResponse.json({ success: true, payload });

    } catch (error: any) {
        console.error('JazzCash Initiation Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
