
//This is an example code for Bottom Navigation//
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../constants/theme.style.js';
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
                
                    <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center'}}><Text style={{fontSize:theme.h2,color:theme.white,fontWeight:'bold'}}>{this.users[0].name}</Text></View>
                
                <View style={{flexDirection:'row' ,justifyContent:'space-between', alignContent:'space-between', padding:scale(20)}}>
                        <View style={{flexDirection:'column' ,justifyContent:'space-between', alignContent:'space-between'}}>
                            <Text style={{fontSize:theme.header,color:theme.white,fontWeight:'bold'}}>Steps</Text>
                            <Text style={{fontSize:theme.body,color:theme.white}}>10000</Text>
                        </View>

                        <View style={{flexDirection:'column' ,justifyContent:'space-between', alignContent:'space-between'}}>
                            <Text style={{fontSize:theme.header,color:theme.white,fontWeight:'bold'}}>Heartrate</Text>
                            <Text style={{fontSize:theme.body,color:theme.white}}>66 bpm</Text>
                        </View>

                        <View style={{flexDirection:'column' ,justifyContent:'space-between', alignContent:'space-between'}}>
                            <Text style={{fontSize:theme.header,color:theme.white,fontWeight:'bold'}}>Weight</Text>
                            <Text style={{fontSize:theme.body,color:theme.white}}>{this.users[0].weight} kg</Text>
                        </View>
                </View>
            </View>

            <View
            style={{backgroundColor:theme.white,flex:2}}>
                <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center'}}>
                    <Text style={{fontSize:theme.header,color:theme.primary_color,fontWeight:'bold'}}>Desired Weight: </Text>
                    <Text style={{fontSize:theme.body,color:theme.primary_color}}>75kg</Text>
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
