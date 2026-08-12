import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Dimensions, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { usePublicaciones } from '../context/PublicacionesContext';

const { height: altoPantalla } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [busqueda, setBusqueda] = useState('');
  const { publicaciones, cargando, error, recargarPublicaciones } = usePublicaciones();

  const publicacionesFiltradas = publicaciones.filter(p =>
    p.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={cargando} onRefresh={recargarPublicaciones} />
        }
      >

        <View style={{ height: altoPantalla, justifyContent: 'flex-end', padding: 20 }}>
          <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.navigate('Primera')}>
            <Text style={styles.botonVolverTexto}>[ VOLVER A PRIMERA - TEMP ]</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.seccion}>

          <View style={styles.header}>
            <Text style={styles.headerTitulo}>Roomie Finder</Text>
            <View style={styles.headerCirculo} />
          </View>

          <Text style={styles.titulo}>Publicaciones</Text>

          <View style={styles.barraBusqueda}>
            <Ionicons name="search-outline" size={18} color="#ffffff" />
            <TextInput
              style={styles.inputBusqueda}
              placeholder="Buscar por palabra clave"
              placeholderTextColor="#d7e0fb"
              value={busqueda}
              onChangeText={setBusqueda}
            />
            <TouchableOpacity style={styles.botonMas} onPress={() => navigation.navigate('CrearPublicacion')}>
              <Text style={styles.botonMasTexto}>+</Text>
            </TouchableOpacity>
          </View>

          {cargando && publicaciones.length === 0 && (
            <ActivityIndicator size="large" color="#555555" style={styles.cargando} />
          )}

          {!cargando && error !== '' && (
            <Text style={styles.mensajeEstado}>{error}</Text>
          )}

          {!cargando && error === '' && publicacionesFiltradas.length === 0 && (
            <Text style={styles.mensajeEstado}>No hay publicaciones todavía.</Text>
          )}

          {publicacionesFiltradas.map((pub) => (
            <TouchableOpacity key={pub.id} style={styles.card} onPress={() => navigation.navigate('Inscripcion', { publicacion: pub })}>
              <View style={styles.cardImagen}>
                {pub.imagenes && pub.imagenes.length > 0 ? (
                  <Image source={{ uri: pub.imagenes[0] }} style={styles.cardImagenFoto} />
                ) : (
                  <Ionicons name="home" size={70} color="#1b2a66" />
                )}
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitulo}>{pub.titulo}</Text>
                <View style={styles.cardUbicacionFila}>
                  <Text style={styles.cardUbicacionTexto}>{pub.ubicacion}</Text>
                  <Ionicons name="location-sharp" size={18} color="#1b2a66" />
                </View>
              </View>
            </TouchableOpacity>
          ))}

        </View>

      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActivo]}>
          <Ionicons name="home" size={22} color="#1b2a66" />
          <Text style={styles.navTexto}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ChatsLista')}>
          <Ionicons name="chatbubble-ellipses" size={22} color="#1b2a66" />
          <Text style={styles.navTexto}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Perfil')}>
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
    backgroundColor: '#ffffff',
  },
  scroll: {
    backgroundColor: '#ffffff',
  },
  botonVolver: {
    backgroundColor: '#ffcc00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonVolverTexto: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333',
  },
  seccion: {
    backgroundColor: '#ffffff',
    paddingBottom: 24,
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
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 12,
    color: '#1b2a66',
  },
  barraBusqueda: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2f5fd9',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inputBusqueda: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    color: '#ffffff',
  },
  botonMas: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  botonMasTexto: {
    fontSize: 20,
    color: '#2f5fd9',
    lineHeight: 22,
  },
  cargando: {
    marginTop: 20,
  },
  mensajeEstado: {
    textAlign: 'center',
    color: '#888888',
    fontSize: 14,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b7c6f0',
    marginHorizontal: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  cardImagen: {
    height: 180,
    backgroundColor: '#edeff5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImagenFoto: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    padding: 12,
    backgroundColor: '#edeff5',
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1b2a66',
    marginBottom: 8,
  },
  cardUbicacionFila: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  cardUbicacionTexto: {
    fontSize: 13,
    color: '#555555',
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
});
