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
  querySub: Subscription;
  form: FormGroup;
  muski: boolean = false;
  zenski: boolean = false;
  a4: boolean = false;
  a5: boolean = false;
  idKnjizare: string = null;
  queryParams = {};
  isLoading: boolean;

  cene = [{controlName: 'cena1', value: '0-1000', text : '0-1000', checked: false},
          {controlName: 'cena2', value: '1000-2000', text : '1000-2000', checked: false},
          {controlName: 'cena3', value: '2000-5000', text : '2000-5000', checked: false},
          {controlName: 'cena4', value: '5000-999999', text : '5000+', checked: false}];

  zanrovi = [{value: 'Drama', text: 'Drama'},
          {value: 'Komedija', text: 'Komedija'},
          {value: 'Triler', text: 'Triler'},
          {value: 'Naucna fantastika', text: 'Naucna fantastika'},
          {value: 'Psihologija', text: 'Psihologija'},
          {value: 'Strucna literatura', text: 'Strucna literatura'},
          {value: 'Zdravlje', text: 'Zdravlje'},
          {value: 'Knjige za decu', text: 'Knjige za decu'},
          {value: 'Roman', text: 'Roman'},
          {value: 'Klasik', text: 'Klasik'},
          {value: 'Novela', text: 'Novela'},
          {value: 'Horor', text: 'Horor'}];
  
  uzrasti = [{controlName: 'uzrast1', value: '0-5', text : 'do 5 godina', checked: false},
          {controlName: 'uzrast2', value: '5-8', text : '5 - 8 godina', checked: false},
          {controlName: 'uzrast3', value: '8-13', text : '8 - 13 godina', checked: false},
          {controlName: 'uzrast4', value: '13-18', text : '13 - 18 godina', checked: false},
          {controlName: 'uzrast5', value: '18-18', text : '18+ godina', checked: false}];
  
  brDelova = [{controlName: 'delovi1', value: 500, text : '500', checked: false},
          {controlName: 'delovi2', value: 1000, text : '1000', checked: false},
          {controlName: 'delovi3', value: 1500, text : '1500', checked: false},
          {controlName: 'delovi4', value: 2000, text : '2000', checked: false}];
  

  ngOnInit(): void {

    const path = this.router.url;
    if(path.includes('iznajmljivanje')){
      this.tipStranice = 'iznajmljivanje';
    } else if(path.includes('knjige')){
      this.tipStranice = 'knjige';
    } else if(path.includes('proizvodi')){
      this.tipStranice = 'proizvodi';
    }
    

    if(this.tipStranice == 'knjige'){
      this.izabranaKategorija = 'knjiga';
    } else if(this.tipStranice == 'iznajmljivanje'){
      this.izabranaKategorija = 'knjiga na izdavanje';
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
        this.ucitajPodatkeZaKnjizaru(this.idKnjizare, this.brStranice, this.queryParams);
      } else {
        this.idKnjizare = null;
        this.ucitajPodatke(this.brStranice, this.queryParams);
      }
    });

    this.querySub = this.route.queryParams.subscribe(params => {
      this.queryParams = params;

      if(this.idKnjizare){
        this.brStranice = 0;
        this.ucitajPodatkeZaKnjizaru(this.idKnjizare, this.brStranice, this.queryParams);
      } else {
        this.brStranice = 0;
        this.ucitajPodatke(this.brStranice, this.queryParams);
      }
    });
  }


  prethodnaStrana() {
    if(!this.idKnjizare)
      this.ucitajPodatke(this.brStranice - 1, this.queryParams);
    else
      this.ucitajPodatkeZaKnjizaru(this.idKnjizare, this.brStranice - 1, this.queryParams);
    this.brStranice--;
    window.scrollTo(0, 0);
  }


  sledecaStrana() {
    if(!this.idKnjizare)
      this.ucitajPodatke(this.brStranice + 1, this.queryParams);
    else
      this.ucitajPodatkeZaKnjizaru(this.idKnjizare, this.brStranice + 1, this.queryParams);
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



  ucitajPodatke(brStranice: number, queryParams) {
    this.authService.user.subscribe(user => {
      if(user && user.role == 'bookstore'){
        return;
      }

      if(this.tipStranice == 'proizvodi'){

      } else
      if(this.tipStranice == 'knjige'){
        queryParams = {kategorija: 'knjiga', ...queryParams};
      } else if(this.tipStranice == 'iznajmljivanje') {
        this.authService.user.subscribe(user => {
          if(user && user.role == 'user'){
            const uid = user.id;
            queryParams = {kategorija: 'knjiga na izdavanje', uid: uid, ...queryParams};
          } else {
            queryParams = {kategorija: 'knjiga na izdavanje', ...queryParams};
          }
        }).unsubscribe();
      }

      const selectFields = ['_id', 'naziv', 'proizvodjac', 'cena', 'slika', 'kolicina', 'kategorija', 'autor', 'zanr', 'poreklo'];
      if(this.tipStranice == 'iznajmljivanje'){
        selectFields.push('zahtevaliZajam');
      }

      this.isLoading = true;
      this.prodService.ucitajProizvode2(brStranice * this.velicinaStranice, this.velicinaStranice, queryParams, selectFields).subscribe({
        next: resp => {
          this.products = resp;
          this.isLoading = false;
        },
        error: err => {console.log(err);}
      });
    }).unsubscribe();
  }



  ucitajPodatkeZaKnjizaru(idKnjizare: string, brStranice: number, queryParams) {
      this.authService.user.subscribe(user => {
        if(user != null && user.role == 'bookstore' && user.id != idKnjizare){
          return;
        }

        if(this.tipStranice == 'knjige'){
          queryParams = {kategorija: 'knjiga', ...queryParams};
        }

        this.isLoading = true;
        this.prodService.ucitajProizvodeKnjizare(idKnjizare, brStranice * this.velicinaStranice, this.velicinaStranice, queryParams).subscribe({
          next: resp => {
            this.products = resp;
            this.isLoading = false;
          },
          error: err => {console.log(err);}
        });
      }).unsubscribe();
    }



  onSubmit() {
    const queryParams = {};

    const kategorija = this.izabranaKategorija;
    if(kategorija && kategorija != ''){
      queryParams['kategorija'] = kategorija;
    }

    const naziv = this.form.get('naziv').value;
    if(naziv && naziv != ''){
      queryParams['naziv'] = naziv;
    }

    const proizvodjac = this.form.get('proizvodjac').value;
    if(proizvodjac && proizvodjac != ''){
      queryParams['proizvodjac'] = proizvodjac;
    }

    const cene = [];
    this.cene.forEach(cena => {
      if(cena.checked){
        cene.push(cena.value);
      }
    });
    if(cene.length > 0){
      queryParams['cene'] = JSON.stringify(cene);
    }

    const sort = this.form.get('sortiranje').value;
    if(sort){
      queryParams['sort'] = sort;
    }


    if (kategorija == 'knjiga') {
      const autor = this.form.get('autor').value;
      const zanr = this.form.get('zanr').value;

      if(autor && autor != ''){
        queryParams['autor'] = autor;
      }
      if(zanr && zanr.length > 0){
        queryParams['zanr'] = JSON.stringify(zanr);
      }

    } else if(kategorija == 'drustvena igra') {
      const uzrasti = [];
      this.uzrasti.forEach(uzrast => {
        if(uzrast.checked){
          uzrasti.push(uzrast.value);
        }
      });
      if(uzrasti.length > 0){
        queryParams['uzrast'] = JSON.stringify(uzrasti);
      }

    } else if(kategorija == 'slagalica') {
      const brDelova = [];
      this.brDelova.forEach(br => {
        if(br.checked) {
          brDelova.push(br.value);
        }
      });
      if(brDelova.length > 0){
        queryParams['brDelova'] = JSON.stringify(brDelova);
      }

    } else if (kategorija == 'ranac') {

      if(this.muski && !this.zenski){
        queryParams['pol'] = '["muski"]';
      } else if(!this.muski && this.zenski){
        queryParams['pol'] = '["zenski"]';
      }

    } else if (kategorija == 'privezak'){
      const materijal = this.form.get('materijal').value;
      if(materijal && materijal != ''){
        queryParams['materijal'] = materijal;
      }
    
    } else if (kategorija == 'sveska') {
      if(this.a4 && !this.a5){
        queryParams['format'] = '["A4"]';
      } else if(!this.a4 && this.a5){
        queryParams['format'] = '["A5"]';
      }

    }

    this.router.navigate([], {relativeTo: this.route, queryParamsHandling : '', queryParams: queryParams});
  }


  ngOnDestroy(): void {
      this.routeSub.unsubscribe();
      this.querySub.unsubscribe();
  }
}
