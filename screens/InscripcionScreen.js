import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function InscripcionScreen({ navigation, route }) {
  const { publicacion } = route.params;
  const { token, estaLogueado } = useAuth();
  const [enviando, setEnviando] = useState(false);
  const [yaInscripto, setYaInscripto] = useState(false);

  const handleInscripcion = async () => {
    if (!estaLogueado) { alert('Tenés que iniciar sesión para inscribirte.'); navigation.navigate('Login'); return; }

    setEnviando(true);
    try {
      const respuesta = await fetch('https://roomie-finder-bay.vercel.app/postulaciones/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ publicacion_id: publicacion.id }),
      });

      if (respuesta.ok) {
        setYaInscripto(true);
        alert('¡Te inscribiste con éxito!');
      } else if (respuesta.status === 401) {
        alert('Tu sesión expiró. Iniciá sesión de nuevo.');
        navigation.navigate('Login');
      } else {
        alert('No se pudo enviar la inscripción. Puede que ya te hayas inscripto antes.');
      }
    } catch (error) {
      alert('No se pudo conectar al servidor. Revisá tu conexión.');
    } finally {
      setEnviando(false);
    }
  };

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
              <Ionicons name="home" size={70} color="#1b2a66" />
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

          <TouchableOpacity
            style={[styles.botonInscripcion, (enviando || yaInscripto) && styles.botonDesactivado]}
            onPress={handleInscripcion}
            disabled={enviando || yaInscripto}
          >
            <Text style={styles.botonTexto}>
              {yaInscripto ? 'Ya te inscribiste' : enviando ? 'Enviando...' : 'Inscripcion'}
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActivo]} onPress={() => navigation.navigate('Home')}>
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
  imagenContenedor: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    height: 200,
    borderWidth: 1,
    borderColor: '#b7c6f0',
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  imagenPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#edeff5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#b7c6f0',
  },
  descPersona: {
    backgroundColor: '#edeff5',
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
    backgroundColor: '#edeff5',
    borderRadius: 8,
    padding: 14,
  },
  campoAlto: {
    minHeight: 100,
  },
  campoTexto: {
    fontSize: 14,
    color: '#1b2a66',
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  mitad: {
    flex: 1,
  },
  botonInscripcion: {
    backgroundColor: '#2f5fd9',
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
  navItemActivo: {
    backgroundColor: '#dce4fa',
  },
  navTexto: {
    fontSize: 15,
    color: '#1b2a66',
    fontWeight: '500',
  },
});
