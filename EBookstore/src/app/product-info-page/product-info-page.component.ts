import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductFull } from 'src/models/product-full.model';
import { ProductsService } from 'src/services/products.service';

@Component({
  selector: 'app-product-info-page',
  templateUrl: './product-info-page.component.html',
  styleUrls: ['./product-info-page.component.css']
})
export class ProductInfoPageComponent implements OnInit {
  imagePreview: string = '';
  paramsSub: Subscription;
  productId: string;
  product: ProductFull;

  constructor(private route: ActivatedRoute, private productService: ProductsService) { }

  ngOnInit(): void {

    this.paramsSub = this.route.params.subscribe(params => {
      this.productId = params['idProizvoda'];
    });

    this.productService.getProductById(this.productId).subscribe({
      next: response=>{
        this.product=response;
        console.log(this.product);
      },
      error: err=>{
        console.log(err);
      }
    })
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
}

}
