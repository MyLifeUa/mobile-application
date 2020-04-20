//This is an example code for Bottom Navigation//
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
//import react in our code.
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('screen');
import theme from '../constants/theme.style.js';

//import all the basic component we have used

export default class DailyLog extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <ScrollView style={{}} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex:1}}>
            <View style={{
              flex: 2,
              marginTop: 0.036 * height,
              alignItems: 'center',
              justifyContent: 'center',
           
            }}>

              < Image style={{
                width: 250,
                height: 150,
                resizeMode: 'contain',
              }} source={require('../assets/icon.png')} />

            </View>
            <View style={{ flex: 1, }}>
            </View>
          </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
});