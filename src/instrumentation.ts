export async function register() {
    // We only want to run env validation on the server component boot.
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { validateEnv } = await import('./lib/env');
        
        try {
            validateEnv();
        } catch (error: any) {
            console.error('\n=============================================');
            console.error('SERVER STARTUP WARNING (ENV MISCONFIG):');
            console.error(error.message || error);
            console.error('=============================================\n');
            // Do NOT exit, allow app to run with fallbacks
        }
    }
}
