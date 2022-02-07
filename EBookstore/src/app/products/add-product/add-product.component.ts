import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../../mime-type-validator/mime-type-validator';

import { Router } from '@angular/router';

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

  constructor() { }

  ngOnInit(): void {



    this.form = new FormGroup({
      kategorija: new FormControl('', Validators.required),
      naziv: new FormControl('', Validators.required),
      proizvodjac: new FormControl('', Validators.required),
      kolicina:new FormControl('', Validators.required),
      isbn : new FormControl('', Validators.required),
      autor : new FormControl('', Validators.required),
      godIzdanja: new FormControl(''),
      brStrana: new FormControl(''),
      zanr:  new FormControl('', Validators.required),
      opis:  new FormControl('', Validators.required),
      cena:  new FormControl('', Validators.required),
      brListova: new FormControl(''),
      format:  new FormControl('', Validators.required),
      dimenzije: new FormControl(''),
      brDelova:  new FormControl('', Validators.required),

      trajanje:  new FormControl(''),
      brIgraca:  new FormControl(''),
      uzrast: new FormControl('',Validators.required),
      slika: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      })

    });

  }

  onSubmit(){

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
