import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Platform, Modal, ActivityIndicator } from 'react-native';
import axios from '../../axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import { ArrowLeft, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { usePersonas } from '../../Context/ContextPersonas';
import moment from 'moment';
import axiosClient from '../../axiosClient';

const NovedadFormulario = ({ visible, onClose, onSubmit, route }) => {
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState(new Date());
    const [instructor, setInstructor] = useState('');
    const { nombres } = usePersonas();
    const [fotos, setFotos] = useState([]);
    const [seguimientos, setSeguimientos] = useState([]);
    const [seguimientoId, setSeguimientoId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [productiva, setProductiva] = useState(null);


    useEffect(() => {
        const loadInitialData = async () => {
            if (route?.params?.productiva) {
                setProductiva(route.params.productiva);
            } else if (!productiva) {
                Alert.alert('Error', 'No se recibió el parámetro productiva.');
            }
        };

        loadInitialData();
    }, [route?.params?.productiva, productiva]);

    useEffect(() => {
        if (visible && productiva) {
            fetchSeguimientos(productiva);
        }
    }, [visible, productiva]);

    useEffect(() => {
        if (nombres) {
            setInstructor(nombres);
        }
    }, [nombres]);

    const fetchSeguimientos = async (productiva) => {
        if (!productiva) {
            console.error('No se pudo cargar la productiva.');
            return;  // No hacer nada si productiva no está disponible
        }
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`/seguimientos/listarSeguimientoP/${productiva}`);
            if (response.status === 200) {
                const data = response.data;
                const parsedSeguimientos = Object.entries(data[productiva]).map(([label, id]) => ({
                    label,
                    value: id,
                }));
                setSeguimientos(parsedSeguimientos);
            } else {
                Alert.alert('Sin seguimientos', 'No hay seguimientos para la productiva seleccionada.');
                setSeguimientos([]);
            }
        } catch (error) {
            console.error('Error al listar seguimientos:', error.message);
            Alert.alert('Error', 'No se pudieron cargar los seguimientos. Inténtelo nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };


    const pickImages = async () => {
        try {
            const result = await ImagePicker.openPicker({
                multiple: false,
                compressImageQuality: 0.7,
            });
            setFotos([result]);
        } catch (error) {
            console.error('Error al seleccionar imágenes:', error);
            Alert.alert('Error', 'No se pudieron seleccionar las imágenes.');
        }
    };

    const removeImage = () => {
        setFotos([]);
    };

    const showDatePicker = () => {
        setIsDatePickerVisible(true);
    };

    const handleDatePicked = (date) => {
        setFecha(date);
        setIsDatePickerVisible(false);
    };

    const TitleWithBackButton = () => (
        <View style={styles.titleContainer}>
            <Text style={styles.title}>Registrar Novedad</Text>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <X size={24} color="#333" />
            </TouchableOpacity>
        </View>
    );

    const handleSubmit = async () => {
        if (!descripcion.trim() || !fecha || !seguimientoId) {
            Alert.alert('Advertencia', 'Por favor complete todos los campos.');
            return;
        }

        if (!instructor) {
            Alert.alert('Error', 'No se pudo obtener la información del instructor.');
            return;
        }

        const formData = new FormData();
        formData.append("descripcion", descripcion);
        formData.append("fecha", moment(fecha).format('YYYY-MM-DD'));
        formData.append("instructor", instructor);
        formData.append("seguimiento", seguimientoId);

        fotos.forEach(foto => {
            formData.append('foto', {
                uri: Platform.OS === 'android' ? foto.path : `file://${foto.path}`,
                type: foto.mime,
                name: foto.filename,
            });
        });

        try {
            const response = await axiosClient.post('/novedades/registrar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                }
            });

            if (response.data) {
                Alert.alert('Éxito', 'Novedad registrada con éxito.');
                onSubmit();
            }
        } catch (error) {
            console.error('Error al registrar novedad:', error);
            Alert.alert('Error', 'Hubo un problema al registrar la novedad.');
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TitleWithBackButton />
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.sectionSeparator}>
                            <Text style={styles.instructor}>
                                {instructor ? `Instructor: ${instructor}` : 'Seleccione un seguimiento para ver el instructor.'}
                            </Text>
                            <TextInput
                                placeholder="Descripción de la Novedad"
                                placeholderTextColor="black"
                                value={descripcion}
                                onChangeText={setDescripcion}
                                multiline
                                numberOfLines={4}
                                style={[styles.input, styles.descriptionInput]}
                            />
                        </View>
                        <View style={styles.instructorContainer}>
                            {isLoading ? (
                                <ActivityIndicator size="large" color="#0000ff" />
                            ) : (
                                <View style={styles.containerpicker}>

                                    <Picker
                                        selectedValue={seguimientoId}
                                        onValueChange={(itemValue) => {
                                            console.log('Valor seleccionado en el Picker:', itemValue);
                                            setSeguimientoId(itemValue); // Actualizar el estado de seguimientoId
                                        }}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Selecciona un Seguimiento" value="" />
                                        {seguimientos.map((seguimiento) => (
                                            <Picker.Item
                                                key={seguimiento.value} // Usa el id del seguimiento como clave
                                                label={seguimiento.label} // Nombre del seguimiento
                                                value={seguimiento.value} // id del seguimiento
                                            />
                                        ))}
                                    </Picker>

                                </View>
                            )}
                            <TouchableOpacity onPress={pickImages} style={[styles.buttonImage, styles.imageButton, styles.largeImageButton]}>
                                <Text style={[styles.TextButton]}> + Cargar Imagen</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={showDatePicker} style={styles.fecha}>
                            <Text style={styles.fecha}>{moment(fecha).format('YYYY-MM-DD')}</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleDatePicked}
                            onCancel={() => setIsDatePickerVisible(false)}
                        />
                        {fotos.length > 0 && (
                            <View style={styles.imagesContainer}>
                                {fotos.map((foto, index) => (
                                    <ImagePreview
                                        key={index}
                                        image={foto}
                                        onDelete={removeImage}
                                    />
                                ))}
                            </View>
                        )}
                    </ScrollView>
                    <View>
                        <TouchableOpacity onPress={handleSubmit} style={[styles.button, styles.submitButton]}>
                            <Text style={styles.TextButton}>Crear Novedad</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const ImagePreview = ({ image, onDelete }) => (
    <View style={styles.imagePreview}>
        <Image source={{ uri: image.path }} style={styles.previewThumbnail} />
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '90%',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    backButton: {
        marginLeft: 100,
        marginBottom: 20,

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "black"
    },
    scrollView: {
        flexGrow: 1,
    },
    instructor: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
        color: "black"
    },
    input: {
        marginBottom: 10,
        borderRadius: 16,
        padding: 10,
        backgroundColor: "#EDEDED",
        color: "black"
    },
    descriptionInput: {
        fontSize: 18,
        color: "black"
    },
    containerpicker: {
        borderRadius: 15,
        padding: 5,
        marginBottom: 10,
        backgroundColor: "#EDEDED"
    },
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        color: 'white',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 5,
    },
    deleteButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    imageButton: {
        backgroundColor: '#03055B',
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    imagePreview: {
        position: 'relative',
        margin: 5,
    },
    previewThumbnail: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 5,
    },
    largeImageButton: {
        marginVertical: 20,
    },
    picker: {
        fontSize: 14,
        backgroundColor: 'transparent',
        color: "black"
    },
    buttonImage: {
        backgroundColor: '#E89551',
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    },
    TextButton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fecha: {
        borderRadius: 8,
        alignItems: "flex-end",
        marginRight: 8,
        color: "black",
        marginBottom: 10
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginTop: 10,
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        marginBottom: 20
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default NovedadFormulario;