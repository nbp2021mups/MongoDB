import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
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

  rent(){
    this.router.navigate(['iznajmljivanje']);
  }

  products(){
    this.router.navigate(['proizvodi']);
  }
}
