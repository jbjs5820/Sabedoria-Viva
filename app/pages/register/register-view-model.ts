import { Observable, Frame, alert } from '@nativescript/core';
import { signUp } from '~/services/supabase';

export class RegisterViewModel extends Observable {
    private _email: string = '';
    private _password: string = '';
    private _confirmPassword: string = '';
    private _isLoading: boolean = false;

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

    get confirmPassword(): string {
        return this._confirmPassword;
    }

    set confirmPassword(value: string) {
        if (this._confirmPassword !== value) {
            this._confirmPassword = value;
            this.notifyPropertyChange('confirmPassword', value);
        }
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        if (this._isLoading !== value) {
            this._isLoading = value;
            this.notifyPropertyChange('isLoading', value);
        }
    }

    async onRegister() {
        if (!this.email || !this.password || !this.confirmPassword) {
            await alert({
                title: "Erro",
                message: "Por favor, preencha todos os campos",
                okButtonText: "OK"
            });
            return;
        }

        if (this.password !== this.confirmPassword) {
            await alert({
                title: "Erro",
                message: "As senhas não coincidem",
                okButtonText: "OK"
            });
            return;
        }

        if (this.password.length < 6) {
            await alert({
                title: "Erro",
                message: "A senha deve ter pelo menos 6 caracteres",
                okButtonText: "OK"
            });
            return;
        }

        try {
            this.isLoading = true;
            const { data, error } = await signUp(this.email, this.password);

            if (error) throw error;

            await alert({
                title: "Sucesso",
                message: "Conta criada com sucesso! Por favor, faça login para continuar.",
                okButtonText: "OK"
            });

            Frame.topmost().goBack();
        } catch (error) {
            console.error('Registration error:', error);
            await alert({
                title: "Erro no Cadastro",
                message: error.message || "Ocorreu um erro ao criar sua conta",
                okButtonText: "OK"
            });
        } finally {
            this.isLoading = false;
        }
    }

    onLogin() {
        Frame.topmost().goBack();
    }
}