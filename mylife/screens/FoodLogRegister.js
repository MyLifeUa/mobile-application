//This is an example code for Bottom Navigation//
import React from "react";
import theme from "../constants/theme.style.js";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import {
  Ionicons,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather
} from "@expo/vector-icons";
import Toast, { DURATION } from "react-native-easy-toast";
import Autocomplete from "react-native-autocomplete-input";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";
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
  RefreshControl,
  ActivityIndicator,
  Keyboard
} from "react-native";

import Modal from "react-native-modal";

import { ScrollView } from "react-native-gesture-handler";
import themeStyle from "../constants/theme.style.js";
import moment from "moment";
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
    showButtons: true,
    refreshing: false,
    SharedLoading: true,
    loading: true,
    initialIndexRadioForm1: -1,
    initialIndexRadioForm2: -1,
    type_of_meal_1: [
      { label: "Breakfast", value: "Breakfast" },
      { label: "Lunch", value: "Lunch" }
    ],
    type_of_meal_2: [
      { label: "Dinner", value: "Dinner" },
      { label: "Snack", value: "Snack" }
    ],
    stringDay: "",
    number_of_servings: "1",
    day: moment().format("YYYY-MM-DD"),
    day_display: moment().format("MMMM Do YYYY"),
    query: "",
    choosen_type_of_meal: "",

    choosen__meal: "",
    meals: []
  };
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidHide = () => {
    this.refs["meal_input"].blur();
    this.setState({ showButtons: true });
  }

  async componentDidMount() {
    await this._retrieveData();

    let date = this.props.navigation.getParam("date", null);
    let food_log_type = this.props.navigation.getParam("food_log_type", null);

    if (date != null) {
      this.dealWithParams(date, food_log_type);
    } else {
      this.dealWithTime();
    }

    if (!this.state.SharedLoading) {
      this.getMeals();
    }
  }

  dealWithParams = (date, type) => {
    let day = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
    let day_display = moment(date, "YYYY-MM-DD").format("MMMM Do YYYY");

    if (type == "Breakfast") {
      this.setState({
        day: day,
        day_display: day_display,
        choosen_type_of_meal: "Breakfast",
        initialIndexRadioForm1: 0
      });
    } else if (type == "Lunch") {
      this.setState({
        day: day,
        day_display: day_display,
        choosen_type_of_meal: "Lunch",
        initialIndexRadioForm1: 1
      });
    } else if (type == "Dinner") {
      this.setState({
        day: day,
        day_display: day_display,
        choosen_type_of_meal: "Dinner",
        initialIndexRadioForm2: 0
      });
    } else {
      this.setState({
        day: day,
        day_display: day_display,
        choosen_type_of_meal: "Snack",
        initialIndexRadioForm2: 1
      });
    }

    console.log(day_display);
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

  dealWithTime = () => {
    moment.locale("pt");
    var currentTime = moment(new Date(), "h:mma");

    var beginningBreakfastTime = moment("6:00am", "h:mma");
    var endBreakfastTime = moment("11:00am", "h:mma");
    var beginningLunchTime = moment("12:00pm", "h:mma");
    var endLunchTime = moment("3:00pm", "h:mma");
    var beginningDinnerTime = moment("6:30pm", "h:mma");
    var endDinnerTime = moment("10:30pm", "h:mma");

    if (
      beginningBreakfastTime.isSameOrBefore(currentTime) &&
      endBreakfastTime.isSameOrAfter(currentTime)
    ) {
      console.log("Breakfast time");
      this.setState({
        choosen_type_of_meal: "Breakfast",
        initialIndexRadioForm1: 0
      });
    } else if (
      beginningLunchTime.isSameOrBefore(currentTime) &&
      endLunchTime.isSameOrAfter(currentTime)
    ) {
      console.log("Lunch time");
      this.setState({
        choosen_type_of_meal: "Lunch",
        initialIndexRadioForm1: 1
      });
    } else if (
      beginningDinnerTime.isSameOrBefore(currentTime) &&
      endDinnerTime.isSameOrAfter(currentTime)
    ) {
      console.log("Dinner time");
      this.setState({
        choosen_type_of_meal: "Dinner",
        initialIndexRadioForm2: 0
      });
    } else {
      console.log("Snack");
      this.setState({
        choosen_type_of_meal: "Snack",
        initialIndexRadioForm2: 1
      });
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
              //this.refs.toast.show("Food Log added 💯", DURATION.LENGTH_LONG);

              this.props.navigation.navigate("FoodLogs", { refresh: true,alerts: responseJson["alerts"],day:this.state.day,type:this.state.choosen_type_of_meal,showAlerts:true });
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
          let picked_date = new Date(year, month, day);
          this.setState({
            day:
              year.toString() +
              "-" +
              (month + 1).toString() +
              "-" +
              day.toString(),
            day_display: moment(picked_date).format("MMMM Do YYYY")
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
            refreshing: false,
            loading: false
          });

          console.log("Dishes", mealDropdown);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleIdentifiedMeal = identifiedFood => {
    this.setState({ choosen__meal: identifiedFood["id"],query: identifiedFood["name"] });
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

  findMeal(query) {
    if (query === "") {
      return [];
    }

    const { meals } = this.state;
    const regex = new RegExp(`${query.trim()}`, "i");
    return meals.filter(meals => meals.label.search(regex) >= 0);
  }

  renderButtons = () => {
    if (this.state.showButtons) {
      return (
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            flex: 0.5,
            position: "absolute",
            paddingVertical: 8,
            right: 0
          }}
        >
          <View
            style={{
              flex: 0.15,
              justifyContent: "center",
              alignItems: "flex-end",
              marginHorizontal: 2
            }}
          >
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => this.handleNavigationML()}
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
          <View
            style={{
              flex: 0.15,
              justifyContent: "center",
              alignItems: "flex-end",
              marginHorizontal: 2
            }}
          >
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => this.setState({ modalFlag: true })}
            >
              <MaterialCommunityIcons
                name="barcode-scan"
                size={moderateScale(20)}
                style={{
                  color: "white",
                  width: moderateScale(20),
                  height: moderateScale(20)
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 0.15,
              justifyContent: "center",
              alignItems: "flex-end",
              marginHorizontal: 2
            }}
          >
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => this.handleNavigation()}
            >
              <AntDesign
                name="plus"
                size={moderateScale(20)}
                style={{
                  color: "white",
                  width: moderateScale(20),
                  height: moderateScale(20)
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            flex: 0.5,
            position: "absolute",
            paddingVertical: 8,
            right: 0
          }}
        >
          <View
            style={{
              flex: 0.15,
              justifyContent: "center",
              alignItems: "flex-end",
              marginHorizontal: 2
            }}
          >
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                this.refs["meal_input"].blur();
                this.setState({ showButtons: true });
              }}
            >
              <Text style={styles.loginButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  handleRadioButton = (value, radioFormIndex) => {
    this.setState({ choosen_type_of_meal: value });
    if (radioFormIndex == 0) {
      console.log(radioFormIndex);
      this.refs["radioForm2"].clearSelection();
    } else {
      this.refs["radioForm1"].clearSelection();
    }
  };

  handleMinusDose() {
    if (parseFloat(this.state.number_of_servings) - 1 / 2 >= 0.5) {
      this.setState({
        number_of_servings: parseFloat(this.state.number_of_servings) - 1 / 2
      });
    }
  }

  handlePlusDose() {
    this.setState({
      number_of_servings: parseFloat(this.state.number_of_servings) + 1 / 2
    });
  }

  render() {
    const { query, loading } = this.state;
    const meals = this.findMeal(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <KeyboardAvoidingView style={styles.container} enabled>
          <ScrollView
            style={{ flex: 1, width: "100%" }}
            vertical
            keyboardShouldPersistTaps={"always"}
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
            {/* Date Component*/}
            <View
              style={{
                flex: 0.2,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TouchableOpacity
                onPress={() => this.openDatepicker()}
                style={styles.inputView}
              >
                <AntDesign
                  name="calendar"
                  size={moderateScale(20)}
                  style={{
                    color: theme.white,
                    width: moderateScale(20),
                    height: moderateScale(20)
                  }}
                />
                <Text style={styles.inputText}>{this.state.day_display}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0.35
              }}
            >
              <View
                style={{
                  flex: 0.3,
                  alignItems: "flex-end",
                  flexDirection: "row",
                  justifyContent: "flex-start"
                }}
              >
                <View style={styles.subHeaderView}>
                  <MaterialCommunityIcons
                    name="food"
                    size={moderateScale(20)}
                    style={{
                      color: theme.white,
                      marginLeft: 10,
                      width: moderateScale(20),
                      height: moderateScale(20)
                    }}
                  />
                  <Text style={styles.inputText}>Meal</Text>
                </View>
              </View>

              <View
                style={{
                  flex: 0.7,
                  alignItems: "flex-start",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  marginBottom: 10
                  //zIndex:2000,
                }}
              >
                <View
                  style={
                    this.state.showButtons
                      ? styles.autocompleteContainer
                      : styles.autocompleteContainerBig
                  }
                >
                  <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => this.setState({ showButtons: false })}
                    hideResults={this.state.showButtons}
                    ref="meal_input"
                    style={{
                      backgroundColor: "#fff",
                      padding: 10,
                      borderRadius: 16,
                      borderColor: theme.primary_color,
                      borderWidth: 1
                    }}
                    listStyle={{ position: "relative" }}
                    inputContainerStyle={{
                      paddingHorizontal: 5,
                      paddingTop: 5,
                      borderWidth: 0
                    }}
                    containerStyle={{}}
                    data={
                      meals.length === 1 && comp(query, meals[0].label)
                        ? []
                        : meals
                    }
                    defaultValue={query}
                    onChangeText={text => this.setState({ query: text })}
                    placeholder="Enter meal name"
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            query: item.label,
                            choosen__meal: item.value
                          })
                        }
                      >
                        <Text style={styles.itemText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>

                {this.renderButtons()}
              </View>
            </View>

            <View
              style={{
                flex: 0.15
              }}
            >
              <View
                style={{
                  flex: 0.1,
                  alignItems: "flex-end",
                  flexDirection: "row",
                  justifyContent: "flex-start"
                }}
              >
                <View style={styles.subHeaderView}>
                  <MaterialCommunityIcons
                    name="food"
                    size={moderateScale(20)}
                    style={{
                      color: theme.white,
                      marginLeft: 10,
                      width: moderateScale(20),
                      height: moderateScale(20)
                    }}
                  />
                  <Text style={styles.inputText}>Type of Food Log</Text>
                </View>
              </View>
              <View
                style={{
                  flex: 0.9,
                  marginTop: 10,
                  marginLeft: 10,
                  flexDirection: "row",
                  justifyContent: "space-around"
                }}
              >
                <RadioForm
                  radio_props={this.state.type_of_meal_1}
                  ref="radioForm1" // !! This is the main prop that needs to be there
                  initial={this.state.initialIndexRadioForm1}
                  onPress={value => this.handleRadioButton(value, 0)}
                />
                <RadioForm
                  radio_props={this.state.type_of_meal_2}
                  ref="radioForm2" // !! This is the main prop that needs to be there
                  initial={this.state.initialIndexRadioForm2}
                  onPress={value => this.handleRadioButton(value, 1)}
                />
              </View>
            </View>
            <View
              style={{
                flex: 0.15
              }}
            >
              <View
                style={{
                  flex: 0.1,
                  flexDirection: "row"
                }}
              >
                <View style={styles.subHeaderView}>
                  <Feather
                    name="hash"
                    size={moderateScale(20)}
                    style={{
                      color: theme.white,
                      marginLeft: 10,
                      width: moderateScale(20),
                      height: moderateScale(20)
                    }}
                  />
                  <Text style={styles.inputText}>Number of servings</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    flex: 0.5,
                    justifyContent: "space-around"
                  }}
                >
                  <TouchableOpacity
                    style={styles.plusButton}
                    onPress={() => this.handleMinusDose()}
                  >
                    <Text style={styles.loginButtonText}>-</Text>
                  </TouchableOpacity>

                  <View style={styles.inputView_2}>
                    <TextInput
                      style={styles.inputText_2}
                      value={this.state.number_of_servings.toString()}
                      placeholderTextColor="#003f5c"
                      keyboardType="numeric"
                      onChangeText={text =>
                        this.setState({ number_of_servings: text })
                      }
                      maxLength={9}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.plusButton}
                    onPress={() => this.handlePlusDose()}
                  >
                    <Text style={styles.loginButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/*<View
              style={{
                flex: 0.2,
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
                width: width,
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
                </View>*/}

            <View
              style={{
                flex: 0.1,
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                style={styles.loginGoogleButton}
                onPress={() => this.addFoodLog()}
              >
                <Text style={styles.loginButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {this.renderModalAddnewMeal()}
          <Toast
            ref="toast"
            style={{ backgroundColor: theme.gray }}
            position="bottom"
            positionValue={100}
            fadeInDuration={500}
            fadeOutDuration={500}
          />
        </KeyboardAvoidingView>
      );
    }
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: "center"
  },
  autocompleteContainerBig: {
    flex: 0.5,

    width: "75%",
    //left: 0,
    position: "absolute",
    //top: 0,
    zIndex: 2000
  },
  autocompleteContainer: {
    flex: 0.5,

    width: "65%",
    //left: 0,
    position: "absolute",
    //top: 0,
    zIndex: 2000
  },
  itemText: {
    fontSize: 15,
    margin: 2
  },
  modal: {
    backgroundColor: "white",
    height: moderateScale(200),
    marginHorizontal: 0.01953125 * height,
    borderRadius: 0.0234375 * height
  },
  plusButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    backgroundColor: theme.primary_color_2,
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(35),
    height: moderateScale(35),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  deleteButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    backgroundColor: theme.red,
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(80),
    height: moderateScale(40),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
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
    fontSize: moderateScale(18)
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

  subHeaderView: {
    flex: 0.55,
    height: 40,
    marginHorizontal: 8,
    backgroundColor: theme.primary_color,
    opacity:.7,
    borderRadius: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },

  inputView: {
    flex: 0.05,
    width: "60%",
    height: 40,
    elevation: 10,
    backgroundColor: theme.primary_color_2,
    borderColor: theme.primary_color_2,
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },

  inputView_2: {
    flex: 0.45,
    backgroundColor: theme.white,
    color: theme.primary_color,
    borderColor: theme.primary_color_2,
    borderWidth: 2,
    borderRadius: 10,
    height: 40,
    justifyContent: "center"
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
    marginLeft: 10,

    color: "white",
    fontWeight: "normal"
  },
  inputText_2: {
    fontSize: 0.02 * height,
    textAlign: "center",

    color: theme.black,
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
