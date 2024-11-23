import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
} from "react-native";
import React, { useState } from "react";
import Layout from "../Template/Layout.jsx";
import Icon from "react-native-vector-icons/FontAwesome";
import { usePersonas } from "../../Context/ContextPersonas";
import { Download } from "lucide-react-native";
import RNFS from 'react-native-fs'; 
import RNFetchBlob from 'rn-fetch-blob'; 


const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      ];
      
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      
      return Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

const openFile = (filePath) => {
  RNFetchBlob.android.actionViewIntent(filePath, 'application/zip');
};

const descargarPdf = async (url, fileName) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permiso denegado', 
        'La aplicación necesita permisos de almacenamiento para guardar archivos.'
      );
      return;
    }

    // Imprimir todas las rutas disponibles para debug
    console.log('Rutas disponibles:');
    console.log('MainBundleDir:', RNFS.MainBundleDir);
    console.log('CachesDirectoryPath:', RNFS.CachesDirectoryPath);
    console.log('DocumentDirectoryPath:', RNFS.DocumentDirectoryPath);
    console.log('DownloadDirectoryPath:', RNFS.DownloadDirectoryPath);
    console.log('ExternalDirectoryPath:', RNFS.ExternalDirectoryPath);
    console.log('ExternalStorageDirectoryPath:', RNFS.ExternalStorageDirectoryPath);

    // Definir múltiples rutas posibles de descarga
    const possiblePaths = [
      `${RNFS.DownloadDirectoryPath}/${fileName}`,
      `${RNFS.ExternalStorageDirectoryPath}/Download/${fileName}`,
      `${RNFS.ExternalDirectoryPath}/${fileName}`,
      `/storage/emulated/0/Download/${fileName}`
    ];

    const downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}`; 

    Alert.alert(
      'Iniciando descarga',
      `Intentando descargar en:\n${downloadPath}`
    );

    // Configurar la descarga
    const options = {
      fromUrl: url,
      toFile: downloadPath,
      background: true,
      begin: (res) => {
        console.log('Comenzando descarga...');
        console.log('Tamaño del archivo:', res.contentLength);
      },
      progress: (res) => {
        const progress = (res.bytesWritten / res.contentLength) * 100;
        console.log(`Progreso: ${progress.toFixed(2)}%`);
      }
    };

    const download = RNFS.downloadFile(options);
    const result = await download.promise;

    if (result.statusCode === 200) {
      // Verificar en qué rutas existe el archivo
      console.log('Verificando ubicaciones del archivo:');
      for (const path of possiblePaths) {
        const exists = await RNFS.exists(path);
        console.log(`${path}: ${exists ? 'EXISTE' : 'NO EXISTE'}`);
      }

      if (Platform.OS === 'android') {
        try {
          await RNFS.scanFile(downloadPath);
        } catch (err) {
          console.warn('Error al escanear el archivo:', err);
        }
      }
      
      Alert.alert(
        'Descarga completa',
        `El archivo se ha guardado en:\n${downloadPath}\n\n¿Desea ver la ubicación?`,
        [
          { 
            text: 'No',
            style: 'cancel'
          },
          {
            text: 'Ver archivo',
            onPress: async () => {
              try {
                if (Platform.OS === 'android') {
                  const android = RNFetchBlob.android;
                  android.actionViewIntent(downloadPath, 'application/zip');
                  
                }
              } catch (error) {
                console.error('Error al abrir el archivo:', error);
                Alert.alert('Error', 'No se pudo abrir el archivo');
              }
            }
          }
        ]
      );
    } else {
      throw new Error(`Error en la descarga: ${result.statusCode}`);
    }
  } catch (error) {
    console.error('Error al descargar el archivo:', error);
    Alert.alert(
      'Error de descarga',
      'No se pudo completar la descarga. Por favor, verifica tu conexión a internet e inténtalo de nuevo.'
    );
  }
};

const Principal = () => {
  const { rol } = usePersonas(); // Uso de contexto

  // Opciones de descarga (deben estar dentro del componente)
  const downloadOptions = [
    {
      title: "Contrato de Aprendizaje",
      fileName: "Modalidad Contrato aprendizaje.zip",
      url: "http://192.168.0.101:3000/principal/descargar?nombre=Modalidad Contrato aprendizaje.zip"
    },
    {
      title: "Pasantías",
      fileName: "Modalidad Pasantia.zip",
      url: "http://192.168.0.101:3000/principal/descargar?nombre=Modalidad Pasantia.zip"
    },
    {
      title: "Proyecto Productivo",
      fileName: "Modalidad Proyecto.zip",
      url: "http://192.168.0.101:3000/principal/descargar?nombre=Modalidad Proyecto.zip"
    },
    {
      title: "Monitorías",
      fileName: "Modalidad Viculacion Laboral.zip",
      url: "http://192.168.0.101:3000/principal/descargar?nombre=Modalidad Viculacion Laboral.zip"
    },
  ];

  return (
    <Layout title={"Inicio"}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          A continuación se muestran los tipos de Modalidades de Etapa Productiva,
          seguidamente se podrá descargar los formatos correspondientes
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
                onPress={() => descargarPdf(option.url, option.fileName)}
              >
                <Download size={24} color="green" />
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
    fontWeight: "bold",
  },
  downloadContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  downloadText: {
    fontSize: 18,
    color: "gray",
    marginRight: 180,
  },
  iconButton: {
    marginHorizontal: 5,
  },
  lastOption: {
    marginBottom: 0,
  },
});


export default Principal;