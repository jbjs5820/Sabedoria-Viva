import { Observable, Frame, alert } from '@nativescript/core';
import { signOut } from '~/services/supabase';

export class HomeViewModel extends Observable {
    constructor() {
        super();
    }

    async onLogout() {
        try {
            const { error } = await signOut(global.token || '');
            if (error) throw error;

            Frame.topmost().navigate({
                moduleName: "~/pages/login/login-page",
                clearHistory: true
            });
        } catch (error) {
            console.error('Logout error:', error);
            await alert({
                title: "Erro",
                message: "Erro ao fazer logout",
                okButtonText: "OK"
            });
        }
    }
}