import { Component } from '@angular/core';
import { WooCommerceService } from './service/woo-commerce.service';
import { CartService } from './service/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  filterValue: string = 'nonbusiness'; // Default filter value

  constructor(private wooCommerceService: WooCommerceService, private cartService: CartService, private router: Router,
    private productCacheService: ProductCacheService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.cart = this.cartService.getCart();

    // Read the 'type' query parameter from the URL (e.g., ?type=business or ?type=nonbusiness)
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.filterValue = params['type'].toLowerCase(); // Ensure lowercase comparison
      }
      this.loadProducts();
    });

  }

  loadProducts() {
    // Check if products are cached
    if (this.productCacheService.hasProducts()) {
      this.products = this.filterProducts(this.productCacheService.getProducts());
      this.loading = false;
    } else {
      this.wooCommerceService.getProducts().subscribe((data) => {
        const filteredProducts = this.filterProducts(data);
        this.products = filteredProducts;
        this.productCacheService.setProducts(data); // Cache all products (unfiltered)
        this.loading = false;
      });
    }
  }

  filterProducts(products: any[]): any[] {
    return products.filter((p: any) => {
      const hasMatchingType = p.attributes?.some(
        (attr: any) =>
          attr.name.toLowerCase() === "product_type" &&
          attr.options.some((option: string) => option.toLowerCase() === this.filterValue)
      );
      return p.stock_status === 'instock' && hasMatchingType;
    }).map(product => ({ ...product, quantity: 0 })); // Ensure quantity is initialized to 0
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
