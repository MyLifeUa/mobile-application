
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

const TOKEN = '9ada84428a40227eb0b0afbcf028fd2b17bb7615';
const API = 'http://mednat.ieeta.pt:8442/';


export default class Login extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
    this.users = usersList;
    this.user_id = 0;
    this.state = {
        fetched: false,
        user_email: 'tomascosta@ua.pti',
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
      //this.getMeasures()
      this.getValues()
  }

  getValues(){

    fetch(`${API}/clients/${this.state.user_email}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "Authorization": "Token " + TOKEN 

        }
      }).then((response) => response.json())
      .then((json) => {
            console.log(json);
            if (json.state == "Error"){
                alert(json.message)
            }
            else { 
                alert(json)
                //this.refs.toast.show("Food Log added 💯",DURATION.LENGTH_LONG);
            }
      })
      .catch((error) => {
          alert("Error adding Food Log.")
          console.error(error);
      });

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
                        borderRadius:'50%',
                        resizeMode: 'contain',
                        }} source={require('../assets/tomas.png')} />
                </View>
                
                    <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center'}}><Text style={{fontSize:theme.h2,color:theme.white,fontWeight:'bold'}}>Vasco Ramos</Text></View>
                
                <View style={{flexDirection:'row' ,justifyContent:'space-between', alignContent:'space-between', padding:scale(20)}}>
                        <View style={{flexDirection:'column' ,justifyContent:'space-between', alignContent:'space-between'}}>
                            <Text style={{fontSize:theme.header,color:theme.white,fontWeight:'bold'}}>Steps</Text>
  <Text style={{fontSize:theme.body,color:theme.white}}>{this.state.measures.steps}</Text>
                        </View>

                        <View style={{flexDirection:'column' ,justifyContent:'space-between', alignContent:'space-between'}}>
                            <Text style={{fontSize:theme.header,color:theme.white,fontWeight:'bold'}}>Heartrate</Text>
                            <Text style={{fontSize:theme.body,color:theme.white}}>{this.state.measures.heartRate} bpm</Text>
                        </View>

                        <View style={{flexDirection:'column' ,justifyContent:'space-between', alignContent:'space-between'}}>
                            <Text style={{fontSize:theme.header,color:theme.white,fontWeight:'bold'}}>Weight</Text>
                            <Text style={{fontSize:theme.body,color:theme.white}}>{this.state.measures.currentWeight} kg</Text>
                        </View>
                </View>
            </View>

            <View
            style={{backgroundColor:theme.white,flex:2}}>
                <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center'}}>
                    <Text style={{fontSize:theme.header,color:theme.primary_color,fontWeight:'bold'}}>Desired Weight: </Text>
                    <Text style={{fontSize:theme.body,color:theme.primary_color}}>{this.state.measures.currentWeight} kg</Text>
                </View>
            </View>

            <View style={{flex:0.3,justifyContent:'flex-start',alignItems:'center'}}>
                <TouchableOpacity style={styles.loginGoogleButton}

                    onPress={()=> this.props.navigation.navigate('EditProfile')}
                    >
                    <Text style={styles.loginButtonText}>
                        Edit
                    </Text>
                </TouchableOpacity>          
            </View>

        </View>
    );
  }
}

const styles = StyleSheet.create({
    container : {
        height: height*0.5,
    },loginGoogleButton: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        backgroundColor:theme.primary_color_2,
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android
        width:moderateScale(150),
        height:moderateScale(40),
        margin: 10,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center'
    },

});
