import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#e0f7fa', '#80deea']} // Light blue gradient colors
      style={styles.container}
    >
      <Image 
        source={require('./../ffapplogo.png')} // Update the path to your logo image
        style={styles.logo}
      />
      <Text style={styles.header}>Fantasy Football Trade Advisor</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Trade')}
      >
        <Text style={styles.buttonText}>Create Trade</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200, // Increased width
    height: 200, // Increased height
    marginBottom: 30, // Slightly reduced margin to move logo up
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000', // Black color
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;