import { createContext, useContext, useState } from 'react';

const PublicacionesContext = createContext();

export function PublicacionesProvider({ children }) {
  const [publicaciones, setPublicaciones] = useState([
    { id: 1, titulo: 'Depto de 4 ambientes', ubicacion: 'Palermo, CABA', imagenes: [], marcador: null, precio: '$100k - $200k', genero: 'Mixto', descripcion: '' },
    { id: 2, titulo: 'Titulo', ubicacion: 'Ubicacion', imagenes: [], marcador: null, precio: '', genero: '', descripcion: '' },
  ]);

  const agregarPublicacion = (pub) => {
    setPublicaciones(prev => [...prev, { ...pub, id: Date.now() }]);
  };

  return (
    <PublicacionesContext.Provider value={{ publicaciones, agregarPublicacion }}>
      {children}
    </PublicacionesContext.Provider>
  );
}

export const usePublicaciones = () => useContext(PublicacionesContext);
