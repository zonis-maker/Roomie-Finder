import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { usePublicaciones } from '../context/PublicacionesContext';

const BASE_URL = 'https://roomie-finder-bay.vercel.app';

export default function PerfilScreen({ navigation }) {
  const { token, userId, estaLogueado } = useAuth();
  const { publicaciones, recargarPublicaciones } = usePublicaciones();
  const [tabActiva, setTabActiva] = useState('Publicacion');
  const [perfil, setPerfil] = useState(null);
  const [misPostulaciones, setMisPostulaciones] = useState([]);
  const [solicitudesPorPub, setSolicitudesPorPub] = useState({});
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(null);
  const [estados, setEstados] = useState([]);

  const misPublicaciones = publicaciones.filter(p => p.propietarioId === userId);

  const cargarTodo = useCallback(async () => {
    if (!estaLogueado) { setCargando(false); return; }
    setCargando(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const respuestaPerfil = await fetch(`${BASE_URL}/auth/me`, { headers });
      if (respuestaPerfil.ok) setPerfil(await respuestaPerfil.json());

      const respuestaEstados = await fetch(`${BASE_URL}/postulaciones/estados`);
      const listaEstados = respuestaEstados.ok ? await respuestaEstados.json() : [];
      setEstados(listaEstados);

      const respuestaMias = await fetch(`${BASE_URL}/postulaciones/mias`, { headers });
      if (respuestaMias.ok) {
        const mias = await respuestaMias.json();
        const conPublicacion = await Promise.all(mias.map(async (post) => {
          let pub = publicaciones.find(p => p.id === post.publicacion_id);
          if (!pub) {
            const r = await fetch(`${BASE_URL}/publicaciones/${post.publicacion_id}`);
            if (r.ok) {
              const datos = await r.json();
              pub = { titulo: datos.titulo, ubicacion: datos.direccion, precio: `$${datos.precio}` };
            }
          }
          return { ...post, publicacion: pub };
        }));
        setMisPostulaciones(conPublicacion);
      }

      const misPubs = publicaciones.filter(p => p.propietarioId === userId);
      const porPub = {};
      for (const pub of misPubs) {
        const r = await fetch(`${BASE_URL}/postulaciones/publicacion/${pub.id}`, { headers });
        if (!r.ok) continue;
        const postulaciones = await r.json();
        const solicitudesPub = [];
        for (const post of postulaciones) {
          if (post.estado?.estado_actual !== 'pendiente') continue;
          const rUser = await fetch(`${BASE_URL}/users/${post.postulante_id}`);
          const postulante = rUser.ok ? await rUser.json() : null;
          let edad = null;
          if (postulante?.fecha_nacimiento) {
            const nacimiento = new Date(postulante.fecha_nacimiento);
            const hoy = new Date();
            edad = hoy.getFullYear() - nacimiento.getFullYear();
            if (hoy < new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate())) edad--;
          }
          solicitudesPub.push({
            id: post.id,
            nombre: postulante ? `${postulante.nombre} ${postulante.apellido}` : 'Usuario',
            edad,
            genero: postulante?.genero || '',
            descripcion: postulante?.descripcion || '',
          });
        }
        porPub[pub.id] = solicitudesPub;
      }
      setSolicitudesPorPub(porPub);
    } catch (error) {
      alert('No se pudo conectar al servidor. Revisá tu conexión.');
    } finally {
      setCargando(false);
    }
  }, [token, userId, estaLogueado, publicaciones]);

  useFocusEffect(useCallback(() => { cargarTodo(); }, [cargarTodo]));

  const responder = async (pubId, postulacionId, aceptar) => {
    const nombreEstado = aceptar ? 'aceptada' : 'rechazada';
    const estado = estados.find(e => e.estado_actual === nombreEstado);
    if (!estado) return;

    setSolicitudesPorPub(prev => ({
      ...prev,
      [pubId]: (prev[pubId] || []).filter(s => s.id !== postulacionId),
    }));
    try {
      await fetch(`${BASE_URL}/postulaciones/${postulacionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado_id: estado.id }),
      });
    } catch (error) {
      alert('No se pudo enviar la respuesta. Revisá tu conexión.');
    }
  };

  const confirmarEliminar = (pubId) => {
    Alert.alert(
      'Eliminar publicación',
      '¿Seguro que querés eliminar esta publicación? No se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminarPublicacion(pubId) },
      ]
    );
  };

  const eliminarPublicacion = async (pubId) => {
    setEliminando(pubId);
    try {
      const respuesta = await fetch(`${BASE_URL}/publicaciones/${pubId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (respuesta.ok) {
        await recargarPublicaciones();
      } else {
        alert('No se pudo borrar la publicación.');
      }
    } catch (error) {
      alert('No se pudo conectar al servidor. Revisá tu conexión.');
    } finally {
      setEliminando(null);
    }
  };

  if (cargando) {
    return (
      <View style={[styles.container, styles.centrado]}>
        <ActivityIndicator size="large" color="#555555" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Roomie Finder</Text>
        <View style={styles.headerCirculo} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.cardPerfil}>
          <View style={styles.fotoContenedor}>
            <View style={styles.fotoCirculo}>
              {perfil?.foto_perfil_url ? (
                <Image source={{ uri: perfil.foto_perfil_url }} style={styles.fotoImagen} />
              ) : (
                <Ionicons name="person" size={48} color="#2f5fd9" />
              )}
            </View>
            <View style={styles.indicadorOnline} />
          </View>
          <Text style={styles.nombre}>{perfil ? `${perfil.nombre} ${perfil.apellido}` : 'Iniciá sesión'}</Text>

          <View style={styles.descripcionBox}>
            <Text style={styles.descripcionTexto}>{perfil?.descripcion || 'Sin descripción todavía.'}</Text>
          </View>

          <TouchableOpacity style={styles.botonEditar} onPress={() => navigation.navigate('EditarPerfil')}>
            <Ionicons name="pencil" size={14} color="#ffffff" />
            <Text style={styles.botonEditarTexto}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tabActiva === 'Inscripcion' && styles.tabActiva]}
            onPress={() => setTabActiva('Inscripcion')}
          >
            <Text style={styles.tabTexto}>Inscripcion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tabActiva === 'Publicacion' && styles.tabActiva]}
            onPress={() => setTabActiva('Publicacion')}
          >
            <Text style={styles.tabTexto}>Publicacion</Text>
          </TouchableOpacity>
        </View>

        {tabActiva === 'Inscripcion' && (
          <View style={styles.listaPublicaciones}>
            {misPostulaciones.length === 0 ? (
              <Text style={styles.sinSolicitudes}>Todavía no te inscribiste a ninguna publicación</Text>
            ) : (
              misPostulaciones.map((post) => (
                <View key={post.id} style={styles.pubCard}>
                  <View style={styles.pubImagen}>
                    <View style={styles.pubImagenPlaceholder} />
                  </View>
                  <View style={styles.pubInfo}>
                    <Text style={styles.pubTitulo}>{post.publicacion?.titulo || 'Publicación'}</Text>
                    <View style={styles.pubUbicacionFila}>
                      <Ionicons name="location-sharp" size={13} color="#1b2a66" />
                      <Text style={styles.pubUbicacion}>{post.publicacion?.ubicacion || ''}</Text>
                    </View>
                    <Text style={styles.pubPrecio}>{post.publicacion?.precio || ''}</Text>
                    <Text style={styles.pubPor}>Estado: {post.estado?.estado_actual || 'pendiente'}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {tabActiva === 'Publicacion' && (
          <View style={styles.listaSolicitudes}>
            {misPublicaciones.length === 0 ? (
              <Text style={styles.sinSolicitudes}>Todavía no publicaste nada</Text>
            ) : (
              misPublicaciones.map((pub) => (
                <View key={pub.id} style={styles.miPubCard}>
                  <View style={styles.miPubHeader}>
                    <View style={styles.miPubImagen}>
                      {pub.imagenes && pub.imagenes.length > 0 ? (
                        <Image source={{ uri: pub.imagenes[0] }} style={styles.pubImagenFoto} />
                      ) : (
                        <View style={styles.pubImagenPlaceholder} />
                      )}
                    </View>
                    <View style={styles.pubInfo}>
                      <Text style={styles.pubTitulo}>{pub.titulo}</Text>
                      <View style={styles.pubUbicacionFila}>
                        <Ionicons name="location-sharp" size={13} color="#1b2a66" />
                        <Text style={styles.pubUbicacion}>{pub.ubicacion}</Text>
                      </View>
                      <Text style={styles.pubPrecio}>{pub.precio}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.botonEliminar}
                      onPress={() => confirmarEliminar(pub.id)}
                      disabled={eliminando === pub.id}
                    >
                      {eliminando === pub.id ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Ionicons name="trash-outline" size={18} color="#ffffff" />
                      )}
                    </TouchableOpacity>
                  </View>

                  {(solicitudesPorPub[pub.id] || []).map((s) => (
                    <View key={s.id} style={styles.solicitudCard}>
                      <View style={styles.solicitudAvatar}>
                        <Ionicons name="person" size={28} color="#2f5fd9" />
                      </View>
                      <View style={styles.solicitudInfo}>
                        <Text style={styles.solicitudNombre}>{s.nombre}</Text>
                        <Text style={styles.solicitudDetalle}>
                          {s.edad != null ? `${s.edad} años · ` : ''}{s.genero}
                        </Text>
                        <Text style={styles.solicitudDesc} numberOfLines={2}>{s.descripcion}</Text>
                      </View>
                      <View style={styles.solicitudBotones}>
                        <TouchableOpacity style={styles.botonNo} onPress={() => responder(pub.id, s.id, false)}>
                          <Ionicons name="close" size={20} color="#ffffff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonSi} onPress={() => responder(pub.id, s.id, true)}>
                          <Ionicons name="checkmark" size={20} color="#ffffff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              ))
            )}
          </View>
        )}
 
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={22} color="#1b2a66" />
          <Text style={styles.navTexto}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ChatsLista')}>
          <Ionicons name="chatbubble-ellipses" size={22} color="#1b2a66" />
          <Text style={styles.navTexto}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActivo]}>
          <Ionicons name="person" size={22} color="#1b2a66" />
          <Text style={styles.navTexto}>Perfil</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edeff5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f1b4d',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
  },
  headerTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerCirculo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dce4fa',
  },
  scroll: {
    padding: 16,
    paddingBottom: 30,
    gap: 14,
  },
  centrado: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPerfil: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#b7c6f0',
  },
  fotoContenedor: {
    position: 'relative',
  },
  fotoCirculo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#edeff5',
    borderWidth: 3,
    borderColor: '#b7c6f0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fotoImagen: {
    width: '100%',
    height: '100%',
  },
  indicadorOnline: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2f5fd9',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  nombre: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1b2a66',
  },
  descripcionBox: {
    backgroundColor: '#edeff5',
    borderRadius: 8,
    padding: 14,
    width: '100%',
    minHeight: 90,
  },
  descripcionTexto: {
    fontSize: 14,
    color: '#444444',
  },
  botonEditar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2f5fd9',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  botonEditarTexto: {
    fontSize: 14,
    color: '#ffffff',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: '#b7c6f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActiva: {
    backgroundColor: '#dce4fa',
  },
  tabTexto: {
    fontSize: 15,
    color: '#1b2a66',
    fontWeight: '500',
  },
  listaPublicaciones: {
    gap: 12,
  },
  pubCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    height: 110,
    borderWidth: 1,
    borderColor: '#b7c6f0',
  },
  pubImagen: {
    width: 110,
    height: 110,
  },
  pubImagenFoto: {
    width: '100%',
    height: '100%',
  },
  pubImagenPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#edeff5',
  },
  pubInfo: {
    flex: 1,
    padding: 10,
    gap: 3,
  },
  pubInfoVacia: {
    flex: 1,
    backgroundColor: '#edeff5',
  },
  pubTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1b2a66',
  },
  pubUbicacionFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  pubUbicacion: {
    fontSize: 12,
    color: '#555555',
  },
  pubPrecio: {
    fontSize: 12,
    color: '#555555',
  },
  soliFilas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  soliBadge: {
    backgroundColor: '#dce4fa',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  soliTexto: {
    fontSize: 11,
    color: '#1b2a66',
  },
  pubPor: {
    fontSize: 11,
    color: '#888888',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#edeff5',
    paddingVertical: 12,
    paddingBottom: 24,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  navItemActivo: {
    backgroundColor: '#dce4fa',
  },
  navTexto: {
    fontSize: 15,
    color: '#1b2a66',
    fontWeight: '500',
  },
  listaSolicitudes: {
    gap: 12,
  },
  miPubCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#b7c6f0',
  },
  miPubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  miPubImagen: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
  },
  botonEliminar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#c0392b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sinSolicitudes: {
    textAlign: 'center',
    color: '#888888',
    fontSize: 14,
    marginTop: 10,
  },
  solicitudCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#b7c6f0',
  },
  solicitudAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#edeff5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  solicitudInfo: {
    flex: 1,
    gap: 2,
  },
  solicitudNombre: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1b2a66',
  },
  solicitudDetalle: {
    fontSize: 12,
    color: '#666666',
  },
  solicitudDesc: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  solicitudBotones: {
    flexDirection: 'column',
    gap: 8,
  },
  botonNo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#bbbbbb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonSi: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2f5fd9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
