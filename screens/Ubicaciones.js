import React, { useState } from 'react';
import { View, Text, Button, FlatList, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function Ubicaciones() {
  const [ubicaciones, setUbicaciones] = useState([]);

  const handleTakePhoto = async () => {
    // Solicitar permisos de ubicación
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    if (locationStatus !== 'granted') {
      Alert.alert('Permiso denegado', 'Es necesario el permiso para acceder a la ubicación.');
      return;
    }

    // Solicitar permisos de cámara
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      Alert.alert('Permiso denegado', 'Es necesario el permiso para usar la cámara.');
      return;
    }

    // Tomar la foto
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1, // Puedes ajustar la calidad de la imagen
    });

    // Verifica si la foto fue tomada
    if (!result.cancelled) {
      // Obtener la ubicación actual
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Convertir las coordenadas en una dirección
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      const address = reverseGeocode[0];
      const locationInfo = `${address.street || 'Sin calle'}, ${address.city || ''}, ${address.region || ''}`;

      // Obtener la fecha y la hora actuales
      const date = new Date();
      const dateString = date.toLocaleDateString();
      const timeString = date.toLocaleTimeString();

      // Guardar la foto con la información
      setUbicaciones((prevUbicaciones) => [
        ...prevUbicaciones,
        {
          uri: result.uri, // URI de la imagen
          locationInfo,
          date: dateString,
          time: timeString,
          latitude,
          longitude
        }
      ]);
    } else {
      Alert.alert('No se tomó la foto', 'Por favor, intenta tomar una foto para registrar la ubicación.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Tomar Foto" onPress={handleTakePhoto} />
      <FlatList
        data={ubicaciones}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.locationCard}>
            {item.uri ? (  // Asegúrate de que se use la URI correcta
              <Image source={{ uri: item.uri }} style={styles.image} />
            ) : (
              <Text style={styles.errorText}>Imagen no disponible</Text>
            )}
            <Text>Ubicación: {item.locationInfo}</Text>
            <Text>Fecha: {item.date}</Text>
            <Text>Hora: {item.time}</Text>
            <Text>Latitud: {item.latitude}</Text>
            <Text>Longitud: {item.longitude}</Text>
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
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 8,
  },
});
