import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { iif, Subscription } from 'rxjs';
import { ProductFull } from 'src/models/product-full.model';
import { AuthService } from 'src/services/auth.service';
import { ProductsService } from 'src/services/products.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import { LeaseDialogComponent } from '../lease-dialog/lease-dialog.component';
import { LeasesService } from 'src/services/leases.service';
import { KnjigaIznajmljivanjeBasic } from 'src/models/knjiga-iznajmljivanje-basic.model';
import { KnjigaIznajmljivanjeFull } from 'src/models/knjiga-iznajmljivanje-full.model';

@Component({
  selector: 'app-product-info-page',
  templateUrl: './product-info-page.component.html',
  styleUrls: ['./product-info-page.component.css']
})
export class ProductInfoPageComponent implements OnInit {
  error: string = '';
  success: string = '';
  imagePreview: string = '';
  paramsSub: Subscription;
  productId: string;
  product: ProductFull;
  personal: boolean;
  idLogUser: string;
  isReq: boolean;

  constructor(private route: ActivatedRoute,
    private productService: ProductsService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private leasesService : LeasesService) { }

  ngOnInit(): void {

    this.paramsSub = this.route.params.subscribe(params => {
      this.productId = params['idProizvoda'];
    });


    /* this.productService.getProductById(this.productId).subscribe({
      next: response=>{
        this.product=response;
        console.log(this.product);
        this.authService.user.subscribe(user=>{
          if(!user){
            this.personal=false;
          }else{
            this.personal=user.id==this.product.poreklo.id;
            this.idLogUser=user.id;
          }
        }).unsubscribe();
        console.log(this.personal)
      },
      error: err=>{
        console.log(err);
      }
    }); */

 


    this.authService.user.subscribe(user=>{

      if(user && user.role == 'user'){
        this.productService.getProductById(this.productId, user.id).subscribe({
          next: response=>{
            this.product=response;
            this.personal=user.id==this.product.poreklo.id;
          },
          error: err=>{
            console.log(err);
          }
        });
      }else {
        this.productService.getProductById(this.productId, null).subscribe({
          next: response=>{
            this.product=response;
            this.personal=user.id==this.product.poreklo.id;
          },
          error: err=>{
            console.log(err);
          }
        });
      }

      if(!user){
        this.personal=false;
      }else{
        this.idLogUser=user.id;
      }
    }).unsubscribe();
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
  }

  status() {
    return (this.product as KnjigaIznajmljivanjeFull).status;
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
              this.router.navigate(['/zajam']);
            },
            error: err=>{
              this.router.navigate(['/zajam']);
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
              this.router.navigate(['/proizvodi', this.product.poreklo.id]);
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

    let dialogLease= this.dialog.open(LeaseDialogComponent,
      { width: '400px',
        data :
        {
          potvrdna : 'Iznajmi'}
      });

    dialogLease.afterClosed().subscribe(result=>{
        if(result!='false'){
          this.leasesService.posaljiZahtevZaInzajmljivanje({
            korisnikZajmi: this.product.poreklo.id,
            korisnikPozajmljuje: this.idLogUser,
            knjiga: this.product._id,
            odDatuma: result.odDatuma,
            doDatuma: result.doDatuma,
            cena: result.cena
          }).subscribe({
            next: resp=>{
              console.log(resp);
              this.isReq=true;
              this.success="Zahtev za iznajmljivanje je poslat korisniku, bićete obavešteni kada zahtev bude obrađen.";
              setTimeout(() => {
                this.success = '';
              }, 3000);

            },
            error: err=>{
              console.log(err)
              this.error = err.error.sadrzaj;
              setTimeout(() => {
                this.error = '';
              }, 3000);
            }
          });
        }
    });
  }

  onCancleRequest(){

    let dialogWarning= this.dialog.open(WarningDialogComponent,
      { data :
        { pitanje : `Da li ste sigurni da želite da otkažete zahtev za iznajmljivanje knjige ${this.product.naziv}?`,
          potvrdna : 'Otkaži'}
      });

    dialogWarning.afterClosed().subscribe(result=>{
      if(result=='true'){
        this.leasesService.otkaziZahtevZaInzajmljivanje(this.product._id,this.idLogUser).subscribe({
          next: response=>{
            this.isReq=false;
          },
          error: err=>{
            console.log(err)
          }
        });
      }
    })
  }
}
