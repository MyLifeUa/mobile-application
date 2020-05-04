//This is an example code for Bottom Navigation//
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import * as Progress from "react-native-progress";
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
import moment from "moment";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph
} from "expo-chart-kit";

import { TabView, SceneMap, TabBar, TabViewPage } from "react-native-tab-view";

import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { toASCII } from "punycode";

//import all the basic component we have used
const API_URL = "http://mednat.ieeta.pt:8442";

export default class Login extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
  }

  state = {
    index: 0,
    SharedLoading: true,
    user_token: "",
    user_email: "",
    day: this.props.date,
    day_display: moment(this.props.date, "YYYY-MM-DD").format("MMMM Do YYYY"),
    loading: true,
    nutrients: []
  };
  async processInvalidToken() {
    this._removeData();
    this.props.navigation.navigate("Auth");
  }

  async componentDidMount() {
    await this._retrieveData(); //TODO uncomment this
    if (!this.state.SharedLoading) {
      this.getNutrientsTotal();
    }
  }

  getNutrientsTotal() {
    console.log(
      `${API_URL}/health-stats/nutrients/total/${this.state.user_email}/${this.state.day}`
    );
    fetch(
      `${API_URL}/health-stats/nutrients/total/${this.state.user_email}/${this.state.day}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Token " + this.state.user_token
        }
      }
    )
    .then(this.processResponse)
    .then(res => {

      const { statusCode, responseJson } = res;
      console.log(responseJson)

      if (statusCode==401){
        this.processInvalidToken()

      }else{
        if (
          responseJson["message"] == "The specified day has no history yet."
        ) {
          this.setState({
            loading: false,
          
          });
        }else{
          this.setState({loading:false,nutrients:responseJson["message"]})

        }

      }
      
      })
      .catch(error => {
        alert("Error adding Ingredient.");
        console.error(error);
      });
  }

  _removeData = async () => {
    // TODO Remove Fitbit flag
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

      if (value !== null) {
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

  async processResponse(response) {
    const statusCode = response.status;
    const data = response.json();
    const res = await Promise.all([statusCode, data]);
    return {
      statusCode: res[0],
      responseJson: res[1]
    };
  }

  renderNutrientsComponents = () => {
    const { nutrients,loading } = this.state;
    console.log(nutrients.length!=0);
    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: moderateScale(20)
          }}
        >
          <ActivityIndicator size="large" color={theme.primary_color_2} />
        </View>
      );
    } else if (nutrients.length!=0) {
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 0.2,
              backgroundColor: "white",
              margin: 10,
              borderRadius: 10
            }}
          >
            <View
              style={{
                flex: 0.3,
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  flex: 0.5,
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: 10
                }}
              >
                <Ionicons
                  name={"md-flame"}
                  size={moderateScale(20)}
                  color={theme.red}
                />
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.black,
                    fontWeight: "bold",
                    marginLeft: 5
                  }}
                >
                  Calories
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around"
                }}
              >
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.black,
                    fontWeight: "600"
                  }}
                >
                  {nutrients["calories"]["total"]}
                </Text>
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.black,
                    fontWeight: "600"
                  }}
                >
                  {nutrients["calories"]["goal"]}
                </Text>
                {this.renderLeftMacros(nutrients["calories"]["left"])}
              </View>
            </View>
            <View style={{ flex: 0.7, justifyContent: "center" }}>
              <Progress.Bar
                progress={this.calcPercentage(
                  nutrients["calories"]["goal"],
                  nutrients["calories"]["total"]
                )}
                width={width - 40}
                style={{ marginLeft: 10, marginRight: 30 }}
              />
            </View>
          </View>
          
          <View
            style={{
              flex: 0.2,
              backgroundColor: "white",
              margin: 10,
              borderRadius: 10
            }}
          >
            <View
              style={{
                flex: 0.3,
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  flex: 0.5,
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: 10
                }}
              >
                <MaterialCommunityIcons
                  name={"food"}
                  size={moderateScale(20)}
                  color={theme.primary_color_2}
                />
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.black,
                    fontWeight: "bold",
                    marginLeft: 5
                  }}
                >
                  Carbs
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around"
                }}
              >
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.black,
                    fontWeight: "600"
                  }}
                >
                  {nutrients["carbs"]["total"]}
                </Text>
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.black,
                    fontWeight: "600"
                  }}
                >
                  {nutrients["carbs"]["goal"]}
                </Text>
                {this.renderLeftMacros(nutrients["carbs"]["left"])}
              </View>
            </View>
            <View style={{ flex: 0.7, justifyContent: "center" }}>
              <Progress.Bar
                progress={this.calcPercentage(
                  nutrients["carbs"]["goal"],
                  nutrients["carbs"]["total"]
                )}
                width={width - 40}
                style={{ marginLeft: 10, marginRight: 35 }}
              />
            </View>
          </View>
          <View
            style={{
              flex: 0.2,
              backgroundColor: "white",
              margin: 10,
              borderRadius: 10
            }}
          >
            <View
              style={{
                flex: 0.3,
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  flex: 0.5,
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: 10
                }}
              >
                <MaterialCommunityIcons
                  name={"food"}
                  size={moderateScale(20)}
                  color={theme.green}
                />
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.black,
                    fontWeight: "bold",
                    marginLeft: 5
                  }}
                >
                  Proteins
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around"
                }}
              >
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.black,
                    fontWeight: "600"
                  }}
                >
                  {nutrients["proteins"]["total"]}
                </Text>
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.black,
                    fontWeight: "600"
                  }}
                >
                  {nutrients["proteins"]["goal"]}
                </Text>
                {this.renderLeftMacros(nutrients["proteins"]["left"])}
              </View>
            </View>
            <View style={{ flex: 0.7, justifyContent: "center" }}>
              <Progress.Bar
                progress={this.calcPercentage(
                  nutrients["proteins"]["goal"],
                  nutrients["proteins"]["total"]
                )}
                width={width - 40}
                style={{ marginLeft: 10, marginRight: 35 }}
              />
            </View>
          </View>
          <View
            style={{
              flex: 0.2,
              backgroundColor: "white",
              margin: 10,
              borderRadius: 10
            }}
          >
            <View
              style={{
                flex: 0.3,
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  flex: 0.5,
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: 10
                }}
              >
                <MaterialCommunityIcons
                  name={"food"}
                  size={moderateScale(20)}
                  color={"#36A9E1"}
                />
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.black,
                    fontWeight: "bold",
                    marginLeft: 5
                  }}
                >
                  Fats
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around"
                }}
              >
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.black,
                    fontWeight: "600"
                  }}
                >
                  {nutrients["fat"]["total"]}
                </Text>
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.black,
                    fontWeight: "600"
                  }}
                >
                  {nutrients["fat"]["goal"]}
                </Text>
                {this.renderLeftMacros(nutrients["fat"]["left"])}
              </View>
            </View>
            <View style={{ flex: 0.7, justifyContent: "center" }}>
              <Progress.Bar
                progress={this.calcPercentage(
                  nutrients["fat"]["goal"],
                  nutrients["fat"]["total"]
                )}
                width={width - 40}
                style={{ marginLeft: 10, marginRight: 35 }}
              />
            </View>
          </View>
        </View>
      );
    }else {
        return (
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 0.2,
                backgroundColor: "white",
                margin: 10,
                borderRadius: 10
              }}
            >
              <View
                style={{
                  flex: 0.3,
                  flexDirection: "row"
                }}
              >
                <View
                  style={{
                    flex: 0.5,
                    alignItems: "center",
                    flexDirection: "row",
                    marginLeft: 10
                  }}
                >
                  <Ionicons
                    name={"md-flame"}
                    size={moderateScale(20)}
                    color={theme.red}
                  />
                  <Text
                    style={{
                      fontSize: theme.h3,
                      color: theme.black,
                      fontWeight: "bold",
                      marginLeft: 5
                    }}
                  >
                    Calories
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around"
                  }}
                >
                  <Text
                    style={{
                      fontSize: theme.h3,
                      color: theme.black,
                      fontWeight: "600"
                    }}
                  >
                    0
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.h3,
                      color: theme.black,
                      fontWeight: "600"
                    }}
                  >
                    0
                  </Text>
                  {this.renderLeftMacros(0)}
                </View>
              </View>
              <View style={{ flex: 0.7, justifyContent: "center" }}>
                <Progress.Bar
                  progress={0}
                  width={width - 40}
                  style={{ marginLeft: 10, marginRight: 30 }}
                />
              </View>
            </View>
            
            <View
              style={{
                flex: 0.2,
                backgroundColor: "white",
                margin: 10,
                borderRadius: 10
              }}
            >
              <View
                style={{
                  flex: 0.3,
                  flexDirection: "row"
                }}
              >
                <View
                  style={{
                    flex: 0.5,
                    alignItems: "center",
                    flexDirection: "row",
                    marginLeft: 10
                  }}
                >
                  <MaterialCommunityIcons
                    name={"food"}
                    size={moderateScale(20)}
                    color={theme.primary_color_2}
                  />
                  <Text
                    style={{
                      fontSize: theme.h3,
                      color: theme.black,
                      fontWeight: "bold",
                      marginLeft: 5
                    }}
                  >
                    Carbs
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around"
                  }}
                >
                  <Text
                    style={{
                      fontSize: theme.h3,
                      color: theme.black,
                      fontWeight: "600"
                    }}
                  >
                    0
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.h3,
                      color: theme.black,
                      fontWeight: "600"
                    }}
                  >
                    0
                  </Text>
                  {this.renderLeftMacros(0)}
                </View>
              </View>
              <View style={{ flex: 0.7, justifyContent: "center" }}>
                <Progress.Bar
                  progress={0}
                  width={width - 40}
                  style={{ marginLeft: 10, marginRight: 35 }}
                />
              </View>
            </View>
            <View
              style={{
                flex: 0.2,
                backgroundColor: "white",
                margin: 10,
                borderRadius: 10
              }}
            >
              <View
                style={{
                  flex: 0.3,
                  flexDirection: "row"
                }}
              >
                <View
                  style={{
                    flex: 0.5,
                    alignItems: "center",
                    flexDirection: "row",
                    marginLeft: 10
                  }}
                >
                  <MaterialCommunityIcons
                    name={"food"}
                    size={moderateScale(20)}
                    color={theme.green}
                  />
                  <Text
                    style={{
                      fontSize: theme.h3,
                      color: theme.black,
                      fontWeight: "bold",
                      marginLeft: 5
                    }}
                  >
                    Proteins
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around"
                  }}
                >
                  <Text
                    style={{
                      fontSize: theme.h3,
                      color: theme.black,
                      fontWeight: "600"
                    }}
                  >
                    0
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.h3,
                      color: theme.black,
                      fontWeight: "600"
                    }}
                  >
                    0
                  </Text>
                  {this.renderLeftMacros(0)}
                </View>
              </View>
              <View style={{ flex: 0.7, justifyContent: "center" }}>
                <Progress.Bar
                  progress={0}
                  width={width - 40}
                  style={{ marginLeft: 10, marginRight: 35 }}
                />
              </View>
            </View>
            <View
              style={{
                flex: 0.2,
                backgroundColor: "white",
                margin: 10,
                borderRadius: 10
              }}
            >
              <View
                style={{
                  flex: 0.3,
                  flexDirection: "row"
                }}
              >
                <View
                  style={{
                    flex: 0.5,
                    alignItems: "center",
                    flexDirection: "row",
                    marginLeft: 10
                  }}
                >
                  <MaterialCommunityIcons
                    name={"food"}
                    size={moderateScale(20)}
                    color={"#36A9E1"}
                  />
                  <Text
                    style={{
                      fontSize: theme.h3,
                      color: theme.black,
                      fontWeight: "bold",
                      marginLeft: 5
                    }}
                  >
                    Fats
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around"
                  }}
                >
                  <Text
                    style={{
                      fontSize: theme.h3,
                      color: theme.black,
                      fontWeight: "600"
                    }}
                  >
                    0
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.h3,
                      color: theme.black,
                      fontWeight: "600"
                    }}
                  >
                    0
                  </Text>
                  {this.renderLeftMacros(0)}
                </View>
              </View>
              <View style={{ flex: 0.7, justifyContent: "center" }}>
                <Progress.Bar
                  progress={0}
                  width={width - 40}
                  style={{ marginLeft: 10, marginRight: 35 }}
                />
              </View>
            </View>
          </View>
        );
      }
  };

  calcPercentage(goal, total) {
    if (parseFloat(total) >= parseFloat(goal)) {
      return 1;
    } else {
      return (parseFloat(total) / parseFloat(goal)).toFixed(1);
    }
  }

  renderLeftMacros(number) {
    if (number > 0) {
      return (
        <Text
          style={{ fontSize: theme.h3, color: theme.red, fontWeight: "bold" }}
        >
          -{number}
        </Text>
      );
    } else {
      return (
        <Text
          style={{ fontSize: theme.h3, color: "green", fontWeight: "bold" }}
        >
          {number.toString().split("-")}
        </Text>
      );
    }
  }

  render() {
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
              flex: 0.06,
              height: moderateScale(40),
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: theme.primary_color
            }}
          >
            <View
              style={{
                flex: 0.5,

                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <Text
                style={{
                  fontSize: moderateScale(20),
                  fontWeight: "bold",
                  color: theme.white,
                  textAlign: "center",
                  marginLeft: 5
                }}
              >
                Nutrients
              </Text>
            </View>
            <View
              style={{
                flex: 0.5,

                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <MaterialCommunityIcons
                name={"calendar"}
                size={moderateScale(20)}
                color="white"
              />
              <Text
                style={{
                  fontSize: moderateScale(20),
                  fontWeight: "600",
                  color: theme.white,
                  textAlign: "center",
                  marginLeft: 5
                }}
              >
                {this.state.day_display}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: theme.gray2,
              marginTop: 10
            }}
          >
            <View
              style={{
                flex: 0.08,
                flexDirection: "row",
                backgroundColor: "white"
              }}
            >
              <View style={{ flex: 0.5 }}></View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around"
                }}
              >
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.primary_color,
                    fontWeight: "bold"
                  }}
                >
                  Total
                </Text>
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.primary_color,
                    fontWeight: "bold"
                  }}
                >
                  Goal
                </Text>
                <Text
                  style={{
                    fontSize: theme.h3,
                    color: theme.primary_color,
                    fontWeight: "bold"
                  }}
                >
                  Left
                </Text>
              </View>
            </View>
            <View style={{ flex: 0.92, elevation: 10, marginTop: 10 }}>
              {this.renderNutrientsComponents()}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    backgroundColor: theme.green,
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
    backgroundColor: theme.red,
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
    flex: 1,
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
    fontSize: moderateScale(15)
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
