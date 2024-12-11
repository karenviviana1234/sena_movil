import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Bell, Trash, BellPlus } from "lucide-react-native";
import FormNovedades from "./FormNovedad";
import axiosClient from "../../axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import Layout from "../Template/Layout";
import NovedadFormulario from "./FormNovedad";
import { usePersonas } from "../../Context/ContextPersonas";

const Novedades = ({ route }) => {
  const [novedades, setNovedades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [seguimientos, setSeguimientos] = useState([]);
  const [seguimientoId, setSeguimientoId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const {
    identificacion: routeIdentificacion,
    productiva: routeProductiva,
  } = route.params;
  const { rol} = usePersonas();

  // Efectos para cargar datos iniciales y dependientes
useEffect(() => {
  const fetchData = async () => {
    // Cargar novedades si existe routeIdentificacion
    if (routeIdentificacion) {
      await listarNovedades(routeIdentificacion); // Cargar novedades por identificación
    }

    // Cargar seguimientos si existe routeProductiva
    if (routeProductiva) {
      await listarSeguimientos(routeProductiva); // Cargar seguimientos por productiva
    }

    // Listar datos con o sin filtro de seguimiento
    if (!seguimientoId) {
      await listar(""); // Listar sin filtro
    } else {
      await listar(seguimientoId); // Listar con filtro de seguimiento
    }
  };

  // Ejecutar la función para obtener los datos
  fetchData();
}, [routeIdentificacion, routeProductiva, seguimientoId]);  // Dependencias correctas


  

  // Controlador para listar seguimientos por productiva
  const listarSeguimientos = async (productiva) => {
    if (!productiva) return;
    setIsLoading(true);
    try {
      const response = await axiosClient.get(
        `/seguimientos/listarSeguimientoP/${productiva}`
      );
      if (response.status === 200 && response.data) {
        const parsedSeguimientos = Object.entries(
          response.data[productiva] || {}
        ).map(([label, id]) => ({
          label,
          value: id,
        }));
        setSeguimientos(parsedSeguimientos);
      } else {
        setSeguimientos([]);
      }
    } catch (error) {
      console.error("Error al listar seguimientos:", error.message);
      Alert.alert("Error", "No se pudieron cargar los seguimientos.");
    } finally {
      setIsLoading(false);
    }
  };

  // Controlador para desactivar una  novedad
  const desactivarNovedad = async (id_novedad) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que quieres eliminar esta novedad?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const response = await axiosClient.delete(
                `/novedades/eliminar/${id_novedad}`
              );
              if (response.status === 200) {
                setNovedades(
                  novedades.filter(
                    (novedad) => novedad.id_novedad !== id_novedad
                  )
                );
                Alert.alert(
                  "Éxito",
                  "La novedad ha sido eliminada exitosamente."
                );
              }
            } catch (error) {
              Alert.alert("Error", "Error al intentar eliminar la novedad.");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  // Controlador para listar novedades por identificación
  const listarNovedades = async (identificacion) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(
        `/novedades/listar/${identificacion}`
      );
      setNovedades(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("Error al obtener novedades :", error.message);
      setNovedades([]); // Limpiar estado en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  const listar = async (id_seguimiento) => {
    setIsLoading(true); 
    const identificacion = routeIdentificacion
    try {
      const url = id_seguimiento
        ? `/novedades/listarN/${id_seguimiento}` // Filtrar por ID de seguimiento
        : `/novedades/listarr/${identificacion}`; // Obtener todas las novedades mediante la identificacion del usuario
      const response = await axiosClient.get(url);
      setNovedades(Array.isArray(response.data) ? response.data : []);
      console.log("identificacion de la persona", identificacion);
      
    } catch (error) {
      console.log("Error al obtener novedades:", error.message);
      setNovedades([]); // Limpiar estado en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  
  

  useEffect(() => {
    if (seguimientoId) listar(seguimientoId);
  }, [seguimientoId]);

  
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (seguimientoId) {
        await listar(seguimientoId); // Filtra por seguimiento
      } else if (routeIdentificacion) {
        await listarNovedades(routeIdentificacion); // Filtra por identificación
      }
    } catch (error) {
      console.error("Error al refrescar novedades:", error.message);
    } finally {
      setRefreshing(false); // Restablece el estado de refresco
    }
  };
  
  
  // Manejo del modal
  const handleAbrirModalFormNovedades = () => setModalVisible(true);
  const handleCloseModalFormNovedades = () => setModalVisible(false);

  const handleSubmitNovedad = async () => {
    try {
      // Actualizar la lista de novedades
      if (seguimientoId) {
        await listar(seguimientoId);
      } else if (routeIdentificacion) {
        await listarNovedades(routeIdentificacion);
      }
      console.log("Novedad registrada correctamente");
      setModalVisible(false); // Cierra el modal tras registrar
    } catch (error) {
      console.error("Error al refrescar novedades:", error.message);
    }
  };
  // Cambiar el onSubmit en el componente del formulario
  
  return (
    <Layout title="Novedades">
      <View style={styles.container}>
        <View style={styles.containerpicker}>
          {isLoading ? (
            <Text>Cargando seguimientos...</Text>
          ) : (
            <Picker
              selectedValue={seguimientoId}
              style={styles.picker}
              onValueChange={(itemValue) => setSeguimientoId(itemValue)}
            >
              <Picker.Item label="Selecciona un Seguimiento" value="" />
              {seguimientos.map((seguimiento) => (
                <Picker.Item
                  key={seguimiento.value}
                  label={seguimiento.label}
                  value={seguimiento.value}
                />
              ))}
            </Picker>
          )}
        </View>

        <NovedadFormulario
          visible={modalVisible}
          onClose={handleCloseModalFormNovedades}
          productiva={routeProductiva}
          onSubmit={handleSubmitNovedad} // Usar esta función
          route={{ params: { productiva: routeProductiva } }}
        />

        {rol !== "Aprendiz" && (
          <TouchableOpacity
            style={styles.formButton}
            onPress={handleAbrirModalFormNovedades}
          >
            <BellPlus size={30} color="green" style={styles.icon} />
          </TouchableOpacity>
        )}
        {isLoading && <Text>Cargando novedades...</Text>}

        {novedades.length === 0 && !isLoading ? (
          <Text style={styles.emptyMessage}>
            No hay novedades para este seguimiento.
          </Text>
        ) : (
          <FlatList
            data={novedades}
            renderItem={({ item }) => (
              <View style={styles.novedadItem}>
                <Text style={styles.instructor}>{item.instructor}</Text>
                <Text style={styles.descripcion}>
                  Descripción: {item.descripcion}
                </Text>
                <Text style={styles.seguimiento}>
                  Seguimiento: {item.seguimiento}
                </Text>
                {item.foto && (
                  <Image
                    source={{
                      uri: `${axiosClient.defaults.baseURL}/novedad/${item.foto}`,
                    }}
                    style={styles.image}
                  />
                )}
                <Text style={styles.fecha}>
                  {new Date(item.fecha).toLocaleDateString("es-CO")}
                </Text>
                {rol !== "Aprendiz" && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => desactivarNovedad(item.id_novedad)}
                  >
                    <Trash size={25} color="black" />
                  </TouchableOpacity>
                )}
              </View>
            )}
            keyExtractor={(item) => item.id_novedad.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "113%",
    padding: 20,
    backgroundColor: "white",
  },
  emptyMessage: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#888",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  containerpicker: {
    height: 50,
    width: "85%",
    marginBottom: 16,
    backgroundColor: "#EDEDED",
    marginLeft: 4,
    borderRadius: 15,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "95%",
    backgroundColor: "transparent",
    color: "black",
  },
  novedadItem: {
    backgroundColor: "#ecffe1",
    padding: 16,
    marginVertical: 16,
    borderRadius: 10,
  },
  instructor: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0d324c",
  },
  descripcion: { fontSize: 16, color: "#666" },
  seguimiento: { fontSize: 16, color: "#666" },
  image: { width: "100%", height: 150, resizeMode: "contain", marginTop: 8 },
  fecha: {
    fontSize: 12,
    color: "#888",
    position: "absolute",
    bottom: 6,
    right: 6,
    padding: 4,
    borderRadius: 4,
  },
  formButton: {
    position: "absolute",
    right: 16,
    top: 10,
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
    color: "#fff",
  },
  deleteButton: {
    position: "absolute",
    top: 6,
    right: 4,
    padding: 4,
    borderRadius: 4,
  },
});

export default Novedades;
