export function getEnv(key: string, fallback: string = ''): string {
    const value = process.env[key];
    if (!value) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`⚠️ Warning: Environment variable ${key} is missing. Using fallback: "${fallback}"`);
        }
        return fallback;
    }
    return value;
}

export function isSanityConfigured(): boolean {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    return !!(projectId && dataset);
}

export function isPayFastConfigured(): boolean {
    return !!(
        process.env.PAYFAST_MERCHANT_ID &&
        process.env.PAYFAST_MERCHANT_KEY &&
        process.env.PAYFAST_PASSPHRASE &&
        process.env.PAYFAST_RETURN_URL &&
        process.env.PAYFAST_CANCEL_URL &&
        process.env.PAYFAST_NOTIFY_URL
    );
}

export function requireEnv(key: string, featureName: string): string {
    const value = process.env[key];
    if (!value) {
        console.warn(`❌ Missing Environment Variable: ${key} is required for ${featureName}.`);
        return ''; 
    }
    return value;
}

export function validateEnv() {
    if (!isSanityConfigured()) {
        console.warn('⚠️ Sanity CMS is NOT configured. CMS features will be disabled.');
    }
    
    if (!isPayFastConfigured()) {
        console.warn('⚠️ PayFast is NOT configured. Online payments will be disabled.');
    }

    if (isSanityConfigured() && isPayFastConfigured()) {
        console.log('✅ Environment configuration validated successfully.');
    }
}
