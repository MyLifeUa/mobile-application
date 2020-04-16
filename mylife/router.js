import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Profile from './screens/Profile'
import Login from './screens/Login'
import Register from './screens/Register'
import {
  

    createAppContainer,
    createSwitchNavigator,
    
  } from 'react-navigation';
  import { createStackNavigator } from 'react-navigation-stack'
  
  
  const LoginStack = createStackNavigator( //SignedOut Stack
    {
      //Defination of Navigaton from home screen
      Login: { screen: Login ,
        navigationOptions: {
            header: null,
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
  
  
  
  const AppNavigator = createStackNavigator( //Signed In Stack
    {
      
      Home: { screen: Profile },
      
      
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        headerStyle: {
          backgroundColor: "#0096dd",
          marginTop: Platform.OS === "android" ? 0 : 20,
        
        },
        headerTitleStyle: {
          color: 'white'
        },
        title:'Intrusion Tracker',
        
  
        
      }),
      tabBarOptions: {
        activeTintColor: '#c73737',
        inactiveTintColor: 'gray',
        
      },
    }
  );
  
  
  
  
  //For React Navigation 2.+ need to export App only
  //export default App;
  //For React Navigation 3.+
  
  //Business Mode Routing, mudar nas opçoes
  const AppNavigatorFinal = createSwitchNavigator(
      {
        App:{
          screen: AppNavigator
        },
        
        Auth:{
          screen: LoginStack
        },
        //AuthLoading: AuthLoadingScreen,

  
    },
    {
      initialRouteName: 'App', 
    }
  );
  
  export default createAppContainer(AppNavigatorFinal);