import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPageComponent } from './products/product-page/product-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { BookstoreListComponent } from './components/bookstore-list/bookstore-list.component';
import { CartComponent } from './components/cart/cart.component';
import { AuthGuardUser } from 'src/services/auth-guard-user.service';
import { AuthGuardBookstore } from 'src/services/auth-guard-bookstore.service';
import { AddProductComponent } from './products/add-product/add-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { ProductInfoPageComponent } from './product-info-page/product-info-page.component';
import { OrdersComponent } from './components/orders/orders.component';
import { LeaseComponent } from './components/lease/lease.component';
import { AddUsersBookComponent } from './add-users-book/add-users-book.component';
import { AuthGuard } from 'src/services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/pocetna', pathMatch: 'full' },
  { path : 'pocetna', component : HomePageComponent },
  { path: 'knjige', component: ProductPageComponent },
  { path: 'knjige/:idKnjizare', component: ProductPageComponent },
  { path: 'proizvodi', component: ProductPageComponent },
  { path: 'proizvodi/:idKnjizare', component: ProductPageComponent },
  { path: 'prijavljivanje', component: LoginPageComponent },
  { path: 'registracija', component: RegistrationPageComponent },
  { path: 'knjige-za-iznajmljivanje', component: ProductPageComponent},
  { path: 'knjizare', component: BookstoreListComponent },
  { path: 'novi-proizvod', component: AddProductComponent, canActivate: [AuthGuardBookstore] },
  { path: 'korpa', component: CartComponent, canActivate: [AuthGuardUser] },
  { path: 'narudzbine', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'iznajmljivanje', component: LeaseComponent, canActivate: [AuthGuardUser] },
  { path: 'izmena/:idProizvoda', component: EditProductComponent, canActivate: [AuthGuardBookstore]},
  { path: 'proizvod/:idProizvoda', component: ProductInfoPageComponent},
  { path: 'nova-knjiga-iznajmljivanje', component: AddUsersBookComponent, canActivate: [AuthGuardUser]},
  { path: '**', redirectTo: 'pocetna' },
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
