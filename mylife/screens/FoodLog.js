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
      user_token: '',

      //request
      data_source : null,

      //selected day
      current_day

    }
  }

  async componentDidMount() {
    //await this._retrieveData(); TODO uncomment this

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

  render() {
    return (
        /* Parent View */
        <View style={{flex:1, padding:moderateScale(10)}}>
            {/* Day selected */}
            <View style={{flex:0.08,backgroundColor:theme.green,flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
              {/* Align Vertically*/}
              <View style={{flexDirection:'column', alignContent:'center',justifyContent:'center'}}>
                <Text style={{fontSize:theme.header,color:'white',fontWeight:'bold'}}>Today</Text>
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
                <Text style={{padding:moderateScale(10),fontSize:theme.h2,color:'black',fontWeight:'bold'}}>2890</Text>
                <Text style={{padding:moderateScale(10),fontSize:theme.h2,color:'black'}}>-</Text>
                <Text style={{padding:moderateScale(10),fontSize:theme.h2,color:'black',fontWeight:'bold'}}>0</Text>
                <Text style={{padding:moderateScale(10),fontSize:theme.h2,color:'black'}}>=</Text>
                <Text style={{padding:moderateScale(10),fontSize:theme.h2,color:'black',fontWeight:'bold'}}>2890</Text>
              </View>
            </View>

            {/* Scrollview */}
            <ScrollView style={{flex:2,backgroundColor:'white', marginTop:verticalScale(5),}}>
              {/* Day selected */}
              <View style={{height:verticalScale(150),marginVertical:verticalScale(5),backgroundColor:theme.gray2}}>
                <Text style={{padding:moderateScale(10),fontSize:theme.header,color:'black',fontWeight:'bold'}}>Breakfast</Text>

              </View>

              {/* Day selected */}
              <View style={{height:verticalScale(150),marginVertical:verticalScale(5),backgroundColor:theme.gray2}}>
                <Text style={{padding:moderateScale(10),fontSize:theme.header,color:'black',fontWeight:'bold'}}>Lunch</Text>

              </View>

              {/* Day selected */}
              <View style={{height:verticalScale(150),marginVertical:verticalScale(5),backgroundColor:theme.gray2}}>
                <Text style={{padding:moderateScale(10),fontSize:theme.header,color:'black',fontWeight:'bold'}}>Snacks</Text>

              </View>

              {/* Day selected */}
              <View style={{height:verticalScale(150),marginVertical:verticalScale(5),backgroundColor:theme.gray2}}>
                <Text style={{padding:moderateScale(10),fontSize:theme.header,color:'black',fontWeight:'bold'}}>Dinner</Text>

              </View>

            </ScrollView>

          <FAB buttonColor={theme.green} iconTextColor="#FFFFFF" onClickAction={() => {this.props.navigation.navigate('FoodLogRegister')}} visible={true} />
        </View>
    );
  }
}

const styles = StyleSheet.create({
});