import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ActaSeguimiento from '../organismos/ActaSeguimiento.jsx';
import SeguimientosContext from '../../Context/ContextSeguimiento.jsx';
import axiosClient from '../../axiosClient.js';
import { Download, X, FileUp, SendHorizontal } from "lucide-react-native";
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { PermissionsAndroid, Platform } from 'react-native';

const ModalSeguimiento = ({ visible, onClose, id_seguimiento, handleSubmit }) => {
  const { getSeguimiento } = useContext(SeguimientosContext);
  const [idSeguimiento, setIdSeguimiento] = useState(null);
  const [bitacoras, setBitacoras] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [estado, setEstado] = useState(null);
  const [bitacoraPdf, setBitacoraPdf] = useState(null);
  const [currentBitacoraId, setCurrentBitacoraId] = useState(null);

  const fetchBitacoras = useCallback(async (id_seguimiento) => {
    if (id_seguimiento) {
      try {
        const response = await axiosClient.get(`/bitacoras/bitacorasSeguimiento/${id_seguimiento}`);
        setBitacoras(response.data);
        setError(null);
      } catch (err) {
        setBitacoras([]);
        setError(`Error al obtener las bitácoras: ${err.message}`);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchIdFromStorage = async () => {
        const id = await AsyncStorage.getItem('idSeguimiento');
        if (id) {
          setIdSeguimiento(id);
          fetchBitacoras(id);
        }
      };

      if (visible) {
        fetchIdFromStorage();
      }

      return () => {
        if (!visible) {
          setIdSeguimiento(null);
          setBitacoras([]);
          setError(null);
        }
      };
    }, [visible, fetchBitacoras])
  );

  const handlePdfSubmit = async (id_bitacora) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setBitacoraPdf(res[0]);
      setCurrentBitacoraId(id_bitacora); // Set the selected bitacora ID
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error(err);
      }
    }
  };

  const handleSubmitBitacora = useCallback(async () => {
    if (!bitacoraPdf) {
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

    if (!result) return;

    const formData = new FormData();
    formData.append("bitacoraPdf", {
      uri: bitacoraPdf.uri,
      type: bitacoraPdf.type,
      name: bitacoraPdf.name,
    });

    try {
      const response = await axiosClient.post(
        `/bitacoras/cargarPDF/${currentBitacoraId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        Alert.alert("Éxito", "Bitacora enviada correctamente");
        if (handleSubmit) handleSubmit();
      } else {
        Alert.alert("Error", `Error al enviar la Bitacora: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error del servidor:", error.response ? error.response.data : error.message);
      Alert.alert("Error del servidor", error.message);
    }
  }, [bitacoraPdf, currentBitacoraId, handleSubmit]);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    fetchBitacoras(idSeguimiento);
  };

  if (!visible) {
    return null;
  }



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

  const downloadFile = async (id_bitacora) => {
    try {
      const granted = await requestStoragePermission();
      if (!granted) return;
      console.log("Hola", id_bitacora)

      const { config, fs } = RNFetchBlob;
      let DownloadDir = fs.dirs.DownloadDir;
      const baseUrl = "http://192.168.0.228:3000"; // Asegúrate de reemplazar esto con el dominio adecuado

      config({
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `${DownloadDir}/bitacora_${id_bitacora}.pdf`,
          description: 'Descargando archivo...',
        }
      })
        .fetch('GET', `${baseUrl}/bitacoras/download/${id_bitacora}`)
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
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#0d324c" />
          </TouchableOpacity>
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.title}>Seguimiento {idSeguimiento}</Text>
            <View style={styles.sectionContainer}>
              <ActaSeguimiento id_seguimiento={idSeguimiento} />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.subTitle}>Bitácoras:</Text>

              {bitacoras.map((bitacora) => {
                return (
                  <View key={bitacora.id_bitacora} style={styles.bitacoraItem}>
                    <View style={styles.containerHeader}>
                      <Text style={styles.labelB}>Bitácora: {bitacora.bitacora}</Text>
                      <View style={styles.containerEstado}>
                        <Text style={[styles.estadoText, styles.getEstadoStyle(bitacora.estado)]}>
                          {bitacora.estado}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.label}>{bitacora.pdf}</Text>
                    <View style={styles.containerPdf}>
                      {currentBitacoraId === bitacora.id_bitacora && bitacoraPdf && (
                        <Text style={styles.fileName}>{bitacoraPdf.name}</Text>
                      )}

                      {/* Solo mostrar el botón "Cargar Pdf" si la bitácora no está aprobada */}
                      {bitacora.estado !== "aprobado" && (
                        <View style={styles.buttonsContainer}>
                          <TouchableOpacity style={styles.buttonFile} onPress={() => handlePdfSubmit(bitacora.id_bitacora)}>
                            <FileUp size={20} color="black" />
                            <Text style={styles.buttonText}>Cargar Pdf</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={handleSubmitBitacora}>
                            <SendHorizontal size={24} color="green" />
                          </TouchableOpacity>
                        </View>
                      )}


                      <TouchableOpacity onPress={() => downloadFile(bitacora.id_bitacora)}>
                        <Download size={24} color="#0d324c" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.labelB}>{bitacora.instructor}</Text>
                    <Text style={styles.labelf}>{new Date(bitacora.fecha).toLocaleDateString()}</Text>
                  </View>
                );
              })}

            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%',
  },
  fileName: {
    position: 'absolute',
    bottom: 5,
    fontSize: 17,
    color: "black",
    padding: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // Espacio entre los botones
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5
  },
  containerEstado: {
    flexDirection: "row",
    marginLeft: 70,
    alignItems: 'center',
  },
  estadoText: {
    fontSize: 14,
    color: '#fff', // Color de texto blanco para que sea legible
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12, // Bordes redondeados para el contenedor pequeño
  },
  getEstadoStyle: (estado) => {
    switch (estado) {
      case 'aprobado':
        return { backgroundColor: 'rgba(0, 128, 0, 0.7)' }; // verde con 50% de opacidad
      case 'solicitud':
        return { backgroundColor: 'rgba(255, 165, 0, 0.7)' }; // naranja con 50% de opacidad
      case 'noaprobado':
        return { backgroundColor: 'rgba(255, 0, 0, 0.7)' }; // rojo con 50% de opacidad
      default:
        return { backgroundColor: 'rgba(128, 128, 128, 0.7)' }; // gris con 50% de opacidad
    }
  },
  
  contentContainer: {
    marginTop: 20,
  },
  containerPdf: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    color: "black"
  },
  buttonFile: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#dfdfdf",
    width: 150,
    marginVertical: 12,
    gap: 10
  },
  buttonText: {
    color: "black",
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: "#0d324c"
  },
  sectionContainer: {
    marginBottom: 32,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 20,
    color: "black"
  },
  bitacoraItem: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    margin: 20
  },
  noBitacorasText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
  },
  labelB: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black"
  },
  labelf: {
    fontSize: 14,
    marginLeft: 150,
    color: "black",
    marginVertical: 5
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  icon: {
    marginRight: 5,
  },
});

export default ModalSeguimiento;