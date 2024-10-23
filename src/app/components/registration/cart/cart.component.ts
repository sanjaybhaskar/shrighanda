import { Component } from '@angular/core';
import { Product } from '../product/model/product.model';
import { Router } from '@angular/router';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  cartItems: any = [];

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  constructor(private router: Router, private cartService: CartService) {
    this.cartItems = this.cartService.getCart();
  }

  getGroupedCartItems() {
    return this.cartService.getGroupedCartItems();
  }

  calculateItemTotal(item: any) {
    const price = parseFloat(item.product.price); // Use the price property directly
    return (price * item.quantity).toFixed(2);
  }

  calculateCartTotal() {
    return this.cartService.calculateCartTotal();
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }

  proceedToEvents() {
    this.router.navigate(['/events']);
  }
}
