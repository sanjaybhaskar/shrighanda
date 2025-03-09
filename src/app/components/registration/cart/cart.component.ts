import { Component } from '@angular/core';
import { ProductType } from '../product/model/product.model';
import { Router, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems: any[] = [];
  filterValue: ProductType = 'nonbusiness'; // Default filter value

  constructor(
    private router: Router,
    private cartService: CartService,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);

    // Read the 'type' query parameter from the URL
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.filterValue = params['type'].toLowerCase(); // Update filter value based on query parameter
      }
      // Load cart items based on filterValue
      this.cartItems = this.cartService.getCartItemsByType(this.filterValue);
    });
  }

  getGroupedCartItems() {
    return this.cartService.getGroupedCartItems().filter((item: any) => {
      const hasMatchingType = item.product.attributes?.some(
        (attr: any) =>
          attr.name.toLowerCase() === "product_type" &&
          attr.options.some((option: string) => option.toLowerCase() === this.filterValue)
      );
      return hasMatchingType;
    });
  }

  calculateItemTotal(item: any) {
    const price = parseFloat(item.product.price); // Use the price property directly
    return (price * item.quantity).toFixed(2);
  }

  calculateCartTotal() {
    return this.cartItems.reduce((total, item) => {
      const price = parseFloat(item.product.price);
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
    // Refresh the cart items after removal
    this.cartItems = this.cartService.getCartItemsByType(this.filterValue);
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }

  proceedToEvents() {
    this.router.navigate(['/events']);
  }
}