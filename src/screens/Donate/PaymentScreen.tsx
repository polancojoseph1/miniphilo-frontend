import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function PaymentScreen({route, navigation}: any) {
  const {donationAmount, processingFee, totalCharge} = route.params;

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  // Validate form
  const validateForm = () => {
    if (!cardholderName.trim()) {
      Alert.alert('Missing Information', 'Please enter cardholder name');
      return false;
    }
    
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }
    
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 15 || cleanCardNumber.length > 16) {
      Alert.alert('Invalid Card', 'Please enter a valid card number');
      return false;
    }
    
    if (expiryDate.length !== 5 || !expiryDate.includes('/')) {
      Alert.alert('Invalid Expiry', 'Please enter expiry date as MM/YY');
      return false;
    }
    
    if (cvv.length < 3 || cvv.length > 4) {
      Alert.alert('Invalid CVV', 'Please enter a valid CVV');
      return false;
    }
    
    return true;
  };

  // Process payment (placeholder for Stripe integration)
  const processPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // TODO: Integrate with Stripe
      // This is a placeholder simulation
      await new Promise(resolve => setTimeout(() => resolve(undefined), 2000));

      // Simulate random success/failure for demo
      const success = Math.random() > 0.1; // 90% success rate

      if (success) {
        navigation.navigate('Confirmation', {
          donationAmount,
          processingFee,
          totalCharge,
          email,
          transactionId: `TXN${Date.now()}`,
          cardLast4: cardNumber.replace(/\s/g, '').slice(-4),
        });
      } else {
        Alert.alert(
          'Payment Failed',
          'Your payment could not be processed. Please check your card details and try again.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Complete Your Donation</Text>
            <Text style={styles.subtitle}>Secure payment powered by Stripe</Text>
          </View>

          {/* Donation Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Donation Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Donation amount:</Text>
              <Text style={styles.summaryValue}>${donationAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Processing fee:</Text>
              <Text style={styles.summaryValue}>${processingFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.summaryLabelTotal}>Total charge:</Text>
              <Text style={styles.summaryValueTotal}>${totalCharge.toFixed(2)}</Text>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Contact Information</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Payment Information */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Payment Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                value={cardholderName}
                onChangeText={setCardholderName}
                placeholder="John Doe"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                placeholder="1234 5678 9012 3456"
                keyboardType="number-pad"
                maxLength={19}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  placeholder="MM/YY"
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  value={cvv}
                  onChangeText={(text) => setCvv(text.replace(/\D/g, '').substring(0, 4))}
                  placeholder="123"
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>

          {/* Security Notice */}
          <View style={styles.securitySection}>
            <Text style={styles.securityTitle}>🔒 Secure Payment</Text>
            <Text style={styles.securityText}>
              Your payment information is encrypted and processed securely by Stripe.
              We never store your card details.
            </Text>
          </View>

          {/* Submit Button */}
          <View style={styles.buttonSection}>
            {/* Temporary bypass button for testing */}
            <TouchableOpacity
              style={[styles.submitButton, styles.testButton]}
              onPress={() => {
                navigation.navigate('Confirmation', {
                  donationAmount,
                  processingFee,
                  totalCharge,
                  email: 'test@example.com',
                  transactionId: `TEST${Date.now()}`,
                  cardLast4: '1234',
                });
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                SKIP PAYMENT (Testing Only)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, isProcessing && styles.submitButtonDisabled]}
              onPress={processPayment}
              disabled={isProcessing}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isProcessing ? 'Processing...' : `Donate $${totalCharge.toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
  },
  summarySection: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#f0f8f0',
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 12,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  summaryLabelTotal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputGroupHalf: {
    flex: 1,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  securitySection: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#4CAF50',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#FF9800',
    marginBottom: 12,
  },
});