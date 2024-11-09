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
import RNFS from 'react-native-fs';

const Principal = () => {
  const { rol } = usePersonas();

  const downloadOptions = [
    { title: "Contrato de Aprendizaje", fileName: "Modalidad Contrato aprendizaje-20241106T214047Z-001.zip", url: "http://192.168.0.110:3000/Modalidad_Contrato_aprendizaje.zip" },
    { title: "Pasantías", fileName: "Modalidad Pasantia-20241106T214000Z-001.zip", url: "http://192.168.0.110:3000/Modalidad_Pasantia.zip" },
    { title: "Proyecto Productivo", fileName: "Modalidad Proyecto-20241106T213957Z-001.zip", url: "http://192.168.0.110:3000/Modalidad_Proyecto.zip" },
    { title: "Monitorías", fileName: "Modalidad Viculacion Laboral-20241107T232242Z-001.zip", url: "http://192.168.0.110:3000/Modalidad_Viculacion_Laboral.zip" },
  ];


  const downloadZipFromAssets = async (fileName) => {
    try {
      const destinationPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      console.log(`Copiando desde: assets/${fileName} a ${destinationPath}`);
  
      await RNFS.copyFileAssets(fileName, destinationPath);
      Alert.alert('Descarga completada', `El archivo ${fileName} se ha guardado en Descargas`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo descargar el archivo');
    }
  };


  return (
    <Layout title={"Inicio"}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          A continuación se muestran los tipos de Modalidades de Etapa Productiva, seguidamente se podrá descargar los formatos correspondientes
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
                onPress={() => downloadZipFromProject(option.fileName)}
              >
                <Download name="download" size={24} color="green" />
              </TouchableOpacity>


              {rol === "Seguimiento" && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleUpload(option.title)}
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
