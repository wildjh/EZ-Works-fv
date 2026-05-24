import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RolCodigo,
  UsuarioResponse,
} from '../models/api.models';

const TOKEN_KEY = 'ezworks_access_token';
const REFRESH_KEY = 'ezworks_refresh_token';
const ROLES_KEY = 'ezworks_roles';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly base = `${environment.apiUrl}/api/auth`;

  readonly currentUser = signal<UsuarioResponse | null>(null);
  readonly roles = signal<RolCodigo[]>(this.loadRoles());
  readonly isLoggedIn = computed(() => !!this.getToken());

  login(body: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.base}/login`, body).pipe(
      tap((res) => this.persistSession(res))
    );
  }

  register(body: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.base}/register`, body).pipe(
      tap((res) => this.persistSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(ROLES_KEY);
    this.currentUser.set(null);
    this.roles.set([]);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  hasRole(role: RolCodigo): boolean {
    return this.roles().includes(role);
  }

  loadProfile() {
    return this.http
      .get<UsuarioResponse>(`${environment.apiUrl}/api/usuarios/me`)
      .pipe(tap((u) => {
        this.currentUser.set(u);
        this.roles.set(u.roles);
        localStorage.setItem(ROLES_KEY, JSON.stringify(u.roles));
      }));
  }

  private persistSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    localStorage.setItem(REFRESH_KEY, res.refreshToken);
    const roles = res.roles as RolCodigo[];
    localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
    this.roles.set(roles);
  }

  private loadRoles(): RolCodigo[] {
    try {
      return JSON.parse(localStorage.getItem(ROLES_KEY) ?? '[]') as RolCodigo[];
    } catch {
      return [];
    }
  }
}
