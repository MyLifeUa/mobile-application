import React, { Component } from "react";

import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import theme from "../constants/theme.style.js";
import NavigationService from "../components/NavigationService";
const API_URL = "http://mednat.ieeta.pt:8442";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default class ActionBarImage extends Component {
  state = {
    dataSource: {},
    token: "",
    email: "",
    refreshing: false,
    SharedLoading: true,
    isLoading: true,
    image: "",
    data: [
      { name: "João Vasconcelos", type: "0" },
      { name: "Ponto Zero", type: "1" }
    ],

    errorMessage: ""
  };

  async componentDidMount() {
    await this._retrieveData();

    if (!this.state.SharedLoading) {
      this.getProfilePic();
    }
  }

  async processResponse(response) {
    const statusCode = response.status;
    const data = response.json();
    const res = await Promise.all([statusCode, data]);
    return {
      statusCode: res[0],
      responseJson: res[1]
    };
  }

  async processInvalidToken() {
    NavigationService.navigate("Auth");
  }

  async getProfilePic() {
    var login_info = "Token " + this.state.token;

    fetch(`${API_URL}/client-photo/` + this.state.email, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: login_info
      }
    })
      .then(this.processResponse)
      .then(res => {
        const { statusCode, responseJson } = res;

        if (statusCode == 401) {
          this.processInvalidToken();
        } else {
          this.setState({
            image: responseJson["message"]["photo"],
            isLoading: false
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  _storeData = async token => {
    console.log("Storing Token: " + token);
    try {
      await AsyncStorage.setItem("token", token);
      this.setState({ user_token: token });
    } catch (error) {
      console.log(error);
    }
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      const email_async = await AsyncStorage.getItem("email");
      if (value !== null && email_async!==null) {
        // We have data!!
        this.setState({
          SharedLoading: false,
          token: value,
          email: email_async
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

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 15
          }}
        >
          <ActivityIndicator size="large" color={theme.primary_color_2} />
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              NavigationService.navigate("Profile");
            }}
          >
            <Image
              source={{ uri: `data:image/png;base64,${this.state.image}` }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40 / 2,
                marginRight: 15,
                borderWidth: 1,
                borderColor: theme.gray2
              }}
            />
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  dropdown_2_image: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,

    borderWidth: 2,
    borderColor: theme.primary_color
  },
  modalPicker2: {
    width: 180,
    height: 40,
    marginLeft: 10,
    justifyContent: "center",

    borderRadius: 16
    //marginVertical:8,
  },
  dropdown_2: {
    alignSelf: "flex-end",
    width: 150,
    marginTop: 32,
    right: 8,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: "cornflowerblue"
  },
  dropdown_2_text: {
    marginVertical: 10,
    //marginHorizontal: 6,
    fontSize: 18,
    color: "white",
    textAlign: "center",
    textAlignVertical: "center"
  },
  dropdown_2_dropdown: {
    width: 150,
    height: 300,
    borderColor: "cornflowerblue",
    borderWidth: 2,
    borderRadius: 3
  },
  dropdown_2_row: {
    flexDirection: "row",
    height: 40,
    marginVertical: 5,
    paddingHorizontal: 5,
    alignItems: "center"
  },

  dropdown_2_row_text: {
    fontSize: 16,
    marginLeft: 5,
    color: "navy",
    textAlignVertical: "center"
  },
  dropdown_2_separator: {
    height: 1,
    backgroundColor: "cornflowerblue"
  }
});
