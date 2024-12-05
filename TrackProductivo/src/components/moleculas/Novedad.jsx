import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Alert, Image } from 'react-native';
import { Bell, Trash, BellPlus } from 'lucide-react-native';
import FormNovedades from './FormNovedad';
import axiosClient from '../../axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import Layout from "../Template/Layout";
import NovedadFormulario from './FormNovedad';
import { usePersonas } from "../../Context/ContextPersonas";

const Novedades = ({ route }) => {
    const [novedades, setNovedades] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [seguimientos, setSeguimientos] = useState([]);
    const [seguimientoId, setSeguimientoId] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const { identificacion: routeIdentificacion, productiva: routeProductiva } = route.params;

    const { rol } = usePersonas();

    // Controlador para listar seguimientos por productiva
    const listarSeguimientos = async (productiva) => {
        if (!productiva) return;
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`/seguimientos/listarSeguimientoP/${productiva}`);
            if (response.status === 200 && response.data) {
                const parsedSeguimientos = Object.entries(response.data[productiva] || {}).map(([label, id]) => ({
                    label,
                    value: id,
                }));
                setSeguimientos(parsedSeguimientos);
            } else {
                setSeguimientos([]);
            }
        } catch (error) {
            console.error('Error al listar seguimientos:', error.message);
            Alert.alert('Error', 'No se pudieron cargar los seguimientos.');
        } finally {
            setIsLoading(false);
        }
    };

    // Controlador para desactivar una  novedad
    const desactivarNovedad = async (id_novedad) => {
        Alert.alert('Confirmación', '¿Estás seguro de que quieres eliminar esta novedad?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                onPress: async () => {
                    try {
                        const response = await axiosClient.delete(`/novedades/eliminar/${id_novedad}`);
                        if (response.status === 200) {
                            setNovedades(novedades.filter((novedad) => novedad.id_novedad !== id_novedad));
                            Alert.alert('Éxito', 'La novedad ha sido eliminada exitosamente.');
                        }
                    } catch (error) {
                        Alert.alert('Error', 'Error al intentar eliminar la novedad.');
                        console.error(error);
                    }
                },
            },
        ]);
    };

    // Controlador para listar novedades por identificación
    const listarNovedades = async (identificacion) => {
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`/novedades/listar/${identificacion}`);
            setNovedades(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al obtener novedades:', error.message);
            Alert.alert('Error', 'No se pudieron cargar las novedades.');
        } finally {
            setIsLoading(false);
        }
    };

    // Controlador para listar novedades por seguimiento
    const listar = async (id_seguimiento) => {
        if (!id_seguimiento) return;
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`/novedades/listarN/${id_seguimiento}`);
            setNovedades(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al obtener novedades:', error.message);
            Alert.alert('Error', 'No se pudieron cargar las novedades.');
        } finally {
            setIsLoading(false);
        }
    };

    // Efectos para cargar datos iniciales y dependientes
    useEffect(() => {
        if (routeProductiva) listarSeguimientos(routeProductiva);
        if (routeIdentificacion) listarNovedades(routeIdentificacion);
    }, [routeProductiva, routeIdentificacion]);

    useEffect(() => {
        if (seguimientoId) listar(seguimientoId);
    }, [seguimientoId]);

    // Manejo del modal
    const handleAbrirModalFormNovedades = () => setModalVisible(true);
    const handleCloseModalFormNovedades = () => setModalVisible(false);


    const handleSubmitNovedad = () => {
        console.log("Novedad registrada correctamente");
        // Aquí puedes hacer cualquier acción después de que la novedad se registre
        // como actualizar la lista, cerrar el modal, etc.
        setModalVisible(false); // Si quieres cerrar el modal después de registrar la novedad
    };
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
                                <Picker.Item key={seguimiento.value} label={seguimiento.label} value={seguimiento.value} />
                            ))}
                        </Picker>
                    )}
                </View>

                <NovedadFormulario
                    visible={modalVisible}
                    onClose={handleCloseModalFormNovedades}
                    productiva={routeProductiva}
                    onSubmit={handleSubmitNovedad}
                    route={{ params: { productiva: routeProductiva } }}
                />

                {rol !== "Aprendiz" && (
                    <TouchableOpacity style={styles.formButton} onPress={handleAbrirModalFormNovedades}>
                        <BellPlus size={30} color="green" style={styles.icon} />
                    </TouchableOpacity>
                )}
                {isLoading && <Text>Cargando novedades...</Text>}

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
                            {rol !== "Aprendiz" && (
                            <TouchableOpacity style={styles.deleteButton} onPress={() => desactivarNovedad(item.id_novedad)}>
                                <Trash size={25} color="black" />
                            </TouchableOpacity>
                            )}
                        </View>
                    )}
                    keyExtractor={(item) => item.id_novedad.toString()}
                />
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

