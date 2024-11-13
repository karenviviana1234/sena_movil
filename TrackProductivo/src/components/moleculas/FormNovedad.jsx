// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import * as ImagePicker from 'expo-image-picker';
// import axiosClient from '../../axiosClient';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const FormNovedades = ({ onSubmit, onClose, actionLabel, mode, initialData }) => {
//   const [descripcion, setDescripcion] = useState(initialData?.descripcion || "");
//   const [fecha, setFecha] = useState(initialData?.fecha || new Date());
//   const [foto, setFoto] = useState(null);
//   const [seguimientos, setSeguimientos] = useState([]);
//   const [selectedSeguimiento, setSelectedSeguimiento] = useState(initialData?.id_seguimiento || "");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [instructor, setInstructor] = useState("");

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         if (mode === 'update' && initialData.id_novedad) {
//           await loadInitialData();
//         }
//         const response = await axiosClient.get("/seguimientos/listar");
//         setSeguimientos(response.data);
//       } catch (error) {
//         console.error("Error al cargar datos", error);
//         setErrorMessage("Error al cargar datos. Intenta de nuevo más tarde.");
//       }
//     };

//     fetchInitialData();

//     // Obtén el instructor desde AsyncStorage
//     const getInstructorFromStorage = async () => {
//       try {
//         const storedUser = await AsyncStorage.getItem('user');
//         if (storedUser) {
//           const user = JSON.parse(storedUser);
//           setInstructor(user.nombres); // Asume que el objeto de usuario tiene una propiedad 'nombre'
//         }
//       } catch (error) {
//         console.error("Error al obtener el instructor del almacenamiento:", error);
//       }
//     };

//     getInstructorFromStorage();
//   }, []);

//   const loadInitialData = async () => {
//     try {
//       const response = await axiosClient.get(`/novedad/listarN/${initialData.id_novedad}`);
//       const novedad = response.data;

//       setFecha(new Date(novedad.fecha));
//       setDescripcion(novedad.descripcion);
//       setSelectedSeguimiento(novedad.id_seguimiento);

//       if (novedad.foto) {
//         setFoto({ uri: novedad.foto });
//       }
//     } catch (error) {
//       console.error("Error al cargar datos iniciales:", error);
//       setErrorMessage("Error al cargar datos iniciales. Intenta de nuevo más tarde.");
//     }
//   };

//   const handleSubmit = async () => {
//     setErrorMessage("");

//     const formData = new FormData();
//     formData.append("descripcion", descripcion);
//     formData.append("fecha", fecha.toISOString().split('T')[0]);
//     formData.append("instructor", instructor);
//     formData.append("seguimiento", selectedSeguimiento);

//     if (foto && typeof foto !== 'string') {
//       formData.append("foto", {
//         name: foto.name,
//         type: foto.type,
//         uri: Platform.OS === 'android' ? foto.uri : foto.uri.replace('file://', ''),
//       });
//     }

//     try {
//       if (mode === 'update' && initialData?.id_novedad) {
//         await axiosClient.put(`/novedad/actualizar/${initialData.id_novedad}`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//       } else {
//         await axiosClient.post("/novedad/registrar", formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//       }

//       // Mostrar alerta de éxito
//       alert('Registro exitoso! La novedad se ha guardado correctamente.');

//       if (onSubmit) onSubmit();
//       if (onClose) onClose();
//     } catch (error) {
//       console.error("Error del servidor:", error);
//       setErrorMessage("Error del servidor: " + error.message);
//       alert('Ocurrió un error al guardar la novedad. Intenta de nuevo.');
//     }
//   };

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled) {
//       setFoto(result);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Registro de Novedades</Text>
//       {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

//       <TouchableOpacity onPress={() => pickImage()} style={styles.imagePickerButton}>
//         <Text style={styles.buttonText}>Seleccionar Foto</Text>
//       </TouchableOpacity>
//       {foto && typeof foto !== 'string' && (
//         <Image source={{ uri: foto.uri }} style={styles.imagePreview} />
//       )}

//       <TextInput
//         placeholder="Descripción"
//         value={descripcion}
//         onChangeText={(text) => setDescripcion(text)}
//         style={styles.input}
//         multiline
//         numberOfLines={4}
//       />

//       <Picker
//         selectedValue={selectedSeguimiento}
//         onValueChange={(itemValue) => setSelectedSeguimiento(itemValue)}
//         style={styles.picker}
//       >
//         <Picker.Item label="Selecciona un Seguimiento" value="" />
//         {seguimientos.map((seguimiento) => (
//           <Picker.Item key={seguimiento.id_seguimiento} label={seguimiento.nombre} value={seguimiento.id_seguimiento} />
//         ))}
//       </Picker>

//       <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
//         <Text style={styles.buttonText}>{mode === 'update' ? 'Actualizar' : 'Registrar'}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   error: {
//     color: 'red',
//     marginBottom: 10,
//   },
//   imagePickerButton: {
//     backgroundColor: '#0d324c',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   imagePreview: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'contain',
//     marginBottom: 15,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     marginBottom: 15,
//   },
//   picker: {
//     width: '100%',
//     marginBottom: 15,
//   },
//   submitButton: {
//     backgroundColor: '#0d324c',
//     padding: 15,
//     alignItems: 'center',
//     borderRadius: 5,
//   },
// });

// export default FormNovedades;
