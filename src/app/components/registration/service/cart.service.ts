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
        this.loadCart();
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
        this.loadCart();
        this.cart = this.cart.filter((item: any) => item.product.id !== productId);
        this.saveCart();
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    getCart() {
        this.loadCart();
        return this.cart;
    }

    getCartTotal() {
        this.loadCart();
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemCount(): number {
        this.loadCart();
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }


    getGroupedCartItems() {
        this.loadCart();
        const groupedItems: { [key: number]: { product: Product; quantity: number } } = {};

        this.cart.forEach((item: any) => {
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


    calculateCartTotal() {
        return this.getGroupedCartItems().reduce((total, item) => {
            const price = parseFloat(item.product.price); // Use the price property directly
            return total + (price * item.quantity);
        }, 0).toFixed(2);
    }

}
