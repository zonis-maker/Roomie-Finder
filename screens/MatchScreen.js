import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
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
          <View style={styles.chips}>
            <View style={styles.chip}><Text style={styles.chipTexto}>{perfilMock.edad}</Text></View>
            <View style={styles.chip}><Text style={styles.chipTexto}>{perfilMock.genero}</Text></View>
          </View>
          <View style={styles.descripcionBox}>
            <Text style={styles.descripcionTexto}>{perfilMock.descripcion}</Text>
          </View>
        </View>

        <View style={styles.cardPreferencias}>
          <Text style={styles.prefLabel}>Preferencias de roomies</Text>
          <View style={styles.tags}>
            {perfilMock.preferencias.map((pref) => (
              <View key={pref} style={styles.tag}>
                <Text style={styles.tagTexto}>{pref}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.fotoContenedor}>
          <Image source={{ uri: perfilMock.foto }} style={styles.foto} resizeMode="cover" />
          <TouchableOpacity style={[styles.boton, styles.botonX]}>
            <Ionicons name="close" size={30} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.boton, styles.botonCheck]}>
            <Ionicons name="checkmark" size={30} color="#ffffff" />
          </TouchableOpacity>
        </View>

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
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Perfil')}>
          <Ionicons name="person" size={22} color="#1b2a66" />
          <Text style={styles.navTexto}>Perfil</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#edeff5' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#0f1b4d', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 14,
  },
  headerTitulo: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  headerCirculo: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#dce4fa' },
  scroll: { padding: 16, paddingBottom: 30, gap: 14 },
  cardInfo: {
    backgroundColor: '#ffffff', borderRadius: 14, padding: 16, gap: 12,
    borderWidth: 1, borderColor: '#b7c6f0',
  },
  nombre: { fontSize: 26, fontWeight: '500', color: '#1b2a66', textAlign: 'center' },
  chips: { flexDirection: 'row', gap: 10 },
  chip: {
    flex: 1, backgroundColor: '#edeff5', borderRadius: 8,
    paddingVertical: 10, alignItems: 'center',
  },
  chipTexto: { fontSize: 14, color: '#1b2a66' },
  descripcionBox: {
    backgroundColor: '#edeff5', borderRadius: 8, padding: 12, minHeight: 160,
  },
  descripcionTexto: { fontSize: 14, color: '#444444' },
  cardPreferencias: {
    backgroundColor: '#ffffff', borderRadius: 14, padding: 16, gap: 12,
    borderWidth: 1, borderColor: '#b7c6f0',
  },
  prefLabel: { fontSize: 14, color: '#1b2a66' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: '#edeff5', borderRadius: 6,
    paddingVertical: 6, paddingHorizontal: 14,
  },
  tagTexto: { fontSize: 13, color: '#1b2a66' },
  fotoContenedor: {
    borderRadius: 14, overflow: 'hidden', height: 340, position: 'relative',
    borderWidth: 1, borderColor: '#b7c6f0',
  },
  foto: { width: '100%', height: '100%' },
  boton: {
    position: 'absolute', bottom: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#8a97b8',
    alignItems: 'center', justifyContent: 'center',
  },
  botonX: { left: 24 },
  botonCheck: { right: 24, backgroundColor: '#2f5fd9' },
  navBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#edeff5', paddingVertical: 12, paddingBottom: 24,
  },
  navItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
  },
  navTexto: { fontSize: 15, color: '#1b2a66', fontWeight: '500' },
});
