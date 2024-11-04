import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Registro() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ username: '', password: '' });
  const navigation = useNavigation();
  const timeoutDuration = 5 * 60 * 1000; // 5 minutes

  let inactivityTimeout = null;

  const startInactivityTimer = useCallback(() => {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      handleLogout();
    }, timeoutDuration);
  }, [inactivityTimeout]);

  const resetInactivityTimer = () => {
    startInactivityTimer();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      startInactivityTimer();
    });
    return () => {
      unsubscribe();
      clearTimeout(inactivityTimeout);
    };
  }, [navigation, startInactivityTimer]);

  const handleRegister = async () => {
    if (validateFields()) {
      try {
        await createUserWithEmailAndPassword(auth, username, password);
        Alert.alert('Registro exitoso', 'Usuario creado con éxito.');
        navigation.navigate('Home'); // Navega a la pantalla principal después del registro
      } catch (error) {
        console.log(error);
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'El correo electrónico no es válido.');
        } else if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'El correo electrónico ya está en uso.');
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
      console.log('Error cerrando sesión:', error.message);
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
      <Image source={require('../assets/logo_otter_soft_4.png')} style={styles.profile} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>¡Bienvenido!</Text>
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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
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
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
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
});
