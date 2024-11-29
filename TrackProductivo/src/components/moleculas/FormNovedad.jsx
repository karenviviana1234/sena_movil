import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Platform, Modal } from 'react-native';
import axios from '../../axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { usePersonas } from '../../Context/ContextPersonas';
import moment from 'moment';
import axiosClient from '../../axiosClient';

const NovedadFormulario = ({ mode, initialData, onSubmit, route, visible, onClose }) => {
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState(new Date());
    const [instructor, setInstructor] = useState('');
    const { nombres } = usePersonas();
    console.log(nombres);
    const [fotos, setFotos] = useState([]);
    const [seguimiento, setSeguimiento] = useState('');
    const [seguimientos, setSeguimientos] = useState([]);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [productiva, setProductiva] = useState(null);
    const [seguimientoId, setSeguimientoId] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            if (route?.params?.productiva) {
                setProductiva(route.params.productiva);
            } else {
                Alert.alert('Error', 'No se recibió el parámetro productiva.');
            }
        };
        loadInitialData();
    }, [route?.params?.productiva]);

    useEffect(() => {
        // Llama a fetchSeguimientos solo si productiva está disponible
        if (productiva) {
            fetchSeguimientos(productiva);
        }
    }, [productiva]);

    useEffect(() => {
        if (nombres) {
            setInstructor(nombres);
            console.log(nombres); // Asignar el nombre del usuario logueado
        }
        if (mode === 'update' && initialData.id_novedad) {
            setDescripcion(initialData.descripcion);
            setFecha(new Date(initialData.fecha));
            setSeguimiento(initialData.seguimiento);
            setFotos([initialData.foto]);
        }
    }, [nombres]);

    const fetchSeguimientos = async (productivaId) => {
        try {
            const response = await axiosClient.get(`/seguimientos/listarSeguimientoP/${productivaId}`);
            if (response.data && response.data[productivaId]) {
                const seguimientosList = Object.entries(response.data[productivaId]).map(([key, value]) => ({
                    id: value,
                    name: key,
                }));
                setSeguimientos(seguimientosList);
            } else {
                console.error("La respuesta no contiene los datos esperados:", response.data);
                Alert.alert('Error', 'La respuesta de la API no es válida.');
            }
        } catch (error) {
            console.error('Error al obtener seguimientos:', error);
            Alert.alert('Error', 'Ocurrió un error al cargar los seguimientos.');
        }
    };

    useEffect(() => {
        fetchSeguimientos(); // Llamada inicial para obtener los seguimientos
    }, []);


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
    const selectSeguimiento = (value) => {
        console.log('Valor seleccionado en el Picker:', value);
        setSeguimiento(Number(value));
    };

    const showDatePicker = () => {
        setIsDatePickerVisible(true);
    };

    const handleDatePicked = (date) => {
        setFecha(date);
        setIsDatePickerVisible(false);
    };

    const navigation = useNavigation();

    const TitleWithBackButton = ({ navigation }) => (
        <View style={styles.titleContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>{mode === 'update' ? 'Actualizar Novedad' : 'Crear Novedad'}</Text>
        </View>
    );


    const handleSubmit = async () => {
        if (!descripcion.trim() || !fecha || !seguimientoId) {
            console.log('Estado actual:', { descripcion, fecha, seguimientoId });
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
        formData.append("seguimiento", seguimientoId);  // Usar el id de seguimiento

        fotos.forEach(foto => {
            formData.append('foto', {
                uri: Platform.OS === 'android' ? foto.path : `file://${foto.path}`,
                type: foto.mime,
                name: foto.filename,
            });
        });

        try {
            let url = mode === 'update' ? `/novedades/actualizar/${initialData.id_novedad}` : '/novedades/registrar';
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                }
            });
            console.log('Respuesta exitosa:', response.data);
            Alert.alert('Éxito', 'Novedad registrada con éxito.');
            onSubmit();
        } catch (error) {
            console.error('Error al registrar novedad:', error);
            if (error.response) {
                if (error.response.status === 404) {
                    Alert.alert('Error', 'La URL de la API no se encuentra. Verifica la conexión.');
                } else {
                    Alert.alert('Error', error.response.data.message || 'Ocurrió un error al registrar la novedad.');
                }
            } else {
                Alert.alert('Error', 'Ocurrió un error al enviar la solicitud.');
            }
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TitleWithBackButton navigation={navigation} />
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.sectionSeparator}>
                            <Text style={styles.instructor}>
                                {instructor ? `Instructor: ${instructor}` : 'Seleccione un seguimiento para ver el instructor.'}
                            </Text>
                            <TextInput
                                placeholder="Descripción de la Novedad"
                                value={descripcion}
                                onChangeText={setDescripcion}
                                multiline
                                numberOfLines={4}
                                style={[styles.input, styles.descriptionInput]}
                            />
                        </View>
                        <View style={styles.instructorContainer}>
                            <View style={styles.containerpicker}>

                                <Picker
                                    selectedValue={seguimientoId}
                                    onValueChange={(itemValue) => {
                                        console.log('Valor seleccionado en el Picker:', itemValue);
                                        setSeguimientoId(itemValue);  // Aquí estás actualizando el estado `seguimientoId`
                                    }}
                                >
                                    <Picker.Item label="Selecciona un Seguimiento" value="" style={styles.picker} />
                                    {seguimientos.map((seguimiento) => (
                                        <Picker.Item
                                            key={seguimiento.id}
                                            label={`Seguimiento ${seguimiento.id}`}  // Para mayor claridad, puedes incluir el nombre
                                            value={seguimiento.id}  // Aquí, el valor debe ser el ID del seguimiento
                                        />
                                    ))}
                                </Picker>
                            </View>
                            <TouchableOpacity onPress={pickImages} style={[styles.buttonImage, styles.imageButton, styles.largeImageButton]}>
                                <Text style={[styles.TextButton]}> + Cargar Imagen</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={showDatePicker} style={styles.fecha}>
                            <Text>{moment(fecha).format('YYYY-MM-DD')}</Text>
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
                            <Text style={[styles.TextButton]}>{mode === 'update' ? 'Actualizar Novedad' : 'Crear Novedad'}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
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
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollView: {
        flexGrow: 1,
    },
    sectionSeparator: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 10,
    },
    seguimientoContainer: {
        marginBottom: 20,
    },
    instructorContainer: {
        marginBottom: 15,
    },
    instructor: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    input: {
        marginBottom: 10,
        borderRadius: 16,
        padding: 10,
        backgroundColor: "#EDEDED"
    },
    descriptionInput: {
        marginBottom: 20,
        fontSize: 18
    },
    containerpicker: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 5,
        marginBottom: 10,
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
        marginBottom: 20,
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
    },
    buttonImage: {
        backgroundColor: '#E89551',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    TextButton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fecha: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginTop: 10,
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 10
    },
    closeButtonText: {
        color: "white",
        fontSize: 18,
    },
});

export default NovedadFormulario;