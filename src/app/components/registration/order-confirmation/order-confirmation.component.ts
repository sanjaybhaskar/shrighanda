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
  isLoading:boolean = true;  // Track loading state
  redirectStatus: any;

  constructor(private router: Router, private route: ActivatedRoute, private wcService: WooCommerceService,
    private cartService: CartService) { }

  ngOnInit(): void {

    // Extract query parameters from the URL
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      this.redirectStatus = params['redirect_status'];
      // Check if the payment status indicates a failure
      if (this.redirectStatus === 'failed') {
        this.errorMessage = 'Your payment was unsuccessful. Please try again or contact support.';
        this.isLoading = false; // Stop loading if there was a failure
      } else if (this.orderId) {
        this.getOrderDetails(this.orderId);
      }
      this.cartService.clearCart();
    });
  }

  getOrderDetails(orderId: string): void {
    this.wcService.getOrder(orderId).subscribe(
      (order: any) => {
        this.orderDetails = order;
        if(this.redirectStatus === 'success') {
          this.confirmPayment(this.orderId);
        } else {
          this.confirmationMessage = 'Your payment is currently unconfirmed. As soon as we receive the payment confirmation, we will send you an email to confirm your order.!';
          this.isLoading = false; // Stop loading if there was a failure
        }
      },
      (error) => {
        console.error('Failed to fetch order details:', error);
        this.errorMessage = 'Failed to retrieve order details. Please try again later.';
        this.isLoading = false; // Stop loading on error
      }
    );
  }

  confirmPayment(orderId: string | null) {
    this.wcService.confirmPayment(orderId)
      .subscribe(
        response => {
          // Handle success response
          this.confirmationMessage = 'Your payment has been confirmed!';
          this.isLoading = false; // Stop loading if there was a failure
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
