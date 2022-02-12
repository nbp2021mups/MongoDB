import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  userType: string = null;
  id: string = null;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.resolveUser();
  }

  resolveUser() {
    this.authService.user.subscribe(user => {
      if(!user){
        this.userType = 'none';
        this.id = null;
      }
      else if(user.role == 'user'){
        this.userType = 'user';
        this.id = user.id;
      }
      else if(user.role == 'bookstore'){
        this.userType = 'bookstore';
        this.id = user.id;
      }
    }).unsubscribe();
  }

  register(){
    this.router.navigate(['registracija']);
  }

  bookstores(){
    this.router.navigate(['knjizare']);
  }

  books(){
    this.router.navigate(['knjige']);
  }

  bookstoreBooks() {
    this.router.navigate(['knjige', this.id]);
  }

  bookstoreProducts() {
    this.router.navigate(['proizvodi', this.id]);
  }

  rent(){
    console.log('ovde');
    this.router.navigate(['knjige-za-iznajmljivanje']);
  }

  products(){
    this.router.navigate(['proizvodi']);
  }

  onAddProduct(){
    console.log('obde');
    this.router.navigate(['novi-proizvod']);
  }
}
