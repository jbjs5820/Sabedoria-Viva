import { Application } from '@nativescript/core';
import { AuthService } from './services/auth.service';

global.token = '';

// Initialize AuthService
AuthService.getInstance();

Application.run({ moduleName: 'app-root' });