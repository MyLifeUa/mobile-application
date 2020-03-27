
//This is an example code for Bottom Navigation//
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../constants/theme.style.js';
import URIs from '../constants/baseURIs';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import usersList from '../data/users'
//import react in our code.
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('screen');
//import all the basic component we have used


export default class Login extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
    this.users = usersList;
    this.user_id = 0;
    this.state = {
        fetched: false,
        measures: {
            currentWeight: null,
            date: null,
            caloriesBMR: null,
            caloriesOut: null,
            heartRate:null,
            sedentaryMinutes: null,
            steps: null
        }
    }
  }

  componentDidMount(){
      //get the info of the user as soon as page loads
      this.getMeasures()
  }

  getMeasures() {

    console.log(URIs.fitbit.baseURI + "fitbit/");
    fetch(URIs.fitbit.baseURI + "fitbit/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({
                fetched: true,
                measures: {
                    currentWeight: data[0].currentWeight + " kg",
                    date: data[0].date,
                    caloriesBMR: data[0].caloriesBMR,
                    caloriesOut: data[0].caloriesOut,
                    sedentaryMinutes: data[0].sedentaryMinutes,
                    steps: data[0].steps,
                    goalWeight: data[0].goalWeight + " kg",
                    heartRate: data[0].heartRate,
                    age: data[0].age,
                    avatar: data[0].avatar,
                    dateOfBirth: data[0].dateOfBirth,
                    fullName: data[0].fullName,
                    gender: data[0].gender,
                    height: data[0].height + " cm"
                }
            })
        })
        .catch(error => {
            console.log("GET ERROR: " + error);
        })

}

  render() {
    return (
        <View style={{flex:1}}>
            <View
            style={{backgroundColor:theme.primary_color,flex:1.2, flexDirection:'column' ,justifyContent:'center', alignContent:'center'}}>
                <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center',}}>
                    <Image style={{
                        width: moderateScale(80),
                        height: moderateScale(80),
                        borderColor:'white',
                        resizeMode: 'contain',
                        }} source={require('../assets/tomas.png')} />
                </View>
                
                    <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center'}}><Text style={{fontSize:theme.h2,color:theme.white,fontWeight:'bold'}}>Vasco Ramos</Text></View>
                
                <View style={{flexDirection:'row' ,justifyContent:'space-between', alignContent:'space-between', padding:scale(20)}}>
                        <View style={{flexDirection:'column' ,justifyContent:'space-between', alignContent:'space-between'}}>
                            <Text style={{fontSize:theme.header,color:theme.white,fontWeight:'bold'}}>Steps</Text>
                    <Text style={{fontSize:theme.body,color:theme.white}}>861</Text>
                        </View>

                        <View style={{flexDirection:'column' ,justifyContent:'space-between', alignContent:'space-between'}}>
                            <Text style={{fontSize:theme.header,color:theme.white,fontWeight:'bold'}}>Heartrate</Text>
                            <Text style={{fontSize:theme.body,color:theme.white}}>54</Text>
                        </View>

                        <View style={{flexDirection:'column' ,justifyContent:'space-between', alignContent:'space-between'}}>
                            <Text style={{fontSize:theme.header,color:theme.white,fontWeight:'bold'}}>Weight</Text>
                            <Text style={{fontSize:theme.body,color:theme.white}}>75 kg</Text>
                        </View>
                </View>
            </View>

            <View
            style={{backgroundColor:theme.white,flex:2}}>
                <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center'}}>
                    <Text style={{fontSize:theme.header,color:theme.primary_color,fontWeight:'bold'}}>Desired Weight: </Text>
                    <Text style={{fontSize:theme.body,color:theme.primary_color}}>68 kg</Text>
                </View>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container : {
        height: height*0.5,
    }
});
