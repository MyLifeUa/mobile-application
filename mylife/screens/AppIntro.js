import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  DatePickerAndroid,
  Text,
  AsyncStorage,
  KeyboardAvoidingView,
  Dimensions,
  Image,
  Animated,
  ActivityIndicator
} from "react-native";
import theme from "../constants/theme.style.js";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import AppIntroSlider from "react-native-app-intro-slider";

const slides = [
  {
    key: 1,
    title: "Welcome to MyLife",
    text: "Improving your health has never been easier 😎",
    style: true,
    image: require("../assets/icon.png"),
    backgroundColor: "#59b2ab"
  },
  {
    key: 2,
    title: "Food Logs",
    style: false,
    text: "Register and analyze your daily food habits 🍳",
    image: require("../assets/app_intro1.gif"),
    backgroundColor: "#febe29"
  },
  {
    key: 3,
    title: "MyLife Food Detector",
    style: false,
    text:
      "Use state of the art Machine Learning to identify the food you eat 😮",
    image: require("../assets/app_intro2.gif"),
    backgroundColor: "#febe29"
  },
  {
    key: 4,
    title: "Health charts",
    style: false,
    text: "Connect your fitness tracker and get live chart feedback 🏋️",
    image: require("../assets/app_intro3.gif"),
    backgroundColor: "#febe29"
  },
  {
    key: 5,
    title: "MyLife Metric",
    style: false,
    text: "Improve your health with weekly feedback 📈",
    image: require("../assets/app_intro4.jpg"),
    backgroundColor: "#febe29"
  }
];

export default class App extends React.Component {
  state = {
    showRealApp: false
  };
  _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Image
          style={item.style ? styles.image : styles.image1}
          source={item.image}
          resizeMode="contain"
        />

        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };
  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.props.navigation.navigate("Profile");
  };
  render() {
    return (
      <AppIntroSlider
        renderItem={this._renderItem}
        data={slides}
        onDone={this._onDone}
      />
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary_color
  },
  image_slide: {
    height: verticalScale(500),
    width: verticalScale(300),
    backgroundColor: "red"
  },
  image1: {
    height: "65%",
    width: "100%",
    marginVertical: verticalScale(32)
  },
  image: {
    width: verticalScale(320),
    height: verticalScale(320),
    marginVertical: verticalScale(32)
  },
  text: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontSize: moderateScale(15)
  },
  title: {
    fontSize: moderateScale(22),
    color: "white",
    textAlign: "center"
  }
});
