import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Alert, Image, RefreshControl } from 'react-native';
import { Bell, Trash, BellPlus } from 'lucide-react-native';
import FormNovedades from './FormNovedad';
import axiosClient from '../../axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import Layout from "../Template/Layout";
import NovedadFormulario from './FormNovedad';

const Novedades = ({ route }) => {
    const [novedades, setNovedades] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bodyContent, setBodyContent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [seguimientoId, setSeguimientoId] = useState(''); // Estado para el seguimiento seleccionado
    const [seguimientos, setSeguimientos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [identificacion, setIdentificacion] = useState(''); // Nuevo estado para la identificacion
    const [productiva, setProductiva] = useState(''); // Nuevo estado para la productiva
    const { identificacion: routeIdentificacion, productiva: routeProductiva } = route.params;
    const [loadingSeguimiento, setLoadingSeguimiento] = useState(false);



    const handleAbrirModalFormNovedades = () => {
        setModalVisible(true);
    };

    const handleCloseModalFormNovedades = () => {
        setModalVisible(false);
    };


    useEffect(() => {
        const loadInitialData = async () => {
            if (routeIdentificacion && routeProductiva) {
                // Llamar a las funciones con los valores de los parámetros de la ruta
                await listarSeguimientos(routeProductiva);  // Llamada solo cuando los parámetros estén disponibles
                listarNovedades(routeIdentificacion, seguimientoId);  // Solo después de que los valores estén establecidos
            } else {
                Alert.alert('Error', 'No se encontró la identificación o productiva.');
            }
        };
        loadInitialData();
    }, [routeIdentificacion, routeProductiva]); // Dependencias de los parámetros

    const listarNovedades = async (identificacion, seguimientoId = '') => {
        if (loadingSeguimiento) return; // Evita nuevas solicitudes si aún se está cargando
        setLoadingSeguimiento(true);
        try {
            const response = await axiosClient.get(`/novedad/listar/${identificacion}`, { params: { seguimientoId } });
            if (Array.isArray(response.data)) {
                setNovedades(response.data);
            } else {
                setNovedades([]);
            }
        } catch (error) {
            console.error('Error al obtener novedades:', error.message);
            setNovedades([]);
        } finally {
            setLoadingSeguimiento(false);
        }
    };


    const listar = async (id_seguimiento = '') => {
        if (!id_seguimiento) return;  // Evita la llamada si el seguimiento no está definido

        setIsLoading(true);
        try {
            const response = await axiosClient.get(`/novedades/listarN/${id_seguimiento}`, { params: { seguimientoId } });
            if (Array.isArray(response.data)) {
                setNovedades(response.data);
            } else {
                setNovedades([]); // Limpia las novedades si no hay datos
            }
        } catch (error) {
            console.error('Error al obtener novedades:', error.message);
            setNovedades([]); // Limpia las novedades en caso de error
        } finally {
            setIsLoading(false);
            if (!isLoading && novedades.length === 0) {
                Alert.alert('No hay novedades', 'No hay novedades registradas.');
            }
        }
    };

    const listarSeguimientos = async (productiva) => {
        if (!productiva) return;  // Evita la llamada si productiva no está definida

        setIsLoading(true);
        console.log('Productiva enviada al endpoint:', productiva); // Log para depurar
        try {
            const response = await axiosClient.get(`/seguimientos/listarSeguimientoP/${productiva}`);
            if (response.status === 200 && response.data) {
                const parsedSeguimientos = Object.entries(response.data[productiva] || {}).map(([label, id]) => ({
                    label, // Ejemplo: "seguimiento 1"
                    value: id, // El ID correspondiente
                }));
                setSeguimientos(parsedSeguimientos);
            } else {
                console.log('No se encontraron seguimientos para la productiva:', productiva);
                setSeguimientos([]);
            }
        } catch (error) {
            console.error('Error al listar seguimientos:', error.message, error.response?.data);
            Alert.alert('Error', 'No se pudieron cargar los seguimientos. Verifica los datos e intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (routeProductiva) {
            listarSeguimientos(routeProductiva);
        }
    }, [routeProductiva]);


    useEffect(() => {
        if (seguimientoId) {
            listar(seguimientoId);
        }
    }, [seguimientoId]);

    useEffect(() => {
        if (seguimientoId) {
            listarNovedades(identificacion, seguimientoId); // Solo llama si el seguimientoId no está vacío
        }
    }, [seguimientoId]);


    const handleCloseModal = () => {
        setIsModalOpen(false);
        listarNovedades(identificacion, seguimientoId); // Vuelve a listar las novedades con el filtro de seguimiento
    };


    const handleRefresh = () => {
        setIsRefreshing(true);
        listarNovedades(identificacion, seguimientoId)
            .then(() => {
                setIsRefreshing(false);
            })
            .catch(() => {
                setIsRefreshing(false);
            });
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
                    {isLoading ? (
                        <Text>Cargando seguimientos...</Text>
                    ) : (
                        <Picker
                            selectedValue={seguimientoId}
                            style={styles.picker}
                            onValueChange={(itemValue) => {
                                setSeguimientoId(itemValue);  // Actualiza el seguimientoId

                                // Llamar a listarNovedades directamente después de que el estado haya cambiado
                                listarNovedades(identificacion, itemValue);
                            }}
                        >
                            <Picker.Item label="Selecciona un Seguimiento" value="" />
                            {seguimientos.map((seguimiento) => (
                                <Picker.Item
                                    key={seguimiento.value}
                                    label={seguimiento.label} // Corregido: muestra el texto "seguimiento X"
                                    value={seguimiento.value}
                                />
                            ))}
                        </Picker>
                    )}
                </View>

                <NovedadFormulario
                    visible={modalVisible}
                    onClose={handleCloseModalFormNovedades}
                    onSubmit={(data) => handleSubmit(data)}
                    productiva={routeProductiva}
                    route={{ params: { productiva: routeProductiva } }}
                />

                <TouchableOpacity style={styles.formButton} onPress={handleAbrirModalFormNovedades}>
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
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                        />
                    }
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

