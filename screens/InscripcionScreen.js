import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InscripcionScreen({ navigation, route }) {
  const { publicacion } = route.params;

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Roomie Finder</Text>
        <View style={styles.headerCirculo} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.imagenContenedor}>
          {publicacion.imagenes && publicacion.imagenes.length > 0 ? (
            <Image source={{ uri: publicacion.imagenes[0] }} style={styles.imagen} />
          ) : (
            <View style={styles.imagenPlaceholder}>
              <Ionicons name="home" size={70} color="#333333" />
            </View>
          )}
        </View>

        <View style={styles.card}>

          <View style={styles.descPersona}>
            <Text style={styles.descPersonaTexto}>
              {publicacion.descripcion || 'Desc corta de la persona'}
            </Text>
            <Text style={styles.descPersonaHint}>(Gustos, edad, etc)</Text>
          </View>

          <View style={styles.campo}>
            <Text style={styles.campoTexto}>{publicacion.titulo || 'Nombre'}</Text>
          </View>

          <View style={styles.campo}>
            <Text style={styles.campoTexto}>{publicacion.ubicacion || 'Ubi'}</Text>
          </View>

          <View style={styles.fila}>
            <View style={[styles.campo, styles.mitad]}>
              <Text style={styles.campoTexto}>{publicacion.precio || 'Precio'}</Text>
            </View>
            <View style={[styles.campo, styles.mitad]}>
              <Text style={styles.campoTexto}>{publicacion.genero || 'Genero prefe'}</Text>
            </View>
          </View>

          <View style={[styles.campo, styles.campoAlto]}>
            <Text style={styles.campoTexto}>{publicacion.descripcion || 'Desc agregada'}</Text>
          </View>

          <TouchableOpacity style={styles.botonInscripcion}>
            <Text style={styles.botonTexto}>Inscripcion</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActivo]} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={22} color="#111111" />
          <Text style={styles.navTexto}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ChatsLista')}>
          <Ionicons name="chatbubble-ellipses" size={22} color="#111111" />
          <Text style={styles.navTexto}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Perfil')}>
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
    backgroundColor: '#e8e8e8',
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
  },
  imagenContenedor: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    height: 200,
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  imagenPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#d0d0d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  descPersona: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    minHeight: 90,
  },
  descPersonaTexto: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 4,
  },
  descPersonaHint: {
    fontSize: 13,
    color: '#999999',
  },
  campo: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
  },
  campoAlto: {
    minHeight: 100,
  },
  campoTexto: {
    fontSize: 14,
    color: '#444444',
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  mitad: {
    flex: 1,
  },
  botonInscripcion: {
    backgroundColor: '#666666',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  botonTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
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
});
