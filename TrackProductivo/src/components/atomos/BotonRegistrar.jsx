import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const BotonRegistrar = ({ titulo, onPress }) => {
  return (
    <TouchableOpacity style={styles.boton} onPress={onPress}>
      <Text style={styles.textoBoton}>{titulo}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boton: {
    backgroundColor: '#0c8652',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignSelf: 'flex-end', 
    marginBottom: 6
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18,
  },
});

export default BotonRegistrar;
