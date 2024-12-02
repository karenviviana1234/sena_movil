import { Buffer } from 'buffer'; // Importar Buffer desde la biblioteca 'buffer'
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axiosClient from '../../axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import { PermissionsAndroid, Platform } from 'react-native';
import { Download, CircleMinus, SendHorizontal, FileUp } from "lucide-react-native";



const ActaSeguimiento = ({ handleSubmit, id_seguimiento, onIdSend }) => {
  const [seguimientoPdf, setSeguimientoPdf] = useState(null);
  const [idPersona, setIdPersona] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [estado, setEstado] = useState(null);
  const [pdfName, setPdfName] = useState(null);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));

  const seguimientoNumeros = {
    1: 1,
    2: 2,
    3: 3,
  };

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Permiso de almacenamiento",
          message: "La aplicación necesita acceso al almacenamiento para descargar archivos.",
          buttonNeutral: "Preguntar después",
          buttonNegative: "Cancelar",
          buttonPositive: "Aceptar"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      Alert.alert("Permiso denegado", "No se concedieron los permisos necesarios.");
      return false;
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
        if (userJson) {
          const user = JSON.parse(userJson);
          setIdPersona(user?.id_persona || null);
        } else {
          console.warn("No se encontró un valor válido para 'user' en AsyncStorage.");
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    getUserData();

    if (onIdSend && id_seguimiento) {
      onIdSend(id_seguimiento);
    }
  }, [id_seguimiento, onIdSend]);

  useEffect(() => {
    if (id_seguimiento) {
      axiosClient.get(`/seguimientos/listarEstado/${id_seguimiento}`)
        .then(response => {
          setEstado(response.data.estado);
          setPdfName(response.data.pdf);
        })
        .catch(error => {
          console.error('Error al obtener el estado del seguimiento:', error);
        });
    }
  }, [id_seguimiento]);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserRole(user.cargo);
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
      }
    };

    getUserRole();
  }, []);

  const handleActaPdfSubmit = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setSeguimientoPdf(res[0]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error(err);
      }
    }
  };

  const handleSubmitActa = useCallback(async () => {
    if (!seguimientoPdf) {
      Alert.alert("Error", "Debes cargar un archivo PDF para poder enviarlo");
      return;
    }

    const result = await new Promise((resolve) => {
      Alert.alert(
        "¿Estás seguro?",
        "Ya existe un PDF cargado, ¿quieres reemplazarlo?",
        [
          { text: "Cancelar", onPress: () => resolve(false), style: "cancel" },
          { text: "Sí, reemplazar", onPress: () => resolve(true) }
        ]
      );
    });

    if (!result) {
      return;
    }

    const formData = new FormData();
    formData.append("seguimientoPdf", {
      uri: seguimientoPdf.uri,
      type: seguimientoPdf.type,
      name: seguimientoPdf.name,
    });

    try {
      const response = await axiosClient.post(
        `/seguimientos/cargarPDF/${id_seguimiento}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Éxito", "Acta enviada correctamente");
        if (handleSubmit) handleSubmit();
      } else {
        Alert.alert("Error", "Error al enviar el Acta.");
      }
    } catch (error) {
      console.error("Error del servidor:", error);
      Alert.alert("Error del servidor", error.message);
    }
  }, [seguimientoPdf, id_seguimiento, handleSubmit]);

  const downloadFile = async () => {
    try {
      const granted = await requestStoragePermission();
      if (!granted) return;

      const { config, fs } = RNFetchBlob;
      let DownloadDir = fs.dirs.DownloadDir;
      const baseUrl = "http://192.168.0.107:3000"; // Asegúrate de reemplazar esto con el dominio adecuado

      config({
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `${DownloadDir}/acta_seguimiento_${id_seguimiento}.pdf`,
          description: 'Descargando archivo...',
        }
      })
        .fetch('GET', `${baseUrl}/seguimientos/descargarPdf/${id_seguimiento}`)
        .then((res) => {
          Alert.alert("Descarga completa", "El archivo se ha descargado correctamente.");
        })
        .catch((error) => {
          Alert.alert("Error de descarga", "No se pudo descargar el archivo: " + error.message);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const estadoConfig = {
    solicitud: {
      color: "orange",
      icon: "alert-circle",
    },
    aprobado: {
      color: "green",
      icon: "check-circle",
    },
    rechazado: {
      color: "red",
      icon: "alert-circle",
    },
  };

  const { color, icon } = estadoConfig[estado] || { color: "black", icon: "alert-circle" };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acta:</Text>
      <View style={styles.card}>

        {estado && (
          <View style={styles.Container}>
            <Text style={styles.subtitle}>
              Acta N° {seguimientoNumeros[id_seguimiento] || 1}:
            </Text>
            <View style={styles.estadoC}>
              <Icon name={icon} size={20} color={color} />
              <Text style={[styles.estadoText, { color }]}>{estado}</Text>
            </View>
          </View>
        )}

        {pdfName && (
          <Text style={styles.pdfName}>{pdfName}</Text>
        )}

        <View style={styles.buttonContainer}>
          {estado !== 'aprobado' && userRole && (userRole !== 'Administrativo' && userRole !== 'Aprendiz' && userRole !== 'Coordinador') && (
            <TouchableOpacity style={styles.buttonFile} onPress={handleActaPdfSubmit}>
              <FileUp name="download" size={20} color="gray" />
              <Text style={styles.buttonText}>Cargar Pdf</Text>
            </TouchableOpacity>
          )}

          {estado !== 'aprobado' && (userRole !== 'Administrativo' && userRole !== 'Aprendiz' && userRole !== 'Coordinador') && (
            <TouchableOpacity style={styles.button} onPress={handleSubmitActa}>
              <SendHorizontal name="download" size={24} color="green" />
            </TouchableOpacity>
          )}
          {(userRole === 'Aprendiz' || userRole === 'Instructor') && (
            <TouchableOpacity style={styles.button} onPress={downloadFile}>
              <Download name="download" size={24} color="#0d324c" />
            </TouchableOpacity>
          )}

        </View>


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  pdfName: {
    fontSize: 14,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  button: {
    flexDirection: "row",
    padding: 8,
    borderRadius: 4,
  },
  buttonFile: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#dfdfdf",
    gap: 10
  },
  buttonText: {
    color: "gray",
    fontSize: 14,
    
  },
  Container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  estadoC: {
    flexDirection: "row",
    marginLeft: 78,
    marginBottom: 12
  },
  estadoText: {
    marginLeft: 2,
    fontSize: 14,
  },
});

export default ActaSeguimiento;