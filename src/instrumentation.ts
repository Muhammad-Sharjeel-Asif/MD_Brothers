export async function register() {
    // We only want to run env validation on the server component boot.
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { validateEnv } = await import('./lib/env');
        
        try {
            validateEnv();
        } catch (error: any) {
            console.error('\n=============================================');
            console.error('SERVER STARTUP HALTED DUE TO ENV MISCONFIG:');
            console.error(error.message);
            console.error('=============================================\n');
            
            // Exit early to prevent bad deployments if required by environment
            if (process.env.NODE_ENV === 'production') {
                process.exit(1);
            }
        }
    }
}
