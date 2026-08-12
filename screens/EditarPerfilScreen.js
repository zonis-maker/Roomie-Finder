import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { subirImagen } from '../utils/subirImagen';

export default function EditarPerfilScreen({ navigation }) {
  const { token, userId } = useAuth();
  const [foto, setFoto] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [preferencias, setPreferencias] = useState(['Ordenado', 'Sociable', 'Tranquilo', 'Introvertido', 'Divertido']);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [mostrarInputNuevo, setMostrarInputNuevo] = useState(false);
  const [nuevaPreferencia, setNuevaPreferencia] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const respuesta = await fetch('https://roomie-finder-bay.vercel.app/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setNombre(datos.nombre || '');
          setEmail(datos.email || '');
          setFechaNacimiento(datos.fecha_nacimiento || '');
          setDescripcion(datos.descripcion || '');
          setFoto(datos.foto_perfil_url || null);
          if (datos.preferencias) {
            setSeleccionadas(datos.preferencias.split(',').map(p => p.trim()).filter(Boolean));
          }
        } else {
          alert('No se pudo cargar tu perfil.');
        }
      } catch (error) {
        alert('No se pudo conectar al servidor. Revisá tu conexión.');
      } finally {
        setCargando(false);
      }
    };
    cargarPerfil();
  }, [token]);

  const guardarCambios = async () => {
    setGuardando(true);
    try {
      let fotoUrl = foto;
      if (foto && !foto.startsWith('http')) {
        try {
          fotoUrl = await subirImagen(foto, token);
        } catch (errorFoto) {
          alert('No se pudo subir la foto de perfil. Se guardó el resto de los datos.');
          fotoUrl = null;
        }
      }

      const respuesta = await fetch(`https://roomie-finder-bay.vercel.app/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          email,
          fecha_nacimiento: fechaNacimiento,
          descripcion,
          preferencias: seleccionadas.join(', '),
          ...(fotoUrl ? { foto_perfil_url: fotoUrl } : {}),
        }),
      });

      if (respuesta.ok) {
        navigation.navigate('Perfil');
      } else if (respuesta.status === 401) {
        alert('Tu sesión expiró. Iniciá sesión de nuevo.');
        navigation.navigate('Login');
      } else {
        alert('No se pudieron guardar los cambios. Revisá los datos.');
      }
    } catch (error) {
      alert('No se pudo conectar al servidor. Revisá tu conexión.');
    } finally {
      setGuardando(false);
    }
  };

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

  if (cargando) {
    return (
      <View style={[styles.container, styles.centrado]}>
        <ActivityIndicator size="large" color="#2f5fd9" />
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

        <View style={styles.card}>

          <TouchableOpacity style={styles.fotoPerfil} onPress={elegirFoto}>
            <View style={styles.fotoContenedor}>
              <View style={styles.fotoCirculo}>
                {foto
                  ? <Image source={{ uri: foto }} style={styles.fotoImagen} />
                  : <Ionicons name="person" size={48} color="#2f5fd9" />
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
            placeholderTextColor="#8a97b8"
            value={nombre}
            onChangeText={setNombre}
          />

          <TextInput
            style={styles.input}
            placeholder="Correo electronico"
            placeholderTextColor="#8a97b8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Fecha de nacimiento"
            placeholderTextColor="#8a97b8"
            value={fechaNacimiento}
            onChangeText={setFechaNacimiento}
          />

        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Descripcion personal</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Gustos, preferencias, costumbres"
            placeholderTextColor="#8a97b8"
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

        <TouchableOpacity
          style={[styles.botonContinuar, guardando && styles.botonDesactivado]}
          onPress={guardarCambios}
          disabled={guardando}
        >
          <Text style={styles.botonTexto}>{guardando ? 'Guardando...' : 'Continuar'}</Text>
        </TouchableOpacity>

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
        <TouchableOpacity style={[styles.navItem, styles.navItemActivo]} onPress={() => navigation.navigate('Perfil')}>
          <Ionicons name="person" size={22} color="#1b2a66" />
          <Text style={styles.navTexto}>Perfil</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#edeff5' },
  centrado: { alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#0f1b4d', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 14,
  },
  headerTitulo: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  headerCirculo: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#dce4fa' },
  scroll: { padding: 16, paddingBottom: 30, gap: 14 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, gap: 12, borderWidth: 1, borderColor: '#b7c6f0' },
  fotoPerfil: { alignItems: 'center', marginBottom: 8 },
  fotoContenedor: { width: 100, height: 100 },
  fotoCirculo: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#edeff5',
    borderWidth: 3, borderColor: '#b7c6f0', alignItems: 'center', justifyContent: 'center',
  },
  fotoImagen: { width: 100, height: 100, borderRadius: 50 },
  fotoBotonMas: {
    position: 'absolute', bottom: 2, right: 2, width: 28, height: 28,
    borderRadius: 14, backgroundColor: '#2f5fd9', alignItems: 'center', justifyContent: 'center',
  },
  fotoMasTexto: { color: '#ffffff', fontSize: 18, lineHeight: 20 },
  fotoTexto: { marginTop: 8, color: '#1b2a66', fontSize: 13 },
  input: {
    backgroundColor: '#ffffff', borderRadius: 8, padding: 12,
    fontSize: 15, color: '#333333', borderWidth: 1, borderColor: '#b7c6f0',
  },
  inputConOjo: {
    backgroundColor: '#ffffff', borderRadius: 8, paddingHorizontal: 12,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#b7c6f0',
  },
  inputSinBorde: { flex: 1, fontSize: 15, paddingVertical: 12, color: '#333333' },
  seccion: { backgroundColor: '#edeff5', borderRadius: 10, padding: 14, gap: 10 },
  seccionTitulo: { fontSize: 14, color: '#1b2a66' },
  textArea: {
    backgroundColor: '#ffffff', borderRadius: 6, padding: 10,
    fontSize: 14, minHeight: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#b7c6f0',
  },
  minimo: { fontSize: 11, color: '#888888' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#b7c6f0', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 14 },
  tagActivo: { backgroundColor: '#2f5fd9', borderColor: '#2f5fd9' },
  tagTexto: { fontSize: 13, color: '#333333' },
  tagTextoActivo: { color: '#ffffff' },
  inputNuevoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  inputNuevo: { flex: 1, backgroundColor: '#ffffff', borderRadius: 8, padding: 8, fontSize: 13, borderWidth: 1, borderColor: '#b7c6f0' },
  agregarTexto: { color: '#1b2a66', fontWeight: 'bold', fontSize: 13 },
  botonContinuar: {
    backgroundColor: '#2f5fd9', borderRadius: 20, padding: 14,
    alignItems: 'center', marginTop: 4,
  },
  botonTexto: { fontSize: 16, color: '#ffffff' },
  botonDesactivado: { opacity: 0.5 },
  navBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#edeff5', paddingVertical: 12, paddingBottom: 24,
  },
  navItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
  },
  navItemActivo: { backgroundColor: '#dce4fa' },
  navTexto: { fontSize: 15, color: '#1b2a66', fontWeight: '500' },
});
