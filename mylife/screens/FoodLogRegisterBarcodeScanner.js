//This is an example code for Bottom Navigation//
import React from "react";
import theme from "../constants/theme.style.js";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Toast, { DURATION } from "react-native-easy-toast";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
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
  Image,
  Animated,
  ActivityIndicator
} from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import themeStyle from "../constants/theme.style.js";
const { width, height } = Dimensions.get("screen");
const API_URL = "http://mednat.ieeta.pt:8442";

//import all the basic component we have used

export default class FoodLogRegisterBarcodeScanner extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
  }
  state = {
    Loading: false,
    showView: false,
    scanned: false,
    hasCameraPermission: null,
    barcode: null,
    animationLineHeight: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },
    focusLineAnimation: new Animated.Value(0),
    showViewError: false,
    identifiedFood: "",
    calories: 0,
    carbs: 0,
    fat: 0,
    responseFood: [],
    protein: 0,
    user_token: "",
    SharedLoading: true,
    number_of_servings: "",
    day: "Pick a day",
    choosen_type_of_meal: "",
    image:
      "https://www.brownweinraub.com/wp-content/uploads/2017/09/placeholder.jpg",
    imageBase64: "",
    imageupdate: false,
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

  animateLine = () => {
    Animated.sequence([
      Animated.timing(this.state.focusLineAnimation, {
        toValue: 1,
        duration: 1000
      }),

      Animated.timing(this.state.focusLineAnimation, {
        toValue: 0,
        duration: 1000
      })
    ]).start(this.animateLine);
  };

  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== "granted") {
      alert("We need to acces your camera to scan barcodes!");
    }
  };
  // get from galery
  _pickImage = async () => {
    await this.getPermissionAsync();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      //aspect: [4, 3],
      base64: true
    });

    if (!result.cancelled) {
      let base64image = result.base64.replace(/(?:\r\n|\r|\n)/g, "");
      this.setState({
        image: result.uri,
        imageupdate: result.uri,
        imageBase64: base64image
      });
    }
  };

  // take camera pic
  takePicture = async () => {
    await this.getPermissionAsync();

    await Permissions.askAsync(Permissions.CAMERA);
    const { cancelled, uri, base64 } = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      base64: true,
      quality: 0.8
    });
    let base64image = base64.replace(/(?:\r\n|\r|\n)/g, "");
    this.setState({
      image: uri,
      imageupdate: uri,
      imageBase64: base64image
    });
  };

  async componentDidMount() {
    await this._retrieveData();
    await this.getPermissionAsync();
    this.animateLine();
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

  addFoodRecognition() {
    var login_info = "Token " + this.state.user_token;
    if (this.state.barcode == null) {
      alert("Fill in the required information!");
    } else {
      this.setState({
        showViewError: false,
        Loading: true,
        showView: false
      });
      fetch(`${API_URL}/barcode-classification?barcode=${this.state.barcode}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
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
            console.log(responseJson);
            {
              if (responseJson.state == "Error") {
              alert(responseJson.message);
              this.setState({
                showViewError: true,
                Loading: false,
                scanned:true,

                showView: false
              });
            } else {
              this.setState({
                showViewError: false,
                scanned:true,
                Loading: false,
                showView: true,
                identifiedFood: responseJson["message"]["name"],
                responseFood: responseJson["message"],
                calories: responseJson["message"]["calories"],
                fat: responseJson["message"]["fat"],
                protein: responseJson["message"]["proteins"],
                carbs: responseJson["message"]["carbs"]
              });
            }
            }
          }
        })
        .catch(error => {
          
          this.setState({
            showViewError: true,
            Loading: false,
            showView: false
          });
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

  goBackWithMeal = () => {
    this.props.navigation.state.params.handleIdentifiedMeal(
      this.state.responseFood
    );
    this.props.navigation.goBack(null);
  };

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
      .then(response => response.json())
      .then(responseJson => {
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
          meals: mealDropdown
        });

        console.log("Dishes", mealDropdown);
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderIdentifiedFoodView() {
    let { Loading, showView, showViewError } = this.state;

    if (Loading) {
      return (
        <View style={{ flex: 0.5, justifyContent: "center" }}>
          <ActivityIndicator size="large" color={theme.primary_color} />
        </View>
      );
    } else if (showViewError) {
      return (
        <View
          style={{
            flex: 0.2,
            marginHorizontal: 20,
            borderRadius: moderateScale(20),
            backgroundColor: theme.primary_color,
            justifyContent: "center"
          }}
        >
          <Text
            style={{
              fontSize: moderateScale(17),
              fontWeight: "600",
              color: themeStyle.white,
              textAlign: "center"
            }}
          >
            Can't identify food. Try again later.
          </Text>
        </View>
      );
    } else if (showView) {
      return (
        <View style={{ flex: 0.35 }}>
          <View
            style={{
              flex: 0.4,
              justifyContent: "center",
              backgroundColor: theme.primary_color
            }}
          >
            <Text
              style={{
                fontSize: moderateScale(17),
                marginLeft: 10,
                fontWeight: "500",
                color: themeStyle.white
              }}
            >
              Identified food :
              <Text
                style={{
                  fontSize: moderateScale(17),
                  fontWeight: "bold",
                  color: themeStyle.white
                }}
              >
                {" "}
                {this.state.identifiedFood}
              </Text>
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginVertical: moderateScale(10),
              height: moderateScale(90),
              justifyContent: "space-around"
            }}
          >
            <View style={styles.squareView}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: moderateScale(15), color: "white" }}>
                  Cal
                </Text>
              </View>
              <View
                style={{
                  flex: 1.8,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.squaretext}>
                  {parseFloat(this.state.calories).toFixed(0)}
                </Text>
              </View>
            </View>
            <View style={styles.squareView}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: moderateScale(15), color: "white" }}>
                  Carbs
                </Text>
              </View>
              <View
                style={{
                  flex: 1.8,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.squaretext}>
                  {parseFloat(this.state.carbs).toFixed(0)}
                </Text>
              </View>
            </View>
            <View style={styles.squareView}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: moderateScale(15), color: "white" }}>
                  Fat
                </Text>
              </View>
              <View
                style={{
                  flex: 1.8,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.squaretext}>
                  {parseFloat(this.state.fat).toFixed(0)}
                </Text>
              </View>
            </View>
            <View style={styles.squareView}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: moderateScale(15), color: "white" }}>
                  Protein
                </Text>
              </View>
              <View
                style={{
                  flex: 1.8,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.squaretext}>
                  {parseFloat(this.state.protein).toFixed(0)}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 0.6,
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom:10
            }}
          >
            <TouchableOpacity
              style={styles.loginGoogleButton}
              onPress={() => this.goBackWithMeal()}
            >
              <Text style={styles.loginButtonText}>Add Item to Food Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const isPermissionGranted = status === "granted";
    console.log(isPermissionGranted);
    setCameraPermission(isPermissionGranted);
  };

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true, barcode: data });
  };

  renderAnimation = () => {
    if (!this.state.scanned) {
      return (
        <Animated.View
          style={[
            styles.animationLineStyle,
            {
              transform: [
                {
                  translateY: this.state.focusLineAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, this.state.animationLineHeight.height]
                  })
                }
              ]
            }
          ]}
        />
      );
    }
  };

  renderRescan = () => {
    if (this.state.scanned) {
      return (
        <TouchableOpacity
          onPress={() => this.setState({ scanned: false })}
          style={styles.rescanIconContainer}
        >
          <Image
            source={require("../assets/rescan.png")}
            style={{ width: 50, height: 50 }}
          />
        </TouchableOpacity>
      );
    }
  };

  render() {
    let { image } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} enabled>
        <View style={{ flex: 1, width: "100%", justifyContent: "center" }}>
          <View style={styles.photoContainer}>
            <View
              style={{
                flex: 0.7,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Camera
                onBarCodeScanned={
                  this.state.scanned ? undefined : this.handleBarCodeScanned
                }
                style={StyleSheet.absoluteFillObject}
              />

              <View style={styles.overlay}>
                <View style={styles.unfocusedContainer}></View>

                <View style={styles.middleContainer}>
                  <View style={styles.unfocusedContainer}></View>
                  <View
                    onLayout={e =>
                      this.setState({
                        animationLineHeight: {
                          x: e.nativeEvent.layout.x,
                          y: e.nativeEvent.layout.y,
                          height: e.nativeEvent.layout.height,
                          width: e.nativeEvent.layout.width
                        }
                      })
                    }
                    style={styles.focusedContainer}
                  >
                    {this.renderAnimation()}
                    {this.renderRescan()}
                  </View>
                  <View style={styles.unfocusedContainer}></View>
                </View>
                <View style={styles.unfocusedContainer}>
                  <Text style={{ textAlign: "center", color: "white" }}>
                    Point your camera at a barcode
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 0.15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  value={this.state.barcode}
                  placeholder="Enter barcode here"
                  onChangeText={text => this.setState({ barcode: text })}
                />
              </View>
            </View>
            <View
              style={{
                flex: 0.15,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                style={styles.loginGoogleButton}
                onPress={() => this.addFoodRecognition()}
              >
                <Text style={styles.loginButtonText}>Identify Item</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )} */}
          {this.renderIdentifiedFoodView()}
        </View>
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
  container: {
    flex: 1,
    position: "relative"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center"
  },

  middleContainer: {
    flexDirection: "row",
    flex: 6
  },

  focusedContainer: {
    flex: 8
  },
  animationLineStyle: {
    height: 2,
    width: "100%",
    backgroundColor: "red"
  },
  rescanIconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  photoContainer: {
    flex: 0.7,
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
  squaretext: {
    fontSize: moderateScale(20),
    textAlign: "center",
    width: "100%",
    color: "white",
    fontWeight: "bold"
  },
  squareView: {
    flex: 1,
    width: moderateScale(75),
    height: moderateScale(75),
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
    paddingLeft: 20,
    justifyContent: "center"
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
