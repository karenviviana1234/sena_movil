import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ActaSeguimiento from '../organismos/ActaSeguimiento.jsx';
import SeguimientosContext from '../../Context/ContextSeguimiento.jsx';
import axiosClient from '../../axiosClient';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalBitacoras from './Modal_Bitacoras.jsx';

const ModalSeguimiento = ({ visible, onClose }) => {
  const { getSeguimiento } = useContext(SeguimientosContext);
  const [idSeguimiento, setIdSeguimiento] = useState(null);
  const [bitacoras, setBitacoras] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);

  const fetchBitacoras = useCallback(async (id) => {
    if (id) {
      try {
        const response = await axiosClient.get(`/bitacoras/bitacorasSeguimiento/${id}`);
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

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    // Refresh bitacoras list when modal is closed
    fetchBitacoras(idSeguimiento);
  };

  if (!visible) {
    return null;
  }

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
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.title}>Seguimiento {idSeguimiento}</Text>
            <View style={styles.sectionContainer}>
              <ActaSeguimiento id_seguimiento={idSeguimiento} />
            </View>
            <View style={styles.sectionContainer}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
                  <Icon name="upload" size={20} color="#fff" style={styles.icon} />
                  <Text style={styles.buttonText}>Subir Bitácora</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.subTitle}>Bitácoras</Text>

              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : bitacoras.length > 0 ? (
                bitacoras.map((bitacora) => (
                  <View key={bitacora.id_bitacora} style={styles.bitacoraItem}>
                    <Text>Bitácora: {bitacora.bitacora}</Text>
                    <Text>Estado: {bitacora.estado}</Text>
                    <Text>Fecha: {new Date(bitacora.fecha).toLocaleDateString()}</Text>
                    <Text>Instructor: {bitacora.instructor}</Text>
                    <Text>PDF: {bitacora.pdf}</Text>
                    <Text>Seguimiento: {bitacora.seguimiento}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noBitacorasText}>No hay bitácoras disponibles.</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
      <ModalBitacoras
        visible={modalVisible}
        onClose={handleCloseModal}
        idSeguimiento={idSeguimiento}
      />
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF0000',
    borderRadius: 50,
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 32,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  bitacoraItem: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
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
  buttonText: {
    color: '#fff',
    marginLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
});

export default ModalSeguimiento;