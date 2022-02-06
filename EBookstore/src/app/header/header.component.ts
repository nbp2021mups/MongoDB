import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  ulogovan: boolean;
  tip: string;
  private loggedUserSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedUserSub = this.authService.user.subscribe(user => {
      if(user){
        this.ulogovan = true;
        this.tip = user.role;
      } else {
        this.ulogovan = false;
        this.tip = null;
      }
    });
  }


  onShoppingCartClicked() {
    console.log('korpa');
  }

  onLogoutClicked() {
    this.authService.logout();
  }


  ngOnDestroy(): void {
      this.loggedUserSub.unsubscribe();
  }
}
