import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { usePublicaciones } from '../context/PublicacionesContext';
import { useAuth } from '../context/AuthContext';
import { subirImagen } from '../utils/subirImagen';

const opcionesGenero = ['Masculino', 'Femenino', 'No binario', 'Indiferente'];
const generoValores = {
  'Masculino': 'masculino',
  'Femenino': 'femenino',
  'No binario': 'no_binario',
  'Indiferente': 'indiferente',
};

export default function CrearPublicacionScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [genero, setGenero] = useState('');
  const [mostrarGenero, setMostrarGenero] = useState(false);
  const [imagenes, setImagenes] = useState([]);
  const [publicando, setPublicando] = useState(false);
  const { recargarPublicaciones } = usePublicaciones();
  const { token, estaLogueado } = useAuth();

  const handlePublicar = async () => {
    if (!estaLogueado) { alert('Tenés que iniciar sesión para publicar.'); navigation.navigate('Login'); return; }
    if (!nombre.trim()) { alert('Ingresá un nombre para la publicación.'); return; }
    if (!ubicacion.trim()) { alert('Ingresá una ubicación.'); return; }
    if (!descripcion.trim()) { alert('Ingresá una descripción.'); return; }
    if (!precio.trim() || isNaN(Number(precio))) { alert('Ingresá un precio válido.'); return; }

    setPublicando(true);
    try {
      const respuesta = await fetch('https://roomie-finder-bay.vercel.app/publicaciones/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: nombre,
          descripcion,
          direccion: ubicacion,
          precio: Number(precio),
          preferencia_genero: generoValores[genero] || 'indiferente',
        }),
      });

      if (respuesta.ok) {
        const creada = await respuesta.json();

        for (let i = 0; i < imagenes.length; i++) {
          try {
            const url = await subirImagen(imagenes[i], token);
            await fetch(`https://roomie-finder-bay.vercel.app/publicaciones/${creada.id}/fotos`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ url, orden: i }),
            });
          } catch (errorFoto) {
            alert(`No se pudo subir una de las fotos. La publicación se creó igual.`);
          }
        }

        await recargarPublicaciones();
        navigation.navigate('Home');
      } else if (respuesta.status === 401) {
        alert('Tu sesión expiró. Iniciá sesión de nuevo.');
        navigation.navigate('Login');
      } else {
        alert('No se pudo crear la publicación. Revisá los datos.');
      }
    } catch (error) {
      alert('No se pudo conectar al servidor. Revisá tu conexión.');
    } finally {
      setPublicando(false);
    }
  };

  const elegirImagenes = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      alert('Necesitás dar permiso para acceder a la galería.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!resultado.canceled) {
      const nuevas = resultado.assets.map(a => a.uri);
      setImagenes([...imagenes, ...nuevas]);
    }
  };

  const eliminarImagen = (index) => {
    setImagenes(imagenes.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Roomie Finder</Text>
        <View style={styles.headerCirculo} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        <Text style={styles.titulo}>Crear Publicacion</Text>

        <TouchableOpacity style={styles.agregarImagen} onPress={elegirImagenes}>
          {imagenes.length === 0 ? (
            <>
              <Ionicons name="add" size={64} color="#2f5fd9" />
              <Text style={styles.agregarImagenTexto}>Agregar Imagen/es</Text>
            </>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.miniaturas}>
              {imagenes.map((uri, index) => (
                <View key={index} style={styles.miniaturaContenedor}>
                  <Image source={{ uri }} style={styles.miniatura} />
                  <TouchableOpacity
                    style={styles.eliminarBtn}
                    onPress={() => eliminarImagen(index)}
                  >
                    <Ionicons name="close-circle" size={22} color="#1b2a66" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.agregarMas} onPress={elegirImagenes}>
                <Ionicons name="add" size={32} color="#2f5fd9" />
              </TouchableOpacity>
            </ScrollView>
          )}
        </TouchableOpacity>

        <View style={styles.formulario}>

          <TextInput
            style={styles.input}
            placeholder="Nombre de publicacion"
            placeholderTextColor="#8a97b8"
            value={nombre}
            onChangeText={setNombre}
          />

          <View style={styles.fila}>
            <TextInput
              style={[styles.input, styles.mitad]}
              placeholder="Precio"
              placeholderTextColor="#8a97b8"
              keyboardType="numeric"
              value={precio}
              onChangeText={setPrecio}
            />

            <TouchableOpacity
              style={[styles.selector, styles.mitad]}
              onPress={() => setMostrarGenero(!mostrarGenero)}
            >
              <Text style={{ color: genero ? '#333333' : '#aaaaaa', flex: 1 }}>
                {genero || 'Genero'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#2f5fd9" />
            </TouchableOpacity>
          </View>

          {mostrarGenero && (
            <View style={styles.dropdown}>
              {opcionesGenero.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={styles.dropdownOpcion}
                  onPress={() => { setGenero(g); setMostrarGenero(false); }}
                >
                  <Text style={styles.dropdownTexto}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Ubicacion"
            placeholderTextColor="#8a97b8"
            value={ubicacion}
            onChangeText={setUbicacion}
          />

          <TextInput
            style={styles.textArea}
            placeholder="Descripcion para agregar"
            placeholderTextColor="#8a97b8"
            multiline
            numberOfLines={6}
            value={descripcion}
            onChangeText={setDescripcion}
            textAlignVertical="top"
          />

        </View>

        <TouchableOpacity
          style={[styles.botonPublicar, publicando && styles.botonDesactivado]}
          onPress={handlePublicar}
          disabled={publicando}
        >
          <Text style={styles.botonPublicarTexto}>{publicando ? 'Publicando...' : 'Publicar'}</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={22} color="#1b2a66" />
          <Text style={styles.navTexto}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
  scroll: {
    padding: 16,
    paddingBottom: 30,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1b2a66',
    marginBottom: 20,
    marginTop: 10,
  },
  agregarImagen: {
    backgroundColor: '#edeff5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b7c6f0',
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  agregarImagenTexto: {
    fontSize: 15,
    color: '#888888',
    marginTop: 4,
  },
  miniaturas: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    alignItems: 'center',
  },
  miniaturaContenedor: {
    position: 'relative',
  },
  miniatura: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  eliminarBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  agregarMas: {
    width: 120,
    height: 120,
    backgroundColor: '#edeff5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formulario: {
    backgroundColor: '#edeff5',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#b7c6f0',
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  mitad: {
    flex: 1,
  },
  selector: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b7c6f0',
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b7c6f0',
    overflow: 'hidden',
    marginTop: -6,
  },
  dropdownOpcion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#edeff5',
  },
  dropdownTexto: {
    fontSize: 14,
    color: '#333333',
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333333',
    minHeight: 130,
    borderWidth: 1,
    borderColor: '#b7c6f0',
  },
  botonPublicar: {
    backgroundColor: '#2f5fd9',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonPublicarTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  botonDesactivado: {
    opacity: 0.5,
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
  navTexto: {
    fontSize: 15,
    color: '#1b2a66',
    fontWeight: '500',
  },
});
