
//This is an example code for Bottom Navigation//
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../constants/theme.style.js';
//import react in our code.
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    AsyncStorage,
    TouchableOpacity,
    Text,
    Dimensions
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('screen');
//import all the basic component we have used

const API = 'http://mednat.ieeta.pt:8442';


export default class LoadingScreen extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
    this.state = {
        user_token: '',
        email: '',
        valid_doctor : false,
        doctor_email : '',
        doctor_name : '',
        hospital: '',
        photo64: '',
    }
  }

  componentDidMount = async () => {
    await this._retrieveData()
    this.getDoctorInfo()
  }

  passData = async () => {
    await this.setState({
      user_token: this.props.navigation.state.params.token,
      email: this.props.navigation.state.params.email
    })

  }

  _retrieveData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const email = await AsyncStorage.getItem('email');

        this.setState({
          email: email,
          user_token: token
        })

        console.log("Oh mano, ai vai: ")
        console.log(this.state)
    } catch (error) {
      // Error retrieving data
      console.log(error);
      //testing purposes only
    }
  };

  getDoctorInfo(){
    fetch(`${API}/doctor-patient-association`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": "Token " + this.state.user_token 
      }
    }).then((response) => response.json())
    .then((json) => {
          console.log(json);
          if (json.state == "Error" || json.message == null){
              alert(json.detail)
              this.setState({
                valid_doctor:false
              })
          }
          else { 
              // Success
              this.setState({
                  valid_doctor : true,
                  doctor_email : json.message.email,
                  doctor_name : json.message.name,
                  hospital: json.message.hospital,
                  photo64: json.message.photo,
              })
          }
    })
    .catch((error) => {
        console.log(error);
    });
  }

  removeDoctor(){
    fetch(`${API}/doctor-patient-association`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": "Token " + this.state.user_token
      },
      body: JSON.stringify({
        client: this.state.email,
        doctor: this.state.doctor_email
      })
    }).then((response) => response.json())
    .then((json) => {
          console.log(json);
          if (json.state == "Error"){
              alert(json.detail)
              this.setState({
                valid_doctor:true
              })
          }
          else { 
              // Success
              this.setState({
                  valid_doctor : false,
              })
              alert("Sucessfully removed doctor")
          }
    })
    .catch((error) => {
        alert("Error fetching doctor")
        console.log(error);
    });
  }

  render() {
    if (this.state.valid_doctor == false) {
      return (
        <View>
          <ScrollView style={styles.container}>
              <View style={{
                flex: 2,
                marginTop: 0.036 * height,
                alignItems: 'center',
                justifyContent: 'center',
              }}>

              <Text style={{fontSize:theme.h1,color:theme.primary_color,fontWeight:'bold'}}>No doctor associated</Text>
              <Text style={{fontSize:theme.header,color:theme.black,fontWeight:'bold'}}>Come back when you have a doctor</Text>
  
              </View>
  
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View>
          <ScrollView style={styles.container}>
              <View style={{
                flex: 2,
                marginTop: 0.036 * height,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
  
              < Image style={{
                  width: moderateScale(200),
                  height: moderateScale(200),
                  borderRadius:300,
                  borderColor:theme.black,
                  resizeMode: 'contain',
                }} source={{uri:`data:image/png;base64,${this.state.photo64}`}} />
  
              <Text style={{fontSize:theme.h1,color:theme.primary_color,fontWeight:'bold'}}>{this.state.doctor_name}</Text>
  
              <Text style={{fontSize:theme.header,color:theme.primary_color}}>{this.state.doctor_email}</Text>
              <Text style={{fontSize:theme.header,color:theme.black,fontWeight:'bold'}}>{this.state.hospital}</Text>
              
              <View style={{marginTop:verticalScale(2),alignContent:'center',justifyContent:'center'}}>
              <TouchableOpacity style={styles.loginGoogleButton}
                      onPress={()=> this.removeDoctor()}
                      >
                      <Text style={styles.loginButtonText}>
                          Remove Doctor
                      </Text>
                  </TouchableOpacity>
              </View>
  
              </View>
  
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
    container : {
        height: height*0.5,
    },
    loginGoogleButton: {
        backgroundColor:'#ff6961',
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
    loginButtonText: {
        textAlign:'center',
        color:"#FFF",
        fontWeight: '700',
        width:"100%",
        fontSize:moderateScale(15)
      }, 
});
