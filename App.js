import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PublicacionesProvider } from './context/PublicacionesContext';
import PrimeraScreen from './screens/PrimeraScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CrearPublicacionScreen from './screens/CrearPublicacionScreen';
import InscripcionScreen from './screens/InscripcionScreen';
import ChatsListaScreen from './screens/ChatsListaScreen';
import ChatConversacionScreen from './screens/ChatConversacionScreen';
import MatchScreen from './screens/MatchScreen';
import PerfilScreen from './screens/PerfilScreen';
import EditarPerfilScreen from './screens/EditarPerfilScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PublicacionesProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Primera" component={PrimeraScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CrearPublicacion" component={CrearPublicacionScreen} />
        <Stack.Screen name="Inscripcion" component={InscripcionScreen} />
        <Stack.Screen name="ChatsLista" component={ChatsListaScreen} />
        <Stack.Screen name="Match" component={MatchScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="ChatConversacion" component={ChatConversacionScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PublicacionesProvider>
  );
}
