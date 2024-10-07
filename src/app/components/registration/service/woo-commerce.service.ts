import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class WooCommerceService {
    private getProductsApiUrl = 'https://shrigandha.nl/wp-json/wc/v3/products';
    private wcApiUrl = 'https://shrigandha.nl/wp-json/wc/v3/orders';

    constructor(private http: HttpClient) { }

    getProducts(): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': 'Basic ' + btoa(`${environment.consumerKey}:${environment.consumerSecret}`),
        });

        return this.http.get(this.getProductsApiUrl, { headers }).pipe(
            map((products: any) => products)
        );
    }

    // Function to create WooCommerce order
    createOrder(orderData: any) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization:
                'Basic ' + btoa(environment.consumerKey + ':' + environment.consumerSecret),
        });

        return this.http.post(this.wcApiUrl, orderData, { headers });
    }

    getOrder(orderId: string) {
        const url = `${this.wcApiUrl}/${orderId}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization:
                'Basic ' + btoa(environment.consumerKey + ':' + environment.consumerSecret),
        });
        return this.http.get(url, { headers });
      }
      
}
