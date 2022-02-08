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
  izabranaKategorija : string;
  form: FormGroup;
  muski: boolean = false;
  zenski: boolean = false;
  a4: boolean = false;
  a5: boolean = false;

  cene = [{controlName: 'cena1', value: '0-1000', text : '0-1000', checked: false},
          {controlName: 'cena2', value: '1000-2000', text : '1000-2000', checked: false},
          {controlName: 'cena3', value: '2000-5000', text : '2000-5000', checked: false},
          {controlName: 'cena4', value: '5000-', text : '5000+', checked: false}];
  
  uzrasti = [{controlName: 'uzrast1', value: '0-5', text : 'do 5 godina', checked: false},
          {controlName: 'uzrast2', value: '5-8', text : '5 - 8 godina', checked: false},
          {controlName: 'uzrast3', value: '8-13', text : '8 - 13 godina', checked: false},
          {controlName: 'uzrast4', value: '13-18', text : '13 - 18 godina', checked: false},
          {controlName: 'uzrast5', value: '18-', text : '18+ godina', checked: false}];
  
  brDelova = [{controlName: 'delovi1', value: 500, text : '500', checked: false},
          {controlName: 'delovi2', value: 1000, text : '1000', checked: false},
          {controlName: 'delovi3', value: 1500, text : '1500', checked: false},
          {controlName: 'delovi4', value: 2000, text : '2000', checked: false}];
  

  ngOnInit(): void {

    this.tipStranice = this.router.url.slice(1, this.router.url.length);
    this.brStranice = 0;

    this.form = new FormGroup({
      kategorija: new FormControl(''),
      naziv: new FormControl(''),
      proizvodjac: new FormControl(''),
      sortiranje: new FormControl(),
      autor: new FormControl(''),
      zanr: new FormControl(''),
      muski: new FormControl(),
      zenski: new FormControl(),
      a4: new FormControl(),
      a5: new FormControl()
    });

    this.cene.forEach(cena => {this.form.addControl(cena.controlName, new FormControl())});
    this.uzrasti.forEach(uzrast => {this.form.addControl(uzrast.controlName, new FormControl())});
    this.brDelova.forEach(br => {this.form.addControl(br.controlName, new FormControl())});
    
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
    this.izabranaKategorija = event.value;
  }


  onIzaberiCenu(event, cena) {
    const izabranaCena = this.cene.find(c => c.controlName == cena);
    if(izabranaCena){
      izabranaCena.checked = event.checked;
    }
  }

  onIzaberiUzrast(event, uzrast) {
    const izabranUzrast = this.uzrasti.find(u => u.controlName == uzrast);
    if(izabranUzrast){
      izabranUzrast.checked = event.checked;
    }
  }

  onIzaberiBrDelova(event, broj) {
    const izabranBrDelova = this.brDelova.find(br => br.controlName == broj);
    if(izabranBrDelova){
      izabranBrDelova.checked = event.checked;
    }
  }


  onMuskiClicked(event) {
    this.muski = event.checked;
  }

  onZenskiClicked(event) {
    this.zenski = event.checked;
  }
  onA4Clicked(event) {
    this.a4 = event.checked;
  }
  onA5Clicked(event) {
    this.a5 = event.checked;
  }


  onSubmit() {
    const kategorija = this.izabranaKategorija;
    const naziv = this.form.get('naziv').value;
    const proizvodjac = this.form.get('proizvodjac').value;

    const cene = [];
    this.cene.forEach(cena => {
      if(cena.checked){
        cene.push(cena.value);
      }
    });
    const sort = this.form.get('sortiranje').value;

    console.log('kategorija : ', kategorija);
    console.log('naziv : ', naziv);
    console.log('proizvodjac : ', proizvodjac);

    if (kategorija == 'knjiga') {
      const autor = this.form.get('autor').value;
      const zanr = this.form.get('zanr').value;

      console.log('autor: ', autor);
      console.log('zanr : ', zanr);
    } else if(kategorija == 'drustvena igra') {
      const uzrasti = [];
      this.uzrasti.forEach(uzrast => {
        if(uzrast.checked){
          uzrasti.push(uzrast.value);
        }
      });
      console.log('uzrasti : ', uzrasti);
    } else if(kategorija == 'slagalica') {
      const brDelova = [];
      this.brDelova.forEach(br => {
        if(br.checked) {
          brDelova.push(br.value);
        }
      });
      console.log('delovi : ', brDelova);
    } else if (kategorija == 'ranac' || kategorija == 'privezak') {
      console.log('pol : ', this.muski, this.zenski);
    } else if (kategorija == 'sveska') {
      console.log('format : ', this.a4, this.a5);
    }

    console.log('cene : ', cene);
    console.log('sortiranje : ', sort);
  }
}
