import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../mime-type-validator/mime-type-validator';


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

  constructor() { }

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

    const email = this.form.get('email').value;
    const username = this.form.get('username').value;
    const password = this.form.get('lozinka').value;
    const telefon = this.form.get('telefon').value;

    if (this.selectedType=='customer'){
      const fName = this.form.get('ime').value;
      const lName = this.form.get('prezime').value;
      const adresss = this.form.get('adresa').value;



    }
    else{
      const name = this.form.get('naziv').value;
      const pib = this.form.get('pib').value;
      const image = this.form.value.slika;



    }




  }

  checkType(event) {
    this.selectedType=event.value;
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
