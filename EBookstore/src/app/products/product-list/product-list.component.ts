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
  onObrisanProizvod(id){
    console.log(id);
    const index=this.products.findIndex(product=>{
      return product._id==id;
    })
    console.log(index);
    if(index!=-1)
      this.products.splice(index,1);
  }

}
