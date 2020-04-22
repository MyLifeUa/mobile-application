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
    Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('screen');
import theme from '../constants/theme.style.js';
import FAB from 'react-native-fab'
import { TouchableOpacity } from 'react-native-gesture-handler';

import moment from 'moment'

const API_URL = "http://mednat.ieeta.pt:8442";

//import all the basic component we have used

export default class FoodLog extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
    this.state = {
      //refreshes
      refreshing: false,
      SharedLoading: true,

      //credentials
      user_email: '',
      user_token: 'a950f777fcc77d3a109210cedbfca69d7c5a9f8e',

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
    //await this._retrieveData(); TODO uncomment this

    if (!this.state.SharedLoading) {
      this.getLogs();
    }
  }

  handleNewLog(flag) {
    // if flag is positive then increment one day, if not decrease
    if (flag==true) {
      this.setState({
        current_day: moment(this.state.current_day).add(1,"days")
      })
    } else {
      this.setState({
        current_day: moment(this.state.current_day).add(-1,"days")
      })
    }
    //after new value is changes, refresh values
    this.getLogs()
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
                    data: json.message
                    //if this doesnt work, change to individual attribution
                })
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
        <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center', marginTop:verticalScale(15)}}>
          <Text style={{padding:moderateScale(10),fontSize:theme.header,color:'black'}}>No registered meals</Text>
        </View>
      )
    } else {
      return(
        <Text style={{padding:moderateScale(10),fontSize:theme.h2,color:'black'}}>Registered meals</Text>
      )    
    }
  }

  renderLeftCalories(){
    if (this.state.data.calories_left > 0) {
      return(
        <Text style={{fontSize:theme.h2,color:'red',fontWeight:'bold'}}>{this.state.data.calories_left}</Text>
      )
    } else {
      return(
        <Text style={{fontSize:theme.h2,color:'green',fontWeight:'bold'}}>{this.state.data.calories_left}</Text>
      )
    }
  }

  render() {
    return (
        /* Parent View */
        <View style={{flex:1, padding:moderateScale(10)}}>
            {/* Day selected */}
            <View style={{flex:0.08,backgroundColor:theme.green,flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
              {/* Align Vertically*/}
              <View style={{flexDirection:'column', alignContent:'center',justifyContent:'center'}}>
                <Text style={{fontSize:theme.header,color:'white',fontWeight:'bold'}}>{this.state.current_day}</Text>
              </View>
            </View>

            
            {/* Calories intake */}
            <View style={{height:verticalScale(100),marginTop:verticalScale(10),backgroundColor:theme.gray2,flexDirection:'column'}}>
              {/* Calories intake text */}
              <View style={{ alignContent:'center', justifyContent:'center',flexDirection:'row'}}>
                <Text style={{padding:moderateScale(10),fontSize:theme.header,color:'black',fontWeight:'bold'}}>Calories Intake</Text>
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
                  <Text style={{marginBottom:moderateScale(30),fontSize:theme.header,color:'black'}}>Missing</Text>
                </View>

              </View>
            </View>

            {/* Scrollview */}
            <ScrollView style={{flex:2,backgroundColor:'white', marginTop:verticalScale(5),}}>
              {/* Day selected */}
              <View style={{height:verticalScale(150),marginVertical:verticalScale(5),backgroundColor:theme.gray2}}>
                <View style={{flexDirection:'row', alignContent:'space-around', justifyContent:'space-around'}}>
                  <Text style={{padding:moderateScale(10),fontSize:theme.h3,color:'black',fontWeight:'bold'}}>Breakfast</Text>
                  <Text style={{padding:moderateScale(10),fontSize:theme.header,color:'black'}}>Total calories: {this.state.data.breakfast.total_calories}</Text>
                </View>
                
                {this.renderScrollMeals(this.state.data.breakfast.meals)}

              </View>

              {/* Day selected */}
              <View style={{height:verticalScale(150),marginVertical:verticalScale(5),backgroundColor:theme.gray2}}>
                <View style={{flexDirection:'row', alignContent:'space-around', justifyContent:'space-around'}}>
                  <Text style={{padding:moderateScale(10),fontSize:theme.h3,color:'black',fontWeight:'bold'}}>Lunch</Text>
                  <Text style={{padding:moderateScale(10),fontSize:theme.header,color:'black'}}>Total calories: {this.state.data.lunch.total_calories}</Text>
                </View>
                
                {this.renderScrollMeals(this.state.data.lunch.meals)}

              </View>

              {/* Day selected */}
              <View style={{height:verticalScale(150),marginVertical:verticalScale(5),backgroundColor:theme.gray2}}>
                <View style={{flexDirection:'row', alignContent:'space-around', justifyContent:'space-around'}}>
                  <Text style={{padding:moderateScale(10),fontSize:theme.h3,color:'black',fontWeight:'bold'}}>Snack</Text>
                  <Text style={{padding:moderateScale(10),fontSize:theme.header,color:'black'}}>Total calories: {this.state.data.snack.total_calories}</Text>
                </View>
                
                {this.renderScrollMeals(this.state.data.snack.meals)}

              </View>

              {/* Day selected */}
              <View style={{height:verticalScale(150),marginVertical:verticalScale(5),backgroundColor:theme.gray2}}>
                <View style={{flexDirection:'row', alignContent:'space-around', justifyContent:'space-around'}}>
                  <Text style={{padding:moderateScale(10),fontSize:theme.h3,color:'black',fontWeight:'bold'}}>Dinner</Text>
                  <Text style={{padding:moderateScale(10),fontSize:theme.header,color:'black'}}>Total calories: {this.state.data.dinner.total_calories}</Text>
                </View>
                
                {this.renderScrollMeals(this.state.data.dinner.meals)}

              </View>

            </ScrollView>

          <FAB buttonColor={theme.green} iconTextColor="#FFFFFF" onClickAction={() => {this.props.navigation.navigate('FoodLogRegister')}} visible={true} />
        </View>
    );
  }
}

const styles = StyleSheet.create({
});