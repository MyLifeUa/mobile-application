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
  RefreshControl,
  ActivityIndicator
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { ScrollView, FlatList } from "react-native-gesture-handler";
import themeStyle from "../constants/theme.style.js";
import IngredientItem from "../components/IngredientItem";
import Toast, { DURATION } from "react-native-easy-toast";
import Modal from "react-native-modal";

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
    checkedItems: new Map(),
    refreshing: false,
    isLoading: true,
    SharedLoading: true,
    modalFlag: false,
    calories: "",
    carbs: "",
    fat: "",
    protein: "",
    mealName: "",
    number_of_servings: "",
    choosen_type_of_meal: "",
    new_name: "",
    new_calories: "",
    new_protein: "",
    new_fat: "",
    new_carbs: "",
    checked_ingredients: [],
    dataSourceIngredients: [],
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

  _storeData = async token => {
    console.log("Storing Token: " + token);
    try {
      await AsyncStorage.setItem("token", token);
      this.setState({ user_token: token });
    } catch (error) {
      console.log(error);
    }
  };

  _removeData = async () => {
    // TODO Remove Fitbit flag 
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

  async componentDidMount() {
    await this._retrieveData();


    if (!this.state.SharedLoading) {
      this.getIngredients();
      /*this.setState({
     
        checkedItems: this.props.navigation.state.params.checkedIngredients
      });*/
    }
  }

  handleChange = (id, checked) => {
    this.setState({ checkedItems: this.state.checkedItems.set(id, !checked) });
    this.props.navigation.state.params.updateData(
      this.state.checkedItems,
      this.state.dataSourceIngredients
    );
  };

  handleRefresh = () => {
    // Refresh a zona de filtros tambem?
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.getIngredients();
      }
    );
  };

  async processResponse(response) {
    const statusCode = response.status;
    const data = response.json();
    const res = await Promise.all([statusCode, data]);
    return ({
      statusCode: res[0],
      responseJson: res[1]
    });
  };

  async processInvalidToken () {
    this._removeData()
    this.props.navigation.navigate("Auth");
    

  }

  async getIngredients() {
    var login_info = "Token " + this.state.user_token;
    console.log("adeus");

    fetch(`${API_URL}/ingredients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: login_info
      }
    })
      .then(this.processResponse)
      .then(res => {
        let ingredients = [];

        const { statusCode, responseJson } = res;

        if (statusCode==401){
          this.processInvalidToken()

        }else{
          for (var i = 0; i < responseJson.message.length; i++) {
            console.log(responseJson.message[i])
            ingredients.push({
              id: responseJson.message[i].id,
              Name: responseJson.message[i].name,
              Calories: responseJson.message[i].calories,
              Proteins: responseJson.message[i].proteins,
              Fats: responseJson.message[i].fat,
              Carbs: responseJson.message[i].carbs,
              quantity: 100,
              compare: false
            });
          }
  
          this._storeData(responseJson.token);
  
          this.setState({
            dataSourceIngredients: ingredients,
            refreshing: false,
            isLoading: false,
            checkedItems: this.props.navigation.state.params.checkedIngredients
          });

        }


        
      })
      .catch(error => {
        console.log(error);
        //this._storeData(responseJson.token);
      });
  }

  addIngredient() {
    //console.log(this.state.dataSourceIngredients)
    var login_info = "Token " + this.state.user_token;

    if (
      this.state.new_name == "" ||
      this.state.new_protein == "" ||
      this.state.new_fat == "" ||
      this.state.new_carbs == "" ||
      this.state.new_calories == ""
    ) {
      alert("Fill in the required information!");
    } else {
      fetch(`${API_URL}/ingredients`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: login_info
        },
        body: JSON.stringify({
          //change these params later
          name: this.state.new_name,
          proteins: this.state.new_protein,
          fat: this.state.new_fat,
          carbs: this.state.new_carbs,
          calories: this.state.new_calories
        })
      })
      .then(this.processResponse)
      .then(res => {

        const { statusCode, responseJson } = res;
        console.log(responseJson)

        if (statusCode==401){
          this.processInvalidToken()

        }else{
          this._storeData(responseJson.token);
          if (responseJson.state == "Error") {
            alert(responseJson.message);
          } else {
            this.setState({ modalFlag: false });
            this.handleRefresh();
            this.refs.toast.show("Ingredient saved 💯", DURATION.LENGTH_LONG);
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

  renderModalIngredient() {
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
              Add a new ingredient 🥫
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
              marginLeft: 10,
              marginTop: 10
            }}
          >
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Name"
                returnKeyType="next"
                onSubmitEditing={() => this.caloriesInput.focus()}
                onChangeText={text => this.setState({ new_name: text })}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Calories (cal)"
                maxLength={3}
                keyboardType={"numeric"}
                returnKeyType="next"
                onSubmitEditing={() => this.proteinsInput.focus()}
                ref={input => (this.caloriesInput = input)}
                onChangeText={text => this.setState({ new_calories: text })}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Proteins (g)"
                maxLength={3}
                keyboardType={"numeric"}
                returnKeyType="next"
                onSubmitEditing={() => this.fatInput.focus()}
                ref={input => (this.proteinsInput = input)}
                onChangeText={text => this.setState({ new_protein: text })}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Fat (g)"
                maxLength={3}
                keyboardType={"numeric"}
                returnKeyType="next"
                onSubmitEditing={() => this.carbsInput.focus()}
                ref={input => (this.fatInput = input)}
                onChangeText={text => this.setState({ new_fat: text })}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Carbs (g)"
                maxLength={3}
                keyboardType={"numeric"}
                returnKeyType="done"
                onSubmitEditing={() => this.addIngredient()}
                ref={input => (this.carbsInput = input)}
                onChangeText={text => this.setState({ new_carbs: text })}
              />
            </View>
          </View>

          <View
            style={{
              flex: 0.3,
              justifyContent: "space-around",
              alignItems: "flex-start",
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              style={styles.CancelButton}
              onPress={() => this.setState({ modalFlag: false })}
            >
              <Text style={styles.loginButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.SaveButton}
              onPress={() => this.addIngredient()}
            >
              <Text style={styles.loginButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

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

  renderItem = ({ item, index }) => {
    console.log("Itens: " + item.fat);

    return (
      <IngredientItem
        Calories={item.Calories}
        quantity={item.quantity}
        Carbs={item.Carbs}
        Proteins={item.Proteins}
        Fats={item.Fats}
        Name={item.Name}
        position={index}
        id={item.id}
        checked={this.state.checkedItems.get(item.id)}
        change={this.handleChange}
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
      <View style={{ flex: 1 }}>
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
          {this.renderList()}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              this.setState({ modalFlag: true });
            }}
          >
            <Text style={styles.loginButtonText}>+</Text>
          </TouchableOpacity>

          {this.renderModalIngredient()}

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
  customBttnV4: {
    width: moderateScale(130),
    height: moderateScale(30),
    borderColor: theme.primary_color,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4
  },
  customBttnV5: {
    width: moderateScale(130),
    height: moderateScale(30),
    backgroundColor: theme.primary_color,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4
  },
  modalContainer: {
    margin: 0,
    justifyContent: "center"
  },
  modal: {
    backgroundColor: "white",
    height: moderateScale(350),
    marginHorizontal: 0.01953125 * height,
    borderRadius: 0.0234375 * height
  },
  buttonContainerV2: {
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    flexDirection: "row"
  },
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
    //marginTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight,
    flex: 1
    //backgroundColor: theme.primary_color,
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
    height: 20,
    marginBottom: 20,
    justifyContent: "center",
    padding: 15
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
