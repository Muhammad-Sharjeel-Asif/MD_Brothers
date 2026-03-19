export function getEnv(key: string, fallback: string = ''): string {
    const value = process.env[key];
    if (!value) {
        return fallback;
    }
    return value;
}

export function requireEnv(key: string, featureName: string): string {
    const value = process.env[key];
    if (!value) {
        console.error(`❌ Critical Missing Environment Variable: ${key} is required for ${featureName}.`);
        console.warn(`⚠️ The ${featureName} feature may fail or crash if this variable is accessed.`);
        return ''; // Return empty string instead of throwing immediately to prevent module load crash
    }
    return value;
}

export function validateEnv() {
    const requiredVars = [
        'STRIPE_SECRET_KEY',
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        'STRIPE_WEBHOOK_SECRET',
    ];

    const missingVars = requiredVars.filter(envVar => !process.env[envVar]);

    if (missingVars.length > 0) {
        console.error('❌ Missing warning environment variables:');
        missingVars.forEach(envVar => {
            console.error(`   - ${envVar}`);
        });
        console.warn('⚠️ Server proceeding without all payment environment variables. Checkout capabilities may fail.');
    } else {
        console.log('✅ Environment configuration validated successfully.');
    }
}
