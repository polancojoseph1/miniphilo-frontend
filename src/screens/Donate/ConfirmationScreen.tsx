import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Share,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function ConfirmationScreen({route, navigation}: any) {
  const {donationAmount, processingFee, totalCharge, email, transactionId, cardLast4} = route.params;
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [checkmarkAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate checkmark after a delay
    setTimeout(() => {
      Animated.spring(checkmarkAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 500);
  }, []);

  const shareSuccess = async () => {
    try {
      const message = `I just donated ${donationAmount.toFixed(2)} to make a difference! Join me in giving back. Every contribution matters. #KindStream #MiniPhilanthropist`;
      
      await Share.share({
        message,
        title: 'I just made a donation!',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share at this time');
    }
  };

  const recordMessage = () => {
    navigation.navigate('Record', {
      donationAmount,
      transactionId,
    });
  };

  const donateAgain = () => {
    navigation.navigate('Donate');
  };

  const goHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{scale: scaleAnim}]
            }
          ]}
        >
          {/* Success Animation */}
          <View style={styles.successSection}>
            <Animated.View 
              style={[
                styles.checkmarkContainer,
                {
                  transform: [{scale: checkmarkAnim}]
                }
              ]}
            >
              <Text style={styles.checkmark}>✓</Text>
            </Animated.View>
            
            <Text style={styles.successTitle}>Donation Successful!</Text>
            <Text style={styles.successSubtitle}>
              Thank you for making a difference
            </Text>
          </View>

          {/* Transaction Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.detailsTitle}>Transaction Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Donation Amount:</Text>
              <Text style={styles.detailValue}>${donationAmount.toFixed(2)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Processing Fee:</Text>
              <Text style={styles.detailValue}>${processingFee.toFixed(2)}</Text>
            </View>
            
            <View style={[styles.detailRow, styles.detailRowHighlight]}>
              <Text style={styles.detailLabelHighlight}>Total Charged:</Text>
              <Text style={styles.detailValueHighlight}>${totalCharge.toFixed(2)}</Text>
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID:</Text>
              <Text style={styles.detailValue}>{transactionId}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{email}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Card Used:</Text>
              <Text style={styles.detailValue}>•••• •••• •••• {cardLast4}</Text>
            </View>
          </View>

          {/* Impact Message */}
          <View style={styles.impactSection}>
            <Text style={styles.impactTitle}>Your Impact</Text>
            <Text style={styles.impactText}>
              You've just joined thousands of mini philanthropists making the world a better place. 
              Your ${donationAmount.toFixed(2)} contribution, no matter the size, creates real positive change.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton]}
              onPress={shareSuccess}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>Share Your Impact</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.recordButton]}
              onPress={recordMessage}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>Record Thank You Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.donateButton]}
              onPress={donateAgain}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>Donate Again</Text>
            </TouchableOpacity>
          </View>

          {/* Receipt Notice */}
          <View style={styles.receiptSection}>
            <Text style={styles.receiptTitle}>Receipt & Tax Information</Text>
            <Text style={styles.receiptText}>
              A receipt has been sent to {email}. Keep this for your tax records.
              If you don't receive it within 10 minutes, please check your spam folder.
            </Text>
          </View>

          {/* Bottom Navigation */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={goHome}
              activeOpacity={0.8}
            >
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  content: {
    flex: 1,
  },
  successSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  checkmarkContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#4CAF50',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmark: {
    fontSize: 48,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },
  detailsSection: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailRowHighlight: {
    backgroundColor: '#f0f8f0',
    marginHorizontal: -12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666666',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  detailLabelHighlight: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
    flex: 1,
  },
  detailValueHighlight: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 16,
  },
  impactSection: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#f0f8f0',
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  impactTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 12,
  },
  impactText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
  },
  recordButton: {
    backgroundColor: '#2196F3',
  },
  donateButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#ffffff',
  },
  receiptSection: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  receiptText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  bottomSection: {
    paddingHorizontal: 20,
  },
  homeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#666666',
  },
});