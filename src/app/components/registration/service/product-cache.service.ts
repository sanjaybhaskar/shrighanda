import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductCacheService {
  private productsCache: any[] = []; // Cache for products

  setProducts(products: any[]): void {
    this.productsCache = products;
  }

  getProducts(): any[] {
    return this.productsCache;
  }

  hasProducts(): boolean {
    return this.productsCache.length > 0;
  }
}
