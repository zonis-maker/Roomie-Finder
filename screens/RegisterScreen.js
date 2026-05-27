import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RegisterScreen({ navigation }) {
  const [fecha, setFecha] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [errorEdad, setErrorEdad] = useState('Mayor de 18 requerido');
  const [genero, setGenero] = useState('');
  const [mostrarGenero, setMostrarGenero] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [preferencias, setPreferencias] = useState(['Ordenado', 'Sociable', 'Tranquilo', 'Introvertido', 'Divertido']);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [mostrarInputNuevo, setMostrarInputNuevo] = useState(false);
  const [nuevaPreferencia, setNuevaPreferencia] = useState('');
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorContrasena, setErrorContrasena] = useState('');

  const generos = ['Masculino', 'Femenino', 'No binario', 'Prefiero no decir'];

  const validarEmail = (texto) => {
    setEmail(texto);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(texto)) {
      setErrorEmail('Ingresá un email válido.');
    } else {
      setErrorEmail('');
    }
  };

  const validarContrasena = (texto) => {
    setContrasena(texto);
    if (texto.length < 6) {
      setErrorContrasena('Mínimo 6 caracteres.');
    } else {
      setErrorContrasena('');
    }
  };

  const onCambioFecha = (event, fechaSeleccionada) => {
    setMostrarPicker(false);
    if (fechaSeleccionada) {
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaSeleccionada.getFullYear();
      const cumpleEsteAnio = hoy < new Date(hoy.getFullYear(), fechaSeleccionada.getMonth(), fechaSeleccionada.getDate());
      const edadReal = cumpleEsteAnio ? edad - 1 : edad;
      if (edadReal < 18) {
        setErrorEdad('Tenés que ser mayor de 18 años.');
      } else {
        setErrorEdad('');
        setFecha(fechaSeleccionada);
      }
    }
  };

  const formatearFecha = (f) => `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`;

  const togglePreferencia = (pref) => {
    if (seleccionadas.includes(pref)) {
      setSeleccionadas(seleccionadas.filter(p => p !== pref));
    } else {
      setSeleccionadas([...seleccionadas, pref]);
    }
  };

  const puedecontinuar = aceptaTerminos && errorEdad === '' && errorEmail === '' && email !== '' && contrasena !== '';

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.titulo}>Crear Perfil</Text>

      <View style={styles.card}>

        <TouchableOpacity style={styles.fotoPerfil}>
          <View style={styles.fotoCirculo} />
          <Text style={styles.fotoTexto}>Foto de perfil</Text>
        </TouchableOpacity>

        <TextInput style={styles.input} placeholder="Nombre Completo" value={nombre} onChangeText={setNombre} />

        <View style={styles.fila}>
          <TextInput style={[styles.input, styles.mitad]} placeholder="DNI" keyboardType="numeric" value={dni} onChangeText={setDni} />

          <TouchableOpacity
            style={[styles.input, styles.mitad, styles.selectorGenero]}
            onPress={() => setMostrarGenero(!mostrarGenero)}
          >
            <Text style={{ color: genero ? '#333' : '#aaa', flex: 1 }}>
              {genero || 'Genero'}
            </Text>
            <Text style={styles.flecha}>{mostrarGenero ? '▲' : '▼'}</Text>
          </TouchableOpacity>
        </View>

        {mostrarGenero && (
          <View style={styles.dropdown}>
            {generos.map((g) => (
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
          placeholder="Correo electronico"
          keyboardType="email-address"
          value={email}
          onChangeText={validarEmail}
          autoCapitalize="none"
        />
        {errorEmail !== '' && <Text style={styles.error}>{errorEmail}</Text>}

        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TouchableOpacity style={styles.inputFecha} onPress={() => setMostrarPicker(true)}>
          <Text style={styles.fechaTexto}>{formatearFecha(fecha)}</Text>
          <Text style={styles.flecha}>▼</Text>
        </TouchableOpacity>
        {errorEdad !== '' && <Text style={styles.error}>{errorEdad}</Text>}
        {mostrarPicker && (
          <DateTimePicker
            value={fecha}
            mode="date"
            display="spinner"
            onChange={onCambioFecha}
            maximumDate={new Date()}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={contrasena}
          onChangeText={validarContrasena}
        />
        {errorContrasena !== '' && <Text style={styles.error}>{errorContrasena}</Text>}

        <TouchableOpacity
          style={styles.terminosRow}
          onPress={() => setAceptaTerminos(!aceptaTerminos)}
        >
          <View style={[styles.checkbox, aceptaTerminos && styles.checkboxActivo]}>
            {aceptaTerminos && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.terminosTexto}>Acepto los terminos y condiciones</Text>
        </TouchableOpacity>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Descripcion personal</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Gustos, preferencias, costumbres"
            placeholderTextColor="#aaaaaa"
            multiline
            numberOfLines={4}
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
              <TouchableOpacity
                onPress={() => {
                  if (nuevaPreferencia.trim() !== '') {
                    setPreferencias([...preferencias, nuevaPreferencia.trim()]);
                    setNuevaPreferencia('');
                    setMostrarInputNuevo(false);
                  }
                }}
              >
                <Text style={styles.agregarTexto}>Agregar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.botonContinuar, !puedeontinuar && styles.botonDesactivado]}
          onPress={() => {
            if (!aceptaTerminos) alert('Tenés que aceptar los términos y condiciones.');
            else if (errorEdad !== '') alert('Tenés que ser mayor de 18 años.');
            else if (errorEmail !== '' || email === '') alert('Ingresá un email válido.');
            else if (contrasena === '') alert('Ingresá una contraseña.');
          }}
        >
          <Text style={styles.botonTexto}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>¿Ya tenés cuenta? <Text style={styles.linkNegrita}>Iniciá sesión</Text></Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  fotoPerfil: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fotoCirculo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#cccccc',
  },
  fotoTexto: {
    marginTop: 8,
    color: '#555555',
    fontSize: 13,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
    justifyContent: 'center',
  },
  selectorGenero: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flecha: {
    fontSize: 12,
    color: '#888888',
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  mitad: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  inputFecha: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fechaTexto: {
    fontSize: 15,
    color: '#333333',
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
    marginTop: -8,
  },
  terminosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#888888',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActivo: {
    backgroundColor: '#222222',
    borderColor: '#222222',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 13,
  },
  terminosTexto: {
    fontSize: 13,
    color: '#444444',
  },
  seccion: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
  },
  seccionTitulo: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  minimo: {
    fontSize: 11,
    color: '#888888',
    marginTop: 6,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  tagActivo: {
    backgroundColor: '#222222',
  },
  tagTexto: {
    fontSize: 13,
    color: '#333333',
  },
  tagTextoActivo: {
    color: '#ffffff',
  },
  inputNuevoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  inputNuevo: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
  },
  agregarTexto: {
    color: '#222222',
    fontWeight: 'bold',
    fontSize: 13,
  },
  botonContinuar: {
    backgroundColor: '#d0d0d0',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  botonDesactivado: {
    opacity: 0.5,
  },
  botonTexto: {
    fontSize: 16,
    color: '#333333',
  },
  link: {
    textAlign: 'center',
    color: '#555555',
    fontSize: 14,
  },
  linkNegrita: {
    fontWeight: 'bold',
    color: '#222222',
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  dropdownOpcion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  dropdownTexto: {
    fontSize: 15,x
    color: '#333333',
  },
});