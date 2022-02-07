import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductBasic } from 'src/models/product-basic.model';
import { ProductsService } from 'src/services/products.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {

  constructor(private router: Router, private prodService: ProductsService) { }

  brStranice: number;
  products: ProductBasic[] = [];
  tipStranice: string;
  velicinaStranice: number = 12;
  form: FormGroup;

  ngOnInit(): void {

    this.tipStranice = this.router.url.slice(1, this.router.url.length);
    this.brStranice = 0;

    this.form = new FormGroup({
      kategorija: new FormControl(),
      naziv: new FormControl(),
      proizvodjac: new FormControl(),
      cena1: new FormControl(),
      cena2: new FormControl(),
      cena3: new FormControl(),
      cena4: new FormControl(),
      sortiranje: new FormControl()
    });
    
    if(this.tipStranice == 'proizvodi') {
      this.prodService.ucitajProizvode(this.brStranice * this.velicinaStranice, this.velicinaStranice).subscribe({
        next: resp => {
          this.products = resp;
        },
        error: err => { console.log(err);}
      });
    }
  }


  prethodnaStrana() {
    if(this,this.brStranice == 0)
      return;

    this.prodService.ucitajProizvode((this.brStranice - 1) * this.velicinaStranice, this.velicinaStranice).subscribe({
      next: resp => {
        this.products = resp;
        this.brStranice--;
        this.scrollTop();
      },
      error: err => { console.log(err);}
    });
  }


  sledecaStrana() {
    this.prodService.ucitajProizvode((this.brStranice + 1) * this.velicinaStranice, this.velicinaStranice).subscribe({
      next: resp => {
        this.products = resp;
        this.brStranice++;
        this.scrollTop();
      },
      error: err => { console.log(err);}
    });
  }


  prvaStranica() {
    return this.brStranice == 0;
  }

  poslednjaStranica() {
    return this.products.length < this.velicinaStranice;
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  onIzborKategorije(event) {

  }


  onSubmit() {

  }
}
