import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPageComponent } from './products/product-page/product-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { BookstoreListComponent } from './components/bookstore-list/bookstore-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/pocetna', pathMatch: 'full' },
  { path: 'knjige', component: ProductPageComponent },
  { path: 'proizvodi', component: ProductPageComponent },
  { path: 'prijavljivanje', component: LoginPageComponent },
  { path: 'registracija', component: RegistrationPageComponent },
  { path: 'knjizare', component: BookstoreListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
