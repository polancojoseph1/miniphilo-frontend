// Stripe Configuration
// In production, these should be environment variables

// Test keys (replace with your actual keys)
export const STRIPE_CONFIG = {
  publishableKey: 'pk_test_your_stripe_publishable_key_here',

  // Backend URL for creating payment intents
  // In development, this could be your local server (e.g., 'http://localhost:3001')
  // In production, this should be your live backend URL
  backendUrl: 'https://your-backend-api.com',

  // Payment settings
  currency: 'usd',
  country: 'US',
};

// Payment intent creation endpoint
export const createPaymentIntent = async (amount: number, metadata: any) => {
  try {
    const response = await fetch(`${STRIPE_CONFIG.backendUrl}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Stripe expects amount in cents
        currency: STRIPE_CONFIG.currency,
        metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};