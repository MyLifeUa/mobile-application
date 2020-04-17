
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
    TouchableOpacity,
    Text,
    Dimensions
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('screen');
//import all the basic component we have used


export default class LoadingScreen extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
    this.state = {
        doctor_email : 'vascoramos@ua.pt',
        doctor_name : 'Vasco Ramos',
        hospital: 'Hospital de Aveiro'
    }
  }

  getDoctorInfo(){

  }

  render() {
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
              }} source={require('../assets/tomas.png')} />

            <Text style={{fontSize:theme.h1,color:theme.primary_color,fontWeight:'bold'}}>{this.state.doctor_name}</Text>

            <Text style={{fontSize:theme.header,color:theme.primary_color}}>{this.state.doctor_email}</Text>
            <Text style={{fontSize:theme.header,color:theme.black,fontWeight:'bold'}}>{this.state.hospital}</Text>
            
            <View style={{marginTop:verticalScale(2),alignContent:'center',justifyContent:'center'}}>
            <TouchableOpacity style={styles.loginGoogleButton}
                    onPress={()=> this.getDoctorInfo()}
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
