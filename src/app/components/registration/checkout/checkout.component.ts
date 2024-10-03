import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WooCommerceService } from '../service/woo-commerce.service';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  city: string = '';
  phoneNumber: string = '';
  cartItems: any[] = []; // You can get the cart items from localStorage or a cart service
  dutchPhonePattern: string = '^(\\+31|0)[1-9][0-9]{8}$';
  stripe: any;
  elements: any;
  card: any;


  constructor(private wcService: WooCommerceService) { }

  ngOnInit(): void {
    // Retrieve cart items from localStorage
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.initializeStripe();
    }

  }

  // Calculate the total price of the cart
  calculateCartTotal() {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }


  handleSubmit(event: Event) {
    event.preventDefault(); // Prevent the default form submission
  
    this.stripe
      .createPaymentMethod({
        type: 'card',
        card: this.card,
      })
      .then((result: any) => {
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          console.error(result.error.message);
        } else {
          // Handle the successful payment here
          console.log('Payment Method:', result.paymentMethod);
          // You can now use the payment method to create a payment intent or complete the payment
          this.SuccessCheckout();
        }
      });
  }

  
  // Handle Checkout
  private SuccessCheckout() {
    // Prepare order data
    const orderData = {
      payment_method: 'stripe', // or 'cod', 'paypal', etc.
      payment_method_title: 'Stripe',
      set_paid: false, // Payment will be handled by Stripe later
      billing: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        phone: this.phoneNumber,
      },
      line_items: this.cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    }

    // Create WooCommerce order
    this.wcService.createOrder(orderData).subscribe(
      (response: any) => {
        // Redirect to WooCommerce checkout URL
        const checkoutUrl = response._links.self.href + '?key=' + response.order_key;
        window.location.href = checkoutUrl;
      },
      (error) => {
        console.error('Error creating order:', error);
      }
    );
  }

  async initializeStripe() {
    this.stripe = await loadStripe('your-publishable-key-from-stripe');
    this.elements = this.stripe.elements();

    // Create an instance of the card element
    this.card = this.elements.create('card');
    this.card.mount('#card-element'); // Mount the card element to a div with this id
  }

}
