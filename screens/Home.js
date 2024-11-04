import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../firebaseConfig'; // Asegúrate de que esta línea sea correcta

export default function Home() {
  const navigation = useNavigation();

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        Alert.alert('Cerrar Sesión', 'Has cerrado sesión exitosamente.');
        navigation.navigate('Login'); // Redirigir a la pantalla de inicio de sesión
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <LinearGradient colors={['#FFA500', '#FFFFFF']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Demandados')}
        >
          <Text style={styles.cardTitle}>Demandados</Text>
          <Text style={styles.cardDescription}>Detalles sobre los demandados</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Ubicaciones')}
        >
          <Text style={styles.cardTitle}>Ubicaciones Demandados</Text>
          <Text style={styles.cardDescription}>Detalles sobre ubicaciones</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FFA500',
    borderRadius: 20,
    padding: 10,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDescription: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
});
