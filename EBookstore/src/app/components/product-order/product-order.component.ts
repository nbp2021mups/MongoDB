import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductBasicSubdocument } from 'src/models/product-basic-subdocument.model';

@Component({
  selector: 'app-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.css']
})
export class ProductOrderComponent implements OnInit {

  @Input() public product: ProductBasicSubdocument;
  @Input() public displayOnly: boolean = false;
  @Output() amount = new EventEmitter<number>();
  @Output() remove = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  changeAmount(amount: number): void {
    if(amount < 1)
      return;
    this.amount.emit(amount - this.product.kolicina);
    this.product.kolicina = amount;
  }

  removeProduct(): void {
    this.remove.emit(this.product.id);
  }

}
