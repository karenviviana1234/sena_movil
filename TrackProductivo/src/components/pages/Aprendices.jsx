import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import Layout from "../Template/Layout";
import axiosClient from "../../axiosClient";
import { usePersonas } from "../../Context/ContextPersonas";
import { CircleUserRound, Mail, IdCard, Building2, GraduationCap } from "lucide-react-native";

const Aprendices = () => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id_persona } = usePersonas();

  useEffect(() => {
    const fetchAprendices = async () => {
      try {
        const response = await axiosClient.get(`/personas/listarAprendicesI/${id_persona}`);
        console.log("Datos de aprendices:", response.data);
        setPersonas(response.data);
      } catch (error) {
        console.error("Error al listar los aprendices asignados al instructor:",
          error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAprendices();
  }, [id_persona]);

  const tieneColorAmarillo = (seguimientos) => {
    if (!seguimientos || !Array.isArray(seguimientos)) return false;

    const seguimiento3ConPdf = seguimientos.some(seguimiento => seguimiento.seguimiento === "3" && seguimiento.pdf_seguimiento);
  
    // Verificar que cada seguimiento tenga un PDF
    const todosLosSeguimientosConPdf = seguimientos.every(seguimiento => seguimiento.pdf_seguimiento);
  
    // Filtrar bitácoras aprobadas con PDF
    const bitacorasConPdfAprobadas = seguimientos.flatMap(seguimiento => seguimiento.bitacoras || [])
      .filter(bitacora => bitacora.pdf && bitacora.estado_bitacora === "aprobado");
  
    // Retorna true solo si se cumplen ambas condiciones
    return  seguimiento3ConPdf || todosLosSeguimientosConPdf && bitacorasConPdfAprobadas.length >= 4;
  };
  

  // Función para verificar si todas las bitácoras tienen PDF
  const tienePdf = (seguimientos) => {
    if (!seguimientos || !Array.isArray(seguimientos)) return false;  // Verificación adicional
    const todasLasBitacoras = seguimientos.flatMap(seguimiento => seguimiento.bitacoras || []);
    return todasLasBitacoras.every(bitacora => bitacora.pdf); // Devuelve true si todas las bitácoras tienen PDF
  };


  // Función para verificar si todas las bitácoras están aprobadas
  const todasBitacorasAprobadas = (seguimientos) => {
    const todasLasBitacoras = seguimientos.flatMap(seguimiento => seguimiento.bitacoras);
    return (
      todasLasBitacoras.length === 12 &&
      todasLasBitacoras.every(bitacora => bitacora.estado_bitacora === "aprobado")
    );
  };

  const tieneSolicitudConPdf = (seguimientos) => {
    const todasLasBitacoras = seguimientos.flatMap(seguimiento => seguimiento.bitacoras);
    console.log(todasLasBitacoras); // Verifica qué se recibe
    return todasLasBitacoras.some(bitacora =>
      bitacora.estado_bitacora === "solicitud" && bitacora.pdf
    );
  };
  
  // Renderiza cada aprendiz
  const renderPersona = ({ item }) => {

    const fondoColorEstado =
    tienePdf(item.seguimientos) ||
    todasBitacorasAprobadas(item.seguimientos) ||
    tieneSolicitudConPdf(item.seguimientos) ||
    tieneColorAmarillo(item.seguimientos);
    
    return(
    <TouchableOpacity style={[
      styles.itemContainer,
      tienePdf(item.seguimientos) && styles.errorBackground,
      todasBitacorasAprobadas(item.seguimientos) && styles.aprobadoBackground,
      tieneSolicitudConPdf(item.seguimientos) && styles.solicitudConPdfBackground,
      tieneColorAmarillo(item.seguimientos) && styles.amarilloBackground,
    ]}>
      <View style={styles.cardHeader}>
        <CircleUserRound size={40} color="green" style={styles.icon} />
        <Text  style={[
            styles.nombreText,
            fondoColorEstado && styles.textoBlanco, // Aplica texto blanco si el fondo es distinto de blanco
          ]}>{item.nombres}</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.infoSection}>
        <View style={styles.infoContainer}>
          <Mail size={20} color="#3498DB" style={styles.icon} />
          <Text style={[
            styles.infoText,
            fondoColorEstado && styles.textoBlanco, // Aplica texto blanco si el fondo es distinto de blanco
          ]}>
            <Text style={[
            styles.labelText,
            fondoColorEstado && styles.textoBlanco, // Aplica texto blanco si el fondo es distinto de blanco
          ]}>Correo: </Text>
            {item.correo}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <IdCard size={20} color="#E74C3C" style={styles.icon} />
          <Text style={[
            styles.infoText,
            fondoColorEstado && styles.textoBlanco, // Aplica texto blanco si el fondo es distinto de blanco
          ]}>
            <Text style={[
            styles.labelText,
            fondoColorEstado && styles.textoBlanco, // Aplica texto blanco si el fondo es distinto de blanco
          ]}>Identificación: </Text>
            {item.identificacion}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Building2 size={20} color="#27AE60" style={styles.icon} />
          <Text style={[
            styles.infoText,
            fondoColorEstado && styles.textoBlanco, // Aplica texto blanco si el fondo es distinto de blanco
          ]}>
            <Text style={[
            styles.labelText,
            fondoColorEstado && styles.textoBlanco, // Aplica texto blanco si el fondo es distinto de blanco
          ]}>Empresa: </Text>
            {item.razon_social}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <GraduationCap size={20} color="#8E44AD" style={styles.icon} />
          <Text style={[
            styles.infoText,
            fondoColorEstado && styles.textoBlanco, // Aplica texto blanco si el fondo es distinto de blanco
          ]}>
            <Text style={[
            styles.labelText,
            fondoColorEstado && styles.textoBlanco, // Aplica texto blanco si el fondo es distinto de blanco
          ]}>Programa: </Text>
            {item.sigla}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    )
  };

  return (
    <Layout title={"Aprendices Asignados"}>
      <ImageBackground
        source={require('../../../public/MobilePerfil.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2C3E50" />
              <Text style={styles.loadingText}>Cargando aprendices...</Text>
            </View>
          ) : (
            <FlatList
              data={personas}
              keyExtractor={(item) => item.identificacion.toString()}
              renderItem={renderPersona}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ImageBackground>
    </Layout>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '113%',
  },
  backgroundImageStyle: {
    opacity: 0.9,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  listContainer: {
    paddingVertical: 16,
  },
  itemContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  errorBackground: {
    backgroundColor: '#FA6F7E', // Rojo para indicar que falta el PDF
  },
  aprobadoBackground: {
    backgroundColor: '#ADF9A4', // Verde claro para indicar que todas las bitácoras están aprobadas
  },
  solicitudConPdfBackground: {
    backgroundColor: '#FFA500', // Naranja para estado solicitud con PDF cargado
  },
  amarilloBackground: {
    backgroundColor: '#FFD700', // Amarillo para cumplir la condición de bitácoras aprobadas con PDF y un seguimiento con PDF
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nombreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  infoSection: {
    marginTop: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#34495E',
    marginLeft: 12,
    flex: 1,
  },
  labelText: {
    fontWeight: '600',
    color: '#7F8C8D',
  },
  textoBlanco: {
    color: '#FFFFFF', // Texto blanco para fondos no blancos
  },
});

export default Aprendices;
