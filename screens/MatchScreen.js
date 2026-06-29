import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const perfilMock = {
  nombre: 'Nombre persona',
  edad: 'Edad',
  genero: 'Genero',
  descripcion: 'Descripcion para agregar',
  preferencias: ['Ordenado', 'Sociable', 'Tranquilo', 'Introvertido', 'Divertido'],
};

export default function MatchScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Roomie Finder</Text>
        <View style={styles.headerCirculo} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.cardInfo}>
          <Text style={styles.nombre}>{perfilMock.nombre}</Text>

          <View style={styles.fila}>
            <View style={styles.chip}>
              <Text style={styles.chipTexto}>{perfilMock.edad}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipTexto}>{perfilMock.genero}</Text>
            </View>
          </View>

          <View style={styles.descripcionBox}>
            <Text style={styles.descripcionTexto}>{perfilMock.descripcion}</Text>
          </View>

          <View style={styles.preferenciasSeccion}>
            <Text style={styles.preferenciasLabel}>Preferencias de roomies</Text>
            <View style={styles.tags}>
              {perfilMock.preferencias.map((pref) => (
                <View key={pref} style={styles.tag}>
                  <Text style={styles.tagTexto}>{pref}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.fotoContenedor}>
          <View style={styles.fotoPlaceholder} />

          <TouchableOpacity style={[styles.botonAccion, styles.botonX]}>
            <Ionicons name="close" size={32} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.botonAccion, styles.botonCheck]}>
            <Ionicons name="checkmark" size={32} color="#ffffff" />
          </TouchableOpacity>
        </View>

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
    gap: 16,
  },
  cardInfo: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  nombre: {
    fontSize: 26,
    fontWeight: '600',
    color: '#222222',
    textAlign: 'center',
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    flex: 1,
    backgroundColor: '#bbbbbb',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  chipTexto: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  descripcionBox: {
    backgroundColor: '#c8c8c8',
    borderRadius: 8,
    padding: 14,
    minHeight: 120,
  },
  descripcionTexto: {
    fontSize: 14,
    color: '#444444',
  },
  preferenciasSeccion: {
    gap: 10,
  },
  preferenciasLabel: {
    fontSize: 14,
    color: '#666666',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  tagTexto: {
    fontSize: 13,
    color: '#333333',
  },
  fotoContenedor: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 320,
    position: 'relative',
  },
  fotoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#cccccc',
  },
  botonAccion: {
    position: 'absolute',
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#444444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonX: {
    left: 20,
  },
  botonCheck: {
    right: 20,
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
  navTexto: {
    fontSize: 15,
    color: '#111111',
    fontWeight: '500',
  },
});
