export const paymentConfig = {
    bankTransfer: {
        bankName: process.env.NEXT_PUBLIC_BANK_NAME || 'Unknown Bank',
        accountTitle: process.env.NEXT_PUBLIC_BANK_ACCOUNT_TITLE || 'Invalid Account configuration',
        accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || 'No Account Provided',
        iban: process.env.NEXT_PUBLIC_BANK_IBAN || '...',
        branch: process.env.NEXT_PUBLIC_BANK_BRANCH || '...',
    },
    jazzCash: {
        returnUrl: process.env.NEXT_PUBLIC_JAZZCASH_RETURN_URL || process.env.JAZZCASH_RETURN_URL || '',
    },
    easypaisa: {
        returnUrl: process.env.NEXT_PUBLIC_EASYPAISA_RETURN_URL || process.env.EASYPAISA_RETURN_URL || '',
    }
} as const;
