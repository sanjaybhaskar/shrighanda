import { ChangeDetectorRef, Component } from '@angular/core';
import { WooCommerceService } from '../service/woo-commerce.service';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentService } from '../service/payment.service';
import { environment } from 'src/environments/environment';
import { style } from './checkout.constant';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  errorMessage: string | null = null;  // Add this to hold the error message

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  city: string = '';    // Added City
  commute: string = 'own';  // Added Commute
  phoneNumber: string = '';
  cartItems: any[] = []; // You can get the cart items from localStorage or a cart service
  dutchPhonePattern: string = '^(\\+31|0)[1-9][0-9]{8}$';
  stripe: any;
  elements: any;
  card: any;
  orderData: any;
  orderId: any;
  selectedPaymentMethod: string = 'card'; // Default selected payment method
  isLoading: boolean = false;
  selectedBank: any;
  paymentModeValid: boolean = false;

  constructor(private wcService: WooCommerceService,
    private paymentService: PaymentService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    // Retrieve cart items from localStorage
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.cartItems = this.cartItems.filter((item) => {
        const hasMatchingType = item.product.attributes?.some(
          (attr: any) =>
            attr.name.toLowerCase() === "product_type" &&
            attr.options.some((option: string) => option.toLowerCase() === 'nonbusiness')
        );
        return hasMatchingType;
      });
      if (this.calculateCartTotal() > 0) {
        this.initializeStripe();
      }
    }

  }

  private async initializeStripe() {
    this.stripe = await loadStripe(environment.stripePublisherKey); // Replace with your Stripe publishable key
    this.setupIdealElement();
  }


  private setupIdealElement() {
    const elements = this.stripe.elements();
    if (this.card) this.card.destroy(); // Clean up the previous element
    this.card = elements.create('idealBank', { style }); // Create an iDEAL Element
    this.card.mount('#ideal-bank-element'); // Mount the iDEAL Element to the DOM
    // Event listener for the idealBank Element
    this.card.on('change', (event: any) => {
      if (event.value) {
        // Store the selected bank in the component state
        this.selectedBank = event.value; // e.g., 'abn_amro'
        this.paymentModeValid = !this.paymentModeValid;
      }
    });
  }

  // Calculate the total price of the cart
  calculateCartTotal() {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  async handleSubmit(event: Event) {
    event.preventDefault(); // Prevent default form submission
    this.isLoading = true; // Set loading state to true
    this.cdr.detectChanges(); // Manually trigger change detection

    try {
      await this.createOrder();
      // Optionally redirect or display success message
    } catch (error: any) {
      console.error('Payment error:', error.message);
    } finally {
      this.isLoading = false; // Reset loading state after payment process
      this.cdr.detectChanges(); // Manually trigger change detection
    }

  }

  private async createOrder() {
    const totalAmount = this.calculateCartTotal();
    this.orderData = {
      billing: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        phone: this.phoneNumber,
        city: this.city,
        commute: this.commute
      },
      line_items: this.cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
      payment_method: this.selectedBank, // Use the selected bank here
      payment_method_title: 'iDEAL',
      total: totalAmount
    };

    return new Promise((resolve, reject) => {
      this.wcService.createOrder(this.orderData).subscribe(
        async (order: any) => {
          this.orderId = order.id;
          if (totalAmount === 0) {
            window.location.href = `https://shrigandha.nl/order-confirmation?orderId=${order.id}&redirect_status=succeeded`;
          }
          else {
            this.handleStripePayment(order);
          }
        },
        (error) => {
          console.error('Order creation error:', error);
        }
      );
    });
  }


  private async handleStripePayment(order: any) {
    const totalAmount = this.calculateCartTotal();

    // Create a PaymentIntent on your backend (you can use WooCommerce for this or create it directly)
    const paymentIntentData = await this.paymentService.createPaymentIntent({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'eur',
      payment_method_types: ['ideal'], // Specify iDEAL payment method
      metadata: { order_id: order.id }  // Pass WooCommerce order ID as metadata
    }).toPromise();

    const clientSecret = paymentIntentData.client_secret;

    // Confirm the payment using Stripe.js and iDEAL
    await this.stripe.confirmIdealPayment(clientSecret, {
      payment_method: {
        ideal: {
          bank: this.selectedBank,
        },
        billing_details: {
          name: `${this.firstName} ${this.lastName}`,
          email: this.email,
        },
      },
      return_url: `https://shrigandha.nl/order-confirmation?orderId=${order.id}` // Handle redirect after payment
    });

  }
}


