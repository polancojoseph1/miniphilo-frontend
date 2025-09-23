// Payment Service
// This file contains mock backend functionality for development
// In production, replace this with actual API calls to your backend

export interface PaymentIntentRequest {
  amount: number; // in cents
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// Mock function to simulate backend payment intent creation
// Replace this with actual backend API call in production
export const createPaymentIntent = async (
  _request: PaymentIntentRequest
): Promise<PaymentIntentResponse> => {
  // Simulate network delay
  await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

  // In a real implementation, this would call your backend API
  // Example:
  // const response = await fetch('/api/create-payment-intent', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(request)
  // });
  // return await response.json();

  // Mock response for development
  const mockClientSecret = `pi_mock_${Date.now()}_secret_mock`;
  const mockPaymentIntentId = `pi_mock_${Date.now()}`;

  // Simulate random failures for testing (5% failure rate)
  if (Math.random() < 0.05) {
    throw new Error('Payment intent creation failed');
  }

  return {
    clientSecret: mockClientSecret,
    paymentIntentId: mockPaymentIntentId,
  };
};

// Mock function for webhook handling (for reference)
export const handlePaymentWebhook = async (paymentIntentId: string) => {
  // In production, your backend would handle Stripe webhooks
  // to update payment status, send confirmation emails, etc.
  console.log(`Payment webhook for intent: ${paymentIntentId}`);
};