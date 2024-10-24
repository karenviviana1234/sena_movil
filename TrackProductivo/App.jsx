import React from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Principal from './src/components/pages/Principal';
import Bitacoras from './src/components/pages/Bitacoras';
import Perfil from './src/components/pages/Perfil';
import GlobalProvider from './src/Context/GlobalContext';
import Login from './src/components/pages/login';
import Usuarios from './src/components/pages/Usuarios';
import Reportes from './src/components/pages/Reportes';
import Seguimientos from './src/components/pages/Seguimientos';
import Matriculas from './src/components/pages/Matriculas';
import Empresas from './src/components/pages/Empresas';
import Aprendices from './src/components/pages/Aprendices';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='login' screenOptions={{ headerShown: false }}>
{/*           <Stack.Screen name="landing_page" component={Landing_page} /> */}
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen 
            name="principal" 
            component={Principal} 
            options={{ headerShown: false }} // Ocultar el encabezado para esta pantalla
          />
          <Stack.Screen 
            name="matriculas" 
            component={Matriculas} 
            options={{ headerShown: false }} // Ocultar el encabezado para esta pantalla
          />
          <Stack.Screen 
            name="empresas" 
            component={Empresas} 
            options={{ headerShown: false }} // Ocultar el encabezado para esta pantalla
          />
          <Stack.Screen 
            name="aprendices" 
            component={Aprendices} 
            options={{ headerShown: false }} // Ocultar el encabezado para esta pantalla
          />
          <Stack.Screen 
            name="seguimiento" 
            component={Seguimientos} 
            options={{ headerShown: false }} // Ocultar el encabezado para esta pantalla
          />
          <Stack.Screen 
            name="reporte" 
            component={Reportes} 
            options={{ headerShown: false }} // Ocultar el encabezado para esta pantalla
          />
          <Stack.Screen 
            name="personas" 
            component={Usuarios} 
            options={{ headerShown: false }} // Ocultar el encabezado para esta pantalla
          />
          <Stack.Screen 
            name="bitacoras" 
            component={Bitacoras} 
            options={{ headerShown: false }} // Ocultar el encabezado para esta pantalla
          />
          <Stack.Screen 
            name="perfil" 
            component={Perfil} 
            options={{ headerShown: false }} // Ocultar el encabezado para esta pantalla
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
};

export default App;
