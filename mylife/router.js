import React from 'react';
import { Platform } from 'react-native';

import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation-stack';

import Login from './screens/Login'
import Profile from './screens/Profile'
import HomePage from './screens/HomePage'

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

const HomeStack = createStackNavigator(
    {
      //Defination of Navigaton from home screen
      Home: { screen: HomePage },

      Profile: { screen: Profile,
        navigationOptions: {
          header: null,
        }},
    },
    {
      //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
      defaultNavigationOptions: {
        //Header customization of the perticular Screen
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20,
        },
        headerTintColor: '#FFFFFF',
        title: 'Profile',
        headerLeft: <ActionBarImage tipo={0} />,
  
        
  
        headerRight: (
          <HeaderRightNavBar/>
        )
        //Header title
      },
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon os={Platform.os} icon="home" color={tintColor}   />
      }
    }
  );

const AppNavigator = createBottomTabNavigator( //Signed In Stack
    {
      HomePage: { screen: HomeStack },
      Profile: { screen: Profile },
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
  },
  {
    initialRouteName: 'Login', 
  }
);

export default createAppContainer(AppNavigatorFinal);