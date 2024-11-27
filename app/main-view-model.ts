import { Observable, Frame, alert } from '@nativescript/core';

export class MainViewModel extends Observable {
    private _email: string = '';
    private _password: string = '';
    private _message: string = '';

    constructor() {
        super();
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        if (this._email !== value) {
            this._email = value;
            this.notifyPropertyChange('email', value);
        }
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        if (this._password !== value) {
            this._password = value;
            this.notifyPropertyChange('password', value);
        }
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        if (this._message !== value) {
            this._message = value;
            this.notifyPropertyChange('message', value);
        }
    }

    async onLogin() {
        if (!this.email || !this.password) {
            this.message = "Por favor, preencha todos os campos";
            return;
        }

        try {
            // Here we'll integrate with Supabase
            await alert({
                title: "Login",
                message: "Implementação do login em andamento",
                okButtonText: "OK"
            });
        } catch (error) {
            console.error('Login error:', error);
            this.message = "Erro ao fazer login. Tente novamente.";
        }
    }
}