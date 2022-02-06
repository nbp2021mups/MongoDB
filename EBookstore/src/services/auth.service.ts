import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from 'src/models/user.model';

interface LoginData {
  id: number;
  username: string;
  token: string;
  expiration: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, lozinka: string) {
    return this.http
      .post<LoginData>('http://localhost:3000/auth/login', {
        username: username,
        lozinka: lozinka,
      })
      .pipe(
        tap((respData) => {
            console.log(respData);
            const expDate = new Date(new Date().getTime() + respData.expiration * 60 * 1000);
            /* this.user.next(user);
            this.autoLogout(respData.expiration * 60 * 1000);
            localStorage.setItem('logged-user', JSON.stringify(user)); */
        }));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/prijavljivanje']);
    localStorage.removeItem('logged-user');

    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
    }
  }

  autoLogin() {
    const loggedUser: {
      id: number;
      username: string;
      _token: string;
      _tokenExpDate: Date;
    } = JSON.parse(localStorage.getItem('logged-user'));
    if (!loggedUser) {
      return;
    }

    /* this.user.next(user);
    const expTimer =
      new Date(loggedUser._tokenExpDate).getTime() - new Date().getTime();
    this.autoLogout(expTimer); */
  }

  autoLogout(timer: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, timer);
  }
}
