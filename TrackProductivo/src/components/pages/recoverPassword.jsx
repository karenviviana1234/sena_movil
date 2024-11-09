import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axiosClient from "../../axiosClient";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";

const RestablecerContrasena = () => {
  const [email, setEmail] = useState("");
  const [estaEnfocadoEmail, setEstaEnfocadoEmail] = useState(false);
  const navigation = useNavigation();

  const manejarRestablecerContrasena = async () => {
    try {
      console.log("Iniciando restablecimiento de contraseña...");

      const respuesta = await axiosClient.post("/reset-password", {
        email: email,
      });

      if (respuesta.status === 200) {
        console.log("Solicitud de restablecimiento de contraseña exitosa:", respuesta.data);
        Alert.alert(
          "Restablecimiento de contraseña",
          "Se han enviado las instrucciones para restablecer tu contraseña a tu correo electrónico."
        );
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error en el restablecimiento de contraseña:", error);
      console.log("Detalles del error:", error.response?.data);

      if (error.response && error.response.status === 404) {
        Alert.alert("Error", `${error.response.status}: ${error.response.data.message || 'Error al restablecer la contraseña'}`);
      } else {
        Alert.alert("Error", "Hubo un problema con el servidor.");
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../../public/Mobile.png')}
      style={estilos.imagenDeFondo}
    >
      <View style={estilos.contenedor}>
        <Text style={estilos.textoTitulo}>Recuperar contraseña</Text>
        <Text style={estilos.texto}>Ingresa tu correo electrónico</Text>
        <View style={estilos.contenedorDeEntrada}>
          <Mail size={24} color="green" style={estilos.icono} />
          <TextInput
            style={[estilos.entrada, estaEnfocadoEmail && estilos.entradaEnfocada]}
            onFocus={() => setEstaEnfocadoEmail(true)}
            onBlur={() => setEstaEnfocadoEmail(false)}
            placeholder="Correo"
            placeholderTextColor="#219162"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <TouchableOpacity style={estilos.contenedorDeBoton} onPress={manejarRestablecerContrasena}>
          <Text style={estilos.boton}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const estilos = StyleSheet.create({
  imagenDeFondo: {
    flex: 1,
    resizeMode: "cover",
  },
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  texto: {
    fontSize: 17,
    color: "gray",
    marginTop: 5,
    marginBottom: 20,
  },
  textoTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0d324c",
    marginTop: 250,
  },
  contenedorDeEntrada: {
    width: 300,
    margin: 10,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: "#ECFFE1",
    paddingLeft: 50,
  },
  entradaEnfocada: {
    borderColor: "green",
  },
  entrada: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "black",
  },
  icono: {
    position: "absolute",
    left: 15,
    top: 12,
  },
  contenedorDeBoton: {
    height: 48,
    width: 290,
    justifyContent: "center",
    backgroundColor: "#74cd62",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 50,
  },
  boton: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
  },
});

export default RestablecerContrasena;