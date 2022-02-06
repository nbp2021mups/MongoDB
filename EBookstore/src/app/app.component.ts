import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'EBookstore';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
      this.authService.autoLogin();
  }
}
