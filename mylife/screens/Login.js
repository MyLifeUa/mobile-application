//This is an example code for Bottom Navigation//
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../constants/theme.style.js";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import * as Permissions from 'expo-permissions'
import {Notifications } from 'expo'


//import react in our code.
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  Dimensions,
  AsyncStorage
} from "react-native";
const { width, height } = Dimensions.get("screen");
//import all the basic component we have used
const API_URL = "http://mednat.ieeta.pt:8442";

export default class Login extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
  }

  state = {
    email: "",
    password: "",
    expo_token:""
  };

  componentDidMount() {
    this.register();
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

  _storeData = async token => {
    console.log("Storing Token: " + token);
    try {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("email", this.state.email);
      await AsyncStorage.setItem('expo_token', this.state.expo_token);
      this.setState({ user_token: token });
    } catch (error) {
      console.log(error);
    }
  };

  async insertToken(token) {
    var login_info = "Token " + token;
    fetch(`${API_URL}/expo-tokens`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: login_info

      },
      body: JSON.stringify({
        expo_token: this.state.expo_token
      })
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.props.navigation.navigate("Profile");
      })
      .catch(error => {
        alert("Error fetching login");
        console.error(error);
      });
  }

  async makeLoginRequest() {
    //unsecure way to send a post
    if (this.state.email == "") {
      alert("Fill in the login information");
    } else {
      console.log("Fetching:" + `${API_URL}/login`);
      fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.email,
          password: this.state.password
        })
      })
        .then(response => response.json())
        .then(json => {
          console.log(json);
          if (json.detail != undefined) {
            //Credentials incorrect
            alert("Login Credentials are invalid.");
          } else {
            
            this._storeData(json.token);
            this.insertToken(json.token);

            
          }
        })
        .catch(error => {
          alert("Error fetching login");
          console.error(error);
        });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* Imagem e logo */}
        <Image
          style={{
            width: moderateScale(100),
            height: moderateScale(100),
            resizeMode: "contain"
          }}
          source={require("../assets/icon.png")}
        />

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email..."
            placeholderTextColor="#003f5c"
            onChangeText={text => this.setState({ email: text })}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Password..."
            placeholderTextColor="#003f5c"
            onChangeText={text => this.setState({ password: text })}
          />
        </View>

        {/* Forgot password has no use for now
            <TouchableOpacity>
                <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
            */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => this.makeLoginRequest()}
        >
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Register")}
        >
          <Text style={styles.loginText}>Signup</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary_color,
    alignItems: "center",
    paddingVertical: 20,
    justifyContent: "center"
  },

  inputView: {
    width: "80%",
    backgroundColor: theme.white,
    color: theme.primary_color,
    borderRadius: 20,
    height: 45,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },

  inputText: {
    height: 50,
    color: theme.primary_color
  },

  forgot: {
    color: theme.white,
    fontSize: 14
  },

  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },

  loginText: {
    color: "white"
  },

  logo_text: {
    fontSize: theme.h1,
    color: theme.white,
    fontWeight: "bold"
  }
});
