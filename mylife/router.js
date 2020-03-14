import React from 'react';
import { Platform } from 'react-native';

import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';

import Login from './screens/Login'

const LoginStack = createStackNavigator( //SignedOut Stack
  {
    //Defination of Navigaton from home screen
    Login: { screen: Login ,
      navigationOptions: {
          header: null,
        }
    },
    EmailLogin: {screen: EmailLogin,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Entrar',

      }
    },
    Registo : {screen: Registo,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Registar',

      }
    },
    RecoverPassword : {screen: RecoverPassword,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Recuperar Palavra-Passe',

      }
    },

  },
  {
    //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
    defaultNavigationOptions: {
      //Header customization of the perticular Screen
      headerStyle: {
        marginTop: Platform.OS === "android" ?  0 : 20  
      },
    }
  }
);

const AppNavigator = createBottomTabNavigator( //Signed In Stack
    {
      PratosDoDia: { screen: PratosStack },
      Restaurantes: { screen: HomeStack },
      Rank: { screen: SettingsStack },
      
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
      }),
      tabBarOptions: {
        activeTintColor: '#c73737',
        inactiveTintColor: 'gray',
        
      },
    }
  );

const AppNavigatorFinal = createSwitchNavigator(
    {
      App:{
        screen: AppNavigator
      },
      Auth:{
        screen: LoginStack
      },
      AuthLoading: AuthLoadingScreen,

  },
  {
    initialRouteName: 'AuthLoading', 
  }
);

export default createAppContainer(AppNavigatorFinal);