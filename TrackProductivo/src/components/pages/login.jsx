import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axiosClient from "../../axiosClient";
import { usePersonas } from "../../Context/ContextPersonas";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    <View style={styles.container}>
      <Text style={styles.textTitle}>TrackProductivo</Text>
      <Image
        source={require("../../../public/logoTic.png")}
        style={styles.logo}
        resizeMode="cover"
      />
      <TextInput
        style={[styles.input, isFocusedEmail && styles.inputFocused]}
        onFocus={() => setIsFocusedEmail(true)}
        onBlur={() => setIsFocusedEmail(false)}
        placeholder="Correo"
        placeholderTextColor="black"
        value={email}
        onChangeText={setEmail}
      />
      <View
        style={[
          styles.input,
          styles.passwordContainer,
          isFocusedPassword && styles.inputFocused,
        ]}
      >
        <TextInput
          style={styles.passwordInput}
          onFocus={() => setIsFocusedPassword(true)}
          onBlur={() => setIsFocusedPassword(false)}
          placeholder="Contraseña"
          placeholderTextColor="black"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Icon
            name={isPasswordVisible ? "eye-slash" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
        <Text style={styles.button}>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.textOlvide}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  textTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 140,
  },
  input: {
    width: 300,
    margin: 10,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 10,
    fontSize: 18,
    height: 60,
    paddingHorizontal: 10,
    color: "black",
  },
  inputFocused: {
    borderColor: "orange",
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
    fontSize: 18,
    color: "black",
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
  },
  buttonContainer: {
    height: 50,
    width: 180,
    justifyContent: "center",
    backgroundColor: "#0c8652",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  button: {
    fontSize: 28,
    color: "white",
    fontWeight: "600",
  },
  textOlvide: {
    fontSize: 16,
    marginTop: 30,
    color: "black",
    textDecorationLine: "underline",
  },
});

export default Login;