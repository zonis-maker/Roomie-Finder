import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style=  {styles.container}>

      <View style={styles.navbar}>
        <Text style={styles.navLogo}>Roomie Finder</Text>
        <View style={styles.navBotones}>
          <TouchableOpacity 
            style={styles.boton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.botonTexto}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.boton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.botonTexto}>Registro</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contenido}>
        <Text style={styles.titulo}>Roomie Finder</Text>
        <Text style={styles.subtitulo}>Encontrá tu compañero ideal</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  navLogo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  navBotones: {
    flexDirection: 'row',
    gap: 10,
  },
  boton: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  botonTexto: {
    fontSize: 14,
    color: '#333333',
  },
  contenido: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  titulo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#222222',
  },
  subtitulo: {
    fontSize: 16,
    color: '#888888',
    marginTop: 10,
  },
});