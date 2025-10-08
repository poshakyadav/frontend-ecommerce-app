// src/razorpay.d.ts

// Define the options that Razorpay accepts
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: any) => void;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    theme: {
      color: string;
    };
  }
  
  // Define the Razorpay constructor and methods
  interface Razorpay {
    new (options: RazorpayOptions): any;
    open(): void;
  }
  
  // Extend the Window interface to include Razorpay
  interface Window {
    Razorpay: Razorpay;
  }