import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
  } from "react-native";
  import React from "react";
  import Layout from "../Template/Layout.jsx";
  import Icon from "react-native-vector-icons/FontAwesome";
  import { usePersonas } from "../../Context/ContextPersonas";
  
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
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.subtitle}>
            A continuación se muestran los formatos correspondientes para cada
            modalidad de etapa productiva
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
                  <Icon name="download" size={24} color="green" />
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
        </ScrollView>
      </Layout>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
    },
    subtitle: {
      fontSize: 20,
      color: "black",
      fontWeight: "400",
      marginBottom: 16,
      textAlign: "center",
    },
    optionContainer: {
      backgroundColor: "white",
      borderRadius: 8,
      padding: 18,
      marginBottom: 18,
    },
    optionTitle: {
      fontSize: 20,
      color: "black",
      marginBottom: 8,
    },
    downloadContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    downloadText: {
      fontSize: 18,
      color: "#333",
      marginRight: 180, // Espacio entre el texto y los botones
    },
    iconButton: {
      marginHorizontal: 10, // Espacio horizontal entre los botones
    },
  });
  
  export default Principal;
  