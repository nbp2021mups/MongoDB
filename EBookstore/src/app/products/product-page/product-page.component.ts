import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductBasic } from 'src/models/product-basic.model';
import { AuthService } from 'src/services/auth.service';
import { ProductsService } from 'src/services/products.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private prodService: ProductsService, private authService: AuthService, private route: ActivatedRoute) { }

  brStranice: number;
  products: ProductBasic[] = [];
  tipStranice: string;
  velicinaStranice: number = 12;
  izabranaKategorija : string;
  routeSub: Subscription;
  form: FormGroup;
  muski: boolean = false;
  zenski: boolean = false;
  a4: boolean = false;
  a5: boolean = false;
  idKnjizare: string = null;

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

    this.tipStranice = this.router.url.slice(1,2);
    this.tipStranice = this.tipStranice == 'p' ? 'proizvodi' : 'knjige';
    
    if(this.tipStranice == 'knjige'){
      this.izabranaKategorija = 'knjiga';
    }
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
      a5: new FormControl(),
      materijal: new FormControl()
    });

    this.cene.forEach(cena => {this.form.addControl(cena.controlName, new FormControl())});
    this.uzrasti.forEach(uzrast => {this.form.addControl(uzrast.controlName, new FormControl())});
    this.brDelova.forEach(br => {this.form.addControl(br.controlName, new FormControl())});
    
    this.routeSub = this.route.params.subscribe(params => {
      if(Object.keys(params).length > 0){
        this.idKnjizare = params['idKnjizare'];
        this.ucitajPodatkeZaKnjizaru(this.idKnjizare, this.brStranice);
      } else {
        this.idKnjizare = null;
        this.ucitajPodatke(this.brStranice);
      }
    });
  }


  prethodnaStrana() {
    if(!this.idKnjizare)
      this.ucitajPodatke(this.brStranice - 1);
    else
      this.ucitajPodatkeZaKnjizaru(this.idKnjizare, this.brStranice - 1);
    this.brStranice--;
    window.scrollTo(0, 0);
  }


  sledecaStrana() {
    if(!this.idKnjizare)
      this.ucitajPodatke(this.brStranice + 1);
    else
      this.ucitajPodatkeZaKnjizaru(this.idKnjizare, this.brStranice + 1);
    this.brStranice++;
    window.scrollTo(0, 0);
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



  ucitajPodatke(brStranice: number) {
    this.authService.user.subscribe(user => {
      //ako niko nije ulogovan, ili je ulogovan korisnik
      if(user == null || user.role == 'user'){
        if(this.tipStranice == 'proizvodi') {
          this.prodService.ucitajProizvode(brStranice * this.velicinaStranice, this.velicinaStranice).subscribe({
            next: resp => {
              this.products = resp;
            },
            error: err => { console.log(err);}
          });
        //ukoliko smo na stranici koja sadrzi samo knjige
        } else {
          this.prodService.ucitajKnjige(brStranice * this.velicinaStranice, this.velicinaStranice).subscribe({
            next: resp => {
              this.products = resp;
            },
            error: err => { console.log(err);}
          });
        }
      }
    }).unsubscribe();
  }



  ucitajPodatkeZaKnjizaru(idKnjizare: string, brStranice: number) {
      this.authService.user.subscribe(user => {
        if(user != null && user.role == 'bookstore' && user.id != idKnjizare){
          return;
        }
        if(this.tipStranice == 'proizvodi') {
          this.prodService.ucitajProizvodeKnjizare(idKnjizare, brStranice * this.velicinaStranice, this.velicinaStranice).subscribe({
            next: resp => {
              this.products = resp;
            },
            error: err => { console.log(err);}
          });
        //ukoliko smo na stranici koja sadrzi samo knjige
        } else {
          this.prodService.ucitajKnjigeKnjizare(idKnjizare, brStranice * this.velicinaStranice, this.velicinaStranice).subscribe({
            next: resp => {
              this.products = resp;
            },
            error: err => { console.log(err);}
          });
        }
      }).unsubscribe();
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
    } else if (kategorija == 'ranac') {
      console.log('pol : ', this.muski, this.zenski);
    } else if (kategorija == 'privezak'){
      const materijal = this.form.get('materijal').value;
      console.log('materijal : ', materijal);
    } else if (kategorija == 'sveska') {
      console.log('format : ', this.a4, this.a5);
    }

    console.log('cene : ', cene);
    console.log('sortiranje : ', sort);
  }


  ngOnDestroy(): void {
      this.routeSub.unsubscribe();
  }
}
