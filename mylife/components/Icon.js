import React from "react";
import { Ionicons } from '@expo/vector-icons';
import { Text, View, TouchableOpacity, StyleSheet,Image } from 'react-native';


export default class Icon extends React.Component {
    //Detail Screen to show from any Open detail button
    render() {
      return (
          this.props.os=='ios'?
            <Ionicons name={"md-"+this.props.icon} color={this.props.color} size={25}/>:
            <Ionicons name={"ios-"+this.props.icon} color={this.props.color} size={25}/>
          
        
  
        
      );
    }
  }