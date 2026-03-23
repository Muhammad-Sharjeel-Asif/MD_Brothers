import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId, amount, customerData } = body;

        if (!orderId || !amount || !customerData) {
            return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
        }

        const merchantId = process.env.PAYFAST_MERCHANT_ID || '';
        const merchantKey = process.env.PAYFAST_MERCHANT_KEY || '';
        const passphrase = process.env.PAYFAST_PASSPHRASE || '';
        const returnUrl = process.env.PAYFAST_RETURN_URL || '';
        const cancelUrl = process.env.PAYFAST_CANCEL_URL || '';
        const notifyUrl = process.env.PAYFAST_NOTIFY_URL || '';

        const payload: Record<string, string> = {
            merchant_id: merchantId,
            merchant_key: merchantKey,
            return_url: returnUrl,
            cancel_url: cancelUrl,
            notify_url: notifyUrl,
            name_first: customerData.firstName || 'Customer',
            name_last: customerData.lastName || '',
            email_address: customerData.email || '',
            m_payment_id: orderId,
            amount: parseFloat(amount).toFixed(2),
            item_name: `Order ID: ${orderId}`,
        };

        // Remove empty/null/undefined fields
        const cleanPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
        );

        // Generate signature
        // 1. Sort keys alphabetically
        const sortedKeys = Object.keys(cleanPayload).sort();
        
        // 2. Build parameter string
        let signatureString = sortedKeys.map(key => {
            const value = cleanPayload[key] as string;
            return `${key}=${encodeURIComponent(value.trim()).replace(/%20/g, '+')}`;
        }).join('&');

        // 3. Append passphrase if exists
        if (passphrase) {
            signatureString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`;
        }

        // 4. Generate MD5 hash
        const signature = crypto.createHash('md5').update(signatureString).digest('hex');

        cleanPayload.signature = signature;

        return NextResponse.json({ success: true, payload: cleanPayload });
        
    } catch (error) {
        console.error('PayFast initiate error:', error);
        return NextResponse.json({ success: false, error: 'Failed to initiate PayFast checkout' }, { status: 500 });
    }
}
