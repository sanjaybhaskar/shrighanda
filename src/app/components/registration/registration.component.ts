import { Component } from '@angular/core';
import { WooCommerceService } from './service/woo-commerce.service';
import { CartService } from './service/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  products: any[] = [];
  adultQuantity: number = 1;
  childQuantity: number = 1;

  constructor(private wooCommerceService: WooCommerceService, private cartService: CartService, private router: Router) { }

  ngOnInit() {
    this.wooCommerceService.getProducts().subscribe((data) => {
      this.products = data.filter((p: any) => p.stock_status === 'instock');
      this.products.forEach(product => {
        product.quantity = 0; // Default quantity is 0
      });
    });
  }

  isQuantityValid(product: any): boolean {
    return product.quantity > 0;
  }

  onQuantityChange(product: any): void {
    // Optional: You can add logic here if needed when quantity changes
    if (product.quantity < 1) {
      product.quantity = 1; // Ensure quantity can't go below 1
    }
  }

  getCartCount(): number {
    return this.cartService.getCartItemCount();
  }

  // Add product to cart
  addToCart(product: any) {
    this.cartService.addToCart(Object.assign({}, product));
    product.quantity = 0;
  }

  increaseQuantity(product: any) {
    if (product.quantity < 10) {
      product.quantity += 1; // Increment quantity
    }
  }

  decreaseQuantity(product: any) {
    if (product.quantity > 0) {
      product.quantity -= 1; // Decrement quantity, ensure it doesn't go below 0
    }
  }

  calculateTotalCost(product: any): number {
    return product.price * product.quantity; // Calculate total cost based on price and quantity
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
