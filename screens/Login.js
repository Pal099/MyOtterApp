import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Registro from './registro';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ username: '', password: '' });
  const navigation = useNavigation();
  const timeoutDuration = 5 * 60 * 1000; // 5 minutes

  // Store the timeout ID to clear it when needed
  let inactivityTimeout = null;

  // Start inactivity timer
  const startInactivityTimer = useCallback(() => {
    clearTimeout(inactivityTimeout); // Clear any existing timer
    inactivityTimeout = setTimeout(() => {
      handleLogout();
    }, timeoutDuration);
  }, [inactivityTimeout]);

  // Reset the timer on user activity
  const resetInactivityTimer = () => {
    startInactivityTimer();
  };

  // Set up the inactivity timer when user logs in
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Start the timer when the screen is focused
      startInactivityTimer();
    });
    return () => {
      unsubscribe();
      clearTimeout(inactivityTimeout); // Clear timer on component unmount
    };
  }, [navigation, startInactivityTimer]);

  const handleLogin = async () => {
    if (validateFields()) {
      try {
        await signInWithEmailAndPassword(auth, username, password);
        Alert.alert('Iniciando Sesión', 'Accediendo...');
        navigation.navigate('Home');
        startInactivityTimer(); // Start inactivity timer on successful login
      } catch (error) {
        console.log(error);
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'El correo electrónico no es válido.');
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          Alert.alert('Error', 'Correo o contraseña incorrectos.');
        } else {
          Alert.alert('Error', error.message);
        }
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Sesión Cerrada', 'La sesión ha expirado por inactividad.');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error closing session:', error.message);
    }
  };

  const validateFields = () => {
    let valid = true;
    const errors = { username: '', password: '' };

    if (!username) {
      errors.username = 'El correo electrónico es obligatorio.';
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(username)) {
      errors.username = 'Por favor, introduce un correo electrónico válido.';
      valid = false;
    }

    if (!password) {
      errors.password = 'La contraseña es obligatoria.';
      valid = false;
    }

    setError(errors);
    return valid;
  };

  return (
    <LinearGradient colors={['#FFA500', '#FFFFFF']} style={styles.container}>
      <Image source={require('../assets/hammer.png')} style={styles.profile} />
      <View style={styles.titleContainer}>
        <Text style={styles.titleOutline}>¡Ujier Assistant!</Text>
        <Text style={styles.title}>¡Ujier Assistant!</Text>
      </View>
      
      <View style={styles.card}>
        <TextInput
          style={[styles.input, error.username && styles.errorInput]}
          placeholder="Correo Electrónico"
          placeholderTextColor="#777"
          value={username}
          onChangeText={text => {
            setUsername(text);
            setError({ ...error, username: '' });
            resetInactivityTimer();
          }}
        />
        {error.username ? <Text style={styles.errorText}>{error.username}</Text> : null}
        
        <TextInput
          style={[styles.input, error.password && styles.errorInput]}
          placeholder="Contraseña"
          placeholderTextColor="#777"
          value={password}
          onChangeText={text => {
            setPassword(text);
            setError({ ...error, password: '' });
            resetInactivityTimer();
          }}
          secureTextEntry
        />
        {error.password ? <Text style={styles.errorText}>{error.password}</Text> : null}
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        
        
        {/* Botón de Registrarse */}
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('registro')}>
  <Text style={styles.registerButtonText}>¿No tienes una cuenta? Regístrate aquí</Text>
</TouchableOpacity>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 1,
  },
  titleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    zIndex: 1, // Ensure this text appears above the outline
  },
  titleOutline: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
    position: 'absolute',
    left: 2,
    top: 2,
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    marginTop: 20,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  errorInput: {
    borderColor: '#FF6347',
  },
  button: {
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF6347',
    fontSize: 12,
    marginBottom: 10,
  },
  registerButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFA500',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
