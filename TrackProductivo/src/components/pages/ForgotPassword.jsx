// ForgotPassword.js
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
import { Mail } from "lucide-react-native";

const ForgotPassword = () => {
  const [correo, setCorreo] = useState("");
  const [estaEnfocadoCorreo, setEstaEnfocadoCorreo] = useState(false);
  const navigation = useNavigation();

  const manejarSolicitudToken = async () => {
    if (!correo) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico");
      return;
    }

    try {
      console.log("Enviando solicitud de recuperación para:", correo);
      
      const respuesta = await axiosClient.post("/password/recuperar", {
        correo: correo.trim()
      });

      console.log("Respuesta del servidor:", respuesta.data);

      if (respuesta.status === 200) {
        Alert.alert(
          "Recuperación de Contraseña",
          "Se ha enviado un correo con las instrucciones para restablecer tu contraseña."
        );
        navigation.navigate('ResetPassword');
      }
    } catch (error) {
      console.log("Error completo:", error);
      console.log("Respuesta del error:", error.response?.data);
      
      let mensajeError = "Hubo un problema al procesar tu solicitud.";
      
      if (error.response) {
        if (error.response.status === 404) {
          mensajeError = "No se encontró ninguna cuenta con ese correo electrónico.";
        } else if (error.response.status === 500) {
          mensajeError = "Error en el servidor. Por favor intenta más tarde.";
        }
        
        if (error.response.data && error.response.data.message) {
          mensajeError = error.response.data.message;
        }
      }
      
      Alert.alert("Error", mensajeError);
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
            style={[estilos.entrada, estaEnfocadoCorreo && estilos.entradaEnfocada]}
            onFocus={() => setEstaEnfocadoCorreo(true)}
            onBlur={() => setEstaEnfocadoCorreo(false)}
            placeholder="Correo"
            placeholderTextColor="#219162"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity 
          style={estilos.contenedorDeBoton} 
          onPress={manejarSolicitudToken}
        >
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

export default ForgotPassword;