import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AboutComponent } from './components/about/about.component';
import { CartComponent } from './components/registration/cart/cart.component';
import { CheckoutComponent } from './components/registration/checkout/checkout.component';
import { OrderConfirmationComponent } from './components/registration/order-confirmation/order-confirmation.component';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full'
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'events', component: RegistrationComponent },
  { path: 'about', component: AboutComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-confirmation', component: OrderConfirmationComponent },
  { path: 'contact-us', component: FeedbackFormComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
  providers: []
})
export class Wpng2RoutingModule { }
