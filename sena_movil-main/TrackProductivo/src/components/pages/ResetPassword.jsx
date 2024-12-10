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
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import axiosClient from "../../axiosClient";
import { Eye, EyeOff, Lock } from "lucide-react-native";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);
  const [estaEnfocadoPassword, setEstaEnfocadoPassword] = useState(false);
  const [estaEnfocadoConfirmPassword, setEstaEnfocadoConfirmPassword] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();
  const token = route.params?.token;

  const resetearFormulario = () => {
    setPassword("");
    setConfirmPassword("");
    setMostrarPassword(false);
    setMostrarConfirmPassword(false);
    setEstaEnfocadoPassword(false);
    setEstaEnfocadoConfirmPassword(false);
  };

  const manejarResetPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      const respuesta = await axiosClient.put("/password/cambiar", {
        token: token,
        password: password
      });

      if (respuesta.status === 200) {
        resetearFormulario(); 
        Alert.alert(
          "Éxito",
          "Tu contraseña ha sido actualizada correctamente",
          [
            {
              text: "OK",
              onPress: () => {
                // Usamos CommonActions para resetear el estado de navegación
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'login' }],
                  })
                );
              }
            }
          ]
        );
      }
    } catch (error) {
      console.log("Error al restablecer contraseña:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Hubo un problema al restablecer la contraseña"
      );
    }
  };

  return (
    <ImageBackground
      source={require('../../../public/Mobile.png')}
      style={estilos.imagenDeFondo}
    >
      <View style={estilos.contenedor}>
        <Text style={estilos.textoTitulo}>Nueva Contraseña</Text>
        <Text style={estilos.texto}>Ingresa y confirma tu nueva contraseña</Text>

        <View style={estilos.contenedorDeEntrada}>
          <Lock size={24} color="green" style={estilos.icono} />
          <TextInput
            style={[estilos.entrada, estaEnfocadoPassword && estilos.entradaEnfocada]}
            onFocus={() => setEstaEnfocadoPassword(true)}
            onBlur={() => setEstaEnfocadoPassword(false)}
            placeholder="Nueva contraseña"
            placeholderTextColor="#219162"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!mostrarPassword}
          />
          <TouchableOpacity
            onPress={() => setMostrarPassword(!mostrarPassword)}
            style={estilos.iconoOjo}
          >
            {mostrarPassword ? (
              <EyeOff size={24} color="green" />
            ) : (
              <Eye size={24} color="green" />
            )}
          </TouchableOpacity>
        </View>

        <View style={estilos.contenedorDeEntrada}>
          <Lock size={24} color="green" style={estilos.icono} />
          <TextInput
            style={[estilos.entrada, estaEnfocadoConfirmPassword && estilos.entradaEnfocada]}
            onFocus={() => setEstaEnfocadoConfirmPassword(true)}
            onBlur={() => setEstaEnfocadoConfirmPassword(false)}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#219162"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!mostrarConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setMostrarConfirmPassword(!mostrarConfirmPassword)}
            style={estilos.iconoOjo}
          >
            {mostrarConfirmPassword ? (
              <EyeOff size={24} color="green" />
            ) : (
              <Eye size={24} color="green" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={estilos.contenedorDeBoton}
          onPress={manejarResetPassword}
        >
          <Text style={estilos.boton}>Guardar</Text>
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
  iconoOjo: {
    position: "absolute",
    right: 15,
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

export default ResetPassword ;