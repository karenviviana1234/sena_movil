import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = ({ title, toggleMenu }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Icon name="bars" size={30} color="black" />
      </TouchableOpacity>
      {/* como vamos 
       */}
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 4, 
  },
  menuButton: {
    marginRight: 16, 
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1, 
    textAlign: 'center', 
    overflow: 'hidden', 
  },
});

export default Header;
