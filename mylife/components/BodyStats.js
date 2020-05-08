//This is an example code for Bottom Navigation//
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

//import react in our code.
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  DatePickerAndroid,
  Text,
  AsyncStorage,
  KeyboardAvoidingView,
  Dimensions,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
  ScrollView
} from "react-native";
const { width, height } = Dimensions.get("screen");
import theme from "../constants/theme.style.js";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph
} from "expo-chart-kit";

import { TabView, SceneMap, TabBar, TabViewPage } from "react-native-tab-view";

import { scale, verticalScale, moderateScale } from "react-native-size-matters";

//import all the basic component we have used
const API_URL = "http://mednat.ieeta.pt:8442";

export default class Login extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
  }

  state = {
    index: 0,
    user_token: "",
    user_email: "",
    isLoading: true,
    hasFitbit: true,
    routes: [
      { key: "first", title: "Body" },
      { key: "second", title: "Nutrients" }
    ]
  };

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
    console.log("HELLO");

    try {
      const value = await AsyncStorage.getItem("token");
      const email = await AsyncStorage.getItem("email");
      console.log(email);

      if (value !== null && email !== null) {
        // We have data!!
        this.setState({
          SharedLoading: false,
          user_token: value,
          user_email: email
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

    if (!this.state.SharedLoading) {
      this.getFitbitInfo();
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
    this.props.navigation.navigate("Auth");
  }

  async getFitbitInfo() {
    var login_info = "Token " + this.state.user_token;
    console.log(
      `${API_URL}/health-stats/body/heart-rate/` + this.state.user_email
    );

    fetch(`${API_URL}/health-stats/body/heart-rate/` + this.state.user_email, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: login_info
      }
    })
      .then(this.processResponse)
      .then(res => {
        const { statusCode, responseJson } = res;
        console.log(responseJson);

        if (statusCode == 401) {
          this.processInvalidToken();
        } else if (statusCode == 400) {
          this.setState({ hasFitbit: false, isLoading: false });
        } else {
          this.setState({ hasFitbit: true, isLoading: false });
        }
      })
      .catch(error => {
        console.log(error);
        //this._storeData(responseJson.token);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 0.085,
              height: moderateScale(40),
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: theme.primary_color
            }}
          >
            <MaterialCommunityIcons
              name={"dumbbell"}
              size={moderateScale(20)}
              color="white"
            />
            <Text
              style={{
                fontSize: moderateScale(20),
                fontWeight: "bold",
                color: theme.white,
                textAlign: "center",
                marginLeft: 5
              }}
            >
              Body Stats
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <ActivityIndicator size="large" color={theme.primary_color} />
          </View>
        </View>
      );
    } else {
      if (this.state.hasFitbit) {
        return (
          <View style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1, width: width }}
              vertical
              scrollEnabled
              scrollEventThrottle={16}
              contentContainerStyle={{
                flexGrow: 1
              }}
            >
              <View
                style={{
                  flex: 0.2,
                  height: moderateScale(40),
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  backgroundColor: theme.primary_color
                }}
              >
                <MaterialCommunityIcons
                  name={"dumbbell"}
                  size={moderateScale(20)}
                  color="white"
                />
                <Text
                  style={{
                    fontSize: moderateScale(20),
                    fontWeight: "bold",
                    color: theme.white,
                    textAlign: "center",
                    marginLeft: 5
                  }}
                >
                  Body Stats
                </Text>
              </View>

              <View style={{ flex: 1, marginVertical: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    height: moderateScale(180),
                    justifyContent: "space-around"
                  }}
                >
                  <TouchableOpacity
                    style={styles.squareView5}
                    onPress={() =>
                      this.props.navigation.navigate("HeartRateStats")
                    }
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Ionicons
                        name={"md-heart"}
                        size={moderateScale(50)}
                        color="white"
                      />

                      <Text
                        style={{
                          fontSize: moderateScale(20),
                          marginTop: 10,
                          color: "white"
                        }}
                      >
                        Resting heart rate
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    height: moderateScale(180),
                    justifyContent: "space-around"
                  }}
                >
                  <TouchableOpacity
                    style={styles.squareView}
                    onPress={() => this.props.navigation.navigate("StepsStats")}
                  >
                    <View
                      style={{
                        flex: 1,
                        //flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Ionicons
                        name={"md-walk"}
                        size={moderateScale(50)}
                        color="white"
                      />

                      <Text
                        style={{
                          fontSize: moderateScale(20),
                          marginTop: 10,
                          color: "white"
                        }}
                      >
                        Steps
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.squareView2}
                    onPress={() =>
                      this.props.navigation.navigate("FloorsStats")
                    }
                  >
                    <View
                      style={{
                        flex: 1,
                        //flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <MaterialCommunityIcons
                        name={"stairs"}
                        size={moderateScale(50)}
                        color="white"
                      />

                      <Text
                        style={{
                          fontSize: moderateScale(20),
                          marginTop: 10,
                          color: "white"
                        }}
                      >
                        Floors
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    height: moderateScale(180),
                    justifyContent: "space-around"
                  }}
                >
                  <TouchableOpacity
                    style={styles.squareView2}
                    onPress={() =>
                      this.props.navigation.navigate("DistanceStats")
                    }
                  >
                    <View
                      style={{
                        flex: 1,
                        //flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <MaterialCommunityIcons
                        name={"map-marker-distance"}
                        size={moderateScale(50)}
                        color="white"
                      />

                      <Text
                        style={{
                          fontSize: moderateScale(20),
                          marginTop: 10,
                          color: "white"
                        }}
                      >
                        Distance
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.squareView3}
                    onPress={() =>
                      this.props.navigation.navigate("CaloriesBurnedStats")
                    }
                  >
                    <View
                      style={{
                        flex: 1,
                        //flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Ionicons
                        name={"md-flame"}
                        size={moderateScale(50)}
                        color="white"
                      />

                      <Text
                        style={{
                          fontSize: moderateScale(20),
                          marginTop: 10,
                          color: "white"
                        }}
                      >
                        Calories burned
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        );
      } else {
        return (
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 0.085,
                height: moderateScale(40),
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: theme.primary_color
              }}
            >
              <MaterialCommunityIcons
                name={"dumbbell"}
                size={moderateScale(20)}
                color="white"
              />
              <Text
                style={{
                  fontSize: moderateScale(20),
                  fontWeight: "bold",
                  color: theme.white,
                  textAlign: "center",
                  marginLeft: 5
                }}
              >
                Body Stats
              </Text>
            </View>
            <View
              style={{
                flex: 0.5,
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >
              <Image
                style={{
                  width: moderateScale(350),
                  height: moderateScale(250),
                  resizeMode: "contain"
                }}
                source={require("../assets/fitbit-mylife.png")}
              />
            </View>
            <View
              style={{
                flex: 0.2,
                justifyContent: "flex-start",
                marginHorizontal: 10
              }}
            >
              <Text
                style={{
                  color: theme.black,
                  fontSize: moderateScale(20),
                  fontWeight: "400",
                  textAlign: "center",
                  marginHorizontal: 5
                }}
              >
                Sorry, you need to connect a Fitbit tracker to MyLife to access
                this feature.
              </Text>
            </View>
            <View
              style={{
                flex: 0.2,
                marginVertical: 10,
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                style={styles.connectFitbit}
                onPress={() => this.props.navigation.navigate("FitbitAuth")}
              >
                <Text style={styles.loginButtonText}>Connect your Fitbit</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  connectFitbit: {
    backgroundColor: "#85ba6a",
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(180),
    height: moderateScale(60),
    margin: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  loginButtonText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700",
    width: "100%",
    fontSize: moderateScale(15)
  },
  photoContainer: {
    flex: 0.6,
    alignSelf: "center",
    backgroundColor: theme.gray2,
    width: "90%",
    borderRadius: 10,
    marginVertical: 20,
    elevation: 8, // Android
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1 //IOS
  },
  squareView: {
    flex: 1,
    width: moderateScale(150),
    height: moderateScale(150),
    marginVertical: width * 0.03,
    marginHorizontal: moderateScale(11),
    borderRadius: moderateScale(10),
    backgroundColor: theme.primary_color,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  squareView2: {
    flex: 1,
    width: moderateScale(150),
    height: moderateScale(150),
    marginVertical: width * 0.03,
    marginHorizontal: moderateScale(11),
    borderRadius: moderateScale(10),
    backgroundColor: theme.primary_color_2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  squareView3: {
    flex: 1,
    width: moderateScale(150),
    height: moderateScale(150),
    marginVertical: width * 0.03,
    marginHorizontal: moderateScale(11),
    borderRadius: moderateScale(10),
    backgroundColor: "#36A9E1",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  squareView4: {
    flex: 1,
    width: moderateScale(150),
    height: moderateScale(150),
    marginVertical: width * 0.03,
    marginHorizontal: moderateScale(11),
    borderRadius: moderateScale(10),
    backgroundColor: "#4caf50",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  squareView5: {
    flex: 0.8,
    width: moderateScale(150),
    height: moderateScale(150),
    marginVertical: width * 0.03,
    marginHorizontal: moderateScale(11),
    borderRadius: moderateScale(10),
    backgroundColor: "#ea4744",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  squareView6: {
    flex: 1,
    width: moderateScale(150),
    height: moderateScale(150),
    marginVertical: width * 0.03,
    marginHorizontal: moderateScale(11),
    borderRadius: moderateScale(10),
    backgroundColor: "#1cbfd3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  squaretext: {
    fontSize: moderateScale(30),
    textAlign: "center",
    width: "100%",
    color: "white",
    fontWeight: "bold"
  },
  addButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    backgroundColor: theme.primary_color_2,
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(40),
    height: moderateScale(40),
    marginBottom: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  pictureButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    backgroundColor: theme.primary_color_2,
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(50),
    height: moderateScale(40),
    margin: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  loginGoogleButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    backgroundColor: theme.primary_color_2,
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(170),
    height: moderateScale(40),
    margin: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  loginButtonText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700",
    width: "100%",
    fontSize: moderateScale(16)
  },
  loginText: {
    color: "white"
  },
  photoText: {
    color: theme.primary_color
  },
  photoButton: {
    width: "80%",
    backgroundColor: theme.white,
    borderRadius: 5,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  container: {
    flex: 1,
    //backgroundColor: theme.primary_color,
    alignItems: "center",

    justifyContent: "center"
  },

  containerScroll: {
    flex: 0.3,
    //backgroundColor: theme.black,
    alignItems: "center",
    justifyContent: "center"
  },

  inputView: {
    width: "80%",
    backgroundColor: theme.white,
    color: theme.primary_color,
    borderColor: theme.primary_color_2,
    borderWidth: 2,
    borderRadius: 20,
    height: 45,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },

  inputView_2: {
    flex: 0.6,
    backgroundColor: theme.white,
    color: theme.primary_color,
    borderColor: theme.primary_color_2,
    borderWidth: 2,
    borderRadius: 20,
    height: 45,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },

  birthday_placeholder: {
    fontSize: 0.02 * height,
    paddingHorizontal: 5,
    paddingVertical: 4,
    height: height * 0.05,
    color: "#FFFFFF",
    fontWeight: "normal",
    paddingRight: 30 // to ensure the text is never behind the icon
  },

  inputText: {
    fontSize: 0.02 * height,
    paddingHorizontal: 5,
    paddingVertical: 4,
    height: height * 0.05,
    color: "black",
    fontWeight: "normal",
    paddingRight: 30 // to ensure the text is never behind the icon
  },

  forgot: {
    color: theme.white,
    fontSize: 14
  },

  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },

  register_title: {
    fontSize: theme.h2,
    color: theme.black,
    fontWeight: "bold"
  },

  logo_text: {
    fontSize: theme.h1,
    color: theme.white,
    fontWeight: "bold"
  },

  icon: {
    color: "#636e72"
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 0.02 * height,
    paddingVertical: 12,
    paddingHorizontal: 10,
    height: height * 0.05,

    color: "black",
    fontWeight: "normal",
    paddingRight: 30 // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 0.02 * height,
    paddingHorizontal: 5,
    paddingVertical: 4,
    height: height * 0.05,
    color: "black",
    fontWeight: "normal",
    paddingRight: 30 // to ensure the text is never behind the icon
  }
});
