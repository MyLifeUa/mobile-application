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
  n_labels = 3
  state = {
    value: null,
    sex:"",
    label: null,
    label_color: "",
    index: 0,
    labels_sizes : [1/this.n_labels, 1/this.n_labels, 1/this.n_labels],

    labels_colors: {
      "Excellent" : "#0FA3B1",
      "Average" : "#B5E2FA" ,
      "Poor" : "#F7A072"
    },

    range_array : [0,0,0,0],
    relative_flex: 0,

    increase: 0,
    current_week: {
      "value" : 0,
      "label" : "Poor"
    },
    previous_week: {
        "value" : 0,
        "label" : "Poor"
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
      sex: this.props.sex,
      current_week: this.props.this_week,
      previous_week : this.props.prev_week,
      increase: this.props.increase,
      scale_values: this.props.scale
    })
    this.calculateDiffRanges(this.props.labels_array)
    this.calculateRangesArray(this.props.labels_array)
    this.calculateRelativePosition()
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

  calculateRangesArray(arr){
    let array_ranges = [0]
    let scale_values = arr

    for (let index = 0; index < scale_values.length; index++) {
      const element = scale_values[index];
      array_ranges.push(element+array_ranges[index])
    }

    console.log("This is the array range:" + array_ranges)
    this.setState({
      range_array: array_ranges
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

  calculateRelativePosition(underLimit,overLimit,value){
    let res = ( value * 1 ) / overLimit;
    return res
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
              MyLife Metric
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
              {this.state.current_week.value}
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
                color: this.state.labels_colors[this.state.current_week.label],
                fontWeight: "bold",
                paddingHorizontal: moderateScale(5)
              }}
            >
               {this.state.current_week.label}
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
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: theme.body,
                color: 'gray',
                fontWeight: "bold",
              }}
            >
              It represents an increase of {this.state.increase}% from last week
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
                    overflow: "hidden"
                }}
            >
              <View style={{flex:this.state.labels_sizes[0],backgroundColor:'white',flexDirection:'row'}}>
                <Text style={{flex:1.9}}></Text>
                <Text style={{flex:0.1}}>|</Text>
              </View>
              <View style={{flex:this.state.labels_sizes[1],backgroundColor:'white',flexDirection:'row'}}>
                <Text style={{flex:1}}></Text>
                <Text style={{flex:1}}>|</Text>
              </View>
              <View style={{flex:this.state.labels_sizes[2],backgroundColor:'white'}}>

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
              <View style={{flex:this.state.labels_sizes[0],backgroundColor:this.state.labels_colors["Poor"]}}></View>
              <View style={{flex:this.state.labels_sizes[1],backgroundColor:this.state.labels_colors["Average"]}}></View>
              <View style={{flex:this.state.labels_sizes[2],backgroundColor:this.state.labels_colors["Excellent"]}}></View>
          </View>

          <View 
                style={{    
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    backgroundColor:'white',
                    flex:1,
                    maxHeight:verticalScale(20),

                }}
            >
              <View style={{flex:this.state.labels_sizes[0],backgroundColor:'white',alignContent:'flex-start',justifyContent:'flex-start',flexDirection:'row'}}>
                {/*this.renderArrowAndLabel("","",true)*/}
              <Text>{this.state.range_array[0]}</Text>
              </View>
              <View style={{flex:this.state.labels_sizes[1],backgroundColor:'white',alignContent:'flex-start',justifyContent:'flex-start',flexDirection:'row'}}>
                <Text>{this.state.range_array[1]}</Text>
              </View>
              <View style={{flex:this.state.labels_sizes[2],backgroundColor:'white',alignContent:'flex-start',justifyContent:'flex-start',flexDirection:'row'}}>
                <Text>{this.state.range_array[2]}</Text>
              </View>
              <View style={{alignContent:'flex-start',justifyContent:'flex-start',flexDirection:'row'}}>
                <Text>{this.state.range_array[3]}</Text>
              </View>
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
              <View style={{flex:1,backgroundColor:this.state.labels_colors["Poor"],borderRadius: 10,}}></View>
              <Text style={{flex:5, paddingHorizontal:moderateScale(10)}}>Poor</Text>
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
              <View style={{flex:1,backgroundColor:this.state.labels_colors["Average"],borderRadius: 10,}}></View>
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
              <View style={{flex:1,backgroundColor:this.state.labels_colors["Excellent"],borderRadius: 10}}></View>
              <Text style={{flex:5, paddingHorizontal:moderateScale(10)}}> Excellent </Text>
          </View>

      </View>
    );
  }
}