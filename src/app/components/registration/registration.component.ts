import { Component } from '@angular/core';
import { WooCommerceService } from './service/woo-commerce.service';
import { CartService } from './service/cart.service';
import { Router } from '@angular/router';
import { ProductCacheService } from './service/product-cache.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  products: any[] = [];
  adultQuantity: number = 1;
  childQuantity: number = 1;
  loading = true;  // Track loading state
  cart: any;
  private productsCache: any[] = []; // Cache for products

  constructor(private wooCommerceService: WooCommerceService, private cartService: CartService, private router: Router,
    private productCacheService: ProductCacheService) { }

  ngOnInit() {
    // Check if products are already cached
    if (this.productCacheService.hasProducts()) {
      this.products = this.productCacheService.getProducts();
      this.loading = false;  // Stop loading as we have cached products
    } else {
      // Fetch products from the service
      this.wooCommerceService.getProducts().subscribe((data) => {
        this.products = data.filter((p: any) => p.stock_status === 'instock');
        this.products.forEach(product => {
          product.quantity = 0; // Default quantity is 0
        });
        this.productCacheService.setProducts(this.products); // Cache the fetched products
        this.loading = false;  // Stop loading once products are fetched
      });
    }
    this.cart = this.cartService.getCart();
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
    this.cart = this.cartService.getCart();  // Update cart after adding product
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

  calculateTotalCost(item: any): number {
    const cartItem = this.cart.find((cartItem: any) => cartItem.product.id === item.product.id);
    return cartItem ? cartItem.product.price * cartItem.quantity : 0;
  }

  viewCart() {
    this.router.navigate(['/cart']);
  }

  // Get the quantity of the product in the cart
  getCartProductQuantity(product: any): number {
    const cartItem = this.cart.find((cartItem: any) => cartItem.product.id === product.id);
    return cartItem ? cartItem.quantity : 0;
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
    this.cart = this.cartService.getCart();  // Update cart after adding product
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }

  calculateCartTotal() {
    return this.cartService.calculateCartTotal();
  }

}
