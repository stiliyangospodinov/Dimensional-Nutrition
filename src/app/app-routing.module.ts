import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { AboutComponent } from './about/about.component';
import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ContactComponent } from './contact/contact.component';
import { DiscountComponent } from './discount/discount.component';
import { CommentsComponent } from './comments/comments.component';

const routes: Routes = [
  { path: '',
    pathMatch: 'full',
    redirectTo: '/home'
  },
  { path: 'home', component: HomeComponent,},
  { path: 'products', component: ProductsComponent},
  { path: 'about', component: AboutComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'discount', component: DiscountComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: '404', component: ErrorComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'comments', component: CommentsComponent },

  { path: '**', redirectTo: "/404" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
