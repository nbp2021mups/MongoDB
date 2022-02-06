import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../mime-type-validator/mime-type-validator';

import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';


@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {
  form: FormGroup;
  hide = true;
  error: string = '';
  success: string = '';
  selectedType: string = 'customer';
  imagePreview: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      ime: new FormControl('', Validators.required),
      prezime: new FormControl('', Validators.required),
      naziv: new FormControl('', Validators.required),
      pib: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      lozinka: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      telefon : new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(9)
      ]),
      adresa: new FormControl('', Validators.required),
      slika: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      })

    });
  }

  onSubmit() {

    const data: FormData = new FormData();

    const email = this.form.get('email').value;
    data.append('email', email);
    const username = this.form.get('username').value;
    data.append('username', username);
    const password = this.form.get('lozinka').value;
    data.append('lozinka', password);
    const telefon = '+381'+this.form.get('telefon').value;
    data.append('telefon', telefon);



    if (this.selectedType=='customer'){
      const fName = this.form.get('ime').value;
      data.append('ime', fName);
      const lName = this.form.get('prezime').value;
      data.append('prezime', lName);
      const address = this.form.get('adresa').value;
      data.append('adresa', address);

      this.authService.registerUser(data).subscribe({
        next : resp =>{
          this.success=resp.poruka;
          setTimeout(() => {
            this.router.navigate(['prijavljivanje']);
          }, 3000);
        },
        error : err =>{
          this.error = err.error.sadrzaj;
          setTimeout(() => {
            this.error = '';
          }, 3000);
        }
      });

    }
    else{
      const name = this.form.get('naziv').value;
      data.append('naziv', name);
      const pib = this.form.get('pib').value;
      data.append('pib', pib);
      const image = this.form.value.slika;
      data.append('image', image);

      this.authService.registerBookstore(data).subscribe({
        next : resp =>{
          this.success=resp.poruka;
          setTimeout(() => {
            this.router.navigate(['prijavljivanje']);
          }, 3000);
        },
        error : err =>{
          this.error = err.error.sadrzaj;
          setTimeout(() => {
            this.error = '';
          }, 3000);
        }

      });



    }


  }

  checkType(event) {
    this.selectedType=event.value;
    this.form.reset();
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
