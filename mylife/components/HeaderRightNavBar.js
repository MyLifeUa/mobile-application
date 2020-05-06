//This is an example code for Bottom Navigation//
import React from "react";
//import react in our code.
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NavigationService from "../components/NavigationService";
const API_URL = "http://mednat.ieeta.pt:8442";

//import all the basic component we have used

export default class HeaderRightNavBar extends React.Component {
  //Detail Screen to show from any Open detail button

  constructor(props) {
    super(props);
    this.state = {
      SharedLoading: true,

      user_token: null,
      expo_token: null
    };
  }

  _deleteData = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("email");
      await AsyncStorage.removeItem("expo_token");
    } catch (exception) {
      return false;
    }
  };

  async logoutWithNotifications() {
    await this._deleteData();
    await this.deleteToken();
    
  }

  async processInvalidToken() {
    this._removeData();
    this.props.navigation.navigate("Auth");
  }

  _removeData = async () => {
    // TODO Remove Fitbit flag
  };

  async processResponse(response) {
    console.log("Hello");
    const statusCode = response.status;
    const data = response.json();
    const res = await Promise.all([statusCode, data]);
    return {
      statusCode: res[0],
      responseJson: res[1]
    };
  }

  async deleteToken() {
    //unsecure way to send a post
    var login_info = "Token " + this.state.user_token;

    if (this.state.expo_token != null) {
      fetch(`${API_URL}/expo-tokens`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: login_info
        },
        body: JSON.stringify({
          expo_token: this.state.expo_token
        })
      })
        .then(this.processResponse)
        .then(res => {
          const { statusCode, responseJson } = res;
          console.log(responseJson);


          if (statusCode == 401) {
            this.processInvalidToken();
          } else {
            NavigationService.navigate("Auth");
          }
        })
        .catch(error => {
          //this.handleRefresh()
          alert("Error deleting expo token.");
          console.error(error);
        });
    }
  }

  _retrieveData = async () => {
    console.log("HELLO");

    try {
      const value = await AsyncStorage.getItem("token");
      const expo_token = await AsyncStorage.getItem("expo_token", null);

      if (value !== null) {
        // We have data!!
        this.setState({
          SharedLoading: false,
          user_token: value,
          expo_token: expo_token
        });
      } else {
        this.setState({
          SharedLoading: false // TODO ELIMINATE THIS
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({
        SharedLoading: false // TODO ELIMINATE THIS
      });
    }
  };

  async componentDidMount() {
    this._retrieveData();
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <TouchableOpacity onPress={this.logoutWithNotifications.bind(this)}>
          <View style={{ paddingHorizontal: 15 }}>
            <Ionicons name="md-exit" size={32} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icons: {
    paddingHorizontal: 15
  }
});

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const Base64 = {
  btoa: (input: string = "") => {
    let str = input;
    let output = "";

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = "="), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: (input: string = "") => {
    let str = input.replace(/=+$/, "");
    let output = "";

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded."
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }
};
