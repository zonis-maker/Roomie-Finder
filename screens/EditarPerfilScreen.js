import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function EditarPerfilScreen({ navigation }) {
  const [foto, setFoto] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [preferencias, setPreferencias] = useState(['Ordenado', 'Sociable', 'Tranquilo', 'Introvertido', 'Divertido']);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [mostrarInputNuevo, setMostrarInputNuevo] = useState(false);
  const [nuevaPreferencia, setNuevaPreferencia] = useState('');

  const elegirFoto = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) { alert('Necesitás dar permiso para acceder a la galería.'); return; }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!resultado.canceled) setFoto(resultado.assets[0].uri);
  };

  const togglePreferencia = (pref) => {
    setSeleccionadas(seleccionadas.includes(pref)
      ? seleccionadas.filter(p => p !== pref)
      : [...seleccionadas, pref]
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Roomie Finder</Text>
        <View style={styles.headerCirculo} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.card}>

          <TouchableOpacity style={styles.fotoPerfil} onPress={elegirFoto}>
            <View style={styles.fotoContenedor}>
              <View style={styles.fotoCirculo}>
                {foto
                  ? <Image source={{ uri: foto }} style={styles.fotoImagen} />
                  : <Ionicons name="person" size={48} color="#888888" />
                }
              </View>
              <View style={styles.fotoBotonMas}>
                <Text style={styles.fotoMasTexto}>+</Text>
              </View>
            </View>
            <Text style={styles.fotoTexto}>Foto de perfil</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Nombre Completo"
            placeholderTextColor="#aaaaaa"
            value={nombre}
            onChangeText={setNombre}
          />

          <TextInput
            style={styles.input}
            placeholder="Correo electronico"
            placeholderTextColor="#aaaaaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Fecha de nacimiento"
            placeholderTextColor="#aaaaaa"
            value={fechaNacimiento}
            onChangeText={setFechaNacimiento}
          />

          <View style={styles.inputConOjo}>
            <TextInput
              style={styles.inputSinBorde}
              placeholder="Contraseña"
              placeholderTextColor="#aaaaaa"
              secureTextEntry={!verContrasena}
              value={contrasena}
              onChangeText={setContrasena}
            />
            <TouchableOpacity onPress={() => setVerContrasena(!verContrasena)}>
              <Ionicons name={verContrasena ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888888" />
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Descripcion personal</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Gustos, preferencias, costumbres"
            placeholderTextColor="#aaaaaa"
            multiline
            numberOfLines={4}
            value={descripcion}
            onChangeText={setDescripcion}
            textAlignVertical="top"
          />
          <Text style={styles.minimo}>Minimo 50 palabras</Text>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Preferencias de roomies</Text>
          <View style={styles.tags}>
            {preferencias.map((pref) => (
              <TouchableOpacity
                key={pref}
                style={[styles.tag, seleccionadas.includes(pref) && styles.tagActivo]}
                onPress={() => togglePreferencia(pref)}
              >
                <Text style={[styles.tagTexto, seleccionadas.includes(pref) && styles.tagTextoActivo]}>
                  {pref}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.tag} onPress={() => setMostrarInputNuevo(true)}>
              <Text style={styles.tagTexto}>+</Text>
            </TouchableOpacity>
          </View>
          {mostrarInputNuevo && (
            <View style={styles.inputNuevoContainer}>
              <TextInput
                style={styles.inputNuevo}
                placeholder="Nueva preferencia"
                value={nuevaPreferencia}
                onChangeText={setNuevaPreferencia}
                autoFocus
              />
              <TouchableOpacity onPress={() => {
                if (nuevaPreferencia.trim()) {
                  setPreferencias([...preferencias, nuevaPreferencia.trim()]);
                  setNuevaPreferencia('');
                  setMostrarInputNuevo(false);
                }
              }}>
                <Text style={styles.agregarTexto}>Agregar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.botonContinuar} onPress={() => navigation.navigate('Perfil')}>
          <Text style={styles.botonTexto}>Continuar</Text>
        </TouchableOpacity>

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
        <TouchableOpacity style={[styles.navItem, styles.navItemActivo]} onPress={() => navigation.navigate('Perfil')}>
          <Ionicons name="person" size={22} color="#111111" />
          <Text style={styles.navTexto}>Perfil</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8e8e8' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#e8e8e8', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 14,
  },
  headerTitulo: { fontSize: 18, fontWeight: 'bold', color: '#222222' },
  headerCirculo: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#bbbbbb' },
  scroll: { padding: 16, paddingBottom: 30, gap: 14 },
  card: { backgroundColor: '#f0f0f0', borderRadius: 12, padding: 20, gap: 12 },
  fotoPerfil: { alignItems: 'center', marginBottom: 8 },
  fotoContenedor: { width: 100, height: 100 },
  fotoCirculo: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#d8d8d8',
    borderWidth: 3, borderColor: '#999999', alignItems: 'center', justifyContent: 'center',
  },
  fotoImagen: { width: 100, height: 100, borderRadius: 50 },
  fotoBotonMas: {
    position: 'absolute', bottom: 2, right: 2, width: 28, height: 28,
    borderRadius: 14, backgroundColor: '#222222', alignItems: 'center', justifyContent: 'center',
  },
  fotoMasTexto: { color: '#ffffff', fontSize: 18, lineHeight: 20 },
  fotoTexto: { marginTop: 8, color: '#555555', fontSize: 13 },
  input: {
    backgroundColor: '#ffffff', borderRadius: 8, padding: 12,
    fontSize: 15, color: '#333333',
  },
  inputConOjo: {
    backgroundColor: '#ffffff', borderRadius: 8, paddingHorizontal: 12,
    flexDirection: 'row', alignItems: 'center',
  },
  inputSinBorde: { flex: 1, fontSize: 15, paddingVertical: 12, color: '#333333' },
  seccion: { backgroundColor: '#e0e0e0', borderRadius: 10, padding: 14, gap: 10 },
  seccionTitulo: { fontSize: 14, color: '#666666' },
  textArea: {
    backgroundColor: '#ffffff', borderRadius: 6, padding: 10,
    fontSize: 14, minHeight: 100, textAlignVertical: 'top',
  },
  minimo: { fontSize: 11, color: '#888888' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#ffffff', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 14 },
  tagActivo: { backgroundColor: '#888888' },
  tagTexto: { fontSize: 13, color: '#333333' },
  tagTextoActivo: { color: '#ffffff' },
  inputNuevoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  inputNuevo: { flex: 1, backgroundColor: '#ffffff', borderRadius: 8, padding: 8, fontSize: 13 },
  agregarTexto: { color: '#222222', fontWeight: 'bold', fontSize: 13 },
  botonContinuar: {
    backgroundColor: '#d0d0d0', borderRadius: 20, padding: 14,
    alignItems: 'center', marginTop: 4,
  },
  botonTexto: { fontSize: 16, color: '#333333' },
  navBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#d0d0d0', paddingVertical: 12, paddingBottom: 24,
  },
  navItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
  },
  navItemActivo: { backgroundColor: '#b8b8b8' },
  navTexto: { fontSize: 15, color: '#111111', fontWeight: '500' },
});
