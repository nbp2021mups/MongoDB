import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductBasic } from 'src/models/product-basic.model';
import { AuthService } from 'src/services/auth.service';

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

  constructor(private authService: AuthService, private router: Router) { }

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
    alert('radi');
  }


  onIzmenaClicked() {
    this.router.navigate(['/izmena', this.product._id]);
  }
}
