import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../firebaseConfig';

export default function Home() {
  const navigation = useNavigation();

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        Alert.alert('Cerrar Sesión', 'Has cerrado sesión exitosamente.');
        navigation.navigate('Login');
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <LinearGradient colors={['#FF7F50', '#FFD700']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menú</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#FFFFFF" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={[styles.card, styles.demandadosCard]}
          onPress={() => navigation.navigate('Demandados')}
        >
          <MaterialIcons name="person-search" size={40} color="#FFFFFF" />
          <Text style={styles.cardTitle}>Demandados</Text>
          <Text style={styles.cardDescription}>Ver y gestionar los demandados</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, styles.ubicacionesCard]}
          onPress={() => navigation.navigate('Ubicaciones')}
        >
          <MaterialIcons name="location-on" size={40} color="#FFFFFF" />
          <Text style={styles.cardTitle}>Ubicaciones</Text>
          <Text style={styles.cardDescription}>Ver ubicaciones en el mapa</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  card: {
    flex: 1,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  demandadosCard: {
    backgroundColor: '#FF4500',
  },
  ubicacionesCard: {
    backgroundColor: '#4682B4',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#F0F8FF',
    textAlign: 'center',
    marginTop: 5,
  },
});
