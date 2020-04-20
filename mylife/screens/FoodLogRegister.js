//This is an example code for Bottom Navigation//
import React from "react";
import theme from "../constants/theme.style.js";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";
import Toast, { DURATION } from "react-native-easy-toast";

//import react in our code.
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  DatePickerAndroid,
  Text,
  AsyncStorage,
  KeyboardAvoidingView,
  Dimensions,
  RefreshControl
} from "react-native";

import Modal from "react-native-modal";

import { ScrollView } from "react-native-gesture-handler";
import themeStyle from "../constants/theme.style.js";
const { width, height } = Dimensions.get("screen");
const API_URL = "http://mednat.ieeta.pt:8442";

//import all the basic component we have used

export default class Register extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
  }
  state = {
    modalFlag: false,
    user_token: "",
    refreshing: false,
    SharedLoading: true,
    number_of_servings: "",
    day: "Pick a day",
    choosen_type_of_meal: "",
    type_of_meal: [
      { label: "Breakfast", value: "Breakfast" },
      { label: "Lunch", value: "Lunch" },
      { label: "Dinner", value: "Dinner" },
      { label: "Snack", value: "Snack" }
    ],
    choosen__meal: "",
    meals: [],
    placeholder_1: {
      label: "Pick a type of meal",
      value: "0"
    },
    placeholder_2: {
      label: "Pick a meal",
      value: "0"
    }
  };

  async componentDidMount() {
    await this._retrieveData();

    if (!this.state.SharedLoading) {
      this.getMeals();
    }
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
    console.log("HELLO");

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

  addFoodLog() {
    //unsecure way to send a post
    var login_info = "Token " + this.state.user_token;
    console.log(this.state.choosen__meal);
    if (
      this.state.day == "" ||
      this.state.day == "Pick a day" ||
      this.state.choosen_type_of_meal == "" ||
      this.state.number_of_servings == "" ||
      this.state.choosen__meal == ""
    ) {
      alert("Fill in the required information!");
    } else {
      fetch(`${API_URL}/food-logs`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: login_info
        },
        body: JSON.stringify({
          //change these params later
          day: this.state.day,
          type_of_meal: this.state.choosen_type_of_meal,
          number_of_servings: this.state.number_of_servings,
          meal: this.state.choosen__meal //this shouldnt go out as clear text
        })
      })
        .then(this.processResponse)
        .then(res => {
          const { statusCode, responseJson } = res;

          if (statusCode == 401) {
            this.processInvalidToken();
          } else {
            console.log(responseJson);
            if (responseJson.state == "Error") {
              alert(responseJson.message);
            } else {
              this.refs.toast.show("Food Log added 💯", DURATION.LENGTH_LONG);
            }
          }
        })
        .catch(error => {
          alert("Error adding Food Log.");
          console.error(error);
        });
    }
  }

  openDatepicker = async () => {
    if (Platform.OS === "android") {
      try {
        const { action, year, month, day } = await DatePickerAndroid.open({
          // Use `new Date()` for current date.
          // May 25 2020. Month 0 is January.
          date: new Date()
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          this.setState({
            day:
              year.toString() +
              "-" +
              (month + 1).toString() +
              "-" +
              day.toString()
          });
        }
      } catch ({ code, message }) {
        console.warn("Cannot open date picker", message);
      }
    }
  };

  _removeData = async () => {
    // TODO Remove Fitbit flag
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
    this._removeData();
    this.props.navigation.navigate("Auth");
  }

  async getMeals() {
    var login_info = "Token " + this.state.user_token;
    console.log("adeus");

    fetch(`${API_URL}/meals`, {
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
          let mealDropdown = [];
          //console.log(responseJson)
          this._storeData(responseJson.token);

          for (var i = 0; i < responseJson.message.length; i++) {
            mealDropdown.push({
              label: responseJson.message[i].name,
              value: responseJson.message[i].id,
              compare: false
            });
          }

          this.setState({
            meals: mealDropdown,
            refreshing: false
          });

          console.log("Dishes", mealDropdown);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleIdentifiedMeal = identifiedFood => {
    console.log(identifiedFood);
  };

  handleRefresh = () => {
    // Refresh a zona de filtros tambem?
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.getMeals();
      }
    );
  };

  handleNavigation = () => {
    this.setState({ modalFlag: false });
    this.props.navigation.navigate("MealRegister", {
      handleRefreshParent: this.handleRefresh.bind(this)
    });
  };

  handleNavigationML = () => {
    this.setState({ modalFlag: false });
    this.props.navigation.navigate("FoodLogRegisterML", {
      handleIdentifiedMeal: this.handleIdentifiedMeal.bind(this)
    });
  };

  renderModalAddnewMeal() {
    const { modalFlag } = this.state;

    if (!modalFlag) return null;

    return (
      <Modal
        isVisible={modalFlag}
        useNativeDriver
        animationType="fade"
        //backdropColor={'grey'}
        onBackButtonPress={() => this.setState({ modalFlag: false })}
        onBackdropPress={() => this.setState({ modalFlag: false })}
        onSwipeComplete={() => this.setState({ modalFlag: false })}
        style={styles.modalContainer}
      >
        <View style={styles.modal}>
          <View
            style={{
              flex: 0.2,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.primary_color,
              borderTopLeftRadius: 0.0234375 * height,
              borderTopRightRadius: 0.0234375 * height
            }}
          >
            <Text
              style={{
                color: theme.white,
                fontSize: moderateScale(15),
                fontWeight: "normal",
                textAlign: "center",
                marginHorizontal: 5
              }}
            >
              Add a new meal
            </Text>
          </View>

          <View
            style={{
              flex: 1
            }}
          >
            <TouchableOpacity
              style={{
                flex: 0.5,
                flexDirection: "row",
                borderBottomWidth: 2,
                borderColor: theme.primary_color,
                justifyContent: "space-around",
                alignItems: "center"
              }}
              onPress={() => this.handleNavigation()}
            >
              <Text
                style={{
                  color: theme.primary_color,
                  fontSize: moderateScale(18),
                  fontWeight: "bold",
                  textAlign: "center",
                  marginHorizontal: 5
                }}
              >
                Manually Insert
              </Text>
              <Ionicons
                name="md-arrow-forward"
                size={moderateScale(25)}
                style={{
                  color: theme.primary_color,
                  width: moderateScale(20),
                  height: moderateScale(20)
                }}
              ></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 0.5,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center"
              }}
              onPress={() => this.handleNavigationML()}
            >
              <Text
                style={{
                  color: theme.primary_color,
                  fontSize: moderateScale(18),
                  fontWeight: "bold",
                  textAlign: "center",
                  marginHorizontal: 5
                }}
              >
                MyLife Food Detector
              </Text>
              <Ionicons
                name="md-arrow-forward"
                size={moderateScale(25)}
                style={{
                  color: theme.primary_color,
                  width: moderateScale(20),
                  height: moderateScale(20)
                }}
              ></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} enabled>
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          vertical
          scrollEnabled
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
          scrollEventThrottle={16}
          contentContainerStyle={{
            flexGrow: 1
          }}
        >
          <View
            style={{
              flex: 0.3,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
              width: width
            }}
          >
            <Text
              style={{
                fontSize: moderateScale(20),
                fontWeight: "600",
                width: "100%",
                textAlign: "center"
              }}
            >
              Insert a Food Log 📖
              <Text style={{ color: "#0096dd", fontWeight: "bold" }}>
                {this.state.name}
              </Text>
            </Text>
          </View>

          <View style={styles.containerScroll}>
            {/* Pick day */}
            <TouchableOpacity
              onPress={() => this.openDatepicker()}
              style={styles.inputView}
            >
              <Text style={styles.inputText}>{this.state.day}</Text>
            </TouchableOpacity>

            <View style={styles.inputView}>
              <RNPickerSelect
                placeholder={this.state.placeholder_1}
                items={this.state.type_of_meal}
                onValueChange={value => {
                  this.setState({
                    choosen_type_of_meal: value
                  });
                }}
                style={{
                  ...pickerSelectStyles,
                  iconContainer: {
                    top: 10,
                    right: 12
                  }
                }}
                value={this.state.choosen_type_of_meal}
                useNativeAndroidPickerStyle={false}
                textInputProps={{ underlineColor: "yellow" }}
                Icon={() => {
                  return (
                    <Ionicons
                      name="md-arrow-down"
                      size={18}
                      style={styles.icon}
                    />
                  );
                }}
              />
            </View>

            {/* Intro */}
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Number of servings"
                maxLength={3}
                keyboardType={"numeric"}
                onChangeText={text =>
                  this.setState({ number_of_servings: text })
                }
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View style={styles.inputView_2}>
                <RNPickerSelect
                  placeholder={this.state.placeholder_2}
                  items={this.state.meals}
                  onValueChange={value => {
                    this.setState({
                      choosen__meal: value
                    });
                  }}
                  style={{
                    ...pickerSelectStyles,
                    iconContainer: {
                      top: 10,
                      right: 2
                    }
                  }}
                  value={this.state.choosen__meal}
                  useNativeAndroidPickerStyle={false}
                  textInputProps={{ underlineColor: "yellow" }}
                  Icon={() => {
                    return (
                      <Ionicons
                        name="md-arrow-down"
                        size={18}
                        style={styles.icon}
                      />
                    );
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0.15,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginLeft: moderateScale(20)
                }}
              >
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => this.setState({ modalFlag: true })}
                >
                  <Text style={styles.loginButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 0.3,
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={styles.loginGoogleButton}
              onPress={() => this.addFoodLog()}
            >
              <Text style={styles.loginButtonText}>Add Food Log</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {this.renderModalAddnewMeal()}
        <Toast
          ref="toast"
          style={{ backgroundColor: theme.gray }}
          position="bottom"
          positionValue={100}
          fadeInDuration={1500}
          fadeOutDuration={1500}
        />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: "center"
  },
  modal: {
    backgroundColor: "white",
    height: moderateScale(200),
    marginHorizontal: 0.01953125 * height,
    borderRadius: 0.0234375 * height
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
  loginGoogleButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    backgroundColor: theme.primary_color_2,
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(150),
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
  CancelButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    backgroundColor: theme.red,
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(100),
    height: moderateScale(40),
    margin: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  SaveButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    backgroundColor: theme.green,
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(100),
    height: moderateScale(40),
    margin: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
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
