import { Component, Input, OnInit } from '@angular/core';
import { ProductBasic } from 'src/models/product-basic.model';

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

  constructor() { }

  ngOnInit(): void {
    if(this.product.kategorija == 'knjiga'){
      this.kategorija = Kategorija.Knjiga;
    } else if (this.product.kategorija == 'knjiga za iznajmljivanje') {
      this.kategorija = Kategorija.KnjigaZaIznajmljivanje;
    } else {
      this.kategorija = Kategorija.Ostalo;
    }
  }


  onProductClicked() {
    alert('radi');
  }
}
