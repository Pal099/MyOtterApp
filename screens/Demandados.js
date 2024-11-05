import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import * as Location from 'expo-location';

export default function Demandados({ navigation, route }) {
  const [demandados, setDemandados] = useState([]);
  const [nuevoDemandado, setNuevoDemandado] = useState({
    nombre: '',
    apellido: '',
    domicilio: '',
    nombreAbogado: '',
    ubicacion: '',
    estado: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaUbicacion, setNuevaUbicacion] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'demandado'), (snapshot) => {
      const demandadosData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setDemandados(demandadosData);
    });
    return () => unsubscribe();
  }, []);

  const obtenerUbicacionActual = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita el permiso de ubicación para continuar.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (reverseGeocode.length > 0) {
      const direccion = `${reverseGeocode[0].street}, ${reverseGeocode[0].city}, ${reverseGeocode[0].region}`;
      setNuevoDemandado(prev => ({ ...prev, ubicacion: direccion }));
      setNuevaUbicacion(direccion);
      setModalVisible(false);
    }
  };

  const eliminarDemandado = async (id) => {
    Alert.alert(
      "Eliminar Demandado",
      "¿Estás seguro de que deseas eliminar este demandado?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'demandado', id));
              Alert.alert("Eliminado", "El demandado ha sido eliminado exitosamente.");
            } catch (error) {
              console.error("Error eliminando el documento: ", error);
              Alert.alert("Error", "No se pudo eliminar el demandado.");
            }
          }
        }
      ]
    );
  };
  const agregarDemandado = async () => {
    if (!nuevoDemandado.nombre || !nuevoDemandado.apellido || !nuevoDemandado.domicilio || !nuevoDemandado.nombreAbogado) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }
    try {
      await addDoc(collection(db, 'demandado'), {
        nombre_demandado: nuevoDemandado.nombre,
        apellido_demandado: nuevoDemandado.apellido,
        domicilio_demandado: nuevoDemandado.domicilio,
        nombre_abogado: nuevoDemandado.nombreAbogado,
        ubicacion: nuevoDemandado.ubicacion,
        estado: nuevoDemandado.estado,
      });
      Alert.alert('Demandado Agregado', `Se ha agregado a ${nuevoDemandado.nombre} ${nuevoDemandado.apellido}`);
      setNuevoDemandado({ nombre: '', apellido: '', domicilio: '', nombreAbogado: '', ubicacion: '', estado: false });
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardText}>{item.nombre_demandado} {item.apellido_demandado}</Text>
        <Text style={styles.cardText}>Domicilio: {item.domicilio_demandado}</Text>
        <Text style={styles.cardText}>Abogado: {item.nombre_abogado}</Text>
        <Text style={styles.cardText}>Ubicación: {item.ubicacion}</Text>
        <Text style={[styles.cardStatus, item.estado ? styles.statusActive : styles.statusInactive]}>
          {item.estado ? 'Notificado' : 'No Notificado'}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => eliminarDemandado(item.id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Modificaciones', { demandado: item })} style={styles.editButton}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => verUbicacion(item.ubicacion)} style={styles.locationButton}>
          <Text style={styles.buttonText}>Ver Ubicación</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const verUbicacion = (ubicacion) => {
    Alert.alert("Ubicación del Demandado", ubicacion);
  };

  return (
    <LinearGradient colors={['#FFA500', '#FFFFFF']} style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput 
          placeholder="Nombre del demandado"
          value={nuevoDemandado.nombre}
          onChangeText={(text) => setNuevoDemandado({ ...nuevoDemandado, nombre: text })}
          style={styles.input}
        />
        <TextInput 
          placeholder="Apellido del demandado"
          value={nuevoDemandado.apellido}
          onChangeText={(text) => setNuevoDemandado({ ...nuevoDemandado, apellido: text })}
          style={styles.input}
        />
        <TextInput 
          placeholder="Domicilio del demandado"
          value={nuevoDemandado.domicilio}
          onChangeText={(text) => setNuevoDemandado({ ...nuevoDemandado, domicilio: text })}
          style={styles.input}
        />
        <TextInput 
          placeholder="Nombre del Abogado"
          value={nuevoDemandado.nombreAbogado}
          onChangeText={(text) => setNuevoDemandado({ ...nuevoDemandado, nombreAbogado: text })}
          style={styles.input}
        />
        <View style={styles.ubicacionContainer}>
          <TextInput 
            placeholder="Ubicación del demandado"
            value={nuevoDemandado.ubicacion}
            editable={false}
            style={styles.ubicacionInput}
          />
          
          <TouchableOpacity style={styles.ubicacionButton} onPress={obtenerUbicacionActual}>
            <Text style={styles.ubicacionButtonText}>Cargar</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={agregarDemandado}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={demandados}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>{nuevaUbicacion}</Text>
            <Button title="Cerrar" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  ubicacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ubicacionInput: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  ubicacionButton: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  ubicacionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#FFA500',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    elevation: 3,
  },
  cardContent: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  cardStatus: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  statusActive: {
    color: 'green',
  },
  statusInactive: {
    color: 'red',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  locationButton: {
    backgroundColor: '#4a4a4a', // gris oscuro
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  
  editButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
