import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProductBasic } from 'src/models/product-basic.model';
import { AuthService } from 'src/services/auth.service';
import { ProductsService } from 'src/services/products.service';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from 'src/app/warning-dialog/warning-dialog.component';
import { KnjigaIznajmljivanjeBasic } from 'src/models/knjiga-iznajmljivanje-basic.model';
import { LeaseDialogComponent } from 'src/app/lease-dialog/lease-dialog.component';
import { LeasesService } from 'src/services/leases.service';


enum Kategorija {
  'Knjiga',
  'KnjigaZaIznajmljivanje',
  'Ostalo'
};

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {

  @Input()
  product: ProductBasic;  //ovo moze biti bilo koji proizvod
  kategorija: Kategorija;
  personal: boolean;
  error: string = '';
  success: string = '';

  @Output()
  obrisaniProizvod: EventEmitter<string>=new EventEmitter<string>();

  constructor(private authService: AuthService,
     private router: Router,
     private productService: ProductsService,
     private dialog: MatDialog,
     private leasesService: LeasesService) { }

  ngOnInit(): void {
    if(this.product.kategorija == 'knjiga'){
      this.kategorija = Kategorija.Knjiga;
    } else if (this.product.kategorija == 'knjiga na izdavanje') {
      this.kategorija = Kategorija.KnjigaZaIznajmljivanje;
    } else {
      this.kategorija = Kategorija.Ostalo;
    }

    this.authService.user.subscribe(user => {
      if(!user){
        this.personal = false;
        return;
      }
      this.personal = (user.id == this.product.poreklo.id);
    }).unsubscribe();
  }


  onProductClicked() {
    this.router.navigate(['/proizvod', this.product._id])
  }


  onIzmenaClicked() {
    this.router.navigate(['/izmena', this.product._id]);
  }

  onObrisiClicked(){

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
          this.productService.deleteCompanyProduct(this.product._id, this.product.slika, this.product.poreklo.id).subscribe({
            next: response=>{
              this.obrisaniProizvod.emit(this.product._id);
            },
            error: err=>{

            }
          });
        }
      }
    })
  }



  onDodajUKorpu() {
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

  zahtevana() {
    return (this.product as KnjigaIznajmljivanjeBasic).zahtevana;
  }

  onIznajmiClicked(){

    this.authService.user.subscribe(user=>{

      if(!user){
        this.router.navigate(['/prijavljivanje']);
        return;
      }
      if(user.role == 'bookstore'){
        return;
      }

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
              korisnikPozajmljuje: user.id,
              knjiga: this.product._id,
              odDatuma: result.odDatuma,
              doDatuma: result.doDatuma,
              cena: result.cena
            }).subscribe({
              next: resp=>{
                console.log(resp);
                (this.product as KnjigaIznajmljivanjeBasic).zahtevana=true;
                this.success="Zahtev za iznajmljivanje je poslat korisniku.";
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
    }).unsubscribe();

  }

  onOtkaziClicked(){
    this.authService.user.subscribe(user=>{
      if(!user){
        this.router.navigate(['/prijavljivanje']);
        return;
      }
      if(user.role == 'bookstore'){
        return;
      }

      let dialogWarning= this.dialog.open(WarningDialogComponent,
        { data :
          { pitanje : `Da li ste sigurni da želite da otkažete zahtev za iznajmljivanje knjige ${this.product.naziv}?`,
            potvrdna : 'Otkaži'}
        });

      dialogWarning.afterClosed().subscribe(result=>{
        if(result=='true'){
          this.leasesService.otkaziZahtevZaInzajmljivanje(this.product._id,user.id).subscribe({
            next: response=>{
              (this.product as KnjigaIznajmljivanjeBasic).zahtevana=false;
            },
            error: err=>{
              console.log(err)
            }
          });
        }
      })
    }).unsubscribe();
  }



}
