import { Component, OnInit } from '@angular/core';
import { BookBasic } from 'src/models/book-basic.model';
import { ProductBasic } from 'src/models/product-basic.model';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {

  constructor() { }

  brStranice: number;
  products: ProductBasic[] = [];

  ngOnInit(): void {
    this.brStranice = 0;
    
    const path = 'https://cdn.pixabay.com/photo/2015/06/02/12/59/book-794978_1280.jpg';
    const product = new ProductBasic('1234', "Alhemicar", "Vulkan", 11, 1230, path, "ostalo");
    const book = new BookBasic('1234', "Alhemicar", "Laguna", 11, 1230, path, "knjiga za iznajmljivanje", "Paulo Koeljo", "Psihologija");
    this.products.push(product);
    this.products.push(product);
    this.products.push(book);
    this.products.push(product);
    this.products.push(product);
    this.products.push(book);
    this.products.push(book);
  }

}
