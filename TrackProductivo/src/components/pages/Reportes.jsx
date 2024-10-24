import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Layout from "../Template/Layout";
import axiosClient from "../../axiosClient";
import Modal_Seguimiento from "../moleculas/Modal_Seguimiento";

const Reportes = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSeguimiento, setSelectedSeguimiento] = useState(null);
  const [bitacoras, setBitacoras] = useState([]);
  const [seguimientos, setSeguimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerSeguimientos = async () => {
      try {
        const response = await axiosClient.get(`/seguimientos/listar`);
        setSeguimientos(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    obtenerSeguimientos();
  }, []);

  const handleOpenModal = (id_bitacora) => {
    setSelectedSeguimiento(id_bitacora);
    setModalVisible(true);
    // Filtrar las bitácoras correspondientes a este seguimiento
    const bitacorasFiltradas = bitacoras.filter(
      (bitacora) => bitacora.id_seguimiento === id_bitacora
    );
    setBitacoras(bitacorasFiltradas);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <Layout title={"Reportes"}>
        <View style={styles.container}>
          <Text>Cargando...</Text>
        </View>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title={"Reportes"}>
        <View style={styles.container}>
          <Text>Error al cargar los seguimientos: {error}</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout title={"Reportes"}>
      <View style={styles.container}>
        <FlatList
          data={seguimientos}
          keyExtractor={(item) => item.id_seguimiento.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>
                Fecha: {formatDate(item.fecha)}
              </Text>
              <Text style={styles.itemText}>
                Seguimiento: {item.seguimiento}
              </Text>
              <Text style={styles.itemText}>
                Estado: {item.estado === 1 ? "Activo" : "Inactivo"}
              </Text>
              <Text style={styles.itemText}>PDF: {item.pdf}</Text>
              <Text style={styles.itemText}>Productiva: {item.productiva}</Text>
              <Text style={styles.itemText}>Instructor: {item.instructor}</Text>
              <View style={styles.buttonContainer}>
                {[1, 2, 3].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={styles.button}
                    onPress={() => handleOpenModal(item.id_seguimiento, num)}
                  >
                    <Text style={styles.buttonText}>
                      Seguimiento {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />
        <Modal_Seguimiento
          visible={modalVisible}
          onClose={handleCloseModal}
          bitacoras={bitacoras}
        />
      </View>
    </Layout>
  );
};

// Función para formatear la fecha
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "orange",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default Reportes;
