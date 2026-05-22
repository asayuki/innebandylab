<script setup lang="ts">
import { ref } from 'vue';
defineProps<{
    title: string;
    description: string;
    monthly: number;
    yearly: number;
    billingCycle: string;
    features: [boolean, string][];
    cta: string;
    ctaStyle?: string;
    highlight?: boolean;
}>();

const checkoutLoading = ref<string | null>(null);
const handleCta = (tier: string) => {
    checkoutLoading.value = tier;
    // Simulate async action
    setTimeout(() => {
        checkoutLoading.value = null;
        alert(`CTA clicked for ${tier}`);
    }, 2000);
};
</script>

<template>
    <div class="price-card" :class="{ 'price-card__highlight': highlight }">
                        <div class="price-card__name">{{ title }}</div>
                <p class="price-card__sub">{{ description }}</p>

                <div class="price-card__price-row">
                    <span class="price-card__price">{{ billingCycle === 'yearly' ? yearly : monthly }}</span>
                    <span v-if="title !== 'Gratis'" class="price-card__unit">kr/mån</span>
                </div>
                <div class="price-card__billed-note">
                    <template v-if="title === 'Gratis'">INGET KREDITKORT KRÄVS</template>
                    <template v-else-if="billingCycle === 'yearly'">FAKTURERAS {{ yearly * 12 }} KR/ÅR</template>
                    <template v-else>FAKTURERAS MÅNADSVIS</template>
                </div>

                <button
                    class="price-card__cta"
                    :class="`price-card__cta--${ctaStyle}`"
                    :disabled="checkoutLoading === title"
                    @click="handleCta(title)"
                >
                    <template v-if="checkoutLoading === title">Laddar…</template>
                    <template v-else>
                        {{ cta }}
                        <svg v-if="ctaStyle === 'accent'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6"/>
                        </svg>
                    </template>
                </button>

                <ul class="price-card__features">
                    <li
                        v-for="([ok, label], i) in features"
                        :key="i"
                        class="price-card__feature"
                        :class="{ 'price-card__feature--off': !ok }"
                    >
                        <span class="price-card__feature-icon">
                            <svg v-if="ok" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M5 13l4 4L19 7"/>
                            </svg>
                            <svg v-else width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                                <path d="M6 6l12 12M18 6L6 18"/>
                            </svg>
                        </span>
                        {{ label }}
                    </li>
                </ul>
    </div>
</template>

<style lang="scss" scoped>
.price-card {
    position: relative;
    background: var(--background-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 1.25rem;
    padding: 28px 24px 24px;
    display: flex;
    flex-direction: column;
    min-height: 480px;
    min-width: 25vw;
    max-width: 99vw;

    .pricing-cards--compact & { min-height: 0; }

    &--targeted {
        outline: 2px solid color-mix(in srgb, var(--color-accent) 60%, transparent);
        outline-offset: 2px;
    }

    &--highlight {
        background: var(--text-primary);
        border-color: var(--text-primary);
        box-shadow: 0 16px 40px -20px rgba(22, 24, 26, 0.4);
        transform: translateY(-8px);

        .pricing-cards--compact & { transform: none; }

        .price-card__name, .price-card__price { color: rgba(250, 248, 243, 0.95); }
        .price-card__sub, .price-card__unit  { color: rgba(250, 248, 243, 0.55); }
        .price-card__billed-note       { color: rgba(250, 248, 243, 0.4); }
        .price-card__features          { border-color: rgba(250, 248, 243, 0.1); }
        .price-card__feature           { color: rgba(250, 248, 243, 0.85); }
        .price-card__feature--off      { color: rgba(250, 248, 243, 0.3); }
    }

    &__badge {
        position: absolute;
        top: -12px;
        left: 24px;
        padding: 4px 10px;
        border-radius: var(--radius-round);
        background: var(--color-accent);
        color: #16181a;
        font-family: var(--font-mono);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.06em;
        border: 1px solid #16181a;
    }

    &__name {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 4px;
    }

    &__sub {
        font-size: 13px;
        color: var(--text-secondary);
        margin: 0 0 20px;
    }

    &__price-row {
        display: flex;
        align-items: baseline;
        gap: 5px;
    }

    &__price {
        font-size: clamp(2.2rem, 3vw, 3.5rem);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.9;
        color: var(--text-primary);
        font-variant-numeric: tabular-nums;
    }

    &__unit {
        font-size: 14px;
        color: var(--text-secondary);
    }

    &__billed-note {
        margin-top: 5px;
        font-family: var(--font-mono);
        font-size: 10px;
        letter-spacing: 0.04em;
        color: var(--text-secondary);
        min-height: 14px;
        margin-bottom: 20px;
    }

    &__cta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 12px 16px;
        border-radius: var(--radius-base);
        font-family: var(--font-ui);
        font-size: var(--font-size-small);
        font-weight: 600;
        margin-bottom: 20px;
        cursor: pointer;
        transition: opacity 0.15s, background 0.15s;

        &:disabled { opacity: 0.5; cursor: not-allowed; }

        &--accent {
            background: var(--color-accent);
            color: #16181a;
            border: none;
            &:hover { opacity: 0.88; }
        }

        &--outline {
            background: transparent;
            border: 1px solid var(--border-primary);
            color: var(--text-primary);
            &:hover { background: var(--surface-hover); }

            .tier--highlight & {
                color: rgba(250, 248, 243, 0.9);
                border-color: rgba(250, 248, 243, 0.25);
                &:hover { background: rgba(250, 248, 243, 0.06); }
            }
        }
    }

    &__features {
        list-style: none;
        margin: 0;
        padding: 18px 0 0;
        border-top: 1px solid var(--border-primary);
        display: flex;
        flex-direction: column;
        gap: 1px;
        flex: 1;
    }

    &__feature {
        display: flex;
        align-items: flex-start;
        gap: 9px;
        padding: 7px 0;
        font-size: 13px;
        line-height: 1.35;
        color: var(--text-primary);

        &--off {
            color: var(--text-secondary);
            text-decoration: line-through;
            text-decoration-color: var(--border-primary);
        }
    }

    &__feature-icon {
        width: 16px;
        height: 16px;
        border-radius: 999px;
        flex-shrink: 0;
        margin-top: 1px;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        .price-card__feature--off & {
            border: 1px solid var(--border-primary);
            color: var(--text-secondary);
            background: transparent;
        }

        .price-card__feature:not(.price-card__feature--off) & {
            background: var(--text-primary);
            color: var(--accent-primary);
        }

        .tier--highlight .price-card__feature:not(.price-card__feature--off) & {
            background: var(--accent-primary);
            color: #16181a;
        }

        .tier--highlight .price-card__feature--off & {
            border-color: rgba(250, 248, 243, 0.2);
            color: rgba(250, 248, 243, 0.3);
        }
    }
}
</style>