
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
    AsyncStorage,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('screen');
//import all the basic component we have used

const API = 'http://mednat.ieeta.pt:8442';


export default class Login extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
    this.users = usersList;
    this.user_id = 0;
    this.state = {
        fetched: false,
        user_data: {
            email: '',
            height: null,
            weight: null,
            name: null,
            phone_number: null,
            sex: '',
            photo: '',
            token: '',
        },
        fitbit_measures: {
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

  componentDidMount = async () => {
      //get the info of the user as soon as page loads
      await this._retrieveData()
      //this.getMeasures()
      this.getValues()
  }

  _retrieveData = async () => {
    console.log("HELLO");

    try {
      const value = await AsyncStorage.getItem("token");
      const email_async = await AsyncStorage.getItem("email")
      if (value !== null) {
        // We have data!!
        this.setState({
          SharedLoading: false,
          user_data: {
              token : value,
              email : email_async
            }

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

  getValues(){

    console.log(`${API}/clients/${this.state.user_data.email}`)
    fetch(`${API}/clients/${this.state.user_data.email}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "Authorization": "Token " + this.state.user_data.token
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
                    user_data : {
                        name: json.message.name,
                        email: json.message.email,
                        phone_number: json.message.phone_number,
                        photo: json.message.photo,
                        weight: json.message.current_weight,
                        height: json.message.height,
                        sex: json.message.sex,
                        weight_goal: json.message.weight_goal
                    }
                })
            }
      })
      .catch((error) => {
          alert("Error adding Food Log.")
          console.log(error);
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
                fitbit_measures: {
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
            style={{backgroundColor:theme.primary_color,flex:0.9, flexDirection:'column' ,justifyContent:'center', alignContent:'center'}}>
                <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center',}}>
                    <Image style={{
                        width: moderateScale(100),
                        height: moderateScale(100),
                        borderColor:'white',
                        borderRadius:400,
                        marginTop:20,
                        resizeMode: 'contain',
                        }} source={{uri:`data:image/png;base64,${this.state.user_data.photo}`}} />
                </View>
                
  <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center'}}><Text style={{fontSize:theme.h2,color:theme.white,fontWeight:'bold'}}>{this.state.user_data.name}</Text></View>
                
                <View style={{flexDirection:'row' ,justifyContent:'space-between', alignContent:'space-between', padding:scale(20)}}>
                        <View style={{flexDirection:'column' ,justifyContent:'space-between', alignContent:'space-between'}}>
                            <Text style={{fontSize:theme.header,color:theme.white,fontWeight:'bold'}}>Steps</Text>
  <Text style={{fontSize:theme.body,color:theme.white}}>{this.state.fitbit_measures.steps}</Text>
                        </View>

                        <View style={{flexDirection:'column' ,justifyContent:'space-between', alignContent:'space-between'}}>
                            <Text style={{fontSize:theme.header,color:theme.white,fontWeight:'bold'}}>Heartrate</Text>
                            <Text style={{fontSize:theme.body,color:theme.white}}>{this.state.fitbit_measures.heartRate} bpm</Text>
                        </View>

                        <View style={{flexDirection:'column' ,justifyContent:'space-between', alignContent:'space-between'}}>
                            <Text style={{fontSize:theme.header,color:theme.white,fontWeight:'bold'}}>Weight</Text>
                            <Text style={{fontSize:theme.body,color:theme.white}}>{this.state.fitbit_measures.currentWeight} kg</Text>
                        </View>
                </View>
            </View>

            <View
            style={{backgroundColor:theme.white,flex:1,alignContent:'space-between'}}>

                <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center', marginTop:moderateScale(20)}}><Text style={{fontSize:theme.h1,color:theme.primary_color,fontWeight:'bold'}}>User Information</Text></View>

                <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center', padding:2}}>
                    <Text style={{fontSize:theme.header,color:theme.primary_color,fontWeight:'bold'}}>Email: </Text>
                    <Text style={{fontSize:theme.body,color:theme.primary_color}}>{this.state.user_data.email}</Text>
                </View>

                <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center', padding:2}}>
                    <Text style={{fontSize:theme.header,color:theme.primary_color,fontWeight:'bold'}}>Height: </Text>
                    <Text style={{fontSize:theme.body,color:theme.primary_color}}>{this.state.user_data.height} cm</Text>
                </View>

                <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center', padding:2}}>
                    <Text style={{fontSize:theme.header,color:theme.primary_color,fontWeight:'bold'}}>Weight: </Text>
                    <Text style={{fontSize:theme.body,color:theme.primary_color}}>{this.state.user_data.weight} kg</Text>
                </View>

                <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center', padding:2}}>
                    <Text style={{fontSize:theme.header,color:theme.primary_color,fontWeight:'bold'}}>Desired Weight: </Text>
                    <Text style={{fontSize:theme.body,color:theme.primary_color}}>{this.state.user_data.weight_goal} kg</Text>
                </View>

                <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center', padding:2}}>
                    <Text style={{fontSize:theme.header,color:theme.primary_color,fontWeight:'bold'}}>Phone Number: </Text>
                    <Text style={{fontSize:theme.body,color:theme.primary_color}}>{this.state.user_data.phone_number}</Text>
                </View>

                <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center', padding:2}}>
                    <Text style={{fontSize:theme.header,color:theme.primary_color,fontWeight:'bold'}}>Gender: </Text>
                    <Text style={{fontSize:theme.body,color:theme.primary_color}}>{this.state.user_data.sex}</Text>
                </View>

            </View>

            <View style={{flex:0.5,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                <TouchableOpacity style={styles.loginGoogleButton}
                    onPress={()=> this.props.navigation.navigate('EditProfile', {
                        user_data: this.state.user_data,
                        email: this.state.user_data.email,
                        weight: this.state.user_data.weight,
                        height: this.state.user_data.height,
                        goal_weight: this.state.user_data.weight,
                        photo: this.state.user_data.weight
                    })}
                    >
                    <Text style={styles.loginButtonText}>
                        Edit
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginGoogleButtonDoctor}

                    onPress={()=> this.props.navigation.navigate('CheckDoctor', {
                        email: this.state.user_data.email,
                    })}
                    >
                    <Text style={styles.loginButtonText}>
                        Check Doctor
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
    },
    loginGoogleButton: {
        backgroundColor:theme.primary_color,
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android
        width:moderateScale(120),
        height:moderateScale(40),
        margin: 10,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center'
    },
    loginGoogleButtonDoctor: {
        backgroundColor:'#85ba6a',
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android
        width:moderateScale(120),
        height:moderateScale(40),
        margin: 10,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center'
    },
    loginButtonText: {
        textAlign:'center',
        color:"#FFF",
        fontWeight: '700',
        width:"100%",
        fontSize:moderateScale(15)
      },  

});
