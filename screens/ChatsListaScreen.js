import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const chats = [
  { id: 1, nombre: 'Nombre 1', ultimo: 'Texto 1' },
  { id: 2, nombre: 'Nombre 2', ultimo: 'Texto 2' },
  { id: 3, nombre: 'Nombre 3', ultimo: 'Texto 3' },
  { id: 4, nombre: 'Nombre 4', ultimo: 'Texto 4' },
  { id: 5, nombre: 'Nombre 5', ultimo: 'Texto 5' },
  { id: 6, nombre: 'Nombre 6', ultimo: 'Texto 6' },
];

export default function ChatsListaScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Roomie Finder</Text>
        <View style={styles.headerCirculo} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Chats</Text>

          {chats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatItem}
              onPress={() => navigation.navigate('ChatConversacion', { nombre: chat.nombre })}
            >
              <View style={styles.avatar} />
              <View style={styles.chatTextos}>
                <Text style={styles.chatNombre}>{chat.nombre}</Text>
                <Text style={styles.chatUltimo}>{chat.ultimo}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={22} color="#111111" />
          <Text style={styles.navTexto}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActivo]}>
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
  card: {
    backgroundColor: '#d8d8d8',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  cardTitulo: {
    fontSize: 20,
    color: '#555555',
    marginBottom: 4,
    paddingLeft: 4,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#bbbbbb',
  },
  chatTextos: {
    flex: 1,
  },
  chatNombre: {
    fontSize: 18,
    fontWeight: '500',
    color: '#222222',
  },
  chatUltimo: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
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
