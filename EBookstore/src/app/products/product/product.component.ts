import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProductBasic } from 'src/models/product-basic.model';
import { AuthService } from 'src/services/auth.service';
import { ProductsService } from 'src/services/products.service';


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

  @Output()
  obrisaniProizvod: EventEmitter<string>=new EventEmitter<string>();

  constructor(private authService: AuthService, private router: Router, private productService: ProductsService) { }

  ngOnInit(): void {
    if(this.product.kategorija == 'knjiga'){
      this.kategorija = Kategorija.Knjiga;
    } else if (this.product.kategorija == 'knjiga za iznajmljivanje') {
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
}
