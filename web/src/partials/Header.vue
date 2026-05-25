<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import Logo from '@/components/Logo.vue';
import Avatar from '@/components/Avatar/Avatar.vue';
import { ref, watch, onUnmounted } from 'vue';

const mobileMenuOpen = ref(false);
const scrollY = ref(0);

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

watch(mobileMenuOpen, (open) => {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = open ? 'hidden' : '';
  document.body.style.paddingRight = open ? `${scrollbarWidth}px` : '';
});

onUnmounted(() => {
  document.body.style.cssText = '';
  window.scrollTo(0, scrollY.value);
});

const authStore = useAuthStore();
</script>

<template>
    <header class="main-header">
        <Logo size="--t-h4" :beta="true" />

        <div class="row gap-3 ml-a mobile-extras">
            <a href="#" class="b b-primary">Skapa konto</a>
            <button class="b b-outline square mmt" aria-label="Open mobile menu" @click="toggleMenu()"></button>
        </div>

        <nav :data-show="mobileMenuOpen">
            <div class="row nav-mobile-header">
                <Logo size="--t-body" :beta="true" />
                <button class="b b-secondary square mmt cross ml-a" aria-label="Close mobile menu" @click="toggleMenu()"></button>
            </div>

            <div class="user-info">
                <Avatar
                    name="Neme"
                    initials="NE"
                    :radius="24"
                />
            </div>

            <p class="eyebrow uppercase mobile-only nav-section-label">Navigation</p>

            <ul role="list" class="stack row-md">
                <li>
                    <a href="/features" class="nav-link">
                        <span class="nav-link-icon"></span>
                        <div class="nav-link-body">
                            <span class="nav-link-title">Funktioner</span>
                            <span class="nav-link-sub">Allt verktyget kan</span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="/pricing" class="nav-link">
                        <span class="nav-link-icon"></span>
                        <div class="nav-link-body">
                            <span class="nav-link-title">Priser</span>
                            <span class="nav-link-sub">Gratis · Pro · Klubb</span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="/season-planning" class="nav-link">
                        <span class="nav-link-icon"></span>
                        <div class="nav-link-body">
                            <span class="nav-link-title">Säsongsplanering</span>
                            <span class="nav-link-sub">Periodisering & belastning</span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="/clubs" class="nav-link">
                        <span class="nav-link-icon"></span>
                        <div class="nav-link-body">
                            <span class="nav-link-title">För klubbar</span>
                            <span class="nav-link-sub">Multi-team, sso, support</span>
                        </div>
                    </a>
                </li>
            </ul>
        </nav>

        <div class="mobile-menu-overlay" :data-show="mobileMenuOpen" @click="toggleMenu()"></div>
    </header>
    
</template>

<style lang="scss">
header.main-header {
    align-items: center;
    background: color-mix(in srgb, var(--paper) 60%, transparent);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--rule);
    display: flex;
    flex-direction: row;
    padding: var(--space-md) var(--space-md);
    position: sticky;
    top: 0;
    z-index: 1;

    &.thin {
        padding: var(--space-sm) var(--space-md);
    }

    .mobile-extras {
        @media (min-width: 769px) {
            display: none;
        }
    }

    .mmt {
        display: flex;
        flex-direction: column;
        gap: 4px;
        justify-content: center;
        align-items: center;

        &:before {
            content: '';
            background-color: var(--ink);
            display: block;
            height: 2px; 
            width: 12px;
            transition: background-color 0.2s ease;
        }

        &:after {
            content: '';
            background-color: var(--ink);
            display: block;
            height: 2px; 
            width: 12px;
            transition: background-color 0.2s ease;
        }

        &:hover {
            &:before, &:after {
                background-color: var(--paper);
            }
        }

        &.cross {
            &:before {
                transform: rotate(45deg);
                position: absolute;
            }

            &:after {
                transform: rotate(-45deg);
                position: absolute;
            }
        }
    }

    nav {
        z-index: 5;
        overflow-y: auto;

        .nav-mobile-header {
            display: none;
        }

        ul {
            list-style: none;
        }
        
        .user-info {
            display: none;
        }

        @media (max-width: 768px) {
            background-color: var(--paper);
            border-left: 1px solid var(--rule);
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            max-width: 400px;
            width: 80vw;
            transition: transform 0.3s ease;
            transform: translateX(100%);
            z-index: 11;

            &[data-show="true"] {
                transform: translateX(0);
            }

            .nav-mobile-header {
                align-items: center;
                border-bottom: 1px solid var(--rule);
                display: flex;
                padding: var(--space-md);
            }

            .nav-link-icon {
                display: block;
                background: var(--rule);
                border: 1px solid var(--rule-2);
                border-radius: var(--r-3);
                color: var(--ink);
                width: 2.5rem;
                height: 2.5rem;
            }

            .nav-section-label {
                padding: var(--space-md) var(--space-md) 0;
            }

            ul {
                margin: 0;
                padding: 0 var(--space-md);

                li {

                    a {
                        align-items: center;
                        color: var(--ink);
                        display: flex;
                        text-decoration: none;
                        padding: var(--space-sm) 0;
                        gap: var(--space-7);
                    }

                    .nav-link-body {
                        display: flex;
                        flex-direction: column;
                        gap: var(--space-1);
                    }

                    .nav-link-title {
                        font-size: var(--t-body);
                        font-weight: 500;
                    }

                    .nav-link-sub {
                        color: var(--ink-2);
                        font-size: var(--t-label);
                    }

                    &:not(:first-child) {
                        border-top: 1px solid var(--rule);
                    }
                }
            }

            .user-info {
                background-color: var(--paper-2);
                border-bottom: 1px solid var(--rule);
                display: flex;
                padding: var(--space-base) var(--space-md);
            }
        }
    }

    .mobile-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.75);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        z-index: 10;

        &[data-show="true"] {
            opacity: 1;
            visibility: visible;
        }
    }
}
</style>