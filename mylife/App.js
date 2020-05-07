import React from "react";
import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import Profile from "./screens/Profile";
import Login from "./screens/Login";
import MealRegister from "./screens/MealRegister";
import AppNavigatorFinal from "./router";
import NavigationService from "./components/NavigationService";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

export default class App extends React.Component {
  componentWillMount() {
    Notifications.addListener(notification => {
      this.listen(notification);
    });
  }

  register = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (status !== "granted") {
      console.log("Permission not granted!");

      //this.removeNotificacao(token)
    } else {
      try {
        const token = await Notifications.getExpoPushTokenAsync();
        console.log("granted", token);
        this.setState({
          expo_token: token
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  listen = notification => {
    if (notification["origin"] == "selected") {
      NavigationService.navigate("FoodLogs");
    }
  };

  render() {
    return (
      <AppNavigatorFinal
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}
