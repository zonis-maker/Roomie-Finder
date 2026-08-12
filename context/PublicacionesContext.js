import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PublicacionesContext = createContext();

const generoTexto = {
  masculino: 'Masculino',
  femenino: 'Femenino',
  no_binario: 'No binario',
  indiferente: 'Indiferente',
};

const mapearPublicacion = (p) => ({
  id: p.id,
  propietarioId: p.propietario_id,
  titulo: p.titulo,
  ubicacion: p.direccion,
  imagenes: (p.fotos || []).map(f => f.url),
  marcador: null,
  precio: p.precio != null ? `$${p.precio}` : '',
  genero: generoTexto[p.preferencia_genero] || '',
  descripcion: p.descripcion || '',
});

export function PublicacionesProvider({ children }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarPublicaciones = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const respuesta = await fetch('https://roomie-finder-bay.vercel.app/publicaciones/');
      if (!respuesta.ok) throw new Error('No se pudieron cargar las publicaciones.');
      const datos = await respuesta.json();
      setPublicaciones(datos.filter(p => p.activo !== false).map(mapearPublicacion));
    } catch (e) {
      setError('No se pudo conectar al servidor. Revisá tu conexión.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarPublicaciones();
  }, [cargarPublicaciones]);

  const agregarPublicacion = (pub) => {
    setPublicaciones(prev => [...prev, { ...pub, id: Date.now() }]);
  };

  return (
    <PublicacionesContext.Provider value={{ publicaciones, cargando, error, recargarPublicaciones: cargarPublicaciones, agregarPublicacion }}>
      {children}
    </PublicacionesContext.Provider>
  );
}

export const usePublicaciones = () => useContext(PublicacionesContext);