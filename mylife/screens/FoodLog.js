//This is an example code for Bottom Navigation//
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
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
import { TouchableOpacity } from 'react-native-gesture-handler';

//import all the basic component we have used

export default class FoodLog extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
  }

  render() {
    return (
        /* Parent View */
        <View style={{flex:1, padding:moderateScale(10)}}>
          {/* Scrollview */}
          <ScrollView>
            {/* Day selected */}
            <View style={{flex:0.2,backgroundColor:'purple'}}>
            </View>

            {/* Calories intake */}
            <View style={{flex:2,backgroundColor:'red'}}>
            </View>

          </ScrollView>

        </View>
    );
  }
}

const styles = StyleSheet.create({
});