import { Component, Input, OnInit } from '@angular/core';
import { ProductBasic } from 'src/models/product-basic.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  @Input()
  products: ProductBasic[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
