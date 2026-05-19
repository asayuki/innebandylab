import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia',
});

export const PRODUCT_IDS = {
    pro_monthly: process.env.STRIPE_PRODUCT_PRO_MONTHLY!,
    pro_yearly: process.env.STRIPE_PRODUCT_PRO_YEARLY!,
    club_monthly: process.env.STRIPE_PRODUCT_CLUB_MONTHLY!,
    club_yearly: process.env.STRIPE_PRODUCT_CLUB_YEARLY!,
} as const;

export type PlanKey = keyof typeof PRODUCT_IDS;

export const tierFromProductId = (productId: string): 'pro' | 'club' | 'free' => {
    if (productId === PRODUCT_IDS.pro_monthly || productId === PRODUCT_IDS.pro_yearly) return 'pro';
    if (productId === PRODUCT_IDS.club_monthly || productId === PRODUCT_IDS.club_yearly) return 'club';
    return 'free';
};

// Fetches the first active price for a product. Caches in memory per process lifecycle.
const priceCache = new Map<string, string>();

export const resolvePriceId = async (productId: string): Promise<string> => {
    const cached = priceCache.get(productId);
    if (cached) return cached;
    const prices = await stripe.prices.list({ product: productId, active: true, limit: 1 });
    const price = prices.data[0];
    if (!price) throw new Error(`No active price found for product ${productId}`);
    priceCache.set(productId, price.id);
    return price.id;
};
