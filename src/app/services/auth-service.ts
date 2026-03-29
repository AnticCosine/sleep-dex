import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { DataSyncService } from './data-sync-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  private readonly jwt_token = 'auth_token';
  private ingredientgStorageKey = 'ingredientQuantities';
  private cookedStorageKey = 'cookedRecipes';
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient, private dataSync: DataSyncService) {
    this.checkStoredToken();

    this.handleOAuthCallback();
  }

  signInWithGoogle(): void {
    window.location.href = `${this.API}/auth/google`;
  }

  signOut(): void {
    localStorage.removeItem(this.jwt_token);
    //localStorage.removeItem(this.cookedStorageKey);
    //localStorage.removeItem(this.ingredientgStorageKey);
    this.loggedIn.next(false);
    window.location.href = '/';
  }

  getToken(): string | null {
    return localStorage.getItem(this.jwt_token);
  }

  private handleOAuthCallback() {
    const hash = window.location.hash;
    if (!hash.includes('auth/callback')) return;

    const queryString = hash.split('?')[1] ?? '';
    const params = new URLSearchParams(queryString);
    const token = params.get('token');
    if (!token) return;

    localStorage.setItem(this.jwt_token, token);
    this.loggedIn.next(true);
    window.history.replaceState({}, '', window.location.pathname);
    
    this.dataSync.syncOnLogin(token);
  }


  private checkStoredToken(): void {
    const token = localStorage.getItem(this.jwt_token);
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
 
      if (isExpired) {
        localStorage.removeItem(this.jwt_token);
        this.loggedIn.next(false);
      } else {
        this.loggedIn.next(true);
      }
    } catch {
      localStorage.removeItem(this.jwt_token);
    }

  }
}