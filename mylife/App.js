import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Profile from './screens/Profile'
import Login from './screens/Login'
import Register from './screens/Register'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabs, createMaterialBottomTabNavigator, MaterialBottomTabView } from '@react-navigation/material-bottom-tabs';



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

const MaterialBot = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

createBotTabs = () => {
  return <MaterialBottomTabs.Navigator>
    <MaterialBottomTabs.Screen name="Home" component={HomeScreen}></MaterialBottomTabs.Screen>
    <MaterialBottomTabs.Screen name="Home1" component={HomeScreen}></MaterialBottomTabs.Screen>
    <MaterialBottomTabs.Screen name="Home2" component={HomeScreen}></MaterialBottomTabs.Screen>
    <MaterialBottomTabs.Screen name="Home3" component={HomeScreen}></MaterialBottomTabs.Screen>
  </MaterialBottomTabs.Navigator>
}

function App() {
  return (
    /* OAuth Stack */
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen options={{headerShown:false}} name="Register" component={RegisterScreen} />
        <Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
        <Stack.Screen name="BotTabs" children={createBotTabs} />
      </Stack.Navigator>
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