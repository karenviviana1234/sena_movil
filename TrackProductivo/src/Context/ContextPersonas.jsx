import React, { createContext, useContext, useState } from 'react';
import axiosClient from '../axiosClient';

const ContextPersonas = createContext();

export const usePersonas = () => useContext(ContextPersonas);

export const PersonasProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const [personas, SetPersonas] = useState([]);
  const [persona, SetPersona] = useState({});
  const [id_persona, SetId_persona] = useState(null);
  const [rol, setRol] = useState(null); // Cambiado el nombre del setter para evitar confusiones

  const SetRol = (newRol) => {
    setRol(newRol);
  };

  const getPersonas = async () => {
    try {
      const response = await axiosClient.get('/personas/listar');
      console.log(response.data);
      SetPersonas(response.data);
    } catch (error) {
      console.log('Error del servidor' + error);
    }
  };  

  const getPersona = async (id_persona) => {
    try {
      const response = await axiosClient.get(`/personas/buscar/${id_persona}`);
      console.log(response.data);
      SetPersona(response.data);
      SetRol(response.data.rol);
    } catch (error) {
      console.log('Error del servidor' + error);
    }
  };

  return (
    <ContextPersonas.Provider
      value={{
        personas,
        persona,
        id_persona,
        rol,
        setUserData,
        SetPersonas,
        SetPersona,
        SetId_persona,
        getPersonas,
        getPersona,
        SetRol
      }}
    >
      {children}
    </ContextPersonas.Provider>
  );
};

export default ContextPersonas;
