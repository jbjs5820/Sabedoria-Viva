import { Observable, Frame, alert } from '@nativescript/core';
import { getProfile, updateProfile } from '../../services/supabase';

export class ProfileViewModel extends Observable {
    private _name: string = '';
    private _age: number = null;
    private _location: string = '';
    private _linkedinUrl: string = '';
    private _bio: string = '';
    private _interests: string[] = [];
    private _isSaving: boolean = false;
    private _profileImage: string = '~/images/default-profile.png';

    constructor() {
        super();
        this.loadProfile();
    }

    // Getters and Setters
    get name(): string { return this._name; }
    set name(value: string) {
        if (this._name !== value) {
            this._name = value;
            this.notifyPropertyChange('name', value);
        }
    }

    get age(): number { return this._age; }
    set age(value: number) {
        if (this._age !== value) {
            this._age = value;
            this.notifyPropertyChange('age', value);
        }
    }

    get location(): string { return this._location; }
    set location(value: string) {
        if (this._location !== value) {
            this._location = value;
            this.notifyPropertyChange('location', value);
        }
    }

    get linkedinUrl(): string { return this._linkedinUrl; }
    set linkedinUrl(value: string) {
        if (this._linkedinUrl !== value) {
            this._linkedinUrl = value;
            this.notifyPropertyChange('linkedinUrl', value);
        }
    }

    get bio(): string { return this._bio; }
    set bio(value: string) {
        if (this._bio !== value) {
            this._bio = value;
            this.notifyPropertyChange('bio', value);
        }
    }

    get interests(): string[] { return this._interests; }
    set interests(value: string[]) {
        if (this._interests !== value) {
            this._interests = value;
            this.notifyPropertyChange('interests', value);
        }
    }

    get isSaving(): boolean { return this._isSaving; }
    set isSaving(value: boolean) {
        if (this._isSaving !== value) {
            this._isSaving = value;
            this.notifyPropertyChange('isSaving', value);
        }
    }

    get profileImage(): string { return this._profileImage; }
    set profileImage(value: string) {
        if (this._profileImage !== value) {
            this._profileImage = value;
            this.notifyPropertyChange('profileImage', value);
        }
    }

    async loadProfile() {
        try {
            const { data, error } = await getProfile();
            if (error) throw error;

            if (data) {
                this.name = data.name || '';
                this.age = data.age || null;
                this.location = data.location || '';
                this.linkedinUrl = data.linkedin_url || '';
                this.bio = data.bio || '';
                this.interests = data.interests || [];
                if (data.avatar_url) {
                    this.profileImage = data.avatar_url;
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            await alert({
                title: "Erro",
                message: "Não foi possível carregar seu perfil",
                okButtonText: "OK"
            });
        }
    }

    async onSave() {
        try {
            this.isSaving = true;
            const profileData = {
                name: this.name,
                age: this.age,
                location: this.location,
                linkedin_url: this.linkedinUrl,
                bio: this.bio,
                interests: this.interests
            };

            const { error } = await updateProfile(profileData);
            if (error) throw error;

            await alert({
                title: "Sucesso",
                message: "Perfil atualizado com sucesso!",
                okButtonText: "OK"
            });
        } catch (error) {
            console.error('Error saving profile:', error);
            await alert({
                title: "Erro",
                message: "Não foi possível salvar as alterações",
                okButtonText: "OK"
            });
        } finally {
            this.isSaving = false;
        }
    }

    onLogout() {
        Frame.topmost().navigate({
            moduleName: "pages/login/login-page",
            clearHistory: true
        });
    }

    onInterestTap(args) {
        const interest = args.object.text;
        const index = this.interests.indexOf(interest);
        if (index > -1) {
            this.interests = this.interests.filter(i => i !== interest);
        }
    }
}