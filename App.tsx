import React from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import DonateScreen from './src/screens/Donate/DonateScreen';
import RecordScreen from './src/screens/Record/RecordScreen';

const Stack = createNativeStackNavigator();
const {width, height} = Dimensions.get('window');

function HomeScreen({navigation}: any) {
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [slideAnim] = React.useState(new Animated.Value(50));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <Animated.View 
            style={[
              styles.heroSection,
              {
                opacity: fadeAnim,
                transform: [{translateY: slideAnim}]
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoEmoji}>💚</Text>
              </View>
            </View>
            
            <Text style={styles.title}>KindStream</Text>
            <Text style={styles.subtitle}>Making giving accessible to everyone</Text>
            
            <View style={styles.taglineContainer}>
              <Text style={styles.tagline}>One link. One tap.</Text>
              <Text style={styles.taglineHighlight}>Infinite impact.</Text>
            </View>
          </Animated.View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>🎥</Text>
              </View>
              <Text style={styles.featureTitle}>Personal Messages</Text>
              <Text style={styles.featureDescription}>
                Record heartfelt video messages to connect with your donors
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>💫</Text>
              </View>
              <Text style={styles.featureTitle}>Instant Impact</Text>
              <Text style={styles.featureDescription}>
                Every contribution creates immediate positive change
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>🌍</Text>
              </View>
              <Text style={styles.featureTitle}>Global Community</Text>
              <Text style={styles.featureDescription}>
                Join thousands making philanthropy accessible to all
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={[styles.primaryButton, styles.startButton]}
              onPress={() => navigation.navigate('Donate')}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>🚀</Text>
                <Text style={styles.primaryButtonText}>Start Giving</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, styles.recordButton]}
              onPress={() => navigation.navigate('Record')}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>🎬</Text>
                <Text style={styles.secondaryButtonText}>Record Message First</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Donors</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>$2M+</Text>
              <Text style={styles.statLabel}>Raised</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Countries</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.versionText}>
              Running on {Platform.OS === 'ios' ? 'iOS' : 'Android'}
            </Text>
            <Text style={styles.versionText}>Mini Philanthropist v0.1</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Stack.Screen 
          name="Donate" 
          component={DonateScreen} 
          options={{
            title: 'Choose Your Impact',
            headerStyle: {backgroundColor: '#ffffff'},
            headerTintColor: '#2E7D32',
            headerTitleStyle: {fontWeight: 'bold'},
          }}
        />
        <Stack.Screen 
          name="Record" 
          component={RecordScreen}
          options={{
            title: 'Create Your Message',
            headerStyle: {backgroundColor: '#ffffff'},
            headerTintColor: '#2E7D32',
            headerTitleStyle: {fontWeight: 'bold'},
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 50,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 20,
    lineHeight: 24,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 20,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  taglineHighlight: {
    fontSize: 20,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '700',
    fontStyle: 'italic',
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  featureEmoji: {
    fontSize: 28,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  actionsSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  primaryButton: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 32,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 32,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recordButton: {
    backgroundColor: 'transparent',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#f0f8f0',
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e9ecef',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
});

export default App;