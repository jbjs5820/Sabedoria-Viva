import { Http } from '@nativescript/core';

const SUPABASE_URL = 'https://iztvqnjsqnebozcjcuik.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6dHZxbmpzcW5lYm96Y2pjdWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1MzcwODEsImV4cCI6MjA0ODExMzA4MX0.f5qQJOw-9Gm57rNwWc2u6-qQrssdlJ9BrO0hpdTf9nI';

const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${global.token || ''}`
};

export interface AuthResponse {
    access_token?: string;
    token_type?: string;
    expires_in?: number;
    refresh_token?: string;
    user?: any;
    error?: any;
}

export async function signInWithEmail(email: string, password: string): Promise<{ data: AuthResponse | null; error: any }> {
    try {
        const response = await Http.request({
            url: `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Content-Type': 'application/json'
            },
            content: JSON.stringify({ email, password })
        });

        const data = JSON.parse(response.content.toString());
        
        if (response.statusCode >= 400) {
            throw new Error(data.error_description || data.msg || 'An error occurred during sign in');
        }

        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getProfile(): Promise<{ data: any; error: any }> {
    try {
        const response = await Http.request({
            url: `${SUPABASE_URL}/rest/v1/profiles?select=*`,
            method: 'GET',
            headers
        });

        const data = JSON.parse(response.content.toString());
        
        if (response.statusCode >= 400) {
            throw new Error('Failed to fetch profile');
        }

        return { data: data[0], error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function updateProfile(profile: any): Promise<{ error: any }> {
    try {
        const response = await Http.request({
            url: `${SUPABASE_URL}/rest/v1/profiles`,
            method: 'PATCH',
            headers,
            content: JSON.stringify(profile)
        });

        if (response.statusCode >= 400) {
            throw new Error('Failed to update profile');
        }

        return { error: null };
    } catch (error) {
        return { error };
    }
}

export async function signOut(): Promise<{ error: any }> {
    try {
        const response = await Http.request({
            url: `${SUPABASE_URL}/auth/v1/logout`,
            method: 'POST',
            headers
        });

        if (response.statusCode >= 400) {
            throw new Error('Failed to sign out');
        }

        return { error: null };
    } catch (error) {
        return { error };
    }
}