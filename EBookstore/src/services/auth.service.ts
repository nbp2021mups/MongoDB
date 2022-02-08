import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from 'src/models/user.model';
import { LoggedUser } from 'src/models/loggedUser.model';
import { BookstoreUser } from 'src/models/bookstoreUser.model';

interface LoginData {
    poruka: string,
    sadrzaj : {
        id: string,
        username: string,
        role: string,
        token: string,
        expiration: number,
        ime? : string,
        prezime? : string,
        naziv?: string
    }
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
            const expDate = new Date(new Date().getTime() + respData.sadrzaj.expiration * 60 * 1000);
            let user: User = null;
            if(respData.sadrzaj.role == 'user'){
              user = new LoggedUser(respData.sadrzaj.id, respData.sadrzaj.username, respData.sadrzaj.role,
                respData.sadrzaj.token, expDate, respData.sadrzaj.ime, respData.sadrzaj.prezime);
            } else {
              user = new BookstoreUser(respData.sadrzaj.id, respData.sadrzaj.username, respData.sadrzaj.role,
                respData.sadrzaj.token, expDate, respData.sadrzaj.naziv);
            }
           /*  const user = new User(respData.sadrzaj.id, respData.sadrzaj.username, respData.sadrzaj.role,
                respData.sadrzaj.token, expDate); */
            this.user.next(user);
            this.autoLogout(respData.sadrzaj.expiration * 60 * 1000);
            localStorage.setItem('logged-user', JSON.stringify(user));
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
      id: string;
      username: string;
      role: string;
      _token: string;
      _tokenExpDate: Date,
      ime?: string,
      prezime?: string,
      naziv?: string

    } = JSON.parse(localStorage.getItem('logged-user'));
    if (!loggedUser) {
      return;
    }

    let user: User = null;
    if(loggedUser.role == 'user')
      user = new LoggedUser(loggedUser.id,loggedUser.username, loggedUser.role, loggedUser._token,new Date(loggedUser._tokenExpDate), loggedUser.ime, loggedUser.prezime);
    else
      user = new BookstoreUser(loggedUser.id,loggedUser.username, loggedUser.role, loggedUser._token,new Date(loggedUser._tokenExpDate), loggedUser.naziv);

    this.user.next(user);
    const expTimer =
      new Date(loggedUser._tokenExpDate).getTime() - new Date().getTime();
    this.autoLogout(expTimer);
  }

  autoLogout(timer: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, timer);
  }


  registerUser(userData: FormData) {
    console.log(userData.get('username'), userData.get('lozinka'))

    return this.http.post<any>("http://localhost:3000/auth/register-user", {
      email : userData.get('email'),
      username : userData.get('username'),
      lozinka : userData.get('lozinka'),
      telefon : userData.get('telefon'),
      ime : userData.get('ime'),
      prezime : userData.get('prezime'),
      adresa : userData.get('adresa'),
    });


  }

  registerBookstore(bookstoreData: FormData) {
    return this.http.post<any>("http://localhost:3000/auth/register-company", bookstoreData);
  }

}
