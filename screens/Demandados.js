import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default function Demandados({ navigation }) {
  const [demandados, setDemandados] = useState([]);
  const [nuevoDemandado, setNuevoDemandado] = useState({
    nombre: '',
    apellido: '',
    domicilio: '',
    nombreAbogado: '',
    estado: false,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'demandado'), snapshot => {
      const demandadosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDemandados(demandadosData);
    });
    return () => unsubscribe();
  }, []);

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
        estado: nuevoDemandado.estado,
      });
      Alert.alert('Demandado Agregado', `Se ha agregado a ${nuevoDemandado.nombre} ${nuevoDemandado.apellido}`);
      setNuevoDemandado({ nombre: '', apellido: '', domicilio: '', nombreAbogado: '', estado: false });
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert('Error', error.message);
    }
  };

  const eliminarDemandado = async (id) => {
    try {
      await deleteDoc(doc(db, "demandado", id));
      Alert.alert('Demandado Eliminado', 'El demandado ha sido eliminado exitosamente.');
    } catch (error) {
      console.error("Error deleting document: ", error);
      Alert.alert('Error', error.message);
    }
  };

  const toggleEstado = async (id, currentEstado) => {
    try {
      await updateDoc(doc(db, 'demandado', id), { estado: !currentEstado });
    } catch (error) {
      console.error("Error updating document: ", error);
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.column}>{item.nombre_demandado}</Text>
      <Text style={styles.column}>{item.apellido_demandado}</Text>
      <Text style={styles.column}>{item.domicilio_demandado}</Text>
      <Switch
        value={item.estado}
        onValueChange={() => toggleEstado(item.id, item.estado)}
        thumbColor={item.estado ? 'green' : 'red'}
      />
      <Text style={[styles.column, { color: item.estado ? 'green' : 'red' }]}>{item.estado ? 'Notificado' : 'No Notificado'}</Text>
      <Text style={styles.column}>{item.nombre_abogado}</Text>
      <TouchableOpacity onPress={() => eliminarDemandado(item.id)}>
        <Text style={styles.deleteButton}>Eliminar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Modificaciones', { demandado: item })}>
        <Text style={styles.editButton}>Editar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#FFA500', '#FFFFFF']} style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput 
          placeholder="Nombre del Demandado"
          value={nuevoDemandado.nombre}
          onChangeText={(text) => setNuevoDemandado({ ...nuevoDemandado, nombre: text })}
          style={styles.input}
        />
        <TextInput 
          placeholder="Apellido del Demandado"
          value={nuevoDemandado.apellido}
          onChangeText={(text) => setNuevoDemandado({ ...nuevoDemandado, apellido: text })}
          style={styles.input}
        />
        <TextInput 
          placeholder="Domicilio del Demandado"
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
        <TouchableOpacity style={styles.addButton} onPress={agregarDemandado}>
          <Text style={styles.addButtonText}>Agregar Demandado</Text>
        </TouchableOpacity>
      </View>

      {/* Encabezado de las columnas */}
      <View style={styles.header}>
        <Text style={styles.headerColumn}>Nombre</Text>
        <Text style={styles.headerColumn}>Apellido</Text>
        <Text style={styles.headerColumn}>Domicilio</Text>
        <Text style={styles.headerColumn}>Estado</Text>
        <Text style={styles.headerColumn}>Abogado</Text>
        <Text style={styles.headerColumn}>Acción</Text>
      </View>

      <FlatList
        data={demandados}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#FFA500',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  list: {
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  headerColumn: {
    flex: 1,  // Cambiado a flex para que cada columna ocupe el mismo espacio
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14, // Tamaño de fuente para el encabezado
  },
  item: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flex: 1,  // Cambiado a flex para que cada columna ocupe el mismo espacio
    textAlign: 'center',
    fontSize: 12, // Tamaño de fuente más pequeño
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
  editButton: {
    color: 'blue',
    fontWeight: 'bold',
  },
});
