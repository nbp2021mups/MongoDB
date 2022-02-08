import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../../mime-type-validator/mime-type-validator';

import { ProductsService } from 'src/services/products.service';
import { BookFull } from 'src/models/book-full.model';
import { RanacFull } from 'src/models/ranac-full.model';
import { PrivezakFull } from 'src/models/privezak-full.model';
import { SveskaFull } from 'src/models/sveska-full.model';
import { DrustvenaIgraFull } from 'src/models/drustvenaIgra-full.model';
import { SlagalicaFull } from 'src/models/slagalica-full.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})

export class EditProductComponent implements OnInit, OnDestroy {

  form: FormGroup;
  error: string = '';
  success: string = '';
  selectedCategory: string;
  imagePreview: string = '';
  paramsSub: Subscription;
  idProizvoda: string;
  rdonly = true;

  constructor(private route: ActivatedRoute, private productService: ProductsService) { }

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe(params => {
      this.idProizvoda = params['idProizvoda'];
      console.log(this.idProizvoda);
    });

    this.form = new FormGroup({
      kategorija: new FormControl('', Validators.required),
      naziv: new FormControl('', Validators.required),
      proizvodjac: new FormControl('', Validators.required),
      kolicina:new FormControl('', Validators.required),
      isbn : new FormControl('', Validators.required),
      autor : new FormControl('', Validators.required),
      izdata: new FormControl(null),
      brojStrana: new FormControl(null),
      zanr:  new FormControl('', Validators.required),
      opis:  new FormControl('', Validators.required),
      cena:  new FormControl('', Validators.required),
      brojListova: new FormControl(null),
      format:  new FormControl('', Validators.required),
      dimenzije: new FormControl(null),
      brojDelova:  new FormControl('', Validators.required),
      pol:  new FormControl('', Validators.required),
      materijal:  new FormControl('', Validators.required),


      trajanje:  new FormControl(null),
      brojIgraca:  new FormControl(null),
      uzrastOd: new FormControl('',Validators.required),
      uzrastDo: new FormControl('',Validators.required),
      slika: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      })

    });

    this.productService.getProductById(this.idProizvoda).subscribe({
      next: resp=>{
        console.log(resp)
        this.selectedCategory=resp.kategorija;
        this.imagePreview=resp.slika;
        this.form.patchValue({
          kategorija : this.selectedCategory,
          naziv : resp.naziv,
          cena : resp.cena,
          proizvodjac : resp.proizvodjac,
          kolicina : resp.kolicina,
          opis : resp.opis,
          slika : resp.slika

        });
        if(this.selectedCategory=='knjiga'){
          const book=resp as BookFull;
          this.form.patchValue({
           isbn:book.isbn,
           autor: book.autor,
           zanr : book.zanr,
           izdata : book.godIzdavanja,
           brojStrana : book.brStrana
          });
        }
        else if (this.selectedCategory=='ranac'){
          const ranac=resp as RanacFull;
          this.form.patchValue({
           pol:ranac.pol
          });
        }
        else if (this.selectedCategory=='privezak'){
          const privezak=resp as PrivezakFull;
          this.form.patchValue({
           materijal:privezak.materijal
          });
        }
        else if (this.selectedCategory=='sveska'){
          const sveska = resp as SveskaFull;
          this.form.patchValue({
           format:sveska.format,
           brojListova:sveska.brListova
          });
        }
        else if (this.selectedCategory=='drustvena igra'){
          const igra=resp as DrustvenaIgraFull;
          this.form.patchValue({
           trajanje:igra.trajanje,
           brojIgraca:igra.brIgraca,
           uzrastOd:igra.uzrast.substring(0,igra.uzrast.indexOf("-")),
           uzrastDo:igra.uzrast.substring(igra.uzrast.indexOf("-"))
          });
        }
        else if (this.selectedCategory=='slagalica'){
          const slagalica=resp as SlagalicaFull;
          this.form.patchValue({
           brojDelova:slagalica.brDelova,
           dimenzije:slagalica.dimenzije
          });
        }

      },
      error: err=>{

      }
    })
  }

  ngOnDestroy(): void {
      this.paramsSub.unsubscribe();
  }

  checkCategory(event){
    this.selectedCategory = event.value;
    this.form.controls.dir
  }

  onSubmit(){
    /* if (this.imagePreview!=this.person.imagePath){
      newImage=this.form.value.slika;
      body["oldImage"]=this.person.imagePath;
    } */
    console.log(this.getDirtyValues(this.form));
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

  getDirtyValues(form: any) {
    let dirtyValues = {};

    Object.keys(form.controls)
        .forEach(key => {
            let currentControl = form.controls[key];

            if (currentControl.dirty) {
                if (currentControl.controls)
                    dirtyValues[key] = this.getDirtyValues(currentControl);
                else
                    dirtyValues[key] = currentControl.value;
            }
        });

    return dirtyValues;
}

}
