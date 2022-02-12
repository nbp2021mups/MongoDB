import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderBasic } from 'src/models/order-basic.model';
import { ProductBasicSubdocument } from 'src/models/product-basic-subdocument.model';
import { UserInfo } from 'src/models/user-info.model';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-order-single',
  templateUrl: './order-single.component.html',
  styleUrls: ['./order-single.component.css']
})
export class OrderSingleComponent implements OnInit {

  @Input() order: OrderBasic = new OrderBasic();
  @Input() category: string = 'user';

  @Output() orderDeleted: EventEmitter<string> = new EventEmitter<string>();

  public count: number = 5;
  public hasMoreProducts: boolean = false;

  public displayUser: boolean = false;
  public displayProducts: boolean = false;

  public loadedProducts: boolean = false;
  public loadedUser: boolean = false;

  public user: UserInfo = null;

  constructor(private http: HttpClient, private matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  toggleProducts() : void {
    this.displayProducts = !this.displayProducts;
    if(this.displayProducts && !this.loadedProducts)
    {
      this.loadedProducts = true;
      this.loadMoreProducts();
    }
  }

  toggleUser() : void {
    this.displayUser = !this.displayUser;
    if(this.displayUser && !this.loadedUser)
    {
      this.loadedUser = true;
      this.http.get('http://localhost:3000/orders/get-user-info/' + this.order.korisnik)
      .subscribe({
        next: (data: { poruka: string, sadrzaj: UserInfo }) => this.user = data.sadrzaj,
        error: err => console.log(err)
    });
    }
  }

  loadMoreProducts() : void {
    this.http.get('http://localhost:3000/orders/get-products/' + this.order._id,{
      params:{
        ['limit']: this.count,
        ['skip']: this.order.proizvodi ? this.order.proizvodi.length : 0,
      }
    }).subscribe({
      next: (data: { poruka: string, sadrzaj: Array<ProductBasicSubdocument> }) => {
        if(this.order.proizvodi)
          this.order.proizvodi = [...this.order.proizvodi, ...data.sadrzaj];
        else
          this.order.proizvodi = data.sadrzaj;
        this.hasMoreProducts = data.sadrzaj.length == this.count;
      },
      error: err => console.log(err)
    });
  }

  acceptOrder(): void {
    const dialog = this.matDialog.open(LoadingDialogComponent, {
      data: {
        content: 'Proveravaju se podaci! Molimo sačekajte...'
      }
    });

    this.http.patch("http://localhost:3000/orders/accept", { orderID: this.order._id })
    .subscribe({
      next: response => {
        this.order.status.potvrdjena = 1;
        dialog.componentInstance.response('Narudžbina je uspešno potvrđena!', true);
      },
      error: response => {
        console.log(response)
        dialog.componentInstance.response(response.error.sadrzaj, false);
    }});
  }

  declineOrder() : void {
    const dialog = this.matDialog.open(LoadingDialogComponent);

    this.http.patch("http://localhost:3000/orders/decline", { orderID: this.order._id })
    .subscribe({
      next: response => {
        console.log(response);
        this.order.status.potvrdjena = -1;
        dialog.componentInstance.response('Narudžbina je uspešno odbijena!', true);
      },
      error: response =>  {
        console.log(response)
        dialog.componentInstance.response(response.error.sadrzaj, false);
    }});
  }

  deleteOrder(): void {
    this.orderDeleted.emit(this.order._id);
  }
}
