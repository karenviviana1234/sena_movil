import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Platform } from 'react-native';
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

const NovedadFormulario = ({ mode, initialData, onSubmit, route }) => {
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
        <View style={styles.container}>
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



            <View style={styles.bottomButtonContainer}>
                <TouchableOpacity onPress={handleSubmit} style={[styles.button, styles.submitButton]}>
                    <Text style={[styles.TextButton]}>{mode === 'update' ? 'Actualizar Novedad' : 'Crear Novedad'}</Text>
                </TouchableOpacity>
            </View>
        </View>
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
    container: {
        flex: 1,
        backgroundColor: '#ecffe1',
        padding: 20,
    },
    scrollView: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
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
    instructorInput: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    },
    buttonImage: {
        backgroundColor: "#EDEDED",
        width: "39%",
        paddingHorizontal: 2,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        marginLeft: 3
    },
    TextButton: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    seguimientoContainer: {
        marginBottom: 20,
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
    largeImageButton: {
        marginVertical: 20,
    },
    bottomButtonContainer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        height: 55,
    },
    instructorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    instructor: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20
    },
    containerpicker: {
        height: 50,
        width: '55%',
        backgroundColor: "#EDEDED",
        borderRadius: 15,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '55%',
        backgroundColor: 'transparent',
    },
    fecha: {
        marginTop: 0,
        marginLeft: 240
    },
});

export default NovedadFormulario;