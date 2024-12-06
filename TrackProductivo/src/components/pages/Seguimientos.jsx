import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Linking } from 'react-native';
import { usePersonas } from "../../Context/ContextPersonas.jsx";
import SeguimientosContext from "../../Context/ContextSeguimiento.jsx";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalSeguimiento from '../moleculas/Modal_Seguimiento.jsx';
import ComponentSeguimiento from '../moleculas/ComponetSeguimiento.jsx';
import Layout from '../Template/Layout';

const Seguimientos = () => {
    const { rol, cargo } = usePersonas();
    const { seguimientos, getSeguimientos, getSeguimiento } = useContext(SeguimientosContext);
    const [filterValue, setFilterValue] = useState("");
    const [selectedSeguimientoId, setSelectedSeguimientoId] = useState(null);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState(null);
    const [seguimientoData, setSeguimientoData] = useState(null);

    useEffect(() => {
        const fetchSeguimientos = async () => {
            try {
                await getSeguimientos();
            } catch (error) {
                setError(`Error al obtener los seguimientos: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchSeguimientos();
    }, [getSeguimientos]);

    const filteredItems = useMemo(() => {
        return seguimientos.filter(seg =>
            seg.identificacion ||
            seg.id_seguimiento.toString().includes(filterValue)
        );
    }, [seguimientos, filterValue]);

    const handleOpenModal = async (id_seguimiento, componentName) => {
        try {
            await AsyncStorage.setItem('idSeguimiento', id_seguimiento.toString());
            setSelectedSeguimientoId(id_seguimiento);
            const data = await getSeguimiento(id_seguimiento);
            setSelectedComponent(componentName);
            setSeguimientoData(data);
            setModalVisible(true);
        } catch (error) {
            setError(`Error al obtener el seguimiento: ${error.message}`);
        }
    };

    const handleCloseModal = async () => {
        setModalVisible(false);
        setSelectedComponent(null);
        setSeguimientoData(null);
        setSelectedSeguimientoId(null);
        await AsyncStorage.removeItem('idSeguimiento');
    };

    // Verificar si todas las bitácoras están aprobadas
    const checkBitacorasApproved = (bitacoras) => {
        if (!Array.isArray(bitacoras)) {
            return false;
        }

        return bitacoras.every(seguimiento =>
            Array.isArray(seguimiento) &&
            seguimiento.every(bitacora => bitacora.estado_bitacora === "aprobado")
        );
    };


    const renderSeguimientoButtons = (item) => {
        const seguimientoFechas = [item.seguimiento1, item.seguimiento2, item.seguimiento3];
        const estados = [item.estado1, item.estado2, item.estado3];

        const formatDate = (date) => {
            if (!date) return "Sin fecha";
            const formattedDate = new Date(date);
            return `${formattedDate.getDate().toString().padStart(2, '0')}-${(formattedDate.getMonth() + 1).toString().padStart(2, '0')}-${formattedDate.getFullYear()}`;
        };

        const getButtonBackgroundColor = (estado) => {
            switch (estado) {
                case "solicitud":
                    return "#FFA000"; // Naranja
                case "aprobado":
                    return "#4CAF50"; // Verde
                case "no aprobado":
                    return "#e64133"; // Rojo
                default:
                    return "#BDBDBD"; // Color gris para estados no definidos
            }
        };

        return (
            <View style={styles.buttonContainer}>
                {["id_seguimiento1", "id_seguimiento2", "id_seguimiento3"].map((seguimientoKey, index) => (
                    <TouchableOpacity
                        key={seguimientoKey}
                        style={[styles.button, { backgroundColor: getButtonBackgroundColor(estados[index]) }]}
                        onPress={() => handleOpenModal(item[seguimientoKey], `ComponentSeguimiento${index + 1}`)}
                        accessible={true}
                        accessibilityLabel={`Ver seguimiento ${index + 1} para ${item.nombres}`}
                    >
                        <Text style={styles.buttonText}>
                            {formatDate(seguimientoFechas[index])}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const handleEmailPress = () => {
        Linking.openURL('mailto:certificacion9528@sena.edu.co');
    };

    const renderItem = ({ item }) => {

        // Verificamos si todas las bitácoras están aprobadas
        if (checkBitacorasApproved(item.bitacoras)) {
            if (rol === "Aprendiz") {
                return (
                    <View key={item.id_seguimiento}>
                        <Text style={styles.subtitle}>¿Como Certificarte?</Text>
                        <Text style={styles.itemText}>
                            Apreciad@ aprendiz, para solicitar el certificado del programa de formación cursado, por favor remitir un mensaje al correo
                            <Text style={styles.emailText} onPress={handleEmailPress}> certificacion9528@sena.edu.co</Text>
                            , solicitando su certificado, el programa de formación, el número de ficha y número de celular. Adicionalmente, adjuntar la siguiente documentación:
                        </Text>
                        <Text style={styles.itemText}>- Fotocopia documento de identidad</Text>
                        <Text style={styles.itemText}>- Foto carnet del SENA destruido (sino lo tienen informar en el correo el motivo por el cual no lo tienen)</Text>
                        <Text style={styles.itemText}>- Pruebas TYT para tecnólogos (Aplica para tecnólogos, pueden remitir soporte de la asistencia a la presentación no es necesario esperar los resultados)</Text>
                        <Text style={styles.itemText}>- Hoja de vida actualizada en agencia pública de empleo (sino esta actualizada por este medio pueden remitir Diploma o acta de Bachiller o de 9)</Text>
                        <Text style={styles.itemText}>- Certificado laboral donde hizo su etapa productiva</Text>
                        <Text style={styles.itemText}>- Certificado por SOFIAPLUS (Ingresa a Sofia Plus, selecciona el rol de aprendiz, opción certificación, descargar soporte del programa que estaba estudiando para realizar el proceso de actualización)</Text>
                    </View>
                );
            }
        }

        if (checkBitacorasApproved(item.bitacoras)) {
            if (rol === "Instructor") {
            return (
                <View key={item.id_seguimiento} style={styles.item}>
                <Text style={styles.itemText}>Nombre: {item.nombres}</Text>
                <Text style={styles.itemText}>Empresa: {item.razon_social}</Text>
                <Text style={styles.itemText}>Identificación: {item.identificacion}</Text>
                <Text style={styles.itemText}>Programa: {item.sigla}</Text>
                <Text style={styles.itemText}>Ficha: {item.codigo}</Text>
                <Text style={styles.itemText}>Porcentaje: {item.porcentaje}%</Text>
                    <Text style={styles.itemText}>Carga el reporte de calificacion de la etapa practica accediendo al siguiente enlace:</Text>
                    <TouchableOpacity onPress={() => Linking.openURL('http://senasofiaplus.edu.co/sofia-public/')}>
                        <Text style={styles.emailText}>http://senasofiaplus.edu.co/sofia-public/</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }
        
        // Si no todas las bitácoras están aprobadas, mostramos la información original
        return (
            <View key={item.id_seguimiento} style={styles.item}>
                <Text style={styles.itemText}>Nombre: {item.nombres}</Text>
                <Text style={styles.itemText}>Empresa: {item.razon_social}</Text>
                <Text style={styles.itemText}>Identificación: {item.identificacion}</Text>
                <Text style={styles.itemText}>Programa: {item.sigla}</Text>
                <Text style={styles.itemText}>Ficha: {item.codigo}</Text>
                <Text style={styles.itemText}>Porcentaje: {item.porcentaje}%</Text>
                {renderSeguimientoButtons(item)}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <Layout title="Seguimientos">
            <View style={styles.container}>
                {rol !== 'Aprendiz' && (
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar seguimiento..."
                        value={filterValue}
                        onChangeText={setFilterValue}
                    />
                )}
                <FlatList
                    data={filteredItems}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.id_seguimiento?.toString() || index.toString()}
                    />

                {seguimientoData && (
                    <View style={styles.seguimientoDetails}>
                        <Text style={styles.detailsTitle}>
                            Detalles del Seguimiento {selectedComponent?.slice(-1)}
                        </Text>
                        <Text>Nombre: {seguimientoData.nombres}</Text>
                        <Text>Empresa: {seguimientoData.razon_social}</Text>
                        <Text>Identificación: {seguimientoData.identificacion}</Text>
                        <Text>Sigla: {seguimientoData.sigla}</Text>
                    </View>
                )}

                <ModalSeguimiento
                    visible={modalVisible}
                    onClose={handleCloseModal}
                    id_seguimiento={selectedSeguimientoId}
                >
                    {selectedComponent?.startsWith("ComponentSeguimiento") && (
                        <ComponentSeguimiento
                            id_seguimiento={selectedSeguimientoId}
                            numero={selectedComponent.slice(-1)}
                        />
                    )}
                </ModalSeguimiento>
            </View>
        </Layout>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#ecffe1",
        height: "110%"
    },
    searchInput: {
        height: 40,
        backgroundColor: "#EDEDED",
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    item: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    emailText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    label: {
        fontSize: 18,
        fontWeight: "bold"
    },
    itemText: {
        fontSize: 16,
        marginBottom: 4,
        color: "black"
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 4,
        fontWeight: "bold",
        textAlign: "center",
        color: "#0d324c"
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    seguimientoDetails: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Seguimientos;

