// DonateScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  useColorScheme,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function DonateScreen() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const isDarkMode = useColorScheme() === 'dark';
  
  const presetAmounts = [5, 10, 25, 50, 100];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
  };

  const handleCustomAmount = () => {
    Alert.alert(
      'Custom Amount',
      'Custom amount input coming in next iteration!'
    );
  };

  const handleContinue = () => {
    if (!selectedAmount) {
      Alert.alert('Select Amount', 'Please choose a donation amount first');
      return;
    }
    Alert.alert(
      'Continue',
      `Great! You selected $${selectedAmount}. Payment processing coming next!`
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff'}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={[styles.title, {color: isDarkMode ? '#ffffff' : '#2E7D32'}]}>
            Choose Your Impact
          </Text>
          <Text style={[styles.subtitle, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
            Every donation makes a difference.{'\n'}
            Start your mini philanthropist journey.
          </Text>
        </View>

        {/* Amount Selection Grid */}
        <View style={styles.amountSection}>
          <Text style={[styles.sectionTitle, {color: isDarkMode ? '#ffffff' : '#2E7D32'}]}>
            Select Amount
          </Text>
          
          <View style={styles.amountGrid}>
            {presetAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.amountButton,
                  selectedAmount === amount && styles.amountButtonSelected,
                  {
                    backgroundColor: isDarkMode 
                      ? (selectedAmount === amount ? '#4CAF50' : '#333333')
                      : (selectedAmount === amount ? '#4CAF50' : '#f8f9fa'),
                    borderColor: isDarkMode ? '#555555' : '#e9ecef',
                  }
                ]}
                onPress={() => handleAmountSelect(amount)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.amountText,
                  selectedAmount === amount && styles.amountTextSelected,
                  {color: isDarkMode 
                    ? (selectedAmount === amount ? '#ffffff' : '#cccccc')
                    : (selectedAmount === amount ? '#ffffff' : '#333333')
                  }
                ]}>
                  ${amount}
                </Text>
              </TouchableOpacity>
            ))}
            
            {/* Custom Amount Button */}
            <TouchableOpacity
              style={[
                styles.customButton,
                {backgroundColor: isDarkMode ? '#2196F3' : '#2196F3'}
              ]}
              onPress={handleCustomAmount}
              activeOpacity={0.8}
            >
              <Text style={styles.customText}>Custom</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Selected Amount Display */}
        {selectedAmount && (
          <View style={[
            styles.selectedSection,
            {backgroundColor: isDarkMode ? '#2a2a2a' : '#f0f8f0'}
          ]}>
            <Text style={[styles.selectedLabel, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
              Your Contribution
            </Text>
            <Text style={styles.selectedAmount}>${selectedAmount}</Text>
            <Text style={[styles.feeNote, {color: isDarkMode ? '#999999' : '#999999'}]}>
              Transparent fees will be shown in next iteration
            </Text>
          </View>
        )}

        {/* Impact Message */}
        <View style={styles.impactSection}>
          <Text style={[styles.impactTitle, {color: isDarkMode ? '#4CAF50' : '#2E7D32'}]}>
            Your Impact
          </Text>
          <Text style={[styles.impactText, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
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
              !selectedAmount && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedAmount}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              {selectedAmount ? `Continue with $${selectedAmount}` : 'Select an amount first'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  amountSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
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
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  amountButtonSelected: {
    borderColor: '#4CAF50',
    transform: [{scale: 1.05}],
  },
  amountText: {
    fontSize: 20,
    fontWeight: '600',
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
  selectedSection: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  selectedAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  feeNote: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  impactSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  impactTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  impactText: {
    fontSize: 16,
    lineHeight: 24,
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