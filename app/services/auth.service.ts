import { Http } from '@nativescript/core';
import { SocialLogin } from '@nativescript/social-login';

const SUPABASE_URL = 'https://iztvqnjsqnebozcjcuik.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6dHZxbmpzcW5lYm96Y2pjdWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1MzcwODEsImV4cCI6MjA0ODExMzA4MX0.f5qQJOw-9Gm57rNwWc2u6-qQrssdlJ9BrO0hpdTf9nI';

export class AuthService {
    private static instance: AuthService;
    private socialLogin: SocialLogin;

    private constructor() {
        this.socialLogin = new SocialLogin();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async loginWithEmail(email: string, password: string) {
        try {
            const response = await Http.request({
                url: `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Content-Type': 'application/json'
                },
                content: JSON.stringify({ email, password })
            });

            const data = JSON.parse(response.content.toString());
            if (response.statusCode >= 400) {
                throw new Error(data.error_description || data.msg || 'Authentication failed');
            }

            global.token = data.access_token;
            return { data, error: null };
        } catch (error) {
            console.error('Email login error:', error);
            return { data: null, error };
        }
    }

    async signOut() {
        try {
            const response = await Http.request({
                url: `${SUPABASE_URL}/auth/v1/logout`,
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${global.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.statusCode >= 400) {
                throw new Error('Logout failed');
            }

            global.token = '';
            return { error: null };
        } catch (error) {
            return { error };
        }
    }
}