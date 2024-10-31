import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import Layout from "../Template/Layout.jsx";
import Icon from "react-native-vector-icons/FontAwesome";
import { usePersonas } from "../../Context/ContextPersonas";
import { Download } from "lucide-react-native";

const Principal = () => {
  const { rol } = usePersonas();

  const downloadOptions = [
    { title: "Contrato de Aprendizaje" },
    { title: "Pasantías" },
    { title: "Proyecto Productivo" },
    { title: "Monitorías" },
  ];

  const handleDownload = (title) => {
    Alert.alert(
      "Descarga exitosa",
      `El archivo de ${title} se ha descargado correctamente.`,
      [{ text: "OK" }]
    );
  };
  const handleupload = (title) => {
    Alert.alert(
      "Archivo cargado con éxito",
      `El archivo de ${title} se ha cargado correctamente.`,
      [{ text: "OK" }]
    );
  };

  return (
    <Layout title={"Inicio"}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          A continuación se muestran los tipos de Modalidades de Etapa Productiva, seguidamente se podra descargar los formatos correspondientes
        </Text>

        {downloadOptions.map((option, index) => (
          <View
            key={index}
            style={[
              styles.optionContainer,
              index === downloadOptions.length - 1 ? styles.lastOption : {},
            ]}
          >
            <Text style={styles.optionTitle}>{option.title}:</Text>
            <View style={styles.downloadContainer}>
              <Text style={styles.downloadText}>archivo.zip</Text>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleDownload(option.title)}
              >
                <Download name="download" size={24} color="green" />
              </TouchableOpacity>
              {rol === "Seguimiento" && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleupload(option.title)}
                >
                  <Icon name="upload" size={24} color="green" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "115%",
    padding: 16,
    backgroundColor: "#f6fbff",
  },
  subtitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "400",
    marginBottom: 16,
    textAlign: "center",
  },
  optionContainer: {
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    padding: 18,
    marginBottom: 18,
  },
  optionTitle: {
    fontSize: 20,
    color: "#0d324c",
    marginBottom: 8,
    fontWeight: "bold"
  },
  downloadContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  downloadText: {
    fontSize: 18,
    color: "gray",
    marginRight: 180, // Espacio entre el texto y los botones
  },
  iconButton: {
    marginHorizontal: 5, // Espacio horizontal entre los botones
  },
});

export default Principal;
