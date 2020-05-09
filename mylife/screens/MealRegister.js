//This is an example code for Bottom Navigation//
import React from "react";
import theme from "../constants/theme.style.js";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Icon } from "react-native-elements";
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants"; //import react in our code.
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
  RefreshControl
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { ScrollView, FlatList } from "react-native-gesture-handler";
import themeStyle from "../constants/theme.style.js";
import MealItem from "../components/MealItem";
import Toast, { DURATION } from "react-native-easy-toast";

const { width, height } = Dimensions.get("screen");
const API_URL = "http://mednat.ieeta.pt:8442";

//import all the basic component we have used

export default class Register extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
  }
  state = {
    user_token: "",
    SharedLoading: true,
    refresh: false,
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    mealName: "",
    number_of_servings: "",
    choosen_type_of_meal: "",
    dataSourceIngredients: [],
    checkedIngredients: new Map(),
    type_of_meal: [
      { label: "Traditional", value: "Traditional" },
      { label: "Fast Food", value: "Fast Food" }
    ],
    placeholder_1: {
      label: "Pick a type of meal",
      value: "0"
    },
    placeholder_2: {
      label: "Pick a meal",
      value: "0"
    }
  };

  updateMealItemList = (data, dataSource) => {
    let ingredients = [];

    for (let i = 0; i < dataSource.length; i++) {
      if (data.get(dataSource[i].id) == true) {
        ingredients.push({
          id: dataSource[i].id,
          Name: dataSource[i].Name,
          Calories: dataSource[i].Calories,
          Proteins: dataSource[i].Proteins,
          Fat: dataSource[i].Fats,
          Carbs: dataSource[i].Carbs,
          quantity: 100,
          compare: false
        });
      }
    }
    this.setState(
      {
        dataSourceIngredients: ingredients,
        checkedIngredients: data,
        refresh: !this.state.refresh
      },
      () => {
        this.changeGlobalQuantity();
      }
    );
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

  addMeal() {
    //unsecure way to send a post
    var login_info = "Token " + this.state.user_token;
    var localIngredients = [];

    for (var i = 0; i < this.state.dataSourceIngredients.length; i++) {
      localIngredients.push({
        id: this.state.dataSourceIngredients[i]["id"],
        quantity: this.state.dataSourceIngredients[i]["quantity"]
      });
    }

    //console.log(this.state.dataSourceIngredients)

    if (
      localIngredients == [] ||
      this.state.choosen_type_of_meal == "" ||
      this.state.mealName == ""
    ) {
      alert("Fill in the required information!");
    } else {
      fetch(`${API_URL}/meals`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: login_info
        },
        body: JSON.stringify({
          //change these params later
          name: this.state.mealName,
          category: this.state.choosen_type_of_meal,
          ingredients: localIngredients
        })
      })
        .then(this.processResponse)
        .then(res => {
          const { statusCode, responseJson } = res;

          if (statusCode == 401) {
            this.processInvalidToken();
          } else {
            this._storeData(responseJson.token);
            if (responseJson.state == "Error") {
              alert(responseJson.message);
            } else {
              this.refs.toast.show("Meal saved 💯", DURATION.LENGTH_LONG);
              this.props.navigation.state.params.handleRefreshParent();
              this.props.navigation.goBack(null);
            }
          }
        })
        .catch(error => {
          alert("Error adding Meal.");
          console.error(error);
        });
    }
  }

  // Get permissions from camera
  getPermissionAsync = async () => {
    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert(
          "To upload a photo, you must allow MyLife to access your gallery."
        );
      }
    }
  };

  selectPicture = async () => {
    await this.getPermissionAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      //aspect: [4, 3],
      base64: true
    });

    if (!result.cancelled) {
      var base64image = result.base64.replace(/(?:\r\n|\r|\n)/g, "");
      this.setState({ photo: result.uri, photo_base64: base64image });
    }

    console.log(this.state);
  };

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

  _listEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          margin: 10,
          borderRadius: 10
        }}
      >
        <Text style={{ fontSize: 20, textAlign: "center", color: theme.black }}>
          Looks like you don't have any ingredients in this meal yet 🥫
        </Text>
      </View>
    );
  };

  changeGlobalQuantity = () => {
    var proteincount = 0;
    var fatcount = 0;
    var carbscount = 0;
    var calcount = 0;

    for (var i = 0; i < this.state.dataSourceIngredients.length; i++) {
      proteincount += parseFloat(
        this.state.dataSourceIngredients[i]["Proteins"]
      );
      fatcount += parseFloat(this.state.dataSourceIngredients[i]["Fat"]);
      carbscount += parseFloat(this.state.dataSourceIngredients[i]["Carbs"]);
      calcount += parseFloat(this.state.dataSourceIngredients[i]["Calories"]);
    }

    this.setState({
      protein: proteincount,
      fat: fatcount,
      carbs: carbscount,
      calories: calcount
    });
  };

  changeIngredientQuantity = (index, quantity) => {
    if (quantity == "" || quantity == 0) {
      quantity = 1;
    }

    const localArray = [...this.state.dataSourceIngredients];
    var quantityNumber = parseFloat(quantity);
    var oldQuantity = parseFloat(localArray[index]["quantity"]);
    var protein =
      (quantityNumber * parseFloat(localArray[index]["Proteins"])) /
      oldQuantity;
    var fat =
      (quantityNumber * parseFloat(localArray[index]["Fat"])) / oldQuantity;
    var carb =
      (quantityNumber * parseFloat(localArray[index]["Carbs"])) / oldQuantity;
    var cal =
      (quantityNumber * parseFloat(localArray[index]["Calories"])) /
      oldQuantity;

    localArray[index]["quantity"] = quantityNumber;
    localArray[index]["Proteins"] = protein;
    localArray[index]["Carbs"] = carb;
    localArray[index]["Fat"] = fat;
    localArray[index]["Calories"] = cal;

    this.setState(
      { changeIngredientQuantity: localArray, refresh: !this.state.refresh },
      () => {
        this.changeGlobalQuantity();
      }
    );
  };

  deleteItem = (index, id) => {
    console.log(this.state.dataSourceIngredients);
    this.state.dataSourceIngredients.splice(index, 1);
    this.state.checkedIngredients.set(id, false);

    this.setState(
      {
        refresh: !this.state.refresh
      },
      () => {
        this.changeGlobalQuantity();
      }
    );
  };

  renderItem = ({ item, index }) => {
    console.log("Reservas!!!", item);

    {
      /*Aqui passar: ferias={item.ferias} */
    }

    return (
      <MealItem
        Calories={item.Calories}
        quantity={item.quantity}
        id={item.id}
        Name={item.Name}
        deleteItem={this.deleteItem}
        position={index}
        changeIngredientQuantity={this.changeIngredientQuantity}
        navigation={this.props.navigation}
      />
    );
  };

  renderFooterList = () => {
    return <View style={{ paddingVertical: 60 }}></View>;
  };

  renderList() {
    const { searchType, refreshing } = this.state;

    return (
      <View style={{ flex: 0.7 }}>
        <FlatList
          Vertical
          showsVericalScrollIndicator={false}
          data={this.state.dataSourceIngredients}
          extraData={this.state.refresh}
          ListEmptyComponent={this._listEmptyComponent}
          ListFooterComponent={this.renderFooterList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.handleRefresh}
            />
          }
          renderItem={(item, index) => this.renderItem(item, index)}
          keyExtractor={val => val.id}
          initialNumToRender={2}
        />
      </View>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/icon.png")}
            style={{ width: "100%", flex: 0.3,    paddingTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight,
          }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "space-around",
                justifyContent: "space-around",
                padding: width * 0.03,
                backgroundColor: "rgba(0,0,0,.55)",
                //paddingTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight,


              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginLeft: width * 0.01,
                  justifyContent: "space-between"
                }}
              >
                <View
                  style={{ flex: 1, alignItems: "flex-start", color: "white" }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.goBack(null);
                    }}
                  >
                    <Ionicons
                      color="white"
                      name="md-arrow-back"
                      size={moderateScale(28)}
                    ></Ionicons>
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    flex: 4,
                    fontSize: moderateScale(22),
                    color: "white",
                    fontWeight: "500",
                    alignItems: "center"
                  }}
                >
                  New Meal
                </Text>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.addMeal();
                    }}
                  >
                    <Text
                      style={{
                        fontSize: moderateScale(20),
                        color: "white",
                        fontWeight: "500",
                        textAlign: "right",
                        marginRight: 10
                      }}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ButoesLike */}
              </View>
            </View>
          </ImageBackground>
          <View style={{ flex: 1, width: "100%" }}>
            <View style={styles.containerScroll}>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Meal Name"
                  onChangeText={text => this.setState({ mealName: text })}
                />
              </View>

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
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 0.4,
                alignItems: "center",
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
                height: moderateScale(50),
                backgroundColor: theme.primary_color_2,
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <Text style={styles.secondHeaderText}>Meal Items</Text>
            </View>

            {this.renderList()}

            {/*<View style={{flex:0.3,justifyContent:'flex-start',alignItems:'center'}}>
      
                    
                        <TouchableOpacity style={styles.loginGoogleButton}
    
                            //onPress={()=> this.makeRegisterRequest()}
                            >
                            <Text style={styles.loginButtonText}>
                                Add Food Log
                            </Text>
                        </TouchableOpacity>
                  
                            </View>*/}
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              this.props.navigation.navigate("IngredientList", {
                updateData: this.updateMealItemList.bind(this),
                checkedIngredients: this.state.checkedIngredients
              })
            }
          >
            <Text style={styles.loginButtonText}>+</Text>
          </TouchableOpacity>

          <Toast
            ref="toast"
            style={{ backgroundColor: theme.gray }}
            position="bottom"
            positionValue={100}
            fadeInDuration={1500}
            fadeOutDuration={1500}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  secondHeaderText: {
    fontSize: moderateScale(20),
    textAlign: "left",
    width: "100%",
    color: "white",
    marginLeft: 10,
    fontWeight: "500"
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

  addButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    backgroundColor: theme.primary_color,
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(70),
    height: moderateScale(70),
    right: 30,
    bottom: 30,
    borderRadius: 40,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center"
  },
  loginGoogleButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    backgroundColor: "#fb5b5a",
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
    fontSize: moderateScale(25)
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
    //paddingTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight,
    flex: 1,
    //backgroundColor: theme.primary_color,
    alignItems: "center",

    justifyContent: "center"
  },

  containerScroll: {
    flex: 0.4,
    marginLeft: 10,
    marginTop: 10,
    //backgroundColor: theme.black,
    alignItems: "flex-start",
    justifyContent: "flex-start"
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
  inputView3: {
    width: "30%",
    backgroundColor: theme.white,
    color: theme.primary_color,
    borderColor: theme.primary_color_2,
    borderWidth: 2,
    borderRadius: 10,
    height: 10,

    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 5
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
  inputText3: {
    fontSize: 0.02 * height,
    textAlign: "center",
    paddingVertical: 2,
    height: height * 0.05,
    color: "black",
    fontWeight: "normal"
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
