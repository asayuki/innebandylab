<script setup lang="ts">
import Logo from '@/components/Logo.vue';
import ProfileAvatar from '@/components/ProfileAvatar.vue';

const navItems = [
    {
        name: 'Hem',
        path: '/hem',
        match: (r: string) => r.startsWith('/hem'),
    },
    { name: 'Kalender', path: '/kalender', match: (r: string) => r.startsWith('/kalender') },
    { name: 'Övningar', path: '/ovningar', match: (r: string) => r.startsWith('/ovningar') },
    { name: 'Klubb', path: '/klubb', match: (r: string) => r.startsWith('/klubb') },
];

</script>

<template>
    <header>
        <Logo size="base" class="space-x-r-medium" />
        <nav>
            <ul>
                <li v-for="item in navItems" :key="item.path">
                    <router-link
                        :to="item.path"
                        :class="{ active: item.match($route.path) }"
                    >
                        {{ item.name }}
                    </router-link>
                </li>
            </ul>
            <div class="page-indicator">
            </div>
        </nav>

        <aside>
            <form>
                <input
                    type="text"
                    placeholder="Sök..."
                    class=""
                />
            </form>
            <ProfileAvatar />
        </aside>
    </header>

    <router-view />
</template>

<style scoped lang="scss">
header {
    align-items: center;
    background: color-mix(in srgb, var(--background-primary) 60%, transparent);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-primary);
    display: flex;
    flex-direction: row;
    padding: var(--space-base) var(--space-medium);
    position: sticky;
    top: 0;
    gap: var(--space-medium);
    z-index: 10;
}

nav {
    background-color: var(--background-secondary);
    border: 1px solid var(--border-primary);
    padding: 0.45rem 0.25rem;
    height: 2.2rem;
    border-radius: 9999px;
    font-size: var(--text-mini);
    position: relative;

    .page-indicator {
        position: absolute;
        top: 0.225rem;
        height: calc(100% - 0.5rem);
        background-color: var(--text-primary);
        border-radius: 9999px;
        position-anchor: --active-page;
        left: anchor(left);
        width: anchor-size(width);
        transition: left 0.28s ease, width 0.28s ease;
    }

    ul {
        display: flex;
        gap: 0.25rem;
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            line-height: 1;
            a {
                color: var(--text-secondary);
                display: inline-block;
                text-decoration: none;
                font-weight: 500;
                line-height: 1;
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                position: relative;
                z-index: 2;
                transition: color 0.28s ease;
            }

            .active {
                color: var(--text-white);
                anchor-name: --active-page;
            }
        }
    }
}

aside {
    display: flex;
    align-items: center;
    gap: var(--space-medium);
    margin-left: auto;

    form {
        position: relative;

        @media (max-width: 800px) {
            display: none;
        }

        input {
            border: 1px solid var(--border-primary);
            border-radius: 9999px;
            height: 2.2rem;
            padding: 0.25rem 0.75rem;
            font-size: var(--text-small);
            background-color: var(--background-secondary);
            color: var(--text-primary);
            width: 100%;
            max-width: 10rem;
        }
    }
}
</style>