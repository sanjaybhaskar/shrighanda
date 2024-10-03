import { Injectable } from '@angular/core';
import { CartItem, Product } from '../product/model/product.model';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    cart: any[] = [];

    constructor() {
        this.loadCart();
    }

    loadCart() {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.cart));
    }

    addToCart(product: any) {
        console.log(product.quantity);
        
        // Check if the product already exists in the cart
        const existingProduct = this.cart.find((item: any) => item.product.id === product.id);
        console.log('existingProduct', existingProduct);
        
        if (existingProduct) {
            existingProduct.quantity += product.quantity; // Increment quantity if the product exists
        } else {
            // Add new product with a quantity from product object
            this.cart.push({ product, quantity: product.quantity });
        }

        // Update the cart in localStorage
        localStorage.setItem('cartItems', JSON.stringify(this.cart));
    }

    removeFromCart(productId: number) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    getCart() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemCount(): number {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
}
