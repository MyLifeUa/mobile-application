import React from "react";

import { Platform, Animated } from "react-native";

const { width, height } = Dimensions.get("screen");
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
const API_URL = 'http://mednat.ieeta.pt:8442';

import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  Linking,
  Easing
} from "react-native";
import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      dataSource: null,
      path: "",
      userToken:"",
      text: ["A ferver água", "A preparar os ingredientes", "A empratar"],
      textused: "A ferver água",
      errorMessage: "",
      publicidade: false,
      fadeValue: new Animated.Value(0),
      xValue: new Animated.Value(500),
      xValue2: new Animated.Value(500)
    };
  }

  async componentDidMount() {
    await this._bootstrapAsync();

    if (this.state.userToken == null) {
      // We have data!!
      console.log("Auth");
      this.props.navigation.navigate("Auth");
    } else {

      await this.check_token(this.state.userToken)
      
   
    }

  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem("token");
    console.log("My userToken V2", userToken);

    this.setState({
      userToken: userToken
    });
    
  };

  async check_token(userToken){
    //unsecure way to send a post
    var login_info = "Token "+userToken;

    fetch(`${API_URL}/check-token`, {
        method: 'GET',
        headers: {
          "Authorization": login_info,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.status)
        .then((status) => {
            if (status==200){
              console.log("App "+status);
              this.props.navigation.navigate("Profile");
            }else{
              console.log("Auth");
              this.props.navigation.navigate("Auth");
            }
           
        })
        .catch((error) => {
            console.log("Auth");
            this.props.navigation.navigate("Auth");
            console.error(error);
        });
  
}

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginHorizontal: 10 }}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.companyImage}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 0 : 20,

    backgroundColor: "#0096dd"
  },

  companyImage: {
    flex: 1,
    width: moderateScale(60),
    height: moderateScale(30),
    borderRadius: moderateScale(30)
  }
});
