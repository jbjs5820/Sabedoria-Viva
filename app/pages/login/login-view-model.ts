import { Observable, Frame, alert } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';

export class LoginViewModel extends Observable {
    private _email: string = '';
    private _password: string = '';
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

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        if (this._isLoading !== value) {
            this._isLoading = value;
            this.notifyPropertyChange('isLoading', value);
        }
    }

    async onEmailLogin() {
        if (!this.email || !this.password) {
            await alert({
                title: "Erro",
                message: "Por favor, preencha todos os campos",
                okButtonText: "OK"
            });
            return;
        }

        try {
            this.isLoading = true;
            const { data, error } = await AuthService.getInstance().loginWithEmail(
                this.email,
                this.password
            );

            if (error) throw error;

            Frame.topmost().navigate({
                moduleName: "pages/home/home-page",
                clearHistory: true
            });
        } catch (error) {
            console.error('Login error:', error);
            await alert({
                title: "Erro no Login",
                message: error.message || "Ocorreu um erro ao tentar entrar",
                okButtonText: "OK"
            });
        } finally {
            this.isLoading = false;
        }
    }

    onRegister() {
        Frame.topmost().navigate("pages/register/register-page");
    }
}