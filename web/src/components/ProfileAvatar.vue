<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const showUserMenu = ref(false);

const userInitials = computed(() => {
    const name = authStore.user?.name ?? '';
    return name.split(' ').map((part: string) => part[0]).join('').toUpperCase();
});

const closeUserMenu = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-avatar')) {
        showUserMenu.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', closeUserMenu);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', closeUserMenu);
});
</script>

<template>
    <div class="profile-avatar">
        <button
            :title="authStore.user?.name"
            :aria-expanded="showUserMenu"
            aria-haspopup="true"
            @click.stop="showUserMenu = !showUserMenu"
        >
            {{ userInitials }}
        </button>

        <div v-if="showUserMenu" class="user-menu">
            <ul>
                <li><a href="/profile">Profile</a></li>
                <li><a href="/settings">Settings</a></li>
                <li><button @click="authStore.logout()">Logout</button></li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="scss">
.profile-avatar {
    position: relative;

    & > button {
        align-items: center;
        background-color: var(--text-primary);
        border: 0;
        border-radius: 9999px;
        color: var(--accent-primary);
        cursor: pointer;
        display: inline-flex;
        font-size: var(--text-small);
        font-weight: bold;
        height: 2.2rem;
        justify-content: center;
        width: 2.2rem;
    }

    .user-menu {
        background-color: var(--background-primary);
        border: 1px solid var(--border-primary);
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 0.5rem 0;
        position: absolute;
        right: 0;
        top: calc(100% + 0.5rem);
        z-index: 10000;

        ul {
            list-style: none;
            margin: 0;
            padding: 0;

            li {
                a,
                button {
                    color: var(--text-primary);
                    display: block;
                    padding: 0.5rem 1rem;
                    text-decoration: none;
                    width: 100%;
                    text-align: left;

                    &:hover {
                        background-color: var(--background-secondary);
                    }
                }
            }
        }
    }
}
</style>