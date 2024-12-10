import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import DocumentPicker from "react-native-document-picker";
import RNFS from "react-native-fs";
import BotonDescargar from "../atomos/BotonDescargar";

const PDFUploader = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      setFile(res[0]); // Guardar el archivo en el estado
      setFileName(res[0].name); // Guardar el nombre del archivo
      onFileSelect(res[0]); // Pasar el archivo al componente padre
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  };

  const downloadFile = async () => {
    if (!file) return;

    const fileUri = `${RNFS.DocumentDirectoryPath}/${file.name}`;
    try {
      await RNFS.downloadFile({
        fromUrl: file.uri,
        toFile: fileUri,
      }).promise;
      Alert.alert("Descarga completada", `Archivo descargado en: ${fileUri}`);
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al descargar el archivo.");
    }
  };

  return (
    <View style={styles.container}>
      {file ? (
        <Text style={styles.text}>Archivo Cargado: {fileName}</Text>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
          <Text style={styles.buttonText}>Seleccionar archivo PDF</Text>
        </TouchableOpacity>
      )}

      {file && (
        <BotonDescargar onPress={downloadFile}/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  uploadButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    color: "#666",
  },
});

export default PDFUploader;
