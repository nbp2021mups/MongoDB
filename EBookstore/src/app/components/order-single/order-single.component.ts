import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { OrderBasic } from 'src/models/order-basic.model';
import { ProductBasicSubdocument } from 'src/models/product-basic-subdocument.model';

@Component({
  selector: 'app-order-single',
  templateUrl: './order-single.component.html',
  styleUrls: ['./order-single.component.css']
})
export class OrderSingleComponent implements OnInit {

  @Input() order: OrderBasic = new OrderBasic();
  @Input() category: string = 'user';
  public count: number = 5;
  public hasMoreProducts: boolean = false;

  public displayUser: boolean = false;
  public displayProducts: boolean = false;

  public loadedProducts: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  toggleProducts() : void {
    this.displayProducts = !this.displayProducts;
    if( this.displayProducts && !this.loadedProducts)
    {
      this.loadedProducts = true;
      this.loadMoreProducts();
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

  confirmOrder(): void {

  }

}
