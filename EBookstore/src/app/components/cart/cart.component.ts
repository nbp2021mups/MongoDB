import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProductBasic } from 'src/models/product-basic.model';
import { User } from 'src/models/user.model';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  public products: Array<ProductBasic> = new Array<ProductBasic>();
  public price: number = 0;
  public productsOrdered: number = 0;
  public loggedUser: User = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    // this.authService.user.subscribe(user=>{
    //   this.loggedUser = user;
    //   this.http.get('http://localhost:3000/users/get-cart/' + user.id).subscribe(data=>{
    //   })
    // })
  }
}
