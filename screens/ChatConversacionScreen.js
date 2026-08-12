import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mensajesIniciales = [
  { id: 1, texto: 'Hola, como estas?', mio: false },
  { id: 2, texto: null, mio: true },
  { id: 3, texto: null, mio: false },
  { id: 4, texto: null, mio: false },
  { id: 5, texto: null, mio: true },
  { id: 6, texto: null, mio: false },
];

export default function ChatConversacionScreen({ navigation, route }) {
  const { nombre } = route.params;
  const [mensajes, setMensajes] = useState(mensajesIniciales);
  const [texto, setTexto] = useState('');

  const enviar = () => {
    if (!texto.trim()) return;
    setMensajes([...mensajes, { id: Date.now(), texto: texto.trim(), mio: true }]);
    setTexto('');
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Roomie Finder</Text>
        <View style={styles.headerCirculo} />
      </View>

      <View style={styles.subHeader}>
        <View style={styles.subHeaderAvatar} />
        <Text style={styles.subHeaderNombre}>{nombre}</Text>
        <TouchableOpacity>
          <Text style={styles.subHeaderOpciones}>···</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {mensajes.map((msg) => (
          <View
            key={msg.id}
            style={[styles.burbuja, msg.mio ? styles.burbujaPropia : styles.burbujaAjena]}
          >
            {msg.texto ? (
              <Text style={[styles.burbujaTexto, msg.mio && styles.burbujaTextoPropio]}>{msg.texto}</Text>
            ) : (
              <View style={styles.burbujaPlaceholder} />
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje"
          placeholderTextColor="#8a97b8"
          value={texto}
          onChangeText={setTexto}
          onSubmitEditing={enviar}
        />
        <TouchableOpacity style={styles.botonEnviar} onPress={enviar}>
          <Ionicons name="chevron-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={22} color="#1b2a66" />
          <Text style={styles.navTexto}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActivo]} onPress={() => navigation.navigate('ChatsLista')}>
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
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edeff5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  subHeaderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dce4fa',
  },
  subHeaderNombre: {
    flex: 1,
    fontSize: 16,
    color: '#1b2a66',
  },
  subHeaderOpciones: {
    fontSize: 20,
    color: '#1b2a66',
    letterSpacing: 2,
  },
  scroll: {
    padding: 16,
    paddingBottom: 10,
    gap: 10,
  },
  burbuja: {
    maxWidth: '70%',
    borderRadius: 16,
    padding: 10,
  },
  burbujaAjena: {
    alignSelf: 'flex-start',
    backgroundColor: '#edeff5',
  },
  burbujaPropia: {
    alignSelf: 'flex-end',
    backgroundColor: '#2f5fd9',
  },
  burbujaTexto: {
    fontSize: 14,
    color: '#333333',
  },
  burbujaTextoPropio: {
    color: '#ffffff',
  },
  burbujaPlaceholder: {
    width: 120,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#b7c6f0',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#edeff5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
  },
  botonEnviar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2f5fd9',
    alignItems: 'center',
    justifyContent: 'center',
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
