import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const publicacionesMock = [
  {
    id: 1,
    titulo: 'Depto de lujo',
    ubicacion: 'Belgrano R',
    precio: '$300K / mes',
    imagen: null,
    soliEnviada: true,
  },
  { id: 2, titulo: '', ubicacion: '', precio: '', imagen: null, soliEnviada: false },
  { id: 3, titulo: '', ubicacion: '', precio: '', imagen: null, soliEnviada: false },
];

const solicitudesMock = [
  { id: 1, nombre: 'Martín López', edad: 24, genero: 'Masculino', descripcion: 'Estudiante, ordenado y tranquilo.' },
  { id: 2, nombre: 'Valentina Ruiz', edad: 22, genero: 'Femenino', descripcion: 'Trabajo remoto, sociable y divertida.' },
  { id: 3, nombre: 'Tomás García', edad: 26, genero: 'Masculino', descripcion: 'Busco lugar tranquilo cerca del centro.' },
];

export default function PerfilScreen({ navigation }) {
  const [tabActiva, setTabActiva] = useState('Publicacion');
  const [solicitudes, setSolicitudes] = useState(solicitudesMock);

  const responder = (id, acepto) => {
    setSolicitudes(solicitudes.filter(s => s.id !== id));
  };

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
              <Ionicons name="person" size={48} color="#888888" />
            </View>
            <View style={styles.indicadorOnline} />
          </View>
          <Text style={styles.nombre}>Emilia Ross</Text>

          <View style={styles.descripcionBox}>
            <Text style={styles.descripcionTexto}>SAHFILASNF{'\n'}A{'\n'}SFSDF{'\n'}AF</Text>
          </View>

          <TouchableOpacity style={styles.botonEditar} onPress={() => navigation.navigate('EditarPerfil')}>
            <Ionicons name="pencil" size={14} color="#444444" />
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
            {publicacionesMock.map((pub) => (
              <View key={pub.id} style={styles.pubCard}>
                <View style={styles.pubImagen}>
                  {pub.imagen ? (
                    <Image source={{ uri: pub.imagen }} style={styles.pubImagenFoto} />
                  ) : (
                    <View style={styles.pubImagenPlaceholder} />
                  )}
                </View>
                {pub.titulo ? (
                  <View style={styles.pubInfo}>
                    <Text style={styles.pubTitulo}>{pub.titulo}</Text>
                    <View style={styles.pubUbicacionFila}>
                      <Ionicons name="location-sharp" size={13} color="#555555" />
                      <Text style={styles.pubUbicacion}>{pub.ubicacion}</Text>
                    </View>
                    <Text style={styles.pubPrecio}>{pub.precio}</Text>
                    <Text style={styles.pubPor}>Publicado por "Nombre"</Text>
                  </View>
                ) : (
                  <View style={styles.pubInfoVacia} />
                )}
              </View>
            ))}
          </View>
        )}

        {tabActiva === 'Publicacion' && (
          <View style={styles.listaSolicitudes}>
            {solicitudes.length === 0 ? (
              <Text style={styles.sinSolicitudes}>No hay solicitudes pendientes</Text>
            ) : (
              solicitudes.map((s) => (
                <View key={s.id} style={styles.solicitudCard}>
                  <View style={styles.solicitudAvatar}>
                    <Ionicons name="person" size={28} color="#888888" />
                  </View>
                  <View style={styles.solicitudInfo}>
                    <Text style={styles.solicitudNombre}>{s.nombre}</Text>
                    <Text style={styles.solicitudDetalle}>{s.edad} años · {s.genero}</Text>
                    <Text style={styles.solicitudDesc} numberOfLines={2}>{s.descripcion}</Text>
                  </View>
                  <View style={styles.solicitudBotones}>
                    <TouchableOpacity style={styles.botonNo} onPress={() => responder(s.id, false)}>
                      <Ionicons name="close" size={20} color="#ffffff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonSi} onPress={() => responder(s.id, true)}>
                      <Ionicons name="checkmark" size={20} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={22} color="#111111" />
          <Text style={styles.navTexto}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ChatsLista')}>
          <Ionicons name="chatbubble-ellipses" size={22} color="#111111" />
          <Text style={styles.navTexto}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActivo]}>
          <Ionicons name="person" size={22} color="#111111" />
          <Text style={styles.navTexto}>Perfil</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
  },
  headerTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
  headerCirculo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#bbbbbb',
  },
  scroll: {
    padding: 16,
    paddingBottom: 30,
    gap: 14,
  },
  cardPerfil: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  fotoContenedor: {
    position: 'relative',
  },
  fotoCirculo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#d8d8d8',
    borderWidth: 3,
    borderColor: '#aaaaaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicadorOnline: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#333333',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  nombre: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222222',
  },
  descripcionBox: {
    backgroundColor: '#e8e8e8',
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
    backgroundColor: '#e8e8e8',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  botonEditarTexto: {
    fontSize: 14,
    color: '#444444',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 6,
    gap: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActiva: {
    backgroundColor: '#e0e0e0',
  },
  tabTexto: {
    fontSize: 15,
    color: '#333333',
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
    backgroundColor: '#d0d0d0',
  },
  pubInfo: {
    flex: 1,
    padding: 10,
    gap: 3,
  },
  pubInfoVacia: {
    flex: 1,
    backgroundColor: '#e8e8e8',
  },
  pubTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
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
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  soliTexto: {
    fontSize: 11,
    color: '#444444',
  },
  pubPor: {
    fontSize: 11,
    color: '#888888',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#d0d0d0',
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
    backgroundColor: '#b8b8b8',
  },
  navTexto: {
    fontSize: 15,
    color: '#111111',
    fontWeight: '500',
  },
  listaSolicitudes: {
    gap: 12,
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
  },
  solicitudAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#d8d8d8',
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
    color: '#222222',
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
    backgroundColor: '#555555',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
