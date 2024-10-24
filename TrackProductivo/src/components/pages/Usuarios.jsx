import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import Layout from '../Template/Layout';
import axiosClient from '../../axiosClient';

const Usuarios = () => {
  const [personas, setPersonas] = useState([]); // Estado para almacenar la lista de personas
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await axiosClient.get('/personas/listar');
        setPersonas(response.data); // Almacena los datos en el estado
        console.log(response.data);
        
      } catch (error) {
        console.error("Error al listar las personas:", error);
      } finally {
        setLoading(false); // Detén la carga cuando la solicitud termine
      }
    };

    fetchPersonas();
  }, []);

  const renderPersona = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.text}>Nombre de usuario {item.nombres}</Text>
      <Text style={styles.text}>Correo: {item.correo}</Text>
      <Text style={styles.text}>Teléfono: {item.telefono}</Text>
      <Text style={styles.text}>Rol: {item.rol}</Text>
    </View>
  );

  return (
    <Layout title={'Usuarios'}>
      <View style={styles.container}>
        {loading ? (
          <Text>Cargando personas...</Text>
        ) : (
          <FlatList
            data={personas}
            keyExtractor={(item) => item.id_persona.toString()}
            renderItem={renderPersona}
          />
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});

export default Usuarios;
