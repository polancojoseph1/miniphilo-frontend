import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import DonateScreen from './src/screens/Donate/DonateScreen';
// import RecordScreen from './src/screens/Record/RecordScreen';

const Stack = createNativeStackNavigator();

function HomeScreen({navigation}: any) {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, {backgroundColor: isDarkMode ? '#2c3e50' : '#ffffff'}]}>
      {/* App Title */}
      <Text style={styles.title}>Mini Philanthropist</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Making giving accessible to everyone</Text>

      {/* Main Message */}
      <Text style={styles.message}>One link. One tap. Infinite impact.</Text>

      {/* Start Giving Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('Donate')}>
        <Text style={styles.startButtonText}>Start Giving</Text>
      </TouchableOpacity>

      {/* Record First Button */}
      <TouchableOpacity
        style={styles.recordButton}
        onPress={() => navigation.navigate('Record')}>
        <Text style={styles.recordButtonText}>Record Message First</Text>
      </TouchableOpacity>


      {/* Debug Info */}
      <Text style={styles.description}>
        📱 Running on {Platform.OS === 'ios' ? 'iOS' : 'Android'}
      </Text>
      <Text style={styles.description}>✅ Mini Philanthropist v0.1</Text>
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Stack.Screen name="Donate" component={DonateScreen} />
        {/* <Stack.Screen name="Record" component={RecordScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 600,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
    shadowColor: '#4CAF50',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
    width: '80%',
    marginBottom: 30,
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default App;
