// app/signup.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SignupScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('+91');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !mobileNumber || !dateOfBirth || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
  
    try {
      const response = await fetch('http://192.168.147.177:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          mobileNumber,
          dateOfBirth,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message || 'Signup failed');
      } else {
        alert('Signup successful!');
        router.replace('/login');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      alert('Something went wrong. Please try again.');
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
        <Text style={styles.titleText}>Create Account</Text>
        <View style={styles.placeholderForAlignment}></View>
      </View>
      
      {/* Signup Form */}
      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContentContainer}>
        {/* Full Name Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="example@example.com"
            placeholderTextColor="#AAAAAA"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        
        {/* Email Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
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
        
        {/* Mobile Number Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="+91"
            placeholderTextColor="#AAAAAA"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
          />
        </View>
        
        {/* Date of Birth Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Date Of Birth</Text>
          <TextInput
            style={styles.textInput}
            placeholder="DD / MM / YYY"
            placeholderTextColor="#AAAAAA"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            keyboardType="numeric"
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
        
        {/* Confirm Password Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor="#AAAAAA"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eyeIconText}>{showConfirmPassword ? '👁' : '👁‍🗨'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
        
        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00C09A',
  },
  header: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholderForAlignment: {
    width: 40, // Same width as the back button
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#F5F8F8',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  formContentContainer: {
    padding: 30,
    paddingBottom: 50,
  },
  inputGroup: {
    marginBottom: 16,
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
  signUpButton: {
    backgroundColor: '#00C09A',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#555',
    fontSize: 14,
  },
  loginLink: {
    color: '#00C09A',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SignupScreen;