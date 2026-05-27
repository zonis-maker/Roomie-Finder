import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Iniciar sesion</Text>

      <View style={styles.card}>

        <Text style={styles.label}>Correo electronico</Text>
        <TextInput
          style={styles.input}
          placeholder="nombre@gmail.com"
          keyboardType="email-address"
          placeholderTextColor="#aaaaaa"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          secureTextEntry
          placeholderTextColor="#aaaaaa"
        />

        <TouchableOpacity>
          <Text style={styles.olvide}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonEntrar}>
          <Text style={styles.botonEntrarTexto}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonGoogle}>
          <Text style={styles.googleG}>G</Text>
          <Text style={styles.botonSocialTexto}>Continuar con Google</Text>
        </TouchableOpacity>

       

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registrate}>
            ¿No tienes cuenta? <Text style={styles.registrateNegrita}>Registrate</Text>
          </Text>
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
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: '#d0d0d0',
    padding: 20,
    paddingTop: 50,
  },
  card: {
    backgroundColor: '#f0f0f0',
    margin: 20,
    borderRadius: 12,
    padding: 24,
  },
  label: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  olvide: {
    color: '#555555',
    fontSize: 13,
    marginBottom: 20,
  },
  botonEntrar: {
    backgroundColor: '#222222',
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  botonEntrarTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonGoogle: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  googleG: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 10,
    width: 24,
    textAlign: 'center',
  },
 
  botonSocialTexto: {
    fontSize: 15,
    color: '#333333',
  },
  registrate: {
    textAlign: 'center',
    color: '#555555',
    fontSize: 14,
  },
  registrateNegrita: {
    fontWeight: 'bold',
    color: '#222222',
  },
});