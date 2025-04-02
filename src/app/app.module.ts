import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { Wpng2RoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { BannerComponent } from './banner/banner.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './components/about/about.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AboutusComponent } from './components/about/aboutus/aboutus.component';
import { MissionComponent } from './components/about/mission/mission.component';
import { EventsComponent } from './components/events/events.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { CartComponent } from './components/registration/cart/cart.component';
import { CheckoutComponent } from './components/registration/checkout/checkout.component';
import { CheckoutStallsComponent } from './components/registration/checkout-stalls/checkout-stalls.component';
import { OrderConfirmationComponent } from './components/registration/order-confirmation/order-confirmation.component';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { LoadingModalComponent } from './shared/loading-modal/loading-modal.component';
import { MediaUploadComponent } from './components/cultural-programs-media-upload/media-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BannerComponent,
    HomeComponent,
    AboutComponent,
    RegistrationComponent,
    AboutusComponent,
    MissionComponent,
    EventsComponent,
    GalleryComponent,
    CartComponent,
    CheckoutComponent,
    CheckoutStallsComponent,
    OrderConfirmationComponent,
    FeedbackFormComponent,
    LoadingModalComponent,
    MediaUploadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    Wpng2RoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
