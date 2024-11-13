import {View, StyleSheet, Image} from 'react-native';
import Icono from '../../../public/pixelcut-export.png';
import { Text } from 'react-native-svg';

export default function PrimeraScreen() {
    return (
        <View style={styles.container}>
            <View>
            <Image source={Icono} style={styles.Image} />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    Image: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
    },
    
  textTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginTop: 250,
  }
});