import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../../mime-type-validator/mime-type-validator';

import { ProductsService } from 'src/services/products.service';

import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  form: FormGroup;
  error: string = '';
  success: string = '';
  selectedCategory: string;
  imagePreview: string = '';

  constructor(private productService : ProductsService, private router : Router, private authService: AuthService) { }

  ngOnInit(): void {



    this.form = new FormGroup({
      kategorija: new FormControl('', Validators.required),
      naziv: new FormControl('', Validators.required),
      proizvodjac: new FormControl('', Validators.required),
      kolicina:new FormControl('', Validators.required),
      isbn : new FormControl('', Validators.required),
      autor : new FormControl('', Validators.required),
      godIzdanja: new FormControl(null),
      brStrana: new FormControl(null),
      zanr:  new FormControl('', Validators.required),
      opis:  new FormControl('', Validators.required),
      cena:  new FormControl('', Validators.required),
      brListova: new FormControl(null),
      format:  new FormControl('', Validators.required),
      dimenzije: new FormControl(null),
      brDelova:  new FormControl('', Validators.required),
      pol:  new FormControl('', Validators.required),
      materijal:  new FormControl('', Validators.required),


      trajanje:  new FormControl(null),
      brIgraca:  new FormControl(null),
      uzrastOd: new FormControl('',Validators.required),
      uzrastDo: new FormControl('',Validators.required),
      slika: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      })

    });

  }

  onSubmit(){

    this.authService.user.subscribe(user => {

      if(user != null && user.role == 'bookstore') {

        const productData : FormData = new FormData();

        const kategorija=this.form.get('kategorija').value;
        productData.append('kategorija', kategorija);
        const naziv=this.form.get('naziv').value;
        productData.append('naziv', naziv);
        const proizvodjac=this.form.get('proizvodjac').value;
        productData.append('proizvodjac', proizvodjac);
        const kolicina=this.form.get('kolicina').value;
        productData.append('kolicina', kolicina);
        const opis=this.form.get('opis').value;
        productData.append('opis', opis);

        const cena=this.form.get('cena').value;
        productData.append('cena', cena);

        const image = this.form.value.slika;
        productData.append('image', image);

        const poreklo={
          id: user.id,
          naziv: Object(user).naziv
        }
        productData.append("poreklo",JSON.stringify(poreklo));


        if(kategorija=='knjiga'){
          const isbn=this.form.get('isbn').value;
          productData.append('isbn', isbn);
          const autor=this.form.get('autor').value;
          productData.append('autor', autor);
          const zanr=this.form.get('zanr').value;
          productData.append('zanr', zanr);

          const godIzdanja=this.form.get('godIzdanja').value;
          if(godIzdanja)
            productData.append('izdata', godIzdanja);
          const brStrana=this.form.get('brStrana').value;
          if(brStrana)
            productData.append('brojStrana', brStrana);

        }
        else if(kategorija=='ranac'){
          const pol=this.form.get('pol').value;
          console.log(pol);
          productData.append('pol', pol);
        }
        else if(kategorija=='privezak'){
          const materijal=this.form.get('materijal').value;
          console.log(materijal);
          productData.append('materijal', materijal);
        }
        else if(kategorija=='sveska'){
          const format=this.form.get('format').value;
          productData.append('format', format);
          const brListova=this.form.get('brListova').value;
          if (brListova)
            productData.append('brojListova', brListova);
        }
        else if(kategorija=='drustvena igra'){
          const uzrastOd=this.form.get('uzrastOd').value;
          productData.append('uzrastOd', uzrastOd);
          const uzrastDo=this.form.get('uzrastDo').value;
          productData.append('uzrastDo', uzrastDo);

          const brIgraca=this.form.get('brIgraca').value;
          if (brIgraca)
            productData.append('brojIgraca', brIgraca);

          const trajanje=this.form.get('trajanje').value;
          if (trajanje)
            productData.append('trajanje', trajanje);
        }
        else if(kategorija=='slagalica'){
          const brDelova=this.form.get('brDelova').value;
          productData.append('brojDelova', brDelova);


          const dimenzije=this.form.get('dimenzije').value;
          if (dimenzije)
            productData.append('dimenzije', dimenzije);
        }

        this.productService.addProduct(productData).subscribe({
          next:resp=>{
            this.router.navigate(['proizvodi']);
          },
          error : err=>{
            console.log(err)
          }
        });

      }});

  }

  checkCategory(event){
    this.selectedCategory = event.value;
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
    this.form.patchValue({ slika: file });
    this.form.get('slika').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

}
