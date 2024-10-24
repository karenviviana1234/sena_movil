import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Layout from '../Template/Layout';
import axiosClient from '../../axiosClient';
import BotonRegistrar from '../atomos/BotonRegistrar';
import Modal_Global from '../moleculas/Modal_Global'; // Asegúrate de que esta ruta sea correcta
import FormEmpresa from '../moleculas/FormEmpresa';

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await axiosClient.get('/empresas/listar');
        setEmpresas(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <Layout title={"Empresas"}>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title={"Empresas"}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Error al cargar las empresas: {error}</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout title={"Empresas"}>
      <View style={styles.container}>
        <FlatList
          data={empresas}
          keyExtractor={(item) => item.id_empresa.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>Razón Social: {item.razon_social}</Text>
              <Text style={styles.itemText}>Dirección: {item.direccion}</Text>
              <Text style={styles.itemText}>Teléfono: {item.telefono}</Text>
              <Text style={styles.itemText}>Correo: {item.correo}</Text>
              <Text style={styles.itemText}>Municipio: {item.municipio}</Text>
              <Text style={styles.itemText}>Jefe Inmediato: {item.jefe_inmediato}</Text>
            </View>
          )}
        />
        <BotonRegistrar
          style={styles.floatingButton}
          onPress={handleOpenModal}
          titulo={"registrar"}
        />
        <Modal_Global
          visible={modalVisible}
          onClose={handleCloseModal}
        >
          {/* Paso de la función onClose al FormEmpresa */}
          <FormEmpresa onClose={handleCloseModal} />
        </Modal_Global>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  loadingText: {
    color: 'black',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 8,
    borderColor: 'black',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  itemText: {
    color: 'black',
    fontSize: 18,
    marginBottom: 4,
  },
});

export default Empresas;
