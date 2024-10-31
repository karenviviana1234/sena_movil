import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu, CircleUserRound } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { usePersonas } from "../../Context/ContextPersonas";

const Header = ({ title, toggleMenu }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Menu name="bars" size={30} color="#0d324c" />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
      <TouchableOpacity
          onPress={() => navigation.navigate("perfil")}
        >
          <View >
            <CircleUserRound name="user" size={30} color="#0d324c"  />
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
