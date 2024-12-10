import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Layout from "../Template/Layout";
import axiosClient from "../../axiosClient";
import Modal_Global from "../moleculas/Modal_Global"; // Asegúrate de que esta ruta sea correcta
import BotonRegistrar from "../atomos/BotonRegistrar";
import FormMatriculas from "../moleculas/FormMatriculas";

const Matriculas = () => {
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchMatriculas = async () => {
      try {
        const response = await axiosClient.get('/matriculas/listar');
        setMatriculas(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMatriculas();
  }, []);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <Layout title={"Matriculas"}>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title={"Matriculas"}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Error al cargar las matrículas: {error}</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout title={"Matriculas"}>
      <View style={styles.container}>
        <FlatList
          data={matriculas}
          keyExtractor={(item) => item.id_matricula.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>Ficha: {item.ficha}</Text>
              <Text style={styles.itemText}>Aprendiz: {item.aprendiz}</Text>
              <Text style={styles.itemText}>Pendientes Técnicos: {item.pendiente_tecnicos}</Text>
              <Text style={styles.itemText}>Pendientes Transversales: {item.pendiente_transversales}</Text>
              <Text style={styles.itemText}>Pendiente Inglés: {item.pendiente_ingles}</Text>
            </View>
          )}
        />
        <BotonRegistrar
        titulo = "registrar"
          onPress={handleOpenModal}
        >
        </BotonRegistrar>
        <Modal_Global
          visible={modalVisible}
          onClose={handleCloseModal}
        >
          <FormMatriculas/>
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

export default Matriculas;
