export function validateEnv() {
    const requiredVars = [
        'STRIPE_SECRET_KEY',
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        'STRIPE_WEBHOOK_SECRET',
        'JAZZCASH_MERCHANT_ID',
        'JAZZCASH_PASSWORD',
        'JAZZCASH_INTEGERITY_SALT',
        'JAZZCASH_RETURN_URL',
        'EASYPAISA_STORE_ID',
        'EASYPAISA_HASH_KEY',
        'EASYPAISA_RETURN_URL',
        'NEXT_PUBLIC_BANK_NAME',
        'NEXT_PUBLIC_BANK_ACCOUNT_TITLE',
        'NEXT_PUBLIC_BANK_ACCOUNT_NUMBER',
        'NEXT_PUBLIC_BANK_IBAN',
        'NEXT_PUBLIC_BANK_BRANCH',
        'NEXT_PUBLIC_SANITY_PROJECT_ID',
        'NEXT_PUBLIC_SANITY_DATASET',
        'SANITY_API_TOKEN'
    ];

    const missingVars = requiredVars.filter(envVar => !process.env[envVar]);

    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(envVar => {
            console.error(`   - ${envVar}`);
        });
        console.error('Please configure these in your .env.local file based on .env.example.');
        
        // In some deployment environments (like Vercel build step), 
        // you might want to warn rather than strictly throw if they inject keys later.
        // However, for strict development validation:
        if (process.env.NODE_ENV !== 'production' || process.env.STRICT_ENV_VALIDATION === 'true') {
             throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
        } else {
             console.warn('⚠️ Server proceeding without all payment environment variables. Checkout capabilities may fail.');
        }
    } else {
        console.log('✅ Environment configuration validated successfully.');
    }
}
