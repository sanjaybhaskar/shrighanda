import { ChangeDetectorRef, Component } from '@angular/core';
import { WooCommerceService } from '../service/woo-commerce.service';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentService } from '../service/payment.service';
import { environment } from 'src/environments/environment';
import { style } from './checkout-stalls.constant';

@Component({
  selector: 'app-checkout-stalls',
  templateUrl: './checkout-stalls.component.html',
  styleUrls: ['./checkout-stalls.component.scss']
})

export class CheckoutStallsComponent {
  // Existing properties
  errorMessage: string | null = null;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  cartItems: any[] = [];
  dutchPhonePattern: string = '^(\\+31|0)[1-9][0-9]{8}$';
  stripe: any;
  elements: any;
  card: any;
  orderData: any;
  orderId: any;
  selectedPaymentMethod: string = 'card';
  isLoading: boolean = false;
  selectedBank: any;
  paymentModeValid: boolean = false;

  // New properties for Business Information
  businessName: string = '';
  businessAddress: string = '';
  businessContactNumber: string = '';
  businessType: string = ''; // Options: Food Vendor, Home decor & handicrafts, etc.
  businessTypes: string[] = [
    'Food Vendor',
    'Home decor & handicrafts',
    'Clothing & clothing accessories',
    'Face painting and mehendi',
    'Other'
  ];

  // New properties for Menu Details
  menuType: string = ''; // Options: South Indian, North Indian, etc.
  menuTypes: string[] = [
    'South Indian',
    'North Indian',
    'Chinese',
    'Snacks',
    'Desserts',
    'NA'
  ];
  menuItems: string = '';

  requiresElectricity: boolean = false;
  electricityPoints: number = 2; // Default to 1 point
  kvkRegistrationNumber: string = '';
  agreeToWasteManagement: boolean = false; // Agreement checkbox
  numberOfPersons: number | null = null; // Number of persons in the stall (1 or 2)
  remarks: string = ''; // Optional remarks

  constructor(
    private wcService: WooCommerceService,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef
  ) {}

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
            attr.options.some((option: string) => option.toLowerCase() === 'business')
        );
        return hasMatchingType;
      });
      this.checkAndInitializeStripe()
    }
  }

  private checkAndInitializeStripe() {
    const total = this.calculateCartTotal();
    if (total > 0) {
      this.initializeStripe();
    } else {
      // Destroy the existing iDEAL element if the total is 0
      if (this.card) {
        this.card.destroy();
        this.card = null;
      }
    }
  }

  public calculateCartTotal(): number {
    let total = this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
    // Add food price for non-food vendors
    if (this.businessType && this.businessType !== 'Food Vendor' && this.numberOfPersons) {
      total += 15 * this.numberOfPersons;
    }
  
    return total;
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

  // Example: Call this method when numberOfPersons changes
  onNumberOfPersonsChange() {
    this.checkAndInitializeStripe();
  }

  private async createOrder() {
    const totalAmount = this.calculateCartTotal();
    this.orderData = {
      billing: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        phone: this.phoneNumber,
        // Add fields for KVK number, number of electricity points and number of persons in stall (optional, if business type is non food)
      },
      business_address: this.businessAddress,
      business_contact_name: this.businessName,
      business_contact: this.businessContactNumber,
      business_type: this.businessType,
      business_electricity_requirement: this.requiresElectricity,
      business_waste_management_agree: this.agreeToWasteManagement,
      business_remarks: this.remarks ?? '',
      business_type_cusine: this.menuType,
      business_type_cusine_menu_item: this.menuItems,
      business_kvk_number: this.kvkRegistrationNumber,
      business_add_people_attending: this.numberOfPersons,
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
            window.location.href = `https://shrigandha.nl/order-confirmation?orderId=${order.id}&redirect_status=success`;
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


