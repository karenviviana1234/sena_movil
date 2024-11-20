import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import Layout from "../Template/Layout";
import PersonasModal from "../moleculas/Modal_personas";
import Icon from "react-native-vector-icons/FontAwesome";
import axiosClient from "../../axiosClient";
import { usePersonas } from "../../Context/ContextPersonas";
import {
  CircleUserRound,
  IdCard,
  Mail,
  Phone,
  MapPinHouse,
} from "lucide-react-native";

const Perfil = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { id_persona, rol } = usePersonas();

  const fetchUserData = async () => {
    try {
      const response = await axiosClient.get(`/personas/perfil/${id_persona}`);
      console.log("Datos del usuario recibidos:", response.data);
      setUserData(response.data);
    } catch (error) {
      console.error(
        "Error al obtener los datos del usuario:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [id_persona]);

  const handleEditProfile = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    handleRefresh();
  };

  return (
    <Layout title={"Perfil"}>
      <ImageBackground
        source={require("../../../public/MobilePerfil.png")}
        style={styles.backgroundImage}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View style={styles.container}>
            {userData ? (
              <View style={styles.containerDos}>
                <View style={styles.infoContainer}>
                  <Text style={styles.textName}>{userData.nombres}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <IdCard size={24} color="green" />
                  <Text style={styles.subtext}>Identificación:</Text>
                  <Text style={styles.text}>{userData.identificacion}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Phone size={24} color="green" />
                  <Text style={styles.subtext}>Teléfono:</Text>
                  <Text style={styles.text}>{userData.telefono}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Mail size={24} color="green" />
                  <Text style={styles.subtext}>Correo: </Text>
                  <Text style={styles.text}>{userData.correo}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <CircleUserRound size={24} color="green" />
                  <Text style={styles.subtext}>Rol:</Text>
                  <Text style={styles.text}>{userData.rol}</Text>
                </View>
                {rol === "Aprendiz" && (
                  <View style={styles.infoContainer}>
                    <MapPinHouse size={24} color="green" />
                    <Text style={styles.subtext}>Municipio:</Text>
                    <Text style={styles.text}>{userData.id_municipio}</Text>
                  </View>
                )}
              </View>
            ) : (
              <Text>Cargando datos del usuario...</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
              <Text style={styles.buttonText}>Editar Perfil</Text>
            </TouchableOpacity>

            <PersonasModal
              visible={modalVisible}
              onClose={handleCloseModal}
              userData={userData}
            />
          </View>

          {/* Imagen en la parte inferior */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../public/def_AGROSIS_LOGOTIC.png")}
              style={styles.logo}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </Layout>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    height: "115%",
  },
  scrollContainer: {
    paddingVertical: 20,
    alignItems: "center", // Centra el contenido en ScrollView
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  containerDos: {
    marginTop: 80,
    backgroundColor: "white",
    width: 330,
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: 20, // Espaciado vertical en el contenedor para el nombre centrado
  },
  textName: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center", // Centra el texto dentro de la vista
    fontSize: 24,
    marginBottom: 20, // Espacio entre el nombre y el resto de la información
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 15,
    width: "90%", // Alinea los elementos a la izquierda
  },
  subtext: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10,
  },
  text: {
    color: "black",
    fontSize: 20,
    marginLeft: 2,
    flexShrink: 1, // Permite que el texto se ajuste si es largo
  },
  button: {
    marginTop: 30,
    backgroundColor: "#74cd62",
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
  },
  logoContainer: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
  },
  logo: {
    width: 220,
    height: 180,
    borderRadius: 40,
  },
});

export default Perfil;
