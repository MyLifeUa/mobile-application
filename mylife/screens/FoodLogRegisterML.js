//This is an example code for Bottom Navigation//
import React from "react";
import theme from "../constants/theme.style.js";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Toast, { DURATION } from "react-native-easy-toast";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

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
  ActivityIndicator
} from "react-native";

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
    Loading: false,
    showView: false,
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

  getPermissionAsync = async () => {
    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Desculpe, precisamos de acesso a camara para tirar fotos!");
      }
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
    if (this.state.imageBase64 == "") {
      alert("Fill in the required information!");
    } else {
      this.setState({
        showViewError: false,
        Loading: true,
        showView: false
      });
      fetch(`${API_URL}/image-classification`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: login_info
        },
        body: JSON.stringify({
          //change these params later
          image_b64: this.state.imageBase64
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
              this.setState({
                showViewError: true,
                Loading: false,
                showView: false
              });
            } else {
              this.setState({
                showViewError: false,
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
        })
        .catch(error => {
          alert("Error adding Food Log.");
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
              height: moderateScale(100),
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
              flex: 0.3,
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={styles.loginGoogleButton}
              onPress={() => this.goBackWithMeal()}
            >
              <Text style={styles.loginButtonText}>Add Meal to Food Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  render() {
    let { image } = this.state;
    return (
      <ScrollView  enabled>
        <View style={{ flex: 1, width: "100%", justifyContent: "center" }}>
          {/*<View
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
              Food Recognition 📷
              <Text style={{ color: "#0096dd", fontWeight: "bold" }}>
                {this.state.name}
              </Text>
            </Text>
          </View>*/}
          <View style={styles.photoContainer}>
            <View
              style={{
                flex: 0.6,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "flex-end",
                marginTop: 10
              }}
            >
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{
                    width: verticalScale(270),
                    height: verticalScale(170),
                    borderWidth: 2,
                    borderColor: themeStyle.primary_color,
                    backgroundColor: "gray"
                  }}
                />
              )}
            </View>
            <View style={{ flex: 0.15, flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  style={styles.pictureButton}
                  onPress={this._pickImage}
                >
                  <View
                    style={{
                      flex: 2,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Ionicons
                      name="md-photos"
                      size={moderateScale(20)}
                      style={{
                        color: "white",
                        width: moderateScale(20),
                        height: moderateScale(20)
                      }}
                    >
                      {" "}
                    </Ionicons>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  style={styles.pictureButton}
                  onPress={this.takePicture}
                >
                  <Entypo
                    name="camera"
                    size={moderateScale(20)}
                    style={{
                      color: "white",
                      width: moderateScale(20),
                      height: moderateScale(20)
                    }}
                  >
                    {" "}
                  </Entypo>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flex: 0.05,
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                style={styles.loginGoogleButton}
                onPress={() => this.addFoodRecognition()}
              >
                <Text style={styles.loginButtonText}>Identify Food</Text>
              </TouchableOpacity>
            </View>
          </View>

          {this.renderIdentifiedFoodView()}

          {/*<View style={styles.containerScroll}>

                    
                    <TouchableOpacity onPress={() => this.openDatepicker()} style={styles.inputView}>
                        <Text style={styles.inputText}>{this.state.day}</Text>
                    </TouchableOpacity>

                    
                    <View style={styles.inputView} >
                        <RNPickerSelect
                            placeholder={this.state.placeholder_1}
                            
                            items={this.state.type_of_meal}
                            onValueChange={value => {
                                this.setState({
                                choosen_type_of_meal: value,
                                })

                            }}

                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                top: 10,
                                right: 12,
                                },
                            }}
                            value={this.state.choosen_type_of_meal}
                            useNativeAndroidPickerStyle={false}
                            textInputProps={{ underlineColor: 'yellow' }}
                            Icon={() => {
                                return <Ionicons name="md-arrow-down" size={18} style={styles.icon} />;
                            }}
                        />
                    </View>

                    
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Number of servings" 
                            
                            maxLength={3}
                            keyboardType={'numeric'}
                            onChangeText={text => this.setState({number_of_servings:text})}/>
                    </View>
                    <View style={{flexDirection: 'row',justifyContent:'center',alignItems:'center'}}>
                        <View style={styles.inputView_2} >
                            <RNPickerSelect
                                placeholder={this.state.placeholder_2}
                                
                                items={this.state.meals}
                                onValueChange={value => {
                                    this.setState({
                                    choosen__meal: value,
                                    })

                                }}

                                style={{
                                    ...pickerSelectStyles,
                                    iconContainer: {
                                    top: 10,
                                    right: 2,
                                    },
                                }}
                                value={this.state.choosen__meal}
                                useNativeAndroidPickerStyle={false}
                                textInputProps={{ underlineColor: 'yellow' }}
                                Icon={() => {
                                    return <Ionicons name="md-arrow-down" size={18} style={styles.icon} />;
                                }}
                            />
                        </View>
                        <View style={{flex:0.15,justifyContent:'flex-start',alignItems:'center',marginLeft:moderateScale(20)}}>
  
                            <TouchableOpacity style={styles.addButton}

                                //onPress={()=> this.makeRegisterRequest()}
                                >
                                <Text style={styles.loginButtonText}>
                                    +
                                </Text>
                            </TouchableOpacity>
                
                        </View>


                  </View>
                    

                </View>*/}
        </View>
        <Toast
          ref="toast"
          style={{ backgroundColor: theme.gray }}
          position="bottom"
          positionValue={100}
          fadeInDuration={1500}
          fadeOutDuration={1500}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
