import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Principal from './src/components/pages/Principal';
import Perfil from './src/components/pages/Perfil';
import GlobalProvider from './src/Context/GlobalContext';
import Login from './src/components/pages/login';
import Usuarios from './src/components/pages/Usuarios';
import Reportes from './src/components/pages/Reportes';
import Seguimientos from './src/components/pages/Seguimientos';
import Matriculas from './src/components/pages/Matriculas';
import Empresas from './src/components/pages/Empresas';
import Aprendices from './src/components/pages/Aprendices';
import PrimeraScreen from './src/components/pages/Splahs';
import RestablecerContrasena from './src/components/pages/ForgotPassword';
import ForgotPassword from './src/components/pages/ForgotPassword';
import ResetPassword from './src/components/pages/ResetPassword';
import VerifyCode from './src/components/pages/VerifyCode';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
    }, 1000);
  }, []);

  return (
    <GlobalProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {isShowSplash ? (
            <Stack.Screen
              name="Splash"
              component={PrimeraScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen name="login" component={Login} />

              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              <Stack.Screen name="VerifyCode" component={VerifyCode} />
              <Stack.Screen name="ResetPassword" component={ResetPassword} />

              <Stack.Screen 
                name="principal" 
                component={Principal} 
                options={{ headerShown: false }} 
              />
              <Stack.Screen 
                name="matriculas" 
                component={Matriculas} 
                options={{ headerShown: false }} 
              />
              <Stack.Screen 
                name="empresas" 
                component={Empresas} 
                options={{ headerShown: false }} 
              />
              <Stack.Screen 
                name="aprendices" 
                component={Aprendices} 
                options={{ headerShown: false }} 
              />
              <Stack.Screen 
                name="seguimiento" 
                component={Seguimientos} 
                options={{ headerShown: false }} 
              />
              <Stack.Screen 
                name="reporte" 
                component={Reportes} 
                options={{ headerShown: false }} 
              />
              <Stack.Screen 
                name="personas" 
                component={Usuarios} 
                options={{ headerShown: false }} 
              />
        
              <Stack.Screen 
                name="perfil" 
                component={Perfil} 
                options={{ headerShown: false }} 
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
};

export default App;
