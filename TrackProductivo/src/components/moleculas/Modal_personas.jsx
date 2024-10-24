import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import axiosClient from "../../axiosClient";
import { Picker } from "@react-native-picker/picker";
import { usePersonas } from "../../Context/ContextPersonas";

const PersonasModal = ({ visible, onClose, userData }) => {
  const [identificacion, setIdentificacion] = useState("");
  const [nombres, setNombres] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [municipiosList, setMunicipiosList] = useState([]);
  const { id_persona } = usePersonas();

  // Obtener la lista de municipios al cargar el componente
  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await axiosClient.get("/municipios/listar");
        setMunicipiosList(response.data); // Asegúrate de que `response.data` tiene la lista de municipios
      } catch (error) {
        console.error("Error al obtener los municipios:", error);
      }
    };
    fetchMunicipios();
  }, []);
  // Prellenar el formulario con los datos del usuario
  useEffect(() => {
    if (userData) {
      setIdentificacion(userData.identificacion || "");
      setNombres(userData.nombres || "");
      setCorreo(userData.correo || "");
      setTelefono(userData.telefono || "");
      setMunicipio(userData.id_municipio || ""); // Asegúrate de que userData.id_municipio contiene el ID
    }
  }, [userData]);

  // Enviar el ID correcto del municipio al actualizar
  const handleUpdate = async () => {
    const updatedData = {
      identificacion: identificacion || userData.identificacion,
      nombres: nombres || userData.nombres,
      correo: correo || userData.correo,
      telefono: telefono || userData.telefono,
      municipio: Number(municipio) || Number(userData.id_municipio), // Convertir el municipio a número
    };
  
    try {
      const response = await axiosClient.put(
        `/personas/perfilActualizar/${id_persona}`,
        updatedData
      );
      Alert.alert('Perfil Actualizado con éxito');
      onClose();
    } catch (error) {
      console.error(
        "Error al actualizar los datos del usuario:",
        error.response ? error.response.data : error.message
      );
    }
  };
  

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Perfil</Text>
          <Text style={styles.texto}>Identificación</Text>
          <TextInput
            style={styles.input}
            value={identificacion.toString()}
            onChangeText={setIdentificacion}
            placeholder="Identificación"
            keyboardType="numeric"
            placeholderTextColor="black"
          />
          <Text style={styles.texto}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombres}
            onChangeText={setNombres}
            placeholder="Nombre"
            placeholderTextColor="black"
          />
          <Text style={styles.texto}>Correo</Text>
          <TextInput
            style={styles.input}
            value={correo}
            onChangeText={setCorreo}
            placeholder="Correo"
            keyboardType="email-address"
            placeholderTextColor="black"
          />
          <Text style={styles.texto}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={telefono}
            onChangeText={setTelefono}
            placeholder="Teléfono"
            keyboardType="phone-pad"
            placeholderTextColor="black"
          />
{/*           {rol === "Aprendiz" && (

          ) }; */}
          <Text style={styles.texto}>Municipio</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={municipio}
              onValueChange={(itemValue) => setMunicipio(itemValue)} // Esto actualiza el estado con el ID del municipio
            >
              {municipiosList.map((muni) => (
                <Picker.Item
                  key={muni.id_municipio}
                  label={muni.nombre_mpio}
                  value={muni.id_municipio} // Asegúrate de que el valor sea el ID del municipio
                />
              ))}
            </Picker>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
            >
              <Text style={styles.updateButtonText}>Actualizar</Text>
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
  texto: {
    color: "black",
    fontSize: 18,
  },
  input: {
    color: "black",
    height: 50,
    width: "100%",
    borderColor: "orange",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 18,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 2,
    borderColor: "orange",
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  updateButtonText: {
    color: "white",
    fontSize: 18,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default PersonasModal;
