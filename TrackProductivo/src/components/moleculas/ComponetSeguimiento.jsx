import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { useContext } from 'react';
import SeguimientosContext from '../../Context/ContextSeguimiento.jsx';

const ComponentSeguimiento = ({ id_seguimiento, numero }) => {
  const { seguimientos, getSeguimiento } = useContext(SeguimientosContext);
  const [seguimientoData, setSeguimientoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeguimientoData = async () => {
      setLoading(true);
      try {
        const response = await getSeguimiento(id_seguimiento);
        setSeguimientoData(response);
      } catch (err) {
        console.error('Error al cargar seguimiento:', err);
        Alert.alert('Error', 'Ocurrió un error al cargar el seguimiento');
      } finally {
        setLoading(false);
      }
    };

    fetchSeguimientoData();
  }, [id_seguimiento, getSeguimiento]);

  const handleDocumentAction = (document, action) => {
    console.log(`Acción ${action} en documento:`, document);
  };

  if (loading) {
    return <Text>Cargando datos del seguimiento...</Text>;
  }

  if (!seguimientoData) {
    return <Text>No se encontró información del seguimiento.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Seguimiento {numero}</Text>
      
      <View style={styles.section}>
        <Text>Bitácoras</Text>
        {seguimientoData.bitacoras.map((bitacora) => (
          <View key={bitacora.id} style={styles.documentItem}>
            <Text style={styles.documentTitle}>{bitacora.titulo}</Text>
            <Text>Estado: {bitacora.estado}</Text>
            <Text>Fecha: {bitacora.fecha}</Text>
            <View style={styles.actionContainer}>
              
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text >Acta</Text>
        <View style={styles.documentItem}>
          <Text style={styles.documentTitle}>{seguimientoData.acta.titulo}</Text>
          <Text>Estado: {seguimientoData.acta.estado}</Text>
          <Text>Fecha: {seguimientoData.acta.fecha}</Text>
          
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 16,
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
  },
  section: {
      marginBottom: 24,
  },

  documentItem: {
      backgroundColor: '#f0f0f0',
      padding: 16,
      borderRadius: 8,
      marginBottom: 12,
  },
  documentTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
  },
  actionContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
  },
});

export default ComponentSeguimiento;