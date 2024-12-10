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
import { useNavigation, useRoute } from "@react-navigation/native";
import axiosClient from "../../axiosClient";
import { Key } from "lucide-react-native";

const VerifyCode = () => {
  const [codigo, setCodigo] = useState("");
  const [estaEnfocadoCodigo, setEstaEnfocadoCodigo] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();
  const correo = route.params?.correo;

  const manejarVerificacion = async () => {
    if (!codigo) {
      Alert.alert("Error", "Por favor ingresa el código de verificación");
      return;
    }

    try {
      const respuesta = await axiosClient.post("/password/verificar", {
        token: codigo
      });

      if (respuesta.status === 200) {
        navigation.navigate('ResetPassword', { 
          token: codigo
        });
      }
    } catch (error) {
      console.log("Error al verificar código:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Código inválido o expirado"
      );
    }
  };

  return (
    <ImageBackground
      source={require('../../../public/Mobile.png')}
      style={estilos.imagenDeFondo}
    >
      <View style={estilos.contenedor}>
        <Text style={estilos.textoTitulo}>Verificar código</Text>
        <Text style={estilos.texto}>
          Ingresa el código de verificación enviado a tu correo
        </Text>
        
        <View style={estilos.contenedorDeEntrada}>
          <Key size={24} color="green" style={estilos.icono} />
          <TextInput
            style={[estilos.entrada, estaEnfocadoCodigo && estilos.entradaEnfocada]}
            onFocus={() => setEstaEnfocadoCodigo(true)}
            onBlur={() => setEstaEnfocadoCodigo(false)}
            placeholder="Código de verificación"
            placeholderTextColor="#219162"
            value={codigo}
            onChangeText={setCodigo}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        <TouchableOpacity 
          style={estilos.contenedorDeBoton}
          onPress={manejarVerificacion}
        >
          <Text style={estilos.boton}>Verificar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.contenedorDeBotonSecundario}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={estilos.botonSecundario}>Solicitar nuevo código</Text>
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
    textAlign: "center",
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
  contenedorDeBotonSecundario: {
    marginTop: 15,
    padding: 10,
  },
  botonSecundario: {
    color: "#219162",
    fontSize: 16,
  },
});

export default VerifyCode;