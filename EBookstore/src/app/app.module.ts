import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { HeaderComponent } from './header/header.component';
import { ProductComponent } from './products/product/product.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductPageComponent } from './products/product-page/product-page.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './components/cart/cart.component';
import { BookstoreListComponent } from './components/bookstore-list/bookstore-list.component';
import { BookstoreSingleComponent } from './components/bookstore-single/bookstore-single.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductOrderComponent } from './components/product-order/product-order.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { ProductInfoPageComponent } from './product-info-page/product-info-page.component';
import { OrderSingleComponent } from './components/order-single/order-single.component';
import { OrdersComponent } from './components/orders/orders.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegistrationPageComponent,
    HeaderComponent,
    ProductComponent,
    ProductListComponent,
    ProductPageComponent,
    BookstoreListComponent,
    BookstoreSingleComponent,
    CartComponent,
    HomePageComponent,
    AddProductComponent,
    ProductOrderComponent,
    EditProductComponent,
    ProductInfoPageComponent,
    OrderSingleComponent,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    HttpClientModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
