import { computed, ref }  from 'vue';
import { defineStore } from 'pinia';
import {
    authApi,
    type AuthSuccessResponse,
    type SubscriptionTier,
    type User,
} from '@/api/auth';
import { registerAuthStore } from '@/api/client';

const STORAGE_KEY = 'innebandylab.auth.v1';

interface PersistedState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
}

const readStoredState = (): PersistedState => {
    if (typeof window === 'undefined') {
        return {
            user: null,
            accessToken: null,
            refreshToken: null,
        };
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return {
                user: null,
                accessToken: null,
                refreshToken: null,
            };
        }
        return JSON.parse(raw) as PersistedState;
    } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        return {
            user: null,
            accessToken: null,
            refreshToken: null,
        };
    }
}

const writeStoredState = (state: PersistedState) => {
    if (typeof window === 'undefined') {
        return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const accessToken = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);

    const isAuthenticated = computed(() => !!user.value);
    const tier = computed<SubscriptionTier | null>(() => user.value?.tier || null);
    const isPro = computed(() => tier.value === 'pro' || tier.value === 'club');
    const isClub = computed(() => tier.value === 'club');
    const isAdmin = computed(() => false); // Placeholder for future admin implementation

    const persist = () => {
        writeStoredState({
            user: user.value,
            accessToken: accessToken.value,
            refreshToken: refreshToken.value,
        });
    };

    const applySuccessResponse = (data: AuthSuccessResponse) => {
        user.value = data.user;
        accessToken.value = data.accessToken;
        refreshToken.value = data.refreshToken;
        persist();
    };

    const setAccessToken = (token: string) => {
        accessToken.value = token;
        persist();
    };

    const setTokens = (access: string, refresh: string) => {
        accessToken.value = access;
        refreshToken.value = refresh;
        persist();
    };

    const loadStoredState = () => {
        const stored = readStoredState();
        user.value = stored.user;
        accessToken.value = stored.accessToken;
        refreshToken.value = stored.refreshToken;
    };

    const login = async (email: string, password: string) => {
        const response = await authApi.login(email, password);
        applySuccessResponse(response);
        return response.user;
    };

    const register = async (email: string, password: string, name: string) => {
        const response = await authApi.register(email, password, name);
        applySuccessResponse(response);
        return response.user;
    };

    const logout = async () => {
        try {
            if (refreshToken.value) {
                await authApi.logout(refreshToken.value);
            }
        } catch(e) {
            console.error('Error during logout:', e);
        } finally {
            user.value = null;
            accessToken.value = null;
            refreshToken.value = null;
            persist();
        }
    };

    const updateUser = async (updated: Partial<User>) => {
        if (user.value) {
            user.value = { ...user.value, ...updated };
            persist();
        }
    };

    const decodeJWTPayload = (token: string): Record<string, unknown> | null => {
        try {
            const b64 = token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(b64));
        } catch {
            return null;
        }
    };

    const refreshTokens = async () => {
        if (!refreshToken.value) {
            return;
        }
        const response = await authApi.refreshToken(refreshToken.value);
        setTokens(response.accessToken, response.refreshToken);

        const payload = decodeJWTPayload(response.accessToken);
        if (payload?.tier && user.value) {
            user.value = { ...user.value, tier: payload.tier as SubscriptionTier };
            persist();
        }
    };

    registerAuthStore(() => ({
        accessToken: accessToken.value,
        refreshToken: refreshToken.value,
        setAccessToken: (token: string) => setAccessToken(token),
        setTokens,
        logout,
    }));

    return {
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        tier,
        isPro,
        isClub,
        isAdmin,
        login,
        register,
        logout,
        refreshTokens,
        loadStoredState,
        updateUser,
    }
});