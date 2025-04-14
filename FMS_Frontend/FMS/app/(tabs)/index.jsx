import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';

const MainScreen = () => {
  const router = useRouter();
  const [showButtons, setShowButtons] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Handle initial animation and button display
  useEffect(() => {
    // Fade in logo animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Set timer to show buttons after 4.5 seconds
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleForgotPassword = () => {
    // Implement forgot password logic or navigation
    console.log('Forgot Password pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer, 
          { opacity: fadeAnim, transform: [{ translateY: showButtons ? -60 : 0 }] }
        ]}
      >
        {/* Logo and app name positioned higher when buttons show */}
        <Image 
          source={require('D:/FMS Frontend/FMS/assets/images/Vector.png')} 
          style={styles.logoIcon} 
          resizeMode="contain"
        />
        <Text style={styles.appName}>RupeePilot</Text>
        <Text style={styles.tagline}>Your Co-Pilot in Financial Success</Text>
      </Animated.View>

      {showButtons && (
        <Animated.View 
          style={[
            styles.buttonContainer,
            { opacity: fadeAnim }
          ]}
        >
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.signupButton} 
            onPress={handleSignUp}
          >
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16a085',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
    position: 'relative',
    top: -30, // Position logo higher initially
  },
  logoIcon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'Black',
    marginBottom: 10,
  },
  tagline: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#10d276',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 15,
  },
  signupButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPasswordText: {
    color: 'white',
    textDecorationLine: 'underline',
  },
});

export default MainScreen;