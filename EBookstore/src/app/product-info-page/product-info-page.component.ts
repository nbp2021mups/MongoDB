import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductFull } from 'src/models/product-full.model';
import { AuthService } from 'src/services/auth.service';
import { ProductsService } from 'src/services/products.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';

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
  personal: boolean;

  constructor(private route: ActivatedRoute,
    private productService: ProductsService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog) { }


  ngOnInit(): void {

    this.paramsSub = this.route.params.subscribe(params => {
      this.productId = params['idProizvoda'];
    });


    this.productService.getProductById(this.productId).subscribe({
      next: response=>{
        this.product=response;
        console.log(this.product);
        this.authService.user.subscribe(user=>{
          if(!user){
            this.personal=false;
          }else{
            this.personal=user.id==this.product.poreklo.id;
          }
        }).unsubscribe();
        console.log(this.personal)
      },
      error: err=>{
        console.log(err);
      }
    })
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
  }

  onDeleteClicked(){

    let dialogWarning= this.dialog.open(WarningDialogComponent,
      { data :
        { pitanje : `Da li ste sigurni da želite da obrišete ovaj proizvod?`,
          potvrdna : 'Obriši'}
      });

    dialogWarning.afterClosed().subscribe(result=>{
      if(result=='true'){

        if(this.product.poreklo.ime){
          this.productService.deleteUserProduct(this.product._id, this.product.slika, this.product.poreklo.id).subscribe({
            next: response=>{

            },
            error: err=>{

            }
          });
        }
        else if(this.product.poreklo.naziv){
          console.log('ovde')
          this.productService.deleteCompanyProduct(this.product._id, this.product.slika, this.product.poreklo.id).subscribe({
            next: response=>{
              this.router.navigate(['/proizvodi', this.product.poreklo.id]);
            },
            error: err=>{

            }
          });
        }
      }
    });

  }

  onUpdateClicked(){
    this.router.navigate(['/izmena', this.product._id]);
  }

  onAddToCart(){
    this.authService.user.subscribe(user => {
      if(!user){
        this.router.navigate(['/prijavljivanje']);
        return;
      }
      if(user.role == 'bookstore'){
        return;
      }


      //ako je ulogovan obican korisnik
      this.productService.addToCart(user.id, this.product._id, 1).subscribe({
        next: resp => {

        },
        error: err => {
          console.log(err);
        }
      });
    }).unsubscribe();
  }

  onSendRequest(){

  }

}
