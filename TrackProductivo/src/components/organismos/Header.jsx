import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu, CircleUserRound } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const Header = ({ title, toggleMenu }) => {
  const navigation = useNavigation();
  const route = useRoute();

  // Verificar la pantalla actual y ajustar la ruta de navegación
  const handleProfileNavigation = () => {
    if (route.name === "perfil") {
      navigation.navigate("principal"); // Navega a la página principal si estás en el perfil
    } else {
      navigation.navigate("perfil"); // Navega al perfil si estás en cualquier otra pantalla
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Menu name="bars" size={30} color="#0d324c" />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
      <TouchableOpacity onPress={handleProfileNavigation}>
        <View>
          <CircleUserRound name="user" size={30} color="#0d324c" />
        </View>
      </TouchableOpacity>
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
    color: '#0d324c',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1, 
    textAlign: 'center', 
    overflow: 'hidden', 
  },
});

export default Header;