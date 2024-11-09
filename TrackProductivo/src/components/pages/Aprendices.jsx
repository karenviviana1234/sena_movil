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
import FormAprendiz from "../moleculas/FormAprendiz";
import { usePersonas } from "../../Context/ContextPersonas";
import Icon from "react-native-vector-icons/FontAwesome";

const Aprendices = () => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id_persona } = usePersonas();

  useEffect(() => {
    const fetchAprendices = async () => {
      try {
        const response = await axiosClient.get(`/personas/listarAprendicesI/${id_persona}`);
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

  const renderPersona = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.cardHeader}>
        <Icon name="user-circle" size={40} color="#2C3E50" />
        <Text style={styles.nombreText}>{item.nombres}</Text>
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.infoSection}>
        <View style={styles.infoContainer}>
          <Icon name="envelope" size={20} color="#3498DB" />
          <Text style={styles.infoText}>
            <Text style={styles.labelText}>Correo: </Text>
            {item.correo}
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Icon name="id-card" size={20} color="#E74C3C" />
          <Text style={styles.infoText}>
            <Text style={styles.labelText}>ID: </Text>
            {item.identificacion}
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Icon name="building" size={20} color="#27AE60" />
          <Text style={styles.infoText}>
            <Text style={styles.labelText}>Empresa: </Text>
            {item.razon_social}
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Icon name="graduation-cap" size={20} color="#8E44AD" />
          <Text style={styles.infoText}>
            <Text style={styles.labelText}>Programa: </Text>
            {item.sigla}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          <FormAprendiz />
        </View>
      </ImageBackground>
    </Layout>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
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
});

export default Aprendices;