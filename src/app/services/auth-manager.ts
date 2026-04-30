import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Preferences } from '@capacitor/preferences';
import { firstValueFrom } from 'rxjs';
import { AuthResponse } from '../types/auth.model';


@Injectable({
  providedIn: 'root',
})
export class AuthManager {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  constructor() {
    GoogleAuth.initialize(); // Inicializar Google Auth (necesario en la web/móvil)

  }

  async loginWithGoogle() {
    try {
      // Pedir token a Google nativo
      const googleUser = await GoogleAuth.signIn();
      const idToken = googleUser.authentication.idToken;

      // Enviar a nuestro backend
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/auth/google`, { idToken })
      );

      // Guardar tokens de forma persistente
      await this.saveSession(response);

      // Lógica de Onboarding que pediste
      if (response.isNewUser) {
        this.router.navigate(['/onboarding']);

      } else {
        this.router.navigate(['/home']);

      }

      return response;

    } catch (error) {

      console.error('Error en login:', error);
      throw error;

    }
  }

  private async saveSession(data: AuthResponse) {
    await Preferences.set({
      key: 'access_token',
      value: data.accessToken
    });
    await Preferences.set({
      key: 'refresh_token',
      value: data.refreshToken
    });
    await Preferences.set({
      key: 'user',
      value: JSON.stringify(data.user)
    });
  }

  async getAccessToken() {
    const { value } = await Preferences.get({ key: 'access_token' });
    return value;
  }

  async logout() {
    await GoogleAuth.signOut();
    await Preferences.clear();
    this.router.navigate(['/login']);
  }
}
