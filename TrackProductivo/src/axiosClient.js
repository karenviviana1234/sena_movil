import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Ip = '192.168.100.155'
/* Ip de mi casa 192.168.100.155  */

const axiosClient = axios.create({
  baseURL: `http://${Ip}:3000`,
});

axiosClient.interceptors.request.use( 
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers['token'] = token;
        console.log("Token desde axiosClient",token);
        
      } 
    } catch (error) {
      console.error("Error getting token from AsyncStorage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;