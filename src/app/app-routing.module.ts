import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full'
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'register', component: RegistrationComponent },
  { path: 'about', component: AboutComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
  providers: []
})
export class Wpng2RoutingModule { }
