import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPageComponent } from './products/product-page/product-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { BookstoreListComponent } from './components/bookstore-list/bookstore-list.component';
import { CartComponent } from './components/cart/cart.component';
import { AuthGuard } from 'src/services/auth-guard.service';
import { AddProductComponent } from './products/add-product/add-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { ProductInfoPageComponent } from './product-info-page/product-info-page.component';
import { OrdersComponent } from './components/orders/orders.component';

const routes: Routes = [
  { path: '', redirectTo: '/pocetna', pathMatch: 'full' },
  { path : 'pocetna', component : HomePageComponent },
  { path: 'knjige', component: ProductPageComponent },
  { path: 'knjige/:idKnjizare', component: ProductPageComponent },
  { path: 'proizvodi', component: ProductPageComponent },
  { path: 'proizvodi/:idKnjizare', component: ProductPageComponent },
  { path: 'prijavljivanje', component: LoginPageComponent },
  { path: 'registracija', component: RegistrationPageComponent },
  { path: 'knjizare', component: BookstoreListComponent },
  { path: 'novi-proizvod', component: AddProductComponent },
  { path: 'korpa', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'narudzbine', component: OrdersComponent },
  { path: 'izmena/:idProizvoda', component: EditProductComponent},
  { path: 'proizvod/:idProizvoda', component: ProductInfoPageComponent},
  { path: '**', redirectTo: 'pocetna' },
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
