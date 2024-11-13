import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, ScrollView, RefreshControl } from "react-native";
import Layout from "../Template/Layout";
import PersonasModal from "../moleculas/Modal_personas";
import axiosClient from "../../axiosClient";
import { usePersonas } from "../../Context/ContextPersonas";
import { CircleUserRound, IdCard, Mail, Phone, MapPinHouse } from "lucide-react-native";

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
      console.error("Error al obtener los datos del usuario:", error.response ? error.response.data : error.message);
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
        source={require('../../../public/MobilePerfil.png')}
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
                  <Icon name="id-card" size={24} color="black" />
                  <Text style={styles.text}>{userData.identificacion}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Icon name="phone" size={24} color="black" />
                  <Text style={styles.text}>{userData.telefono}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Icon name="envelope" size={24} color="black" />
                  <Text style={styles.text}>{userData.correo}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Icon name="check-circle" size={24} color="black" />
                  <Text style={styles.text}>Rol: {userData.rol}</Text>
                </View>
                {rol === 'Aprendiz' && (
                  <View style={styles.infoContainer}>
                    <Icon name="map-marker" size={24} color="black" />
                    <Text style={styles.text}>Municipio: {userData.id_municipio}</Text>
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
        </ScrollView>
      </ImageBackground>
    </Layout>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    height: "115%"
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  containerDos: {
    backgroundColor: "white",
    width: 300,
    borderRadius: 15
  },
  title: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold",
    fontFamily: 'poppins',
    marginBottom: 20,
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
    flexShrink: 1,  // Permite que el texto se ajuste en caso de que sea largo
  },
  textName: {
    color: "black",
    fontWeight: "bold",
    fontSize: 22,
    marginLeft: 30,
    marginTop: 20
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 25,
    marginLeft: 20,
    flexWrap: "wrap", 
  },
  infoContainers: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
    textAlign: "center"
  },
  button: {
    marginTop: 30,
    backgroundColor: "orange",
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
  },
});


export default Perfil;
