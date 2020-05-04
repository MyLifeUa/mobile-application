//This is an example code for Bottom Navigation//
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
//import react in our code.
import {
  View,
  Image,
  Text,
  AsyncStorage,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from "react-native";
const { width, height } = Dimensions.get("screen");
import theme from "../constants/theme.style.js";
import FAB from "react-native-fab";
import Swipeout from "react-native-swipeout";
import moment from "moment";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { ThemeConsumer } from "react-native-elements";
import {NavigationEvents} from 'react-navigation';
const API_URL = "http://mednat.ieeta.pt:8442";

//import all the basic component we have used

export default class FoodLog extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
    this.state = {
      //refreshes
      refresh: false,
      loading: true,
      SharedLoading: true,

      //credentials
      user_email: "",
      user_token: "",

      //request
      data: {
        total_calories: 0,
        calories_goal: 0,
        calories_left: 0,
        breakfast: {
          total_calories: 0,
          meals: []
        },
        lunch: {
          total_calories: 0,
          meals: []
        },
        dinner: {
          total_calories: 0,
          meals: []
        },
        snack: {
          total_calories: 0,
          meals: []
        }
      },

      //selected day
      current_day: moment(new Date()).format("YYYY-MM-DD")
    };
  }

  async componentDidMount() {
    await this._retrieveData(); //TODO uncomment this
    console.log("Im back")
    //this.getLogs()
    if (!this.state.SharedLoading) {
      this.getLogs();
    }
  }

  async processInvalidToken() {
    this._removeData();
    this.props.navigation.navigate("Auth");
  }

  _removeData = async () => {
    // TODO Remove Fitbit flag
  };

  async processResponse(response) {
    console.log("Hello");
    const statusCode = response.status;
    const data = response.json();
    const res = await Promise.all([statusCode, data]);
    return {
      statusCode: res[0],
      responseJson: res[1]
    };
  }

  handleNewLog = async flag => {
    // if flag is positive then increment one day, if not decrease
    if (flag == true) {
      await this.setState({
        loading: true,
        current_day: moment(this.state.current_day)
          .add(1, "days")
          .format("YYYY-MM-DD")
      });
    } else {
      await this.setState({
        loading: true,

        current_day: moment(this.state.current_day)
          .add(-1, "days")
          .format("YYYY-MM-DD")
      });
    }

    //after new value is changes, refresh values
    await this.getLogs();
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

  //GET Request
  getLogs() {
    console.log(`${API_URL}/food-logs/${this.state.current_day}`);
    fetch(`${API_URL}/food-logs/${this.state.current_day}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.user_token
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (json.state == "Error") {
          alert(json.message);
        } else {
          // Success
          this.setState({
            data: json.message,
            refresh: false,
            loading: false
            //if this doesnt work, change to individual attribution
          });

          console.log("New state");
          console.log(this.state.data);
        }
      })
      .catch(error => {
        alert("Error adding Food Log.");
        console.error(error);
      });
  }

  deleteFoodLog(food_log_id) {
    //unsecure way to send a post
    var login_info = "Token " + this.state.user_token;
    console.log(`${API_URL}/food-logs/${food_log_id}`);

    fetch(`${API_URL}/food-logs/${food_log_id}`, {
      method: "DELETE",
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
        } else {
          console.log(responseJson);
          if (responseJson.state == "Error") {
            alert(responseJson.message);
          } else {
            //this.refs.toast.show("Food Log deleted 💯", DURATION.LENGTH_LONG);
            this.handleRefresh();
          }
        }
      })
      .catch(error => {
        //this.handleRefresh()
        alert("Error deleting Food Log.");
        console.error(error);
      });
  }

  //takes in meals as an array argument and renders it
  renderScrollMeals(meals_array) {
    if (meals_array.length == 0) {
      return (
        <View
          style={{
            flex: 1,
            flexGrow: 1,
            height: verticalScale(50),
            backgroundColor: "white",
            borderRadius: 10,
            borderColor: theme.gray2,
            borderBottomWidth: 4,
            borderLeftWidth: 4,
            borderRightWidth: 4
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                flexDirection: "column",
                flex: 4,
                alignContent: "center",
                justifyContent: "center",
                paddingHorizontal: moderateScale(5)
              }}
            >
              <Text style={{ fontSize: theme.header }}>
                No registered meals
              </Text>
            </View>

            <View
              style={{
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center",
                paddingHorizontal: moderateScale(5)
              }}
            >
              <Text style={{ fontSize: theme.header }}>0</Text>
            </View>
          </View>
        </View>
      );
    } else {
      return meals_array.map(meal => {
        let swipeBtns = [
          {
            text: "Delete",
            backgroundColor: "red",
            underlayColor: "rgba(0, 0, 0, 1, 0.6)",
            onPress: () => {
              this.deleteFoodLog(meal["id"]);
            }
          }
        ];
        return (
          /*
          <View style={{flexDirection:'row',alignContent:'flex-start',justifyContent:'flex-start',paddingLeft:moderateScale(5)}}>
            <Text style={{fontSize:theme.header}}>{meal.number_of_servings}x {meal.meal_name} with {meal.calories.toFixed(1)} kcal</Text>
          </View>
          */
          <Swipeout
            right={swipeBtns}
            backgroundColor="transparent"
            style={{ margin: 4 }}
          >
            <View
              style={{
                flex: 1,
                flexGrow: 1,
                height: verticalScale(50),
                backgroundColor: "white",
                borderRadius: 10
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    flexDirection: "column",
                    flex: 4,
                    alignContent: "flex-start",
                    justifyContent: "flex-start",
                    paddingHorizontal: moderateScale(5)
                  }}
                >
                  <Text style={{ fontSize: theme.header, fontWeight: "bold" }}>
                    {meal.meal_name}
                  </Text>
                  <Text style={{ fontSize: theme.header }}>
                    {meal.meal_category}, {meal.number_of_servings} servings
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "column",
                    alignContent: "center",
                    justifyContent: "center",
                    paddingHorizontal: moderateScale(5)
                  }}
                >
                  <Text style={{ fontSize: theme.header }}>
                    {meal.calories.toFixed(0)}
                  </Text>
                </View>
              </View>
            </View>
          </Swipeout>
        );
      });
    }
  }

  renderLeftCalories() {
    if (this.state.data.calories_left > 0) {
      return (
        <Text
          style={{ fontSize: theme.h2, color: theme.red, fontWeight: "bold" }}
        >
          -{this.state.data.calories_left}
        </Text>
      );
    } else {
      return (
        <Text
          style={{ fontSize: theme.h2, color: "green", fontWeight: "bold" }}
        >
          {this.state.data.calories_left.toString().split("-")}
        </Text>
      );
    }
  }

  handleRefresh = () => {
    // Refresh a zona de filtros tambem?
    this.setState(
      {
        refresh: true
      },
      () => {
        this.getLogs();
      }
    );
  };

  handlePossibleRefresh = () => {
    let refresh=this.props.navigation.getParam("refresh",null)

    if(refresh){
      this.handleRefresh()
    }

  }

  renderMealsComponent = (data,type) => {
    if (this.state.loading) {
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
    } else {
      return (
        <View>
          <View style={{}}>{this.renderScrollMeals(data)}</View>
          <TouchableOpacity
            style={{
              flex: 4,
              alignContent: "flex-start",
              justifyContent: "flex-start",
              bottomBorderRadius: 10,
              flexDirection: "row",
              paddingLeft: moderateScale(10),
              paddingVertical: moderateScale(10)
            }}
            onPress={() =>
              this.props.navigation.navigate("FoodLogRegister", {
                date:this.state.current_day,
                food_log_type:type
              })
            }
          >
            <AntDesign
              name="plus"
              size={moderateScale(15)}
              color={theme.primary_color_2}
              style={{
                alignContent: "center",
                alignSelf: "center"
              }}
            />

            <Text
              style={{
                margin: moderateScale(5),
                fontSize: theme.h4,
                color: theme.primary_color_2,
                fontWeight: "bold"
              }}
            >
              Add Food
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  render() {
    return (
      /* Parent View */
      
      <View style={{ flex: 1, padding: moderateScale(10) }}>
        {/* Day selected */}
        <View
          style={{
            flex: 0.08,
            backgroundColor: theme.primary_color_2,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              flex: 1,
              alignContent: "space-around",
              justifyContent: "space-around",
              flexDirection: "row"
            }}
          >
            {/* Align Vertically*/}
            <View
              style={{
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center"
              }}
            >
              <TouchableOpacity onPress={() => this.handleNewLog(false)}>
                <Text
                  style={{
                    fontSize: theme.h1,
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  {"<"}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  fontSize: theme.header,
                  color: "white",
                  fontWeight: "bold"
                }}
              >
                {this.state.current_day}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center"
              }}
            >
              <TouchableOpacity onPress={() => this.handleNewLog(true)}>
                <Text
                  style={{
                    fontSize: theme.h1,
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  {">"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Calories intake */}
        <View
          style={{
            height: verticalScale(100),
            marginTop: verticalScale(10),
            backgroundColor: theme.gray2,
            flexDirection: "column",
            borderRadius: 10,
            elevation: 5
          }}
        >
          {/* Calories intake text */}
          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            <Text
              style={{
                padding: moderateScale(10),
                fontSize: theme.h3,
                color: "black",
                fontWeight: "bold"
              }}
            >
              Calories Intake
            </Text>
          </View>

          {/* Calories intake numbers */}
          <View
            style={{
              alignContent: "space-around",
              justifyContent: "space-around",
              flexDirection: "row"
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  paddingHorizontal: moderateScale(10),
                  fontSize: theme.h2,
                  color: "black",
                  fontWeight: "bold"
                }}
              >
                {this.state.data.calories_goal}
              </Text>
              <Text
                style={{
                  marginLeft: moderateScale(10),
                  marginBottom: moderateScale(30),
                  fontSize: theme.header,
                  color: "black"
                }}
              >
                Goal
              </Text>
            </View>

            <Text
              style={{
                padding: moderateScale(10),
                fontSize: theme.h2,
                color: "black"
              }}
            >
              -
            </Text>

            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  paddingHorizontal: moderateScale(10),
                  fontSize: theme.h2,
                  color: "black",
                  fontWeight: "bold"
                }}
              >
                {this.state.data.total_calories}
              </Text>
              <Text
                style={{
                  marginLeft: moderateScale(10),
                  marginBottom: moderateScale(30),
                  fontSize: theme.header,
                  color: "black"
                }}
              >
                Consumed
              </Text>
            </View>

            <Text
              style={{
                padding: moderateScale(10),
                fontSize: theme.h2,
                color: "black"
              }}
            >
              =
            </Text>

            <View
              style={{
                flexDirection: "column",
                paddingHorizontal: moderateScale(10)
              }}
            >
              {this.renderLeftCalories()}
              <Text
                style={{
                  marginBottom: moderateScale(30),
                  fontSize: theme.header,
                  color: "black"
                }}
              >
                Remaining
              </Text>
            </View>
          </View>
        </View>

        {/* Scrollview */}
        <ScrollView
          style={{
            flex: 2,
            backgroundColor: "white",
            marginTop: verticalScale(10)
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={this.handleRefresh}
            />
          }
        >
          {/* Day selected */}
          <View
            style={{
              minHeight: verticalScale(40),
              flexGrow: 2,
              marginVertical: verticalScale(5),
              borderColor: theme.gray2,
              backgroundColor: theme.gray2,
              borderRadius: 10,
              elevation: 2
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flex: 4,
                  alignContent: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                <Text
                  style={{
                    padding: moderateScale(10),
                    fontSize: theme.h3,
                    color: "black",
                    fontWeight: "bold"
                  }}
                >
                  Breakfast
                </Text>
              </View>

              <View
                style={{ alignContent: "flex-end", justifyContent: "flex-end" }}
              >
                <Text
                  style={{
                    padding: moderateScale(10),
                    fontSize: theme.header,
                    color: "black",
                    fontWeight: "bold"
                  }}
                >
                  {this.state.data.breakfast.total_calories}
                </Text>
              </View>
            </View>

            {this.renderMealsComponent(this.state.data.breakfast.meals,"Breakfast")}
          </View>

          {/* Day selected */}
          <View
            style={{
              minHeight: verticalScale(40),
              flexGrow: 2,
              marginVertical: verticalScale(5),
              borderColor: theme.gray2,
              backgroundColor: theme.gray2,
              borderRadius: 10,
              elevation: 2
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flex: 4,
                  alignContent: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                <Text
                  style={{
                    padding: moderateScale(10),
                    fontSize: theme.h3,
                    color: "black",
                    fontWeight: "bold"
                  }}
                >
                  Lunch
                </Text>
              </View>

              <View
                style={{ alignContent: "flex-end", justifyContent: "flex-end" }}
              >
                <Text
                  style={{
                    padding: moderateScale(10),
                    fontSize: theme.h3,
                    color: "black",
                    fontWeight: "bold"
                  }}
                >
                  {this.state.data.lunch.total_calories}
                </Text>
              </View>
            </View>

            {this.renderMealsComponent(this.state.data.lunch.meals,"Lunch")}
          </View>

          {/* Day selected */}
          <View
            style={{
              minHeight: verticalScale(40),
              flexGrow: 2,
              marginVertical: verticalScale(5),
              borderColor: theme.gray2,
              backgroundColor: theme.gray2,
              borderRadius: 10,
              elevation: 2
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flex: 4,
                  alignContent: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                <Text
                  style={{
                    padding: moderateScale(10),
                    fontSize: theme.h3,
                    color: "black",
                    fontWeight: "bold"
                  }}
                >
                  Dinner
                </Text>
              </View>

              <View
                style={{ alignContent: "flex-end", justifyContent: "flex-end" }}
              >
                <Text
                  style={{
                    padding: moderateScale(10),
                    fontSize: theme.h3,
                    color: "black",
                    fontWeight: "bold"
                  }}
                >
                  {this.state.data.dinner.total_calories}
                </Text>
              </View>
            </View>

            {this.renderMealsComponent(this.state.data.dinner.meals,"Dinner")}
          </View>

          {/* Day selected */}
          <View
            style={{
              minHeight: verticalScale(40),
              flexGrow: 2,
              marginVertical: verticalScale(5),
              borderColor: theme.gray2,
              backgroundColor: theme.gray2,
              borderRadius: 10,
              elevation: 2
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flex: 4,
                  alignContent: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                <Text
                  style={{
                    padding: moderateScale(10),
                    fontSize: theme.h3,
                    color: "black",
                    fontWeight: "bold"
                  }}
                >
                  Snack
                </Text>
              </View>

              <View
                style={{ alignContent: "flex-end", justifyContent: "flex-end" }}
              >
                <Text
                  style={{
                    padding: moderateScale(10),
                    fontSize: theme.h3,
                    color: "black",
                    fontWeight: "bold"
                  }}
                >
                  {this.state.data.snack.total_calories}
                </Text>
              </View>
            </View>


            {this.renderMealsComponent(this.state.data.snack.meals,"Snack")}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            this.props.navigation.navigate("Nutrients", {
              date: this.state.current_day,
            })
          }
        >
          <AntDesign
                  name={"piechart"}
                  size={moderateScale(30)}
                  color={"white"}
                />
        </TouchableOpacity>



        
        <NavigationEvents onDidFocus={() => this.handlePossibleRefresh()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    backgroundColor: theme.primary_color_2,
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
  loginButtonText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700",
    width: "100%",
    fontSize: moderateScale(25)
  }
});
