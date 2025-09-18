// DonateScreen.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function DonateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donate</Text>
      <Text style={styles.text}>Choose an amount and start giving 💚</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});
