import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatButtonModule,MatIconModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, MatStepperModule,MatSnackBarModule,MatBottomSheetModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreComponent } from './store/store.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegisterComponent } from './store/register/register.component';
import { LoginComponent } from './store/login/login.component';
import { HomeComponent } from './store/home/home.component';
import { PreviewComponent } from './registration/preview/preview.component';
import { AdminComponent } from './store/admin/admin.component';
import {ShipPipeFilterPipe} from './registration/shiptimefilter.pipe';
import { AdminloginComponent } from './store/admin/adminlogin/adminlogin.component';
import { RegComponent } from './reg/reg.component';
import { LandingComponent } from './landing/landing.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TosComponent } from './tos/tos.component';
import { DataService } from './data.service';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { AccessComponent } from './superadmin/access/access.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqComponent } from './faq/faq.component';
import { PaymentComponent } from './store/admin/payment/payment.component';
import { SaPaymentComponent } from './superadmin/sa-payment/sa-payment.component';
import { NgxCurrencyModule } from "ngx-currency";

@NgModule({
  declarations: [
    AppComponent,
    StoreComponent,
    RegistrationComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    PreviewComponent,
    AdminComponent,
    ShipPipeFilterPipe,
    AdminloginComponent,
    RegComponent,
    LandingComponent,
    AboutUsComponent,
    PrivacyPolicyComponent,
    TosComponent,
    SuperadminComponent,  
    AccessComponent, ContactUsComponent, FaqComponent, PaymentComponent, SaPaymentComponent
  ],
  imports: [
    NgxCurrencyModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule, MatIconModule,MatFormFieldModule, MatNativeDateModule, MatInputModule, MatStepperModule, MatButtonModule,MatSnackBarModule,MatBottomSheetModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }



