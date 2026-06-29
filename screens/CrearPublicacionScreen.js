import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { usePublicaciones } from '../context/PublicacionesContext';

const opcionesPrecios = ['$0 - $100k', '$100k - $200k', '$200k - $400k', '$400k+'];
const opcionesGenero = ['Masculino', 'Femenino', 'No binario', 'Prefiero no decir'];

export default function CrearPublicacionScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [genero, setGenero] = useState('');
  const [mostrarPrecios, setMostrarPrecios] = useState(false);
  const [mostrarGenero, setMostrarGenero] = useState(false);
  const [imagenes, setImagenes] = useState([]);
  const [marcador, setMarcador] = useState(null);
  const { agregarPublicacion } = usePublicaciones();

  const handlePublicar = () => {
    if (!nombre.trim()) { alert('Ingresá un nombre para la publicación.'); return; }
    if (!ubicacion.trim()) { alert('Ingresá una ubicación.'); return; }
    agregarPublicacion({ titulo: nombre, ubicacion, imagenes, marcador, precio, genero, descripcion });
    navigation.navigate('Home');
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
              <Ionicons name="add" size={64} color="#888888" />
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
                    <Ionicons name="close-circle" size={22} color="#333333" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.agregarMas} onPress={elegirImagenes}>
                <Ionicons name="add" size={32} color="#888888" />
              </TouchableOpacity>
            </ScrollView>
          )}
        </TouchableOpacity>

        <View style={styles.formulario}>

          <TextInput
            style={styles.input}
            placeholder="Nombre de publicacion"
            placeholderTextColor="#aaaaaa"
            value={nombre}
            onChangeText={setNombre}
          />

          <View style={styles.fila}>
            <TouchableOpacity
              style={[styles.selector, styles.mitad]}
              onPress={() => { setMostrarPrecios(!mostrarPrecios); setMostrarGenero(false); }}
            >
              <Text style={{ color: precio ? '#333333' : '#aaaaaa', flex: 1 }}>
                {precio || 'Precios'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#888888" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.selector, styles.mitad]}
              onPress={() => { setMostrarGenero(!mostrarGenero); setMostrarPrecios(false); }}
            >
              <Text style={{ color: genero ? '#333333' : '#aaaaaa', flex: 1 }}>
                {genero || 'Genero'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#888888" />
            </TouchableOpacity>
          </View>

          {mostrarPrecios && (
            <View style={styles.dropdown}>
              {opcionesPrecios.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={styles.dropdownOpcion}
                  onPress={() => { setPrecio(p); setMostrarPrecios(false); }}
                >
                  <Text style={styles.dropdownTexto}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

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
            placeholderTextColor="#aaaaaa"
            value={ubicacion}
            onChangeText={setUbicacion}
          />

          <View style={styles.mapaHeader}>
            <Text style={styles.mapaLabel}>
              {marcador ? 'Ubicación marcada ✓  (tocá para mover)' : 'Tocá el mapa para marcar la ubicación'}
            </Text>
            {marcador && (
              <TouchableOpacity onPress={() => setMarcador(null)}>
                <Text style={styles.mapaEliminar}>Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>
          <MapView
            style={styles.mapa}
            initialRegion={{
              latitude: -34.6037,
              longitude: -58.3816,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onPress={(e) => setMarcador(e.nativeEvent.coordinate)}
          >
            {marcador && (
              <Marker
                coordinate={marcador}
                draggable
                onDragEnd={(e) => setMarcador(e.nativeEvent.coordinate)}
              />
            )}
          </MapView>

          <TextInput
            style={styles.textArea}
            placeholder="Descripcion para agregar"
            placeholderTextColor="#aaaaaa"
            multiline
            numberOfLines={6}
            value={descripcion}
            onChangeText={setDescripcion}
            textAlignVertical="top"
          />

        </View>

        <TouchableOpacity style={styles.botonPublicar} onPress={handlePublicar}>
          <Text style={styles.botonPublicarTexto}>Publicar</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={22} color="#111111" />
          <Text style={styles.navTexto}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
    backgroundColor: '#ffffff',
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
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 20,
    marginTop: 10,
  },
  agregarImagen: {
    backgroundColor: '#eeeeee',
    borderRadius: 12,
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
    backgroundColor: '#dddddd',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formulario: {
    backgroundColor: '#eeeeee',
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
    borderColor: '#dddddd',
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
    borderColor: '#dddddd',
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
    overflow: 'hidden',
    marginTop: -6,
  },
  dropdownOpcion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  dropdownTexto: {
    fontSize: 14,
    color: '#333333',
  },
  mapaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  mapaLabel: {
    fontSize: 13,
    color: '#666666',
    flex: 1,
  },
  mapaEliminar: {
    fontSize: 13,
    color: '#cc0000',
    fontWeight: '500',
  },
  mapa: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333333',
    minHeight: 130,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  botonPublicar: {
    backgroundColor: '#666666',
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
