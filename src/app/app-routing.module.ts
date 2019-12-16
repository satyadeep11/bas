import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreComponent } from './store/store.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegisterComponent } from './store/register/register.component';
import { LoginComponent } from './store/login/login.component';
import { HomeComponent } from './store/home/home.component';
import { PreviewComponent } from './registration/preview/preview.component';
import { AdminComponent } from './store/admin/admin.component';
import { AdminloginComponent } from './store/admin/adminlogin/adminlogin.component';
import { RegComponent } from './reg/reg.component';
import { LandingComponent } from './landing/landing.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TosComponent } from './tos/tos.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { AccessComponent } from './superadmin/access/access.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqComponent } from './faq/faq.component';



const routes: Routes = [
  { path: 'stores/:id', component: HomeComponent },
  { path: 'stores/:id/admin', component: AdminComponent },
  { path: 'stores/:id/admin/login', component: AdminloginComponent },
  { path: 'stores', component: StoreComponent  },
  { path: 'stores/:id/register', component: RegisterComponent  },
  { path: 'stores/:id/login', component: LoginComponent  },
  { path: 'stores/:id/home', component: HomeComponent },
  { path: 'stores/:id/home/:uid/:pwd', component: HomeComponent },
  { path: '', component: LandingComponent},
  { path: 'registration', component: RegistrationComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TosComponent },
  { path: 'reg', component: RegComponent },
  { path: 'registration/preview', component: PreviewComponent },
  { path: 'superadmin', component:SuperadminComponent},
  { path: 'superadmin/login', component:AccessComponent},
  { path: '**', redirectTo: '' },
 
  

  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


