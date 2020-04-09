import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Profile from './screens/Profile'
import Login from './screens/Login'
import Register from './screens/Register'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/* 
Steps:
 * Criar Screens como Funcs
 * Criar Stack e incluir la esses screens
 * Incluir Stack na botomTabStack
*/

function HomeScreen() {
  return (
    <Profile></Profile>
  );
}

function LoginScreen() {
  return (
    <Login></Login>
  );
}

function RegisterScreen() {
  return (
    <Register></Register>
  );
}

const Tab = createBottomTabNavigator();
const LoginStack = createStackNavigator();
const HomeStack = createStackNavigator();




function App() {
  return (
    /* OAuth Stack */
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Login">
        <Tab.Screen name="Register" component={RegisterScreen} />
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="BotTabs" children={createBotTabs} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;