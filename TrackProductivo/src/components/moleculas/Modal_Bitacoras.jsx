import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Picker } from '@react-native-picker/picker'
import DocumentPicker from "react-native-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axiosClient from "../../axiosClient";


const ModalBitacoras = ({ visible, onClose }) => {
  const [fecha, setFecha] = useState(new Date());
  const [bitacora, setBitacora] = useState("");
  const [seguimiento, setSeguimiento] = useState("");
  const [pdf, setPdf] = useState(null);
  const [instructor, setInstructor] = useState("");
  const [instructores, setInstructores] = useState([]);
  const [seguimientos, setSeguimientos] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bitacoras, setBitacoras] = useState([]);
  const [idSeguimiento, setIdSeguimiento] = useState(null);


  useEffect(() => {
    const fetchInstructores = async () => {
      try {
        const response = await axiosClient.get("/personas/listarI");
        setInstructores(response.data);
        if (response.data.length > 0) {
          setInstructor(response.data[0].id_persona);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    const fetchSeguimientos = async (id_seguimiento) => {
      try {
        const response = await axiosClient.get(`/bitacoras/bitacorasSeguimiento/${id_seguimiento}`);
        return response.data;
      } catch (error) {
        Alert.alert("Error fetching seguimiento:", error);

      }
    };

    fetchInstructores();
    fetchSeguimientos();
  }, []);

  const fetchBitacoras = async (id_seguimiento) => {
    try {
      const response = await axiosClient.get(`/bitacoras/bitacorasSeguimiento/${id_seguimiento}`);
      setBitacoras(response.data);
    } catch (err) {
      setBitacoras([]);
    }
  };

  const handlePickPDF = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setPdf(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled document picker");
      } else {
        throw err;
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    const currentDate = selectedDate || fecha;
    setFecha(currentDate);
  };

  const handleSubmit = async () => {

    if (!bitacora || !seguimiento || !instructor || !pdf) {
      Alert.alert('Todos los campos son obligatorios')
      return;
    }

    const formData = new FormData();
    formData.append("fecha", fecha.toISOString().split("T")[0]); 
    formData.append("bitacora", bitacora);
    formData.append("seguimiento", seguimiento);
    formData.append("instructor", instructor);

    if (pdf) {
      formData.append("bitacoraPdf", {
        uri: pdf.uri,
        type: pdf.type,
        name: pdf.name,
      });
    }

    try {
      const response = await axiosClient.post(
        "/bitacoras/registrar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Bitácora registrada", "Bitácora registrada exitosamente.");
        fetchBitacoras(idSeguimiento);
      setBitacora("");
      setPdf(null);
      setFecha(new Date());
      } else {
        Alert.alert(
          "Error",
          `No se pudo registrar la bitácora: ${response.data.message}`
        );
      }
    } catch (error) {
      Alert.alert("Error", `Ocurrió un error: ${error.message}`);
    }

    onClose();
  };

  useEffect(() => {
    const cargarSeguimientos = async () => {
      try {
        // Aquí iría tu lógica para cargar los seguimientos
        const datos = [
          { id_seguimiento: 1, seguimiento: '1' },
          { id_seguimiento: 2, seguimiento: '2' },
          { id_seguimiento: 3, seguimiento: '3' },
        ];
        setSeguimientos(datos);
        setSeguimiento(datos[0]?.id_seguimiento || null);
      } catch (error) {
        Alert.alert("Error", `Ocurrió un error: ${error}`);
      }
    };
    cargarSeguimientos();
  }, []);

  const handleChange = (itemValue) => {
    if (typeof itemValue === 'string' && itemValue.trim() !== '') {
      setSeguimiento(itemValue);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Registrar Bitácora</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputText}>{fecha.toDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Bitácora"
            placeholderTextColor="grey"
            value={bitacora}
            onChangeText={setBitacora}
            color="black"
          />

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',margin:12 }}>
            {seguimientos.length > 0 ? (
              <Picker
                selectedValue={seguimiento}
                style={{ width: 200 }}
                onValueChange={handleChange}
              >
                {seguimientos.map((seg) => (
                  <Picker.Item
                    key={seg.id_seguimiento}
                    label={seg.seguimiento || ''}
                    value={String(seg.id_seguimiento)}
                  />
                ))}
              </Picker>
            ) : (
              <Text>No hay seguimientos disponibles</Text>
            )}
          </View>

          <TouchableOpacity style={styles.pdfButton} onPress={handlePickPDF}>
            <Text style={styles.pdfButtonText}>
              {pdf ? pdf.name : "Seleccionar PDF"}
            </Text>
          </TouchableOpacity>

          <View style={styles.pickerContainer}>
            {instructores.length > 0 ? (
              <Picker
                selectedValue={instructor}
                style={styles.picker}
                onValueChange={(itemValue) => setInstructor(itemValue)}
              >
                {instructores.map((inst) => (
                  <Picker.Item
                    key={inst.id_persona}
                    label={inst.nombres}
                    value={inst.id_persona}
                  />
                ))}
              </Picker>
            ) : (
              <Text style={styles.noInstructorsText}>No hay instructores</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 26,
    color: "orange",
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "orange",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
    color: "black",
  },
  pdfButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    height: 50,
    justifyContent: "center",
  },
  pdfButtonText: {
    color: "white",
    fontSize: 16,
  },
  pickerContainer: {
    width: "100%",
    borderColor: "orange",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "black",
  },
  noInstructorsText: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
  seguimientoLabel: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  noSeguimientosText: {
    fontSize: 16,
    color: "grey",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ModalBitacoras;
