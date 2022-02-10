import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../mime-type-validator/mime-type-validator';

import { ProductsService } from 'src/services/products.service';

import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { LoggedUser } from 'src/models/loggedUser.model';

@Component({
  selector: 'app-add-users-book',
  templateUrl: './add-users-book.component.html',
  styleUrls: ['./add-users-book.component.css']
})
export class AddUsersBookComponent implements OnInit {

  form: FormGroup;
  imagePreview: string = '';

  constructor(private productService : ProductsService, private router : Router, private authService: AuthService) { }

  ngOnInit(): void {
    //kolicina=1, kategorija=knjiga na izdavanje

    this.form = new FormGroup({
      naziv: new FormControl('', Validators.required),
      proizvodjac: new FormControl('', Validators.required),
      autor : new FormControl('', Validators.required),
      izdata: new FormControl(null),
      brojStrana: new FormControl(null),
      zanr:  new FormControl('', Validators.required),
      opis:  new FormControl('', Validators.required),
      cena:  new FormControl('', Validators.required),
      stanje: new FormControl('', Validators.required),
      slika: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      })

    });
  }

  onSubmit(){

    this.authService.user.subscribe(user=>{
      if(user && user.role=='user'){

      console.log(this.form.getRawValue());
      const formValues=this.form.getRawValue();
      const bookData : FormData = new FormData();

      for (const [key, value] of Object.entries(formValues)) {
        if(value){
          if (key!='slika')
            bookData.append(key, value as string);
          else
            bookData.append('image', value as Blob);
        }
      }
      bookData.append('kategorija','knjiga na izdavanje');
      bookData.append('kolicina','1');
      const logUser= user as LoggedUser;
      const poreklo={
        id:user.id,
        ime: logUser.ime,
        prezime: logUser.prezime
      }
      bookData.append('poreklo', JSON.stringify(poreklo));

      this.productService.addProduct(bookData).subscribe({
        next:resp=>{
          this.router.navigate(['knjizare']);
        },
        error : err=>{
          console.log(err)
          this.router.navigate(['knjizare']);
        }
      });

      }
    });


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
