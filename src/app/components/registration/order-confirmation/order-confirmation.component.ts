import { Component, OnInit } from '@angular/core';
import { WooCommerceService } from '../service/woo-commerce.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {

  orderId: string | null = null;
  errorMessage: string | null = null;
  orderDetails: any;
  confirmationMessage: string | null = null;
  loading = true;  // Track loading state

  constructor(private router: Router, private route: ActivatedRoute, private wcService: WooCommerceService,
    private cartService: CartService) { }

  ngOnInit(): void {

    // Extract query parameters from the URL
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      const redirectStatus = params['redirect_status'];
      // Check if the payment status indicates a failure
      if (redirectStatus === 'failed') {
        this.loading = false; // Stop loading if there was a failure
        this.errorMessage = 'Your payment was unsuccessful. Please try again or contact support.';
      } else if (this.orderId) {
        this.getOrderDetails(this.orderId);
        this.confirmPayment(this.orderId);
        this.cartService.clearCart();
      }
    });
  }

  getOrderDetails(orderId: string): void {
    this.wcService.getOrder(orderId).subscribe(
      (order: any) => {
        this.orderDetails = order;
        this.loading = false; // Stop loading when order details are fetched
      },
      (error) => {
        console.error('Failed to fetch order details:', error);
        this.errorMessage = 'Failed to retrieve order details. Please try again later.';
        this.loading = false; // Stop loading on error
      }
    );
  }

  confirmPayment(orderId: string | null) {
    this.wcService.confirmPayment(orderId)
      .subscribe(
        response => {
          // Handle success response
          this.confirmationMessage = 'Your payment has been confirmed!';
          console.log('Payment confirmed:', response);
        },
        error => {
          // Handle error response
          this.errorMessage = 'There was an error confirming your payment.';
          console.error('Payment confirmation error:', error);
        }
      );
  }

  calculateOrderTotal(): number {
    return this.orderDetails.line_items.reduce((total: number, item: any) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  goToShop() {
    this.router.navigate(['/events']);
  }

  goToCart() {
    this.router.navigate(['/checkout']);
  }
}
