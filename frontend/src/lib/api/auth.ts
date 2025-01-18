'use server';

import { API_BASE_URL } from '../config';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types';
import { cookies } from 'next/headers';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to login');
    }

    const data = await response.json();
    
    // Set the auth token cookie
    const cookieStore = await cookies();
    cookieStore.set('authToken', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return data;
}

export async function logout(): Promise<void> {
    const cookieStore = await cookies();
    await cookieStore.delete('authToken');
}

export async function register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register');
    }

    return response.json();
}

export async function getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get user');
    }

    return response.json();
}
