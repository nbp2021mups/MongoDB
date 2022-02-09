import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OrderBasic } from 'src/models/order-basic.model';
import { User } from 'src/models/user.model';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  public orders: Array<OrderBasic> = new Array<OrderBasic>();
  public filter: { kategorija: string, korisnik?: string, kompanija?: string };
  public loggedUser: User;
  public hasMore: boolean = false;

  private count: number = 10;

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user.subscribe({
      next: (user) => {
        this.loggedUser = user;
        if(this.loggedUser.role == 'bookstore')
          this.filter = { kompanija: this.loggedUser.id, kategorija: "kompanija" };
        else
          this.filter = { korisnik: this.loggedUser.id, kategorija: "korisnik" };
        this.loadMore();
      },
      error: err => console.log(err)
    }).unsubscribe();
  }

  loadMore(): void {
    this.http.get('http://localhost:3000/orders/', {
          params: {
            ['filter']: JSON.stringify(this.filter),
            ['skip']: 0,
            ['limit']: this.count,
            ['select']: 'cena brojProizvoda potvrdjena korisnik kompanija datum',
            ['sort']: JSON.stringify({ datum: -1 })
          }
        }).subscribe({ next: (data: {poruka:string, sadrzaj: Array<OrderBasic>}) => {
            this.orders = [...this.orders, ...data.sadrzaj];
            this.hasMore = data.sadrzaj.length == this.count;
          },
          error: err => console.log(err)
        });
  }

}
