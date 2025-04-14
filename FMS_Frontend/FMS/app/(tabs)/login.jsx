// app/login.js (Login Screen)
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
  
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
  
    try {
      const response = await fetch('http://192.168.147.177:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const contentType = response.headers.get('Content-Type');
      let data;
  
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response: ${text}`);
      }
  
      if (!response.ok) {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
        return;
      }
  
      // Save token here (AsyncStorage/SecureStore)
      // await AsyncStorage.setItem('token', data.token);
  
      Alert.alert('Success', 'Login successful!');
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('userName', data.user.name); // <- Save correct name
      router.replace('/dashboard');
      

    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }

  };
  
  


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00C09A" barStyle="dark-content" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Welcome</Text>
        <View style={styles.placeholderForAlignment}></View>
      </View>
      
      {/* Login Form */}
      <View style={styles.formContainer}>
        {/* Email Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Username Or Email</Text>
          <TextInput
            style={styles.textInput}
            placeholder="example@example.com"
            placeholderTextColor="#AAAAAA"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        {/* Password Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor="#AAAAAA"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIconText}>{showPassword ? '👁' : '👁‍🗨'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
        
        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotContainer} onPress={() => console.log('Forgot password pressed')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
        
        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={() => console.log('Sign up pressed')}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00C09A',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholderForAlignment: {
    width: 40, // Same width as the back button
  },
  formContainer: {
    flex: 3,
    backgroundColor: '#F5F8F8',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#E8F0E8',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8F0E8',
    borderRadius: 25,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },
  eyeIconText: {
    fontSize: 20,
    color: '#888',
  },
  loginButton: {
    backgroundColor: '#00C09A',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  forgotText: {
    color: '#555',
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: '#F5F8F8',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 16,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoginScreen;