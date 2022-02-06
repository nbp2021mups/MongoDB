import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  constructor() { }

  ngOnInit(): void {

    this.form = new FormGroup({
      ime: new FormControl('', Validators.required),
      prezime: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      lozinka: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      telefon : new FormControl('',[
        Validators.required
      ])

    });
  }

  onSubmit() {
    const fName = this.form.get('ime').value;
    const lName = this.form.get('prezime').value;
    const email = this.form.get('email').value;
    const username = this.form.get('username').value;
    const password = this.form.get('lozinka').value;
    const desc = this.form.get('opis').value;
    const image = this.form.value.slika;


  }

}
