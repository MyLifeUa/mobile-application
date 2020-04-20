import React from "react";

import { StyleSheet, Text, View,Platform, Button } from "react-native";
import Profile from "./screens/Profile";
import EditProfile from "./screens/EditProfile";
import CheckDoctor from "./screens/CheckDoctor";

import FoodLogs from "./screens/FoodLog";
import Stats from "./screens/Stats";
import FoodLogRegister from "./screens/FoodLogRegister";
import FoodLogRegisterML from "./screens/FoodLogRegisterML";
import IngredientList from "./screens/IngredientList";
import MealRegister from "./screens/MealRegister";

import Login from "./screens/Login";
import Register from "./screens/Register";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import AuthLoadingScreen from "./components/auth/AuthLoadingScreen";
import theme from "./constants/theme.style.js";
import { Ionicons, Foundation } from "@expo/vector-icons";
import Icon from "./components/Icon";

const LoginStack = createStackNavigator(
  //SignedOut Stack
  {
    //Defination of Navigaton from home screen
    Login: {
      screen: Login,
      navigationOptions: {
        header: null
      }
    },
    Register: {
      screen: Register,
      navigationOptions: {
        headerStyle: {
          backgroundColor: theme.primary_color,
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTitleStyle: {
          color: "white"
        },
        title: "Register"
      }
    }
  },
  {
    //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
    defaultNavigationOptions: {
      //Header customization of the perticular Screen

      headerStyle: {
        marginTop: Platform.OS === "android" ? 0 : 20
      }
    }
  }
);

const StatsNavigator = createStackNavigator(
  //Signed In Stack
  {
    Stats: { screen: Stats }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: theme.primary_color,
        marginTop: Platform.OS === "android" ? 0 : 20
      },
      headerTitleStyle: {
        color: "white"
      },
      title: "My Life"
    }),
    tabBarOptions: {
      activeTintColor: "#c73737",
      inactiveTintColor: "gray"
    }
  }
);

const ProfileNavigator = createStackNavigator(
  //Signed In Stack
  {
    Profile: { screen: Profile },
    EditProfile: {
      screen: EditProfile,
      navigationOptions: {
        headerStyle: {
          backgroundColor: theme.primary_color,
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTitleStyle: {
          color: "white"
        },
        title: "EditProfile"
      }
    },
    CheckDoctor: {screen: CheckDoctor,
      navigationOptions : {
        title: "Assigned Doctor"
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: theme.primary_color,
        marginTop: Platform.OS === "android" ? 0 : 20
      },
      headerTitleStyle: {
        color: "white"
      },
      title: "Profile"
    }),
    tabBarOptions: {
      activeTintColor: "#c73737",
      inactiveTintColor: "gray"
    }
  }
);

const FoodLogsNavigator = createStackNavigator(
  //Signed In Stack
  {
    //FoodLogs: { screen: FoodLogs },
    FoodLogRegister: {
      screen: FoodLogRegister,
      navigationOptions: {
        title: "New Food Log"
      }
    },
    FoodLogRegisterML: {
      screen: FoodLogRegisterML,
      navigationOptions: {
        title: "MyLife Food Detector"
      }
    },
    IngredientList: {
      screen: IngredientList,
      navigationOptions: {
        title: "Ingredients"
      }
    },
    MealRegister: {
      screen: MealRegister,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: theme.primary_color,
        marginTop: Platform.OS === "android" ? 0 : 20
      },
      headerTitleStyle: {
        color: "white"
      },

      title: "Food Logs",
    }),
    
   
  }
);

const AppNavigator = createBottomTabNavigator(
  //Signed In Stack
  {
    //Login:{screen: LoginStack},
    //AdiconarPrato: { screen: AdicionarPratoStack},
    //PratosRestauranteSide : { screen: PratosRestauranteSideStack},
    //AreaPessoal: { screen: PessoalStack},
    //PratoEspecifico: { screen: PratoEspecificoStack }, // alterei Gual
    FoodLogs: {
      screen: FoodLogsNavigator,
      navigationOptions: {
        tabBarLabel: "Food Log",
        tabBarIcon: ({ tintColor }) => (
          <Foundation name="book" color={tintColor} size={25} />
        )
      }
    },
    Home: {
      screen: ProfileNavigator,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-home" color={tintColor} size={25} />
        )
      }
    },
    Stats: {
      screen: StatsNavigator,
      navigationOptions: {
        tabBarLabel: "Stats",
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-stats" color={tintColor} size={25} />
        )
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({}),
    tabBarOptions: {
      activeTintColor: theme.primary_color,
      inactiveTintColor: "gray"
    }
  }
);

//For React Navigation 2.+ need to export App only
//export default App;
//For React Navigation 3.+

//Business Mode Routing, mudar nas opçoes
const AppNavigatorFinal = createSwitchNavigator(
  {
    App: {
      screen: AppNavigator
    },

    Auth: {
      screen: LoginStack
    },
    AuthLoading: AuthLoadingScreen
  },
  {
    initialRouteName: "AuthLoading"
  }
);

export default createAppContainer(AppNavigatorFinal);
