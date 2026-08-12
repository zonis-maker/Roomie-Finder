import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const cargarSesionGuardada = async () => {
      try {
        const [tokenGuardado, userIdGuardado] = await AsyncStorage.multiGet(['token', 'userId']);
        if (tokenGuardado[1] && userIdGuardado[1]) {
          setToken(tokenGuardado[1]);
          setUserId(userIdGuardado[1]);
        }
      } catch (error) {
        // Si falla la lectura, simplemente arranca sin sesión guardada.
      } finally {
        setCargandoSesion(false);
      }
    };
    cargarSesionGuardada();
  }, []);

  const iniciarSesion = (nuevoToken, nuevoUserId) => {
    setToken(nuevoToken);
    setUserId(nuevoUserId);
    AsyncStorage.multiSet([['token', nuevoToken], ['userId', nuevoUserId]]);
  };

  const cerrarSesion = () => {
    setToken(null);
    setUserId(null);
    AsyncStorage.multiRemove(['token', 'userId']);
  };

  return (
    <AuthContext.Provider value={{ token, userId, estaLogueado: !!token, cargandoSesion, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);