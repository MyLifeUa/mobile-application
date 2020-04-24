//This is an example code for Bottom Navigation//
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
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
    RefreshControl
} from 'react-native';
const { width, height } = Dimensions.get('screen');
import theme from '../constants/theme.style.js';
import FAB from 'react-native-fab'
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';

import moment from 'moment'

const API_URL = "http://mednat.ieeta.pt:8442";

//import all the basic component we have used

export default class FoodLog extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
    this.state = {
      //refreshes
      refresh: false,
      SharedLoading: true,

      //credentials
      user_email: '',
      user_token: '',

      //request
      data : {
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

    }
  }

  async componentDidMount() {
    await this._retrieveData(); //TODO uncomment this
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
    const statusCode = response.status;
    const data = response.json();
    const res = await Promise.all([statusCode, data]);
    return {
      statusCode: res[0],
      responseJson: res[1]
    };
  }


  handleNewLog = async (flag) => {



    // if flag is positive then increment one day, if not decrease
    if (flag==true) {
      await this.setState({
        current_day: moment(this.state.current_day).add(1,"days").format("YYYY-MM-DD")
      })
    } else {
      await this.setState({
        current_day: moment(this.state.current_day).add(-1,"days").format("YYYY-MM-DD")
      })
    }
    
    //after new value is changes, refresh values
    await this.getLogs()

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

  //GET Request
  getLogs(){

    console.log(`${API_URL}/food-logs/${this.state.current_day}`)
    fetch(`${API_URL}/food-logs/${this.state.current_day}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "Authorization": "Token " + this.state.user_token
        }
      }).then((response) => response.json())
      .then((json) => {
            console.log(json);
            if (json.state == "Error"){
                alert(json.message)
            }
            else { 
                // Success
                this.setState({
                    data: json.message,
                    refresh: false
                    //if this doesnt work, change to individual attribution
                })
                console.log("New state")
                console.log(this.state.data)
            }
      })
      .catch((error) => {
          alert("Error adding Food Log.")
          console.error(error);
      });

  }

  //takes in meals as an array argument and renders it
  renderScrollMeals(meals_array) {
    if (meals_array.length == 0) { 
      return(
        <View style={{flex:1, flexGrow:1, height:verticalScale(50) ,backgroundColor:'white',borderColor:theme.gray2,borderBottomWidth:4,borderLeftWidth:4,borderRightWidth:4}}>
            <View style={{flexDirection:'row'}}>
              <View style={{flexDirection:'column',flex:4,alignContent:'center',justifyContent:'center', paddingHorizontal:moderateScale(5)}}>            
                <Text style={{fontSize:theme.header}}>No registered meals</Text>
              </View>

              <View style={{flexDirection:'column', alignContent:'center', justifyContent:'center',paddingHorizontal:moderateScale(5)}}>
                <Text style={{fontSize:theme.header}}>0</Text>
              </View>

            </View>
        </View>
      )
    } else {
      return meals_array.map( meal => {
        return(
          /*
          <View style={{flexDirection:'row',alignContent:'flex-start',justifyContent:'flex-start',paddingLeft:moderateScale(5)}}>
            <Text style={{fontSize:theme.header}}>{meal.number_of_servings}x {meal.meal_name} with {meal.calories.toFixed(1)} kcal</Text>
          </View>
          */
          <View style={{flex:1, flexGrow:1, height:verticalScale(50) ,backgroundColor:'white',borderColor:theme.gray2,borderBottomWidth:4,borderLeftWidth:4,borderRightWidth:4}}>
            <View style={{flexDirection:'row'}}>
              <View style={{flexDirection:'column',flex:4,alignContent:'flex-start',justifyContent:'flex-start', paddingHorizontal:moderateScale(5)}}>
                <Text style={{fontSize:theme.header,fontWeight:'bold'}}>{meal.meal_name}</Text>
                <Text style={{fontSize:theme.header}}>{meal.meal_category}, {meal.number_of_servings} servings</Text>
              </View>

              <View style={{flexDirection:'column', alignContent:'center', justifyContent:'center',paddingHorizontal:moderateScale(5)}}>
                <Text style={{fontSize:theme.header}}>{meal.calories.toFixed(0)}</Text>
              </View>

            </View>
          </View>

  
        )
      }); 
    }
  }

  renderLeftCalories(){
    if (this.state.data.calories_left > 0) {
      return(
        <Text style={{fontSize:theme.h2,color:theme.red,fontWeight:'bold'}}>-{this.state.data.calories_left}</Text>
      )
    } else {
      return(
        <Text style={{fontSize:theme.h2,color:'green',fontWeight:'bold'}}>{this.state.data.calories_left.toString().split("-")}</Text>
      )
    }
  }

  handleRefresh = () => {
    // Refresh a zona de filtros tambem?
    this.setState(
      {
        refresh: true
      },
      () => {
        this.getLogs()
      }
    );
  };


  render() {
    return (
        /* Parent View */
        <View style={{flex:1, padding:moderateScale(10)}}>
            {/* Day selected */}
            <View style={{flex:0.08,backgroundColor:theme.primary_color_2,flexDirection:'row'}}>
              <View style={{flex:1,alignContent:'space-around', justifyContent:'space-around',flexDirection:'row'}}>
                {/* Align Vertically*/}
                <View style={{flexDirection:'column', alignContent:'center',justifyContent:'center'}}>
                  <TouchableOpacity onPress={() => this.handleNewLog(false)}>
                    <Text style={{fontSize:theme.h1,color:'white',fontWeight:'bold'}}>{'<'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={{flexDirection:'column', alignContent:'center',justifyContent:'center'}}>
                  <Text style={{fontSize:theme.header,color:'white',fontWeight:'bold'}}>{this.state.current_day}</Text>
                </View>

                <View style={{flexDirection:'column', alignContent:'center',justifyContent:'center'}}>
                  <TouchableOpacity onPress={() => this.handleNewLog(true)}>
                    <Text style={{fontSize:theme.h1,color:'white',fontWeight:'bold'}}>{'>'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            
            {/* Calories intake */}
            <View style={{height:verticalScale(100),marginTop:verticalScale(10),backgroundColor:theme.gray2,flexDirection:'column'}}>
              {/* Calories intake text */}
              <View style={{ alignContent:'center', justifyContent:'center',flexDirection:'row'}}>
                <Text style={{padding:moderateScale(10),fontSize:theme.h3,color:'black',fontWeight:'bold'}}>Calories Intake</Text>
              </View>

              {/* Calories intake numbers */}
              <View style={{ alignContent:'space-around', justifyContent:'space-around',flexDirection:'row'}}>
                
                <View style={{flexDirection:'column'}}>
                  <Text style={{paddingHorizontal:moderateScale(10),fontSize:theme.h2,color:'black',fontWeight:'bold'}}>{this.state.data.calories_goal}</Text>
                  <Text style={{marginLeft:moderateScale(10),marginBottom:moderateScale(30),fontSize:theme.header,color:'black'}}>Goal</Text>
                </View>

                <Text style={{padding:moderateScale(10),fontSize:theme.h2,color:'black'}}>-</Text>
                
                <View style={{flexDirection:'column'}}>
                  <Text style={{paddingHorizontal:moderateScale(10),fontSize:theme.h2,color:'black',fontWeight:'bold'}}>{this.state.data.total_calories}</Text>
                  <Text style={{marginLeft:moderateScale(10),marginBottom:moderateScale(30),fontSize:theme.header,color:'black'}}>Consumed</Text>
                </View>
                
                <Text style={{padding:moderateScale(10),fontSize:theme.h2,color:'black'}}>=</Text>
                
                <View style={{flexDirection:'column',paddingHorizontal:moderateScale(10)}}>
                  {this.renderLeftCalories()}
                  <Text style={{marginBottom:moderateScale(30),fontSize:theme.header,color:'black'}}>Remaining</Text>
                </View>

              </View>
            </View>

            {/* Scrollview */}
            <ScrollView 
              style={{flex:2,backgroundColor:'white', marginTop:verticalScale(10),}}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refresh}
                  onRefresh={this.handleRefresh}
                />}
              >
              {/* Day selected */}
              <View style={{minHeight:verticalScale(40),flexGrow:2,marginBottom:verticalScale(5),backgroundColor:theme.gray2}}>
                <View style={{flexDirection:'row'}}>
                  <View style={{ flex:4,alignContent:'flex-start', justifyContent:'flex-start'}}>
                    <Text style={{padding:moderateScale(10),fontSize:theme.h3,color:'black',fontWeight:'bold'}}>Breakfast</Text>
                  </View>

                  <View style={{alignContent:'flex-end', justifyContent:'flex-end'}}>
                    <Text style={{padding:moderateScale(10),fontSize:theme.header,color:'black',fontWeight:'bold'}}>{this.state.data.breakfast.total_calories}</Text>
                  </View>
                </View>
                
                <View style={{}}>
                  {this.renderScrollMeals(this.state.data.breakfast.meals)}
                </View>

              </View>

              {/* Day selected */}
              <View style={{minHeight:verticalScale(40),marginVertical:verticalScale(5),backgroundColor:theme.gray2}}>
                <View style={{flexDirection:'row'}}>
                  <View style={{ flex:4,alignContent:'flex-start', justifyContent:'flex-start'}}>
                    <Text style={{padding:moderateScale(10),fontSize:theme.h3,color:'black',fontWeight:'bold'}}>Lunch</Text>
                  </View>

                  <View style={{alignContent:'flex-end', justifyContent:'flex-end'}}>
                    <Text style={{padding:moderateScale(10),fontSize:theme.h3,color:'black',fontWeight:'bold'}}>{this.state.data.lunch.total_calories}</Text>
                  </View>
                </View>
                
                <View style={{}}>
                  {this.renderScrollMeals(this.state.data.lunch.meals)}
                </View>

              </View>

              {/* Day selected */}
              <View style={{minHeight:verticalScale(40),marginVertical:verticalScale(5),backgroundColor:theme.gray2}}>
                <View style={{flexDirection:'row'}}>
                  <View style={{ flex:4,alignContent:'flex-start', justifyContent:'flex-start'}}>
                    <Text style={{padding:moderateScale(10),fontSize:theme.h3,color:'black',fontWeight:'bold'}}>Snack</Text>
                  </View>

                  <View style={{alignContent:'flex-end', justifyContent:'flex-end'}}>
                    <Text style={{padding:moderateScale(10),fontSize:theme.h3,color:'black',fontWeight:'bold'}}>{this.state.data.snack.total_calories}</Text>
                  </View>
                </View>
                
                <View style={{}}>
                  {this.renderScrollMeals(this.state.data.snack.meals)}
                </View>

              </View>

              {/* Day selected */}
              <View style={{minHeight:verticalScale(40),marginVertical:verticalScale(5),backgroundColor:theme.gray2}}>
                <View style={{flexDirection:'row'}}>
                  <View style={{ flex:4,alignContent:'flex-start', justifyContent:'flex-start'}}>
                    <Text style={{padding:moderateScale(10),fontSize:theme.h3,color:'black',fontWeight:'bold'}}>Dinner</Text>
                  </View>

                  <View style={{alignContent:'flex-end', justifyContent:'flex-end'}}>
                    <Text style={{padding:moderateScale(10),fontSize:theme.h3,color:'black',fontWeight:'bold'}}>{this.state.data.dinner.total_calories}</Text>
                  </View>
                </View>
                
                <View style={{}}>
                  {this.renderScrollMeals(this.state.data.dinner.meals)}
                </View>

              </View>

            </ScrollView>

          <FAB buttonColor={theme.primary_color_2} iconTextColor="#FFFFFF" onClickAction={() => {this.props.navigation.navigate('FoodLogRegister')}} visible={true} />
        </View>
    );
  }
}

const styles = StyleSheet.create({
});