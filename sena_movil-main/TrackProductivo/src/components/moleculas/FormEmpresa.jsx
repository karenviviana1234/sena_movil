import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import axiosClient from '../../axiosClient'; // Asegúrate de que esta ruta sea correcta
import { Picker } from '@react-native-picker/picker';
import BotonRegistrar from '../atomos/BotonRegistrar';

const FormEmpresa = ({ onClose = () => {} }) => {
  const [razonSocial, setRazonSocial] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [jefeInmediato, setJefeInmediato] = useState('');
  const [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await axiosClient.get('/municipios/listar');
        setMunicipios(response.data);
      } catch (error) {
        Alert.alert('Error', 'Error al cargar los municipios: ' + error.message);
      }
    };

    fetchMunicipios();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axiosClient.post('/empresas/registrar', {
        razon_social: razonSocial,
        direccion,
        telefono,
        correo,
        municipio,
        jefe_inmediato: jefeInmediato,
      });

      if (response.status === 200) {
        Alert.alert('Éxito', 'Empresa registrada correctamente');
        onClose(); // Cierra el modal al registrar correctamente
      } else {
        Alert.alert('Error', 'Error al registrar la empresa');
      }
    } catch (error) {
      console.log('error del server',error);
      
      Alert.alert('Error', 'Error del servidor: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Empresa</Text>

      <Text style={styles.label}>Razón Social</Text>
      <TextInput
        style={styles.input}
        placeholder="Razón Social"
        value={razonSocial}
        onChangeText={setRazonSocial}
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={direccion}
        onChangeText={setDireccion}
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        keyboardType='numeric'
        onChangeText={setTelefono}
      />

      <Text style={styles.label}>Correo</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Seleccionar Municipio</Text>
      <Picker
        selectedValue={municipio}
        style={styles.picker}
        onValueChange={(itemValue) => setMunicipio(itemValue)}
      >
        {municipios.map((mun) => (
          <Picker.Item 
          key={mun.id_municipio} 
          label={mun.nombre_mpio} 
          value={mun.id_municipio} />
        ))}
      </Picker>

      <Text style={styles.label}>Jefe Inmediato</Text>
      <TextInput
        style={styles.input}
        placeholder="Jefe Inmediato"
        value={jefeInmediato}
        onChangeText={setJefeInmediato}
      />

      <BotonRegistrar titulo="Registrar" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    margin: 10,
    alignSelf: 'center',
  },
  title: {
    padding: 0,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: "black",
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: "black",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 12,
    height: 50, // Ajustar la altura para que el Picker se vea bien
  },
});

export default FormEmpresa;
