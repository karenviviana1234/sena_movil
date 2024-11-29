import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Alert, Image } from 'react-native';
import { Bell, Trash, BellPlus } from 'lucide-react-native';
import FormNovedades from './FormNovedad';
import axiosClient from '../../axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import Layout from "../Template/Layout";


const Novedades = ({ route }) => {
    const [novedades, setNovedades] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bodyContent, setBodyContent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [identificacion, setIdentificacion] = useState(null);
    const [seguimientoId, setSeguimientoId] = useState(''); // Estado para el seguimiento seleccionado
    const [productiva, setProductiva] = useState(null);
    const [seguimientos, setSeguimientos] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            const { identificacion, productiva } = route.params; // Obtener identificacion y productiva
            console.log('Datos recibidos:', { identificacion, productiva });

            if (identificacion) {
                setIdentificacion(identificacion);
                setProductiva(productiva); // Guardar productiva en el estado
                listarNovedades(identificacion, '', productiva); // Pasar productiva a la función
            } else {
                Alert.alert('Error', 'No se encontró la identificación del usuario.');
            }
        };
        loadInitialData();
    }, [route.params]);

    const listarNovedades = async (identificacion, seguimientoId = '') => {
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`/novedad/listar/${identificacion}`, { params: { seguimientoId } }); // Pasar el ID de seguimiento si existe
            if (Array.isArray(response.data)) {
                setNovedades(response.data);
            } else {
                setNovedades([]);
                Alert.alert('No hay novedades', 'No hay novedades registradas.');
            }
        } catch (error) {
            console.error('Error al obtener novedades:', error.message);
            Alert.alert('Error', 'No se encontraron novedades para este seguimiento. Inténtelo nuevamente.');
            setNovedades([]);
        } finally {
            setIsLoading(false);
        }
    };

    const listar = async (id_seguimiento = '') => {
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`/novedades/listarN/${id_seguimiento}`, { params: { seguimientoId } });
            if (Array.isArray(response.data)) {
                setNovedades(response.data);
            } else {
                setNovedades([]);
                Alert.alert('No hay novedades', 'No hay novedades registradas.');
            }
        } catch (error) {
            console.error('Error al obtener novedades:', error.message);
            Alert.alert('Error', 'No se pudieron cargar las novedades. Inténtelo nuevamente.');
            setNovedades([]);
        } finally {
            setIsLoading(false);
        }
    };


    const listarSeguimientos = async (productiva) => {
        try {
            const response = await axiosClient.get(`/seguimientos/listarSeguimientoP/${productiva}`);
            if (response.status === 200) {
                const data = response.data;

                // Transforma el objeto agrupado en un array plano
                const parsedSeguimientos = Object.entries(data[productiva]).map(([label, id]) => ({
                    label,   // "seguimiento 1", "seguimiento 2", etc.
                    value: id, // El id correspondiente
                }));

                setSeguimientos(parsedSeguimientos);
            } else {
                Alert.alert('Sin seguimientos', 'No hay seguimientos para la productiva seleccionada.');
                setSeguimientos([]);
            }
        } catch (error) {
            console.error('Error al listar seguimientos:', error.message);
            Alert.alert('Error', 'No se pudieron cargar los seguimientos. Inténtelo nuevamente.');
        }
    };
    useEffect(() => {
        if (productiva) {
            listarSeguimientos(productiva);
        }
    }, [productiva]);

    useEffect(() => {
        if (seguimientoId) {
            listar(seguimientoId);
        }
    }, [seguimientoId]);


    const handleOpenModal = (formType, novedad = null) => {
        if (formType === 'formNovedades') {
            setBodyContent(
                    <FormNovedades
                        initialData={novedad}
                        onClose={() => handleCloseModal()}
                        onSubmit={(data) => handleSubmit(data)}
                        mode={novedad ? 'edit' : 'create'}
                        actionLabel={novedad ? 'Actualizar Novedad' : 'Registrar Novedad'}
                        productiva={productiva}
                        route={{ params: { productiva } }}
                    />
            );
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        listarNovedades(identificacion, seguimientoId); // Vuelve a listar las novedades con el filtro de seguimiento
    };

    const handleSubmit = async (novedadData) => {
        try {
            if (novedadData.id_novedad) {
                // Editar novedad
                await axiosClient.put(`/novedades/actualizar/${novedadData.id_novedad}`, novedadData);
            } else {
                // Registrar nueva novedad
                await axiosClient.post(`/novedades/registrar`, novedadData);
            }
            listarNovedades(identificacion, seguimientoId); // Vuelve a cargar las novedades
            handleCloseModal();
        } catch (error) {
            Alert.alert('Error', `Error al guardar la novedad: ${error.message}`);
        }
    };

    const desactivarNovedad = async (id_novedad) => {
        Alert.alert('Confirmación', '¿Estás seguro de que quieres eliminar esta novedad?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar', onPress: async () => {
                    try {
                        const response = await axiosClient.delete(`/novedades/eliminar/${id_novedad}`);
                        if (response.status === 200) {
                            setNovedades(novedades.filter((novedad) => novedad.id_novedad !== id_novedad));
                            Alert.alert('Éxito', 'La novedad ha sido eliminada exitosamente.');
                        } else {
                            Alert.alert('Error', 'Hubo un problema al eliminar la novedad.');
                        }
                    } catch (error) {
                        Alert.alert('Error', 'Error al intentar eliminar la novedad.');
                        console.error(error);
                    }
                }
            }
        ]);
    };

    return (
        <Layout title={"Novedades"}>
            <View style={styles.container}>
                <View style={styles.containerpicker}>
                    <Picker
                        selectedValue={seguimientoId}
                        style={styles.picker}
                        onValueChange={(itemValue) => {
                            setSeguimientoId(itemValue);
                            listar(seguimientoId, itemValue);
                        }}
                    >
                        <Picker.Item label="Selecciona un Seguimiento" value="" />
                        {seguimientos.map((seguimiento) => (
                            <Picker.Item
                                key={seguimiento.value}
                                label={seguimiento.value}  // Label, como "seguimiento 1"
                                value={seguimiento.value}  // ID, por ejemplo 1
                            />
                        ))}
                    </Picker>
                </View>

                <TouchableOpacity style={styles.formButton} onPress={() => handleOpenModal('formNovedades')}>
                    <BellPlus size={30} bottom={-8} color="green" style={styles.icon} />
                </TouchableOpacity>

                {isLoading && <Text>Cargando...</Text>}

                <FlatList
                    data={novedades}
                    renderItem={({ item }) => (
                        <View style={styles.novedadItem}>
                            <Text style={styles.instructor}>{item.instructor}</Text>
                            <Text style={styles.descripcion}>Descripción: {item.descripcion}</Text>
                            <Text style={styles.seguimiento}>Seguimiento: {item.seguimiento}</Text>
                            {item.foto && (
                                <Image source={{ uri: `${axiosClient.defaults.baseURL}/novedad/${item.foto}` }} style={styles.image} />
                            )}
                            <Text style={styles.fecha}>{new Date(item.fecha).toLocaleDateString('es-CO')}</Text>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => desactivarNovedad(item.id_novedad)}>
                                <Trash size={25} color="black" />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={item => item.id_novedad.toString()}
                />

                <Modal visible={isModalOpen} onRequestClose={handleCloseModal}>
                    {bodyContent}
                </Modal>
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        height: "113%",
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    containerpicker: {
        height: 50,
        width: '85%',
        marginBottom: 16,
        backgroundColor: "#EDEDED",
        marginLeft: 4,
        borderRadius: 15,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: 'transparent',
    },
    novedadItem: {
        backgroundColor: '#ecffe1',
        padding: 16,
        marginVertical: 16,
        borderRadius: 10,
    },
    instructor: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#0d324c' },
    descripcion: { fontSize: 16, color: '#666' },
    seguimiento: { fontSize: 16, color: '#666' },
    image: { width: '100%', height: 150, resizeMode: 'contain', marginTop: 8 },
    fecha: { fontSize: 12, color: '#888', position: 'absolute', bottom: 6, right: 6, padding: 4, borderRadius: 4 },
    formButton: {
        position: 'absolute',
        right: 16,
        top: 10,
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        width: 24,
        height: 24,
        color: '#fff'
    },
    deleteButton: { position: 'absolute', top: 6, right: 4, padding: 4, borderRadius: 4 },
});

export default Novedades;