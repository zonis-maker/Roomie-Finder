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
          <Ionicons name="home" size={22} color="#1b2a66" />
          <Text style={styles.navTexto}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActivo]}>
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
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#b7c6f0',
  },
  cardTitulo: {
    fontSize: 20,
    color: '#1b2a66',
    marginBottom: 4,
    paddingLeft: 4,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edeff5',
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dce4fa',
  },
  chatTextos: {
    flex: 1,
  },
  chatNombre: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1b2a66',
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
