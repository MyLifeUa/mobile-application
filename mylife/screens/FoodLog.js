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
import FAB from 'react-native-fab'
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
            {/* Day selected */}
            <View style={{flex:0.1,backgroundColor:'purple'}}>
            </View>
            {/* Calories intake */}
            <ScrollView style={{flex:2,backgroundColor:'white', marginTop:verticalScale(5),}}>
              {/* Day selected */}
              <View style={{height:verticalScale(150),marginVertical:verticalScale(5),backgroundColor:'blue'}}>
              </View>

              {/* Day selected */}
              <View style={{height:verticalScale(150),marginVertical:verticalScale(5),backgroundColor:'green'}}>
              </View>

              {/* Day selected */}
              <View style={{height:verticalScale(150),marginVertical:verticalScale(5),backgroundColor:'yellow'}}>
              </View>

              {/* Day selected */}
              <View style={{height:verticalScale(150),marginVertical:verticalScale(5),backgroundColor:'black'}}>
              </View>

            </ScrollView>

          <FAB buttonColor={theme.green} iconTextColor="#FFFFFF" onClickAction={() => {this.props.navigation.navigate('FoodLogRegister')}} visible={true} />
        </View>
    );
  }
}

const styles = StyleSheet.create({
});