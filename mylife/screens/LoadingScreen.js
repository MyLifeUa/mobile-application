
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
    Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('screen');
//import all the basic component we have used


export default class LoadingScreen extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LinearGradient colors={['#1D71B8', '#69C8F3']} start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }} style={{flex:1}}>
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex:1}}>
            <View style={{
              flex: 2,
              marginTop: 0.036 * height,
              alignItems: 'center',
              justifyContent: 'center',
            }}>

            < Image style={{
                width: 150,
                height: 150,
                borderWidth:3,
                borderColor:'white',
                resizeMode: 'contain',
              }} source={require('../assets/icon.png')} />

            </View>
            <View style={{ flex: 1, }}>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
    container : {
        height: height*0.5,
    }
});
