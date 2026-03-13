export interface Discount {
    type: 'percentage' | 'fixed' | 'bulk';
    value: number;
    bulkThreshold?: number;
    isActive: boolean;
    activeRange?: {
        startDate: string;
        endDate: string;
    };
}

export const calculateDiscountedPrice = (price: number, quantity: number, discount?: Discount): number => {
    if (!discount || !discount.isActive) return price;

    const now = new Date();
    if (discount.activeRange) {
        const start = new Date(discount.activeRange.startDate);
        const end = new Date(discount.activeRange.endDate);
        if (now < start || now > end) return price;
    }

    switch (discount.type) {
        case 'percentage':
            return price * (1 - discount.value / 100);
        case 'fixed':
            return Math.max(0, price - discount.value);
        case 'bulk':
            if (quantity >= (discount.bulkThreshold || 0)) {
                return price * (1 - discount.value / 100);
            }
            return price;
        default:
            return price;
    }
};
