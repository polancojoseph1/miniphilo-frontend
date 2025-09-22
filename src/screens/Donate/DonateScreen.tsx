import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function DonateScreen({navigation}: any) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [processingFee, setProcessingFee] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  
  const presetAmounts = [5, 10, 25, 50];

  // GoFundMe-style fee calculation: 2.9% + $0.30 (added to donor's payment)
  const calculateFees = (donationAmount: number) => {
    const fee = Math.round((donationAmount * 0.029 + 0.30) * 100) / 100;
    const totalCharge = Math.round((donationAmount + fee) * 100) / 100;
    return { fee, totalCharge, donationAmount };
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustomMode(false);
    setCustomAmount('');
    
    const { fee, totalCharge } = calculateFees(amount);
    setProcessingFee(fee);
    setNetAmount(totalCharge);
  };

  const handleCustomAmount = () => {
    setIsCustomMode(true);
    setSelectedAmount(null);
  };

  const handleCustomAmountChange = (text: string) => {
    // Only allow numbers and decimal point
    const numericText = text.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = numericText.split('.');
    if (parts.length > 2) return;
    
    setCustomAmount(numericText);
    
    const amount = parseFloat(numericText);
    if (!isNaN(amount) && amount > 0) {
      const { fee, totalCharge } = calculateFees(amount);
      setProcessingFee(fee);
      setNetAmount(totalCharge);
      setSelectedAmount(amount);
    } else {
      setProcessingFee(0);
      setNetAmount(0);
      setSelectedAmount(null);
    }
  };

  const validateAndContinue = () => {
    const finalAmount = isCustomMode ? parseFloat(customAmount) : selectedAmount;
    
    if (!finalAmount || finalAmount < 1) {
      Alert.alert('Invalid Amount', 'Please enter a donation amount of at least $1');
      return;
    }
    
    if (finalAmount > 10000) {
      Alert.alert('Amount Too Large', 'Maximum donation amount is $10,000');
      return;
    }

    // Navigate to payment screen with donation details
    navigation.navigate('Payment', {
      donationAmount: finalAmount,
      processingFee,
      totalCharge: netAmount > 0 ? netAmount : finalAmount + calculateFees(finalAmount).fee
    });
  };

  const getCurrentAmount = () => {
    return isCustomMode ? parseFloat(customAmount) || 0 : selectedAmount || 0;
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
            <Text style={styles.title}>Choose Your Impact</Text>
            <Text style={styles.subtitle}>
              Every donation makes a difference.{'\n'}
              Start your mini philanthropist journey.
            </Text>
          </View>

          {/* Amount Selection */}
          <View style={styles.amountSection}>
            <Text style={styles.sectionTitle}>Select Amount</Text>
            
            <View style={styles.amountGrid}>
              {presetAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.amountButton,
                    selectedAmount === amount && !isCustomMode && styles.amountButtonSelected,
                  ]}
                  onPress={() => handleAmountSelect(amount)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.amountText,
                    selectedAmount === amount && !isCustomMode && styles.amountTextSelected,
                  ]}>
                    ${amount}
                  </Text>
                </TouchableOpacity>
              ))}
              
              {/* Custom Amount Button/Input */}
              {!isCustomMode ? (
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={handleCustomAmount}
                  activeOpacity={0.8}
                >
                  <Text style={styles.customText}>Custom</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.customInputContainer}>
                  <Text style={styles.dollarSign}>$</Text>
                  <TextInput
                    style={styles.customInput}
                    value={customAmount}
                    onChangeText={handleCustomAmountChange}
                    placeholder="0"
                    keyboardType="decimal-pad"
                    autoFocus={true}
                    maxLength={8}
                  />
                </View>
              )}
            </View>

            {isCustomMode && (
              <TouchableOpacity
                style={styles.backToPresets}
                onPress={() => {
                  setIsCustomMode(false);
                  setCustomAmount('');
                  setSelectedAmount(null);
                  setProcessingFee(0);
                  setNetAmount(0);
                }}
              >
                <Text style={styles.backToPresetsText}>← Back to preset amounts</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Fee Breakdown */}
          {getCurrentAmount() > 0 && (
            <View style={styles.feeSection}>
              <Text style={styles.feeTitle}>Transaction Details</Text>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Donation amount:</Text>
                <Text style={styles.feeValue}>${getCurrentAmount().toFixed(2)}</Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Processing fee:</Text>
                <Text style={styles.feeValue}>${processingFee.toFixed(2)}</Text>
              </View>
              <View style={[styles.feeRow, styles.feeRowTotal]}>
                <Text style={styles.feeLabelTotal}>Total charge to you:</Text>
                <Text style={styles.feeValueTotal}>
                  ${(netAmount > 0 ? netAmount : getCurrentAmount() + processingFee).toFixed(2)}
                </Text>
              </View>
              <Text style={styles.feeNote}>
                Processing fees help cover payment processing costs
              </Text>
            </View>
          )}

          {/* Impact Message */}
          <View style={styles.impactSection}>
            <Text style={styles.impactTitle}>Your Impact</Text>
            <Text style={styles.impactText}>
              Join thousands of mini philanthropists making a difference{'\n'}
              Every contribution, no matter the size, creates positive change{'\n'}
              Be part of a movement that makes giving accessible to all
            </Text>
          </View>

          {/* Continue Button */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !getCurrentAmount() && styles.continueButtonDisabled,
              ]}
              onPress={validateAndContinue}
              disabled={!getCurrentAmount()}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>
                {getCurrentAmount() > 0 
                  ? `Continue with $${getCurrentAmount().toFixed(2)}` 
                  : 'Select an amount first'
                }
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#666666',
  },
  amountSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#2E7D32',
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amountButton: {
    width: '30%',
    aspectRatio: 1.2,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  amountButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
    transform: [{scale: 1.05}],
  },
  amountText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  amountTextSelected: {
    color: '#ffffff',
  },
  customButton: {
    width: '30%',
    aspectRatio: 1.2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#2196F3',
    shadowColor: '#2196F3',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  customText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  customInputContainer: {
    width: '30%',
    aspectRatio: 1.2,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
  },
  dollarSign: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
    position: 'absolute',
    left: 8,
  },
  customInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
    flex: 1,
    padding: 0,
    paddingLeft: 20,
  },
  backToPresets: {
    marginTop: 10,
    paddingVertical: 8,
  },
  backToPresetsText: {
    fontSize: 14,
    color: '#2196F3',
    textAlign: 'center',
  },
  feeSection: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#f0f8f0',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  feeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 16,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feeRowTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 12,
    marginTop: 8,
  },
  feeLabel: {
    fontSize: 16,
    color: '#666666',
  },
  feeValue: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  feeLabelTotal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  feeValueTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  feeNote: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
  impactSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  impactTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2E7D32',
  },
  impactText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#4CAF50',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});