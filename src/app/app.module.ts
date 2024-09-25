import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { Wpng2RoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { BannerComponent } from './banner/banner.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './components/about/about.component';
import { RegistrationComponent } from './components/registration/registration.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BannerComponent,
    HomeComponent,
    AboutComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    Wpng2RoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
