//This is an example code for Bottom Navigation//
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import RNSpeedometer from 'react-native-speedometer'

//import react in our code.
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  DatePickerAndroid,
  Text,
  AsyncStorage,
  KeyboardAvoidingView,
  Dimensions,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
  ScrollView
} from "react-native";
const { width, height } = Dimensions.get("screen");
import theme from "../constants/theme.style.js";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph
} from "expo-chart-kit";

import { TabView, SceneMap, TabBar, TabViewPage } from "react-native-tab-view";

import { scale, verticalScale, moderateScale } from "react-native-size-matters";

//import all the basic component we have used

export default class GaugeMetrics extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
  }
  n_labels = 5
  state = {
    index: 0,
    routes: [
      { key: "first", title: "Body" },
      { key: "second", title: "Nutrients" }
    ],
    labels_sizes : [1/this.n_labels, 1/this.n_labels, 1/this.n_labels, 1/this.n_labels, 1/this.n_labels]
  };

  componentDidMount(){
    //receives 
    //array with values
    //value of metric
    //label done
    console.log("-----------------Incoming Props---------------")
    console.log(this.props)
  }

  calculateDiffRanges(){
    //returns array from state labels, with 5 values ordered and their flex percentage
  }

  render() {
    return (
      <View style={{
        backgroundColor: theme.white,
        flex: 1,
        alignContent: "space-between",
        paddingHorizontal:moderateScale(15),
        overflow: "hidden"
      }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              marginTop: moderateScale(20),
            }}
          >
            <Text
              style={{
                fontSize: theme.h1,
                color: theme.primary_color,
                fontWeight: "bold"
              }}
            >
              Heart Rate
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              
            }}
          >
            <Text
              style={{
                fontSize: theme.body,
                color: 'gray',
                fontWeight: "bold"
              }}
            >
              Your estimate of 52 is 
            </Text>
            <Text
              style={{
                fontSize: theme.body,
                color: "#80ccff",
                fontWeight: "bold",
                paddingHorizontal: moderateScale(5)
              }}
            >
               Good
            </Text>
            <Text
              style={{
                fontSize: theme.body,
                color: 'gray',
                fontWeight: "bold",
              }}
            >
               for men your age
            </Text>
          </View>
          <View 
                style={{    
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    backgroundColor:'white',
                    flex:1,
                    marginTop:verticalScale(15),
                    maxHeight:verticalScale(15),
                    borderRadius: 10,
                    overflow: "hidden"
                }}
            >
              <View style={{flex:1,backgroundColor:'#bb99ff'}}></View>
              <View style={{flex:1.5,backgroundColor:'#80ccff'}}></View>
              <View style={{flex:2,backgroundColor:'#99ffff'}}></View>
              <View style={{flex:2,backgroundColor:'#d9ffb3'}}></View>
              <View style={{flex:0.8,backgroundColor:'#99ff33'}}></View>
          </View>
      </View>
    );
  }
}