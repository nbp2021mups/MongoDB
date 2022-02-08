import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../../mime-type-validator/mime-type-validator';

import { ProductsService } from 'src/services/products.service';

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

  constructor(private route: ActivatedRoute) { }

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

  ngOnDestroy(): void {
      this.paramsSub.unsubscribe();
  }
}
