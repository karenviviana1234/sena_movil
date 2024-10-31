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
import { usePersonas } from "../../Context/ContextPersonas";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const navigation = useNavigation();

  const { SetRol, SetId_persona } = usePersonas();



  const handleLogin = async () => {
    try {
      console.log("Iniciando login...");
      console.log({ correo: email, password: password });

      const response = await axiosClient.post("/validacion", {
        correo: email,
        password: password,
      });

      if (response.status === 200) {
        console.log("Datos de respuesta:", response.data);
        const { user, token } = response.data;

        await AsyncStorage.setItem("token", token);
        const storedToken = await AsyncStorage.getItem("token");
        console.log("Token almacenado:", storedToken);
        if (user) {

          SetRol(user.cargo);
          SetId_persona(user.id_persona);

          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('user', JSON.stringify(user));

          const allowedRoles = ["Administrativo", "Instructor", "Aprendiz"];
          if (allowedRoles.includes(user.cargo)) {
            console.log("rol", user.cargo, "id", user.id_persona);
            navigation.navigate("principal");
          } else {
            Alert.alert(
              "Acceso denegado",
              "Los roles permitidos son Seguimiento, Instructor, y Aprendiz."
            );
          }

        }
      }
    } catch (error) {
      console.log("Error en login:", error);
      console.log("Detalles del error:", error.response?.data);

      if (error.response && error.response.status === 404) {
        Alert.alert("Error", `${error.response.status}: ${error.response.data.message || 'Error de autenticación'}`);
      } else {
        Alert.alert("Error", "Hubo un problema con el servidor.");
      }
    }
  };

  const handleForgotPassword = () => {
    console.log("Ir a la pantalla de recuperación de contraseña");
  };

  return (
    <ImageBackground
      source={require('../../../public/Mobile.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.textTitle}>Bienvenid@ a TrackProductivo</Text>
        <Text style={styles.text}>Ingrese a su cuenta</Text>
        <View style={styles.inputContainer}>
          <Mail size={24} color="green" style={styles.icon} />
          <TextInput
            style={[styles.input, isFocusedEmail && styles.inputFocused]}
            onFocus={() => setIsFocusedEmail(true)}
            onBlur={() => setIsFocusedEmail(false)}
            placeholder="Correo"

            placeholderTextColor="#219162"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View
          style={[
            styles.inputContainer,
            styles.passwordContainer,
            isFocusedPassword && styles.inputFocused,
          ]}
        >
          <Lock size={24} color="green" style={styles.icon} />
          <TextInput
  style={styles.passwordInput}
  onFocus={() => setIsFocusedPassword(true)}
  onBlur={() => setIsFocusedPassword(false)}
  placeholder="Contraseña"
  placeholderTextColor="#219162"
  value={password}
  onChangeText={setPassword}
/>

          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <EyeOff size={24} color="green" />
            ) : (
              <Eye size={24} color="green" />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
          <Text style={styles.button}>Ingresar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.textOlvide}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // Asegura que la imagen cubra toda la pantalla
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  text: {
    fontSize: 17,
    color: "gray",
    marginTop: 5,
    marginBottom: 20,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0d324c",
    marginTop: 250,
  },
  inputContainer: {
    width: 300,
    margin: 10,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: "#ECFFE1",
    paddingLeft: 50,
    color:'black'
  },
  inputFocused: {
    borderColor: "green",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "black",
    paddingRight: 40,
  },
  icon: {
    position: "absolute",
    left: 15,
    top: 12,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
  },
  input: {
    color: 'black'
  },
  buttonContainer: {
    height: 48,
    width: 290,
    justifyContent: "center",
    backgroundColor: "#74cd62",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 50,
  },
  button: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
  },
  textOlvide: {
    fontSize: 16,
    marginTop: 20,
    color: "gray",
    textDecorationLine: "underline",
  },
});

export default Login;