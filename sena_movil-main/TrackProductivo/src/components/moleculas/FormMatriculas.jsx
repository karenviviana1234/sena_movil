import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import axiosClient from '../../axiosClient';
import { Picker } from '@react-native-picker/picker';
import BotonRegistrar from '../atomos/BotonRegistrar';

const FormMatriculas = ({ onClose }) => {
  const [ficha, setFicha] = useState('');
  const [aprendiz, setAprendiz] = useState('');
  const [estado, setEstado] = useState('Inducción'); // Estado por defecto
  const [pendientesTecnicos, setPendientesTecnicos] = useState('');
  const [pendientesTransversales, setPendientesTransversales] = useState('');
  const [pendienteIngles, setPendienteIngles] = useState('');
  const [aprendices, setAprendices] = useState([]);
  const [fichas, setFichas] = useState([]);

  const estados = [
    'Inducción', 
    'Formación', 
    'Condicionado', 
    'Cancelado', 
    'Retiro Voluntario', 
    'Por Certificar', 
    'Certificado'
  ];

  useEffect(() => {
    const fetchAprendices = async () => {
      try {
        const response = await axiosClient.get('/personas/listarA');
        setAprendices(response.data);
      } catch (error) {
        Alert.alert('Error', 'Error al cargar los aprendices: ' + error.message);
      }
    };

    fetchAprendices();
  }, []);
  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const response = await axiosClient.get('/fichas/listar');
        setFichas(response.data);
      } catch (error) {
        Alert.alert('Error', 'Error al cargar las fichas: ' + error.message);
      }
    };

    fetchFichas();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axiosClient.post('/matriculas/registrar', {
        ficha,
        aprendiz,
        estado,
        pendientes_tecnicos: pendientesTecnicos,
        pendientes_transversales: pendientesTransversales,
        pendiente_ingles: pendienteIngles,
      });

      if (response.status === 200) {
        Alert.alert('Éxito', 'Matrícula registrada correctamente');
        onClose(); // Cierra el modal al registrar correctamente
      } else {
        Alert.alert('Error', 'Error al registrar la matrícula');
      }
    } catch (error) {
      Alert.alert('Error', 'Error del servidor: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Matrícula</Text>

      <Text style={styles.label}>Ficha</Text>
      <Picker
        selectedValue={ficha}
        style={styles.picker}
        onValueChange={(itemValue) => setFicha(itemValue)}
      >
        {fichas.map((fi) => (
          <Picker.Item 
            key={fi.codigo} 
            label={`${fi.codigo}`} 
            value={fi.codigo} />
        ))}
      </Picker>

      <Text style={styles.label}>Aprendiz</Text>
      <Picker
        selectedValue={aprendiz}
        style={styles.picker}
        onValueChange={(itemValue) => setAprendiz(itemValue)}
      >
        {aprendices.map((apr) => (
          <Picker.Item 
            key={apr.id_persona} 
            label={`${apr.nombres}`} 
            value={apr.id_persona} />
        ))}
      </Picker>

      <Text style={styles.label}>Estado</Text>
      <Picker
        selectedValue={estado}
        style={styles.picker}
        onValueChange={(itemValue) => setEstado(itemValue)}
      >
        
        {estados.map((estado, index) => (
          <Picker.Item 
            key={index} 
            label={estado} 
            value={estado} />
        ))}
      </Picker>

      <Text style={styles.label}>Pendientes Técnicos</Text>
      <TextInput
        style={styles.input}
        placeholder="Pendientes Técnicos"
        value={pendientesTecnicos}
        onChangeText={setPendientesTecnicos}
      />

      <Text style={styles.label}>Pendientes Transversales</Text>
      <TextInput
        style={styles.input}
        placeholder="Pendientes Transversales"
        value={pendientesTransversales}
        onChangeText={setPendientesTransversales}
      />

      <Text style={styles.label}>Pendiente Inglés</Text>
      <TextInput
        style={styles.input}
        placeholder="Pendiente Inglés"
        value={pendienteIngles}
        onChangeText={setPendienteIngles}
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
    height: 50,
  },
});

export default FormMatriculas;
