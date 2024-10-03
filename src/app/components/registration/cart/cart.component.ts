import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { Product } from '../product/model/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  cartItems: any = [];

  constructor(private router: Router) {
    // Retrieve cart items from localStorage
    const storedCartItems = localStorage.getItem('cartItems');
    this.cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
  }

  getGroupedCartItems() {
    const groupedItems: { [key: number]: { product: Product; quantity: number } } = {};

    this.cartItems.forEach((item: any) => {
      const productId = item.product.id;
      if (!groupedItems[productId]) {
        groupedItems[productId] = {
          product: item.product,
          quantity: 0
        };
      }
      groupedItems[productId].quantity += item.quantity;
    });

    return Object.values(groupedItems);
  }

  calculateItemTotal(item: any) {
    const price = parseFloat(item.product.price); // Use the price property directly
    return (price * item.quantity).toFixed(2);
  }

  calculateCartTotal() {
    return this.getGroupedCartItems().reduce((total, item) => {
      const price = parseFloat(item.product.price); // Use the price property directly
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  }

  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter((item: any) => item.product.id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
