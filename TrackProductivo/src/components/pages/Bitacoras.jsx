import React, { useEffect, useState, useContext } from 'react';
import { Text, SectionList, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Layout from '../Template/Layout';
import axiosClient from '../../axiosClient';
import ModalBitacoras from '../moleculas/Modal_Bitacoras';
import Icon from 'react-native-vector-icons/FontAwesome';
import SeguimientosContext from '../../Context/ContextSeguimiento';

const Bitacoras = () => {
  const [bitacoras, setBitacoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  const { idSeguimiento } = useContext(SeguimientosContext); // Usando el contexto

  useEffect(() => {
    const fetchBitacoras = async () => {
      try {
        const response = await axiosClient.get(`/bitacoras/bitacorasSeguiminetos/${idSeguimiento}`);
        const groupedBitacoras = groupBySeguimiento(response.data);
        setBitacoras(groupedBitacoras);
      } catch (error) {
        console.error('Error fetching bitacoras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBitacoras();
  }, [idSeguimiento]); // Asegúrate de que se ejecute cuando cambie idSeguimiento

  const groupBySeguimiento = (data) => {
    const grouped = data.reduce((result, item) => {
      const seguimientoId = item.id_seguimiento;
      if (!result[seguimientoId]) {
        result[seguimientoId] = { seguimientoId, data: [] };
      }
      result[seguimientoId].data.push(item);
      return result;
    }, {});
    
    return Object.values(grouped); // Convierte el objeto en un array para la SectionList
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleButtonPress = (id) => {
    Alert.alert(`'ID del Seguimiento', El ID es: ${id}`); // Mostrar el ID
  };

  const renderBitacora = ({ item }) => {
    const formattedDate = new Date(item.fecha).toLocaleDateString();
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Fecha: {formattedDate}</Text>
        <Text style={styles.itemSubtitle}>Bitácora: {item.bitacora}</Text>
        <Text style={styles.itemSubtitle}>Instructor: {item.instructor}</Text>
        <Text style={styles.itemSubtitle}>Seguimiento: {item.seguimiento}</Text>
        {item.bitacoraPdf && (
          <TouchableOpacity>
            <Text style={styles.itemLink}>Ver PDF</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSectionHeader = ({ section }) => (
    <View>
      <Text style={styles.groupTitle}>Seguimiento ID: {section.seguimientoId}</Text>
      {/* Botones para mostrar el ID */}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => handleButtonPress(section.seguimientoId)}>
          <Text style={styles.buttonText}>Mostrar ID</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Bitacoras:</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
            <Icon name="upload" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Subir Bitácora</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <Text>Cargando bitácoras...</Text>
        ) : (
          <SectionList
            sections={bitacoras}
            keyExtractor={(item, index) => item.id_bitacora.toString()}
            renderItem={renderBitacora}
            renderSectionHeader={renderSectionHeader}
            ListEmptyComponent={<Text>No hay bitácoras registradas.</Text>}
          />
        )}
        <ModalBitacoras
          visible={modalVisible}
          onClose={handleCloseModal}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
  itemContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  groupTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#eee',
    padding: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 16,
    color: 'grey',
  },
  itemLink: {
    fontSize: 16,
    color: 'blue',
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});

export default Bitacoras;