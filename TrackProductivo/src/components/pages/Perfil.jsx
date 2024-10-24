import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from "react-native";
import Layout from "../Template/Layout";
import PersonasModal from "../moleculas/Modal_personas";
import Icon from "react-native-vector-icons/FontAwesome";
import axiosClient from "../../axiosClient";
import { usePersonas } from "../../Context/ContextPersonas";
import { CircleUserRound, User } from "lucide-react-native";

const Perfil = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const { id_persona, rol } = usePersonas();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Ajusta la ruta según el backend
        const response = await axiosClient.get(`/personas/perfil/${id_persona}`);
        console.log("Datos del usuario recibidos:", response.data);


        if (response.data) {
          setUserData(response.data);
        } else {
          console.log("No se encontraron datos del usuario.");
        }

      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error.response ? error.response.data : error.message);
      }
    };

    fetchUserData();
  }, [id_persona]);

  const handleEditProfile = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <Layout title={"Perfil"}>
       <ImageBackground
      source={require('../../../public/MobilePerfil.png')}
      style={styles.backgroundImage}
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



        {/* Pasar los datos del usuario al modal */}
        <PersonasModal
          visible={modalVisible}
          onClose={handleCloseModal}
          userData={userData}
        />
      </View>
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
  text: {
    color: "black",
    fontSize: 20,
    marginLeft: 10,
  },
  textName:{
    color: "black",
    fontWeight: "bold",
    fontSize: 22,
    marginLeft: 30,
    marginTop: 20
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "statrt",
    justifyContent: "flex-start",
    marginBottom: 25,
    marginLeft: 20
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
  logo: {
    marginBottom: 5,
    marginTop: "40%",
    alignSelf: "center",
    width: 220,
    height: 180,
    borderRadius: 40,
  },
});

export default Perfil;
