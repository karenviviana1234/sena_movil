import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import axiosClient from '../../axiosClient';
import Layout from '../Template/Layout';
import { Download } from 'lucide-react-native';
import { usePersonas } from "../../Context/ContextPersonas";
import { Buffer } from 'buffer';

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      return Object.values(granted).every(
        (permission) => permission === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

const descargarPdf = async (fileName) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permiso denegado',
        'La aplicación necesita permisos de almacenamiento para guardar archivos.'
      );
      return;
    }

    const url = `/principal/descargar?nombre=${fileName}`; 
    const downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    const response = await axiosClient.get(url, { responseType: 'arraybuffer' });

    await RNFS.writeFile(downloadPath, Buffer.from(response.data).toString('base64'), 'base64');

    Alert.alert(
      'Descarga completa',
      `El archivo se guardó en: ${downloadPath}`,
      [
        {
          text: 'Abrir archivo',
          onPress: () => {
            RNFetchBlob.android.actionViewIntent(downloadPath, 'application/zip');
          },
        },
        {
          text: 'No abrir',
          style: 'cancel', 
        },
      ]
    );
  } catch (error) {
    console.error('Error al descargar el archivo:', error);
    Alert.alert(
      'Error de descarga',
      'No se pudo completar la descarga. Por favor, verifica tu conexión a internet e inténtalo de nuevo.'
    );
  }
};

const Principal = () => {
  const { rol } = usePersonas(); 
  const downloadOptions = [
    {
      title: 'Contrato de Aprendizaje',
      fileName: 'Modalidad Contrato aprendizaje.zip',
    },
    {
      title: 'Pasantías',
      fileName: 'Modalidad Pasantia.zip',
    },
    {
      title: 'Proyecto Productivo',
      fileName: 'Modalidad Proyecto.zip',
    },
    {
      title: "Monitorías",
      fileName: "Modalidad Viculacion Laboral.zip",
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
                onPress={() => descargarPdf(option.fileName)}
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
    backgroundColor: "white",
  },
  subtitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "400",
    marginBottom: 16,
    textAlign: "center",
  },
  optionContainer: {
    backgroundColor: "#ecffe1",
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