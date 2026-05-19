import { apiClient } from './client';

export type SubscriptionTier = 'free' | 'pro' | 'club';

export interface User {
    id: string;
    email: string;
    name: string;
    tier: SubscriptionTier;
}

export interface AuthSuccessResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export const authApi = {
    register: async (
        email: string,
        password: string,
        name: string
    ): Promise<AuthSuccessResponse> => {
        return await apiClient.post<AuthSuccessResponse>('/auth/register', { email, password, name });
    },
    login: async (
        email: string,
        password: string
    ): Promise<AuthSuccessResponse> => {
        return await apiClient.post<AuthSuccessResponse>('/auth/login', { email, password });
    },
    refreshToken: async (
        refreshToken: string
    ): Promise<RefreshTokenResponse> => {
        return await apiClient.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
    },
    logout: async (refreshToken: string): Promise<void> => {
        await apiClient.post('/auth/logout', { refreshToken });
    },
    updateProfile: async (data: {
        name?: string;
        currentPassword?: string;
        newPassword?: string;
    }): Promise<User> => {
        return await apiClient.put<User>('/auth/profile', data);
    },
};