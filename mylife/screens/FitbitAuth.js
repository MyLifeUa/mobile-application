//This is an example code for Bottom Navigation//
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../constants/theme.style.js";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import Constants from "expo-constants"; //import react in our code.
import { Ionicons } from "@expo/vector-icons";
import config from "../config.js";
import qs from "qs";
import * as AuthSession from "expo-auth-session";
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
  AsyncStorage,
  Linking,
  Platform
} from "react-native";
import { ThemeConsumer } from "react-native-elements";
const { width, height } = Dimensions.get("screen");
//import all the basic component we have used
const API_URL = "http://mednat.ieeta.pt:8442";

if (Platform.OS === "web") {
  WebBrowser.maybeCompleteAuthSession();
}

export default class Login extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
  }

  state = {
    email: "",
    password: "",
    SharedLoading: true,
    user_token: "",
    accessToken: "",
    refresToken: ""
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value !== null) {
        // We have data!!
        this.setState({
          SharedLoading: false,
          user_token: value
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
    await this._retrieveData();
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
    this.props.navigation.navigate("Auth");
  }

  addToken() {
    //console.log(this.state.dataSourceIngredients)
    var login_info = "Token " + this.state.user_token;

    if (this.state.accessToken == "" || this.state.refresToken == "") {
      alert("Could not get Token information!");
    } else {
      fetch(`${API_URL}/fitbit-token`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: login_info
        },
        body: JSON.stringify({
          //change these params later
          access_token: this.state.accessToken,
          refresh_token: this.state.refresToken
        })
      })
        .then(this.processResponse)
        .then(res => {
          const { statusCode, responseJson } = res;
          console.log(responseJson);

          if (statusCode == 401) {
            this.processInvalidToken();
          } else {
            this._storeData(responseJson.token);
            if (responseJson.state == "Error") {
              alert(responseJson.message);
            } else {
              console.log("Success");
              this.props.navigation.navigate('Profile', {
                FitbitToken: true
              })
            }
          }
        })
        .catch(error => {
          alert("Error adding Ingredient.");
          console.error(error);
          this._storeData(responseJson.token);
        });
    }
  }

  makeAcessTokenRequest(code, redirectUrl) {
    //unsecure way to send a post
    let login_info =
      "Basic " + Base64.btoa(config.client_id + ":" + config.client_secret);

    fetch(`https://api.fitbit.com/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: login_info,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: qs.stringify({
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUrl,
        expires_in:"3600"
      })
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);

        this.setState(
          {
            accessToken: json["access_token"],
            refresToken: json["refresh_token"]
          },
          () => {
            this.addToken();
          }
        );
      })
      .catch(error => {
        alert("Error fetching login");
        console.error(error);
      });
  }

  handlePressAsync = async client_id => {
    let redirectUrl = AuthSession.getRedirectUrl();

    let result = await AuthSession.startAsync({
      authUrl: `https://www.fitbit.com/oauth2/authorize?${qs.stringify({
        client_id,
        response_type: "code",
        scope: "heartrate activity activity profile sleep",
        redirect_uri: redirectUrl,
        expires_in: "31536000"
      })}`
    });

    this.makeAcessTokenRequest(result["params"]["code"], redirectUrl);
  };

  OAuth(client_id) {
    Linking.addEventListener("url", handleUrl);

    function handleUrl(event) {
      console.log(event.url);
      Linking.removeEventListener("url", handleUrl);
      const [, query_string] = event.url.match(/\#(.*)/);
      console.log(query_string);
      const query = qs.parse(query_string);
      console.log(`query: ${JSON.stringify(query)}`);
    }
    let redirectUrl = AuthSession.getRedirectUrl();
    console.log("Redirect url " + redirectUrl);

    const oauthurl = `https://www.fitbit.com/oauth2/authorize?${qs.stringify({
      client_id,
      response_type: "token",
      scope: "heartrate activity activity profile sleep",
      redirect_uri: redirectUrl,
      expires_in: "31536000"
    })}`;
    console.log(oauthurl);
    Linking.openURL(oauthurl).catch(err =>
      console.error("Error processing linking", err)
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {/* Forgot password has no use for now
            <TouchableOpacity>
                <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
            */}

        <View style={{ flex: 0.7, justifyContent: "center" }}>
          <View
            style={{
              flex: 0.1,
              justifyContent: "flex-end",
              alignItems: "flex-start",
              marginHorizontal: 10,
              marginVertical: 10,
              flexDirection: "row"
            }}
          >
            <TouchableOpacity style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "flex-start",
              marginHorizontal: 10,
              marginVertical: 10,
              flexDirection: "row"
            }}

            onPress={() =>this.props.navigation.navigate('Profile', {
              FitbitToken: false
            })
          }
            >
              <Text
                style={{
                  color: theme.primary_color,
                  fontSize: moderateScale(15),
                  fontWeight: "bold",
                  textAlign: "right",
                  marginHorizontal: 8
                }}
              >
                Skip
              </Text>
              <Ionicons
              name="md-arrow-forward"
              size={moderateScale(22)}
              style={{
                color: theme.primary_color,
                width: moderateScale(20),
                height: moderateScale(20)
              }}
            ></Ionicons>
            </TouchableOpacity>

            
          </View>
          <View
            style={{
              flex: 0.7,
              justifyContent: "flex-end",
              marginBottom:20,
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: moderateScale(350),
                height: moderateScale(250),
                resizeMode: "contain",
              }}
              source={require("../assets/fitbit-mylife.png")}
            />
          </View>
          <View
            style={{
              flex: 0.2,
              justifyContent: "center",
              marginHorizontal: 10
            }}
          >
            <Text
              style={{
                color: theme.primary_color,
                fontSize: moderateScale(30),
                fontWeight: "bold",
                textAlign: "center",
                marginHorizontal: 5
              }}
            >
              Connect your Fitbit Tracker with MyLife and get the ultimate
              experience.
            </Text>
          </View>
        </View>
        <View
          style={{ flex: 0.3, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => this.handlePressAsync(config.client_id)}
          >
            <Text style={styles.loginText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    marginTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight

    //alignItems: "center",
    //justifyContent: "center"
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
    backgroundColor: theme.primary_color,
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
