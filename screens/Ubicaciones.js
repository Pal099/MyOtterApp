import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { db } from '../firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function Ubicaciones() {
  const [ubicaciones, setUbicaciones] = useState([]);

  // Función para cargar las ubicaciones de Firestore al iniciar
  const loadUbicaciones = async () => {
    const ubicacionesCollection = collection(db, 'ubicaciones');
    const ubicacionesSnapshot = await getDocs(ubicacionesCollection);
    const ubicacionesList = ubicacionesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUbicaciones(ubicacionesList);
  };

  useEffect(() => {
    loadUbicaciones();
  }, []);

  const handleAddUbicacion = async () => {
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    if (locationStatus !== 'granted') {
      Alert.alert('Permiso denegado', 'Es necesario el permiso para acceder a la ubicación.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Obtener la dirección a partir de la latitud y longitud
    const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    const address = reverseGeocode[0];
    const locationInfo = `${address.name || ''}, ${address.street || 'Sin calle'}, ${address.city || ''}, ${address.region || ''}`;

    // Obtener la fecha y hora actuales
    const date = new Date();
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString();

    const newUbicacion = {
      locationInfo, // Usar la dirección en lugar de latitud y longitud
      date: dateString,
      time: timeString,
    };

    // Guardar en Firestore
    try {
      const docRef = await addDoc(collection(db, 'ubicaciones'), newUbicacion);
      newUbicacion.id = docRef.id; // Añadir el ID del documento
      setUbicaciones(prevUbicaciones => [...prevUbicaciones, newUbicacion]);
      Alert.alert('Ubicación guardada', 'La ubicación se ha guardado correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la ubicación en la base de datos.');
      console.error("Error añadiendo documento: ", error);
    }
  };

  const handleDeleteUbicacion = async (id) => {
    try {
      await deleteDoc(doc(db, 'ubicaciones', id));
      setUbicaciones(prevUbicaciones => prevUbicaciones.filter(ubicacion => ubicacion.id !== id));
      Alert.alert('Ubicación eliminada', 'La ubicación se ha eliminado correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la ubicación.');
      console.error("Error eliminando documento: ", error);
    }
  };

  const handleEditUbicacion = (ubicacion) => {
    // Aquí puedes implementar la lógica para editar una ubicación
    Alert.alert('Editar Ubicación', `Ubicación actual: ${ubicacion.locationInfo}`);
    // Implementa la lógica para modificar la ubicación
  };

  return (
    <View style={styles.container}>
      <Button title="Agregar Ubicación" onPress={handleAddUbicacion} />
      <FlatList
        data={ubicaciones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.locationCard}>
            <Text>Ubicación: {item.locationInfo}</Text>
            <Text>Fecha: {item.date}</Text>
            <Text>Hora: {item.time}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => handleEditUbicacion(item)} style={styles.button}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteUbicacion(item.id)} style={styles.button}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  locationCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 4,
    padding: 8,
    marginTop: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
