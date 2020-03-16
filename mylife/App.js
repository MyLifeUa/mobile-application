import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigatorFinal from './router';
import {
    createStackNavigator,
    createBottomTabNavigator,
    createAppContainer,
  } from 'react-navigation-stack';

export default function App() {
    return (
        <AppNavigatorFinal
            ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
  
        />
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
