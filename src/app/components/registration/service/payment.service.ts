// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'https://shrigandha.nl/wp-json/wc/v2';

  constructor(private http: HttpClient) {}

  // Create payment intent with total amount
  createPaymentIntent(paymentData: any): any {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.apiUrl}/create-payment-intent`, paymentData, { headers });
  }
}
