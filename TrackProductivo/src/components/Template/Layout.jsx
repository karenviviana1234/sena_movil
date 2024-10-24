import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Sidebar from '../organismos/Sidebar';
import Header from '../organismos/Header';

const Layout = ({ children, title }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={styles.container}>
      <Sidebar menuVisible={menuVisible} toggleMenu={toggleMenu} />
      <Header title={title} toggleMenu={toggleMenu} style={styles.header} />
      <View style={styles.content}>
        {React.cloneElement(children, { toggleMenu })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
  },
  header: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    flex: 1,
    marginBottom: 60, 
  },
});

export default Layout;
