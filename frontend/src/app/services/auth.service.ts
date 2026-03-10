import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface User {
  id: number;
  email: string;
  name: string;
  roleId: number;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private tokenSubject: BehaviorSubject<string | null>;
  private userSubject: BehaviorSubject<User | null>;

  public token$: Observable<string | null>;
  public user$: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    this.tokenSubject = new BehaviorSubject<string | null>(token);
    this.userSubject = new BehaviorSubject<User | null>(parsedUser);
    
    this.token$ = this.tokenSubject.asObservable();
    this.user$ = this.userSubject.asObservable();
  }

  public get tokenValue(): string | null {
    return this.tokenSubject.value;
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  public get isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  register(email: string, password: string, name: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password, name })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.tokenSubject.next(response.token);
          this.userSubject.next(response.user);
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.tokenSubject.next(response.token);
          this.userSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSubject.next(null);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
