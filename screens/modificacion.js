import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from "firebase/firestore";
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Modificacion() {
  const navigation = useNavigation();
  const route = useRoute();
  const { demandado } = route.params;

  const [nombre, setNombre] = useState(demandado.nombre_demandado);
  const [apellido, setApellido] = useState(demandado.apellido_demandado);
  const [domicilio, setDomicilio] = useState(demandado.domicilio_demandado);
  const [nombreAbogado, setNombreAbogado] = useState(demandado.nombre_abogado);
  const [ubicacion, setubicacion] = useState(demandado.ubicacion);
  const [estado, setEstado] = useState(demandado.estado);

  const actualizarDemandado = async () => {
    if (!nombre || !apellido || !domicilio || !nombreAbogado) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    try {
      await updateDoc(doc(db, 'demandado', demandado.id), {
        nombre_demandado: nombre,
        apellido_demandado: apellido,
        domicilio_demandado: domicilio,
        nombre_abogado: nombreAbogado,
        ubicacion: ubicacion,
        estado: estado,
      });

      Alert.alert('Demandado Actualizado', 'Los datos se han actualizado correctamente.');
      navigation.goBack(); // Regresa a la vista anterior
    } catch (error) {
      console.error("Error: ", error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre del demandado"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Apellido del demandado"
        value={apellido}
        onChangeText={setApellido}
        style={styles.input}
      />
      <TextInput
        placeholder="Domicilio del demandado"
        value={domicilio}
        onChangeText={setDomicilio}
        style={styles.input}
      />
      <TextInput
        placeholder="Nombre del Abogado"
        value={nombreAbogado}
        onChangeText={setNombreAbogado}
        style={styles.input}
      />
      <View style={styles.switchContainer}>
        <Text>Estado:</Text>
        <Switch
          value={estado}
          onValueChange={setEstado}
          thumbColor={estado ? 'green' : 'red'}
        />
      </View>
      <TouchableOpacity onPress={actualizarDemandado} style={styles.button}>
        <Text style={styles.buttonText}>Actualizar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: '#000',
  },
  button: {
    backgroundColor: '#ffa500',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});
