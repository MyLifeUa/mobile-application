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
    value: null,
    sex:"",
    label: null,
    label_color: "",
    index: 0,
    labels_sizes : [1/this.n_labels, 1/this.n_labels, 1/this.n_labels, 1/this.n_labels, 1/this.n_labels],
    
    range_array : [0,0,0,0],
    relative_flex: 0,

    labels_colors: {
      "Excellent" : "#99ff33",
      "Good" : "#d9ffb3",
      "Average" : "#99ffff" ,
      "Fair" : "#80ccff",
      "Poor" : "#bb99ff"
    }
  };

  componentDidMount(){
    //receives 
    //array with values
    //value of metric
    //label done
    console.log("-----------------Incoming Props---------------")
    console.log(this.props)
    this.setState({
      value: this.props.value,
      label: this.props.label,
      sex: this.props.sex
    })
    this.calculateDiffRanges(this.props.labels_array)
    this.calculateRangesArray(this.props.labels_array, this.props.value)
  } 

  componentWillReceiveProps(){
    //receives 
    //array with values
    //value of metric
    //label done
    console.log("-----------------Incoming Updated Props---------------")
    console.log(this.props)
    this.setState({
      value: this.props.value,
      label: this.props.label,
      sex: this.props.sex
    })
    this.calculateDiffRanges(this.props.labels_array)
    this.calculateRangesArray(this.props.labels_array, this.props.value)
  }

  calculateDiffRanges(labels_sizes_array){
    //returns array from state labels, with 5 values ordered and their flex percentage
    //labels = [10,2,5,8]
    //sums all values of the array
    var sum_array = labels_sizes_array.reduce((a,b) => a + b, 0);
    var array_degrees = [];

    for (let index = 0; index < labels_sizes_array.length; index++) {
      const element = labels_sizes_array[index];
      array_degrees.push((element * 1) / sum_array);
    }
    
    this.setState({
      labels_sizes: array_degrees
    })
    //returns array of degrees
    console.log("New values")
    console.log(this.state.labels_sizes)
  }

  calculateRangesArray(arr,inc_value){
    let smallest_value;

    if (this.props.scales.length > 0) {
      smallest_value = parseInt(Object.keys(this.props.scales)[1].toString().substring(0,2)) 
      console.log("Object keys:")
      console.log(smallest_value)

    } else {
      smallest_value=49
    }
    let array_ranges = [smallest_value]
    let scale_values = arr

    let element = 0;
    let val = 1;

    for (let index = 0; index < scale_values.length; index++) {
      element = scale_values[index];
      val = element+array_ranges[index]
      array_ranges.push(val)
    }

    console.log("This is the array range:" + array_ranges)
    console.log("Element: " + val)
    console.log("Value:" + inc_value)

    let result = ((inc_value - smallest_value) * 1) / val;
    console.log("ResultOfRange: " + result)
    this.setState({
      range_array: array_ranges,
      relative_flex: result
    })
  }

  renderName(str) {
    if (str=="M") {
      return (
        <Text
              style={{
                fontSize: theme.body,
                color: 'gray',
                fontWeight: "bold",
                paddingHorizontal:moderateScale(5)
              }}
            >
              men
            </Text>
      )
    } else if (str=="F"){
      <Text
              style={{
                fontSize: theme.body,
                color: 'gray',
                fontWeight: "bold",
                paddingHorizontal:moderateScale(5)
              }}
            >
              women
            </Text>
    } else {
      <Text
              style={{
                fontSize: theme.body,
                color: 'gray',
                fontWeight: "bold",
                paddingHorizontal:moderateScale(5)
              }}
            >
              people
            </Text>
    }
  }

  render() {
    return (
      <View style={{
        backgroundColor: theme.white,
        flex: 1,
        alignContent: "space-between",
        paddingHorizontal:moderateScale(15),
        overflow: "hidden",
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
              Your estimate of 
            </Text>
            <Text
              style={{
                fontSize: theme.body,
                color: 'gray',
                fontWeight: "bold",
                paddingHorizontal: moderateScale(5)
              }}
            >
              {this.state.value}
            </Text>
            <Text
              style={{
                fontSize: theme.body,
                color: 'gray',
                fontWeight: "bold",
              }}
            >
              is 
            </Text>
            <Text
              style={{
                fontSize: theme.body,
                color: this.state.labels_colors[this.state.label],
                fontWeight: "bold",
                paddingHorizontal: moderateScale(5)
              }}
            >
               {this.state.label}
            </Text>
            <Text
              style={{
                fontSize: theme.body,
                color: 'gray',
                fontWeight: "bold",
              }}
            >
               for
            </Text>
            {this.renderName(this.state.sex)}
            <Text
              style={{
                fontSize: theme.body,
                color: 'gray',
                fontWeight: "bold",
              }}
            >
              your age
            </Text>
          </View>

          <View 
                style={{    
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignContent: "flex-start",
                    backgroundColor:'white',
                    flex:1,
                    marginTop:verticalScale(5),
                    maxHeight:verticalScale(15),
                    overflow: "hidden"
                }}
            >
              <View style={{flex:this.state.relative_flex,backgroundColor:'white',flexDirection:'row'}}>
              </View>
              <View style={{flex:1-this.state.relative_flex,backgroundColor:'white',flexDirection:'row'}}>
                <Ionicons 
                  name={"md-arrow-down"}
                />
              </View>
              
          </View>

          <View 
                style={{    
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    backgroundColor:'white',
                    flex:1,
                    maxHeight:verticalScale(15),
                    borderRadius: 10,
                    elevation: 5,
                    overflow: "hidden"
                }}
            >
              <View style={{flex:this.state.labels_sizes[0],backgroundColor:'#99ff33'}}></View>
              <View style={{flex:this.state.labels_sizes[1],backgroundColor:'#d9ffb3'}}></View>
              <View style={{flex:this.state.labels_sizes[2],backgroundColor:'#99ffff'}}></View>
              <View style={{flex:this.state.labels_sizes[3],backgroundColor:'#80ccff'}}></View>
              <View style={{flex:this.state.labels_sizes[4],backgroundColor:'#bb99ff'}}></View>
          </View>


          {/* Legenda */}
          <View 
                style={{    
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    backgroundColor:'white',
                    flex:1,
                    marginTop:verticalScale(15),
                    maxHeight:verticalScale(20),
                    overflow: "hidden"
                }}
            >
              <View style={{flex:1,backgroundColor:'#99ff33',borderRadius: 10,}}></View>
              <Text style={{flex:5, paddingHorizontal:moderateScale(10)}}> Excellent </Text>
          </View>

          {/* Legenda */}
          <View 
                style={{    
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    backgroundColor:'white',
                    flex:1,
                    marginTop:verticalScale(5),
                    maxHeight:verticalScale(20),
                    overflow: "hidden"
                }}
            >
              <View style={{flex:1,backgroundColor:'#d9ffb3',borderRadius: 10,}}></View>
              <Text style={{flex:5, paddingHorizontal:moderateScale(10)}}> Good </Text>
          </View>

          {/* Legenda */}
          <View 
                style={{    
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    backgroundColor:'white',
                    flex:1,
                    marginTop:verticalScale(5),
                    maxHeight:verticalScale(20),
                    overflow: "hidden"
                }}
            >
              <View style={{flex:1,backgroundColor:'#99ffff',borderRadius: 10,}}></View>
              <Text style={{flex:5, paddingHorizontal:moderateScale(10)}}> Average </Text>
          </View>

          {/* Legenda */}
          <View 
                style={{    
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    backgroundColor:'white',
                    flex:1,
                    marginTop:verticalScale(5),
                    maxHeight:verticalScale(20),
                    overflow: "hidden"
                }}
            >
              <View style={{flex:1,backgroundColor:'#80ccff',borderRadius: 10,}}></View>
              <Text style={{flex:5, paddingHorizontal:moderateScale(10)}}> Fair </Text>
          </View>

          {/* Legenda */}
          <View 
                style={{    
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    backgroundColor:'white',
                    flex:1,
                    marginTop:verticalScale(5),
                    maxHeight:verticalScale(20),
                    overflow: "hidden"
                }}
            >
              <View style={{flex:1,backgroundColor:'#bb99ff',borderRadius: 10,}}></View>
              <Text style={{flex:5, paddingHorizontal:moderateScale(10)}}> Poor </Text>
          </View>
      </View>
    );
  }
}