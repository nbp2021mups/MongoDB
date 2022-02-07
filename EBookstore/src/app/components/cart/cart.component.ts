import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductBasicSubdocument } from 'src/models/product-basic-subdocument.model';
import { User } from 'src/models/user.model';
import { AuthService } from 'src/services/auth.service';
import { Cart } from './cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  public cart: Cart = new Cart();
  public loggedUser: User = null;
  public hasMore: boolean = false;
  private count: number = 4;
  public changes: { done: boolean, cena?: number, brojProizvoda?: number, obrisani?: Map<string, boolean>, promenjeni?: Map<string, number> } = { done: false, obrisani: new Map<string, boolean>(), promenjeni: new Map<string, number>() };

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnDestroy(): void {
    if(this.changes.done)
      this.http.put('http://localhost:3000/users/update-cart/' + this.cart._id, { ...this.changes })
      .subscribe({
        next: response => {
          this.changes = { done: false, obrisani: new Map<string, boolean>(), promenjeni: new Map<string, number>() };
      },
        error: err => console.log(err)
      });
  }

  ngOnInit(): void {
    this.authService.user.subscribe({
      next: user => {
        this.loggedUser = user;
        this.loadCart();
      },
      error: err => console.log(err)
    });
  }

  loadCart(): void {
    this.http.get('http://localhost:3000/users/get-cart/' + this.loggedUser.id, {
      params: {
        ['skip']: 0,
        ['limit']: this.count
      }
    }).subscribe({
      next: (data: { poruka: string, sadrzaj: Cart}) => {
        this.cart = data.sadrzaj;
        this.hasMore = this.count == data.sadrzaj.proizvodi.length;
      },
      error: err => console.log(err)
    });
  }

  loadMore(): void{
    this.http.get('http://localhost:3000/users/get-more-products-from-cart/' + this.cart._id, {
      params: {
        ['skip']: this.cart.proizvodi.length,
        ['limit']: this.count
      }
    }).subscribe({
      next: (data: { poruka: string, sadrzaj: Array<ProductBasicSubdocument>
    }) => {
        this.cart.proizvodi = [...this.cart.proizvodi, ...data.sadrzaj];
        this.hasMore = this.count == data.sadrzaj.length;
      },
      error: err => console.log(err)
    });
  }

  changeGeneric(valueDiff: number, price: number): void{
    this.cart.brojProizvoda += valueDiff;
    this.cart.cena += price * valueDiff;

    this.changes.brojProizvoda = this.cart.brojProizvoda;
    this.changes.cena = this.cart.cena;
    this.changes.done = true;
  }

  changeAmount(valueDiff: number, index: number): void {
    this.changeGeneric(valueDiff, this.cart.proizvodi[index].cena);

    this.changes.promenjeni[this.cart.proizvodi[index].id] = this.changes.promenjeni[this.cart.proizvodi[index].id] != null ? this.changes.promenjeni[this.cart.proizvodi[index].id] + valueDiff : valueDiff;
    this.changes.done = true;
  }

  removeProduct(index: number): void {
    this.changeGeneric(-this.cart.proizvodi[index].kolicina, this.cart.proizvodi[index].cena);

    this.changes.obrisani[this.cart.proizvodi[index].id] = true;
    this.changes.promenjeni.delete(this.cart.proizvodi[index].id);
    this.changes.done = true;

    this.cart.proizvodi = this.cart.proizvodi.filter((el, ind) => ind != index);
  }

  async order(): Promise<void>{
    this.http.put('http://localhost:3000/users/order/' + this.cart._id, { ...this.changes })
    .subscribe({
      next: response => {
        this.changes = { done: false, obrisani: new Map<string, boolean>(), promenjeni: new Map<string, number>() };
    },
      error: err => console.log(err)
    });
  }
}
