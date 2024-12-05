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
import { X } from "lucide-react-native";

const PersonasModal = ({ visible, onClose, userData }) => {
  const [identificacion, setIdentificacion] = useState("");
  const [nombres, setNombres] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [municipiosList, setMunicipiosList] = useState([]);
  const { id_persona, rol } = usePersonas();

  // Obtener la lista de municipios al cargar el componente
  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await axiosClient.get("/municipios/listar");
        setMunicipiosList(response.data);
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

      // Verificar que userData.id_municipio no sea null o vacío
      if (userData.id_municipio) {
        const municipioSeleccionado = municipiosList.find((muni) =>
          muni.nombre_mpio.trim() === userData.id_municipio.trim()
        );

        if (municipioSeleccionado) {
          setMunicipio(municipioSeleccionado.id_municipio);
        }
      } else {
        // Si no tiene municipio asignado (null o vacío)
        setMunicipio(null);  // O cualquier valor predeterminado que quieras usar
      }

      console.log("UserData:", userData.id_municipio);
    }
  }, [userData, municipiosList]);


  // Enviar el ID correcto del municipio al actualizar
  const handleUpdate = async () => {

    if (!/^\d{6,10}$/.test(identificacion)) {
      Alert.alert("Error", "La identificación debe contener entre 6 y 10 dígitos numéricos.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(correo)) {
      Alert.alert("Error", "El correo debe tener un formato válido (incluyendo '@').");
      return;
    }
    if (!/^\d{10}$/.test(telefono)) {
      Alert.alert("Error", "El teléfono debe contener exactamente 10 dígitos.");
      return;
    }

    const updatedData = {
      identificacion: identificacion || userData.identificacion,
      nombres: nombres || userData.nombres,
      correo: correo || userData.correo,
      telefono: telefono || userData.telefono,
      municipio: municipio || userData.id_municipio
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
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="black" />
          </TouchableOpacity>

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
          </View>
         
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
          {rol === "Aprendiz" && (
            <>
              <Text style={styles.texto}>Municipio</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.texto}
                  selectedValue={municipio}
                  onValueChange={(itemValue) => setMunicipio(itemValue)}
                >
                  {municipiosList.map((muni) => (
                    <Picker.Item
                      key={muni.id_municipio}
                      label={muni.nombre_mpio}
                      value={muni.id_municipio}
                    />
                  ))}
                </Picker>
              </View>
            </>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
            >
              <Text style={styles.updateButtonText}>Actualizar</Text>
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
    position: "relative", // Permite posicionar la 'X' de forma absoluta
  },
  modalHeader: {
    alignItems: "center", // Centra el título horizontalmente
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 26,
    color: "green",
    fontWeight: "bold",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  texto: {
    color: "black",
    fontSize: 18,
  },
  input: {
    backgroundColor: "#EDEDED",
    height: 50,
    width: "100%",
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 18,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    marginBottom: 15,
    height: 50
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  updateButton: {
    marginTop: 30,
    backgroundColor: "#74cd62",
    width: 250,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  updateButtonText: {
    color: "white",
    fontSize: 18,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10, // Posiciona la 'X' en la esquina superior derecha
    zIndex: 1, // Asegura que esté por encima del resto del contenido
  },
});

export default PersonasModal;





