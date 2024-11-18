import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from "react-native";
import Layout from "../Template/Layout";
import PersonasModal from "../moleculas/Modal_personas";
import axiosClient from "../../axiosClient";
import { usePersonas } from "../../Context/ContextPersonas";
import { CircleUserRound, IdCard, Mail, Phone, MapPinHouse } from "lucide-react-native";


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
              <View style={styles.infoContainers}>
                <Text style={styles.textName}>{userData.nombres}</Text>
              </View>
              <View style={styles.infoContainer}>
                <IdCard size={24} color="green" />
                <Text style={styles.subtext}>Identificacion:</Text>
                <Text style={styles.text}>{userData.identificacion}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Phone size={24} color="green" />
                <Text style={styles.subtext}>Telefono:</Text>
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
              {rol === 'Aprendiz' && (
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
    width: 330,
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
