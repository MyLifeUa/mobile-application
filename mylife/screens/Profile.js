//This is an example code for Bottom Navigation//
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../constants/theme.style.js";
import URIs from "../constants/baseURIs";
import Swiper from 'react-native-swiper'
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import usersList from "../data/users";
import GaugeMetrics from "../components/GaugeMetrics";

//import react in our code.
import {
  View,
  Text,
  Image,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from "react-native";
const { width, height } = Dimensions.get("screen");
//import all the basic component we have used

const API = "http://mednat.ieeta.pt:8442";

export default class Login extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
    this.users = usersList;
    this.user_id = 0;

    this.state = {
      fetched: false,
      refreshing: false,
      noFitbit: false,
      Loading: true,
      SharedLoading:true,
      user_data: {
        email: "",
        height: null,
        weight: null,
        name: null,
        phone_number: null,
        sex: "",
        photo: "https://www.healthredefine.com/wp-content/uploads/2018/02/person-placeholder.jpg",
        token: "",
        steps: "",
        distance: "",
        heartRate: ""
      },
      fitbit_measures: {
        currentWeight: null,
        date: null,
        caloriesBMR: null,
        caloriesOut: null,
        heartRate: null,
        sedentaryMinutes: null,
        steps: null
      }
    };
  }
  _storeData = async token => {
    console.log("Storing Token: " + token);
    try {
      await AsyncStorage.setItem("token", token);
      this.setState({ user_token: token });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount = async () => {
    //get the info of the user as soon as page loads
    await this._retrieveData();
    //this.getMeasures()
    if (!this.state.SharedLoading) {
      this.getValues();
    }

  };

  _retrieveData = async () => {
    console.log("HELLO");

    try {
      const value = await AsyncStorage.getItem("token");
      console.log(value);

      const email_async = await AsyncStorage.getItem("email");
      if (value !== null) {
        // We have data!!
        this.setState({
          SharedLoading: false,
          user_data: {
            token: value,
            email: email_async
          }
        });
      } else {
        this.setState({
          SharedLoading: false // TODO ELIMINATE THIS
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({
        SharedLoading: false // TODO ELIMINATE THIS
      });
    }
  };

  async processResponse(response) {
    const statusCode = response.status;
    const data = response.json();
    const res = await Promise.all([statusCode, data]);
    return {
      statusCode: res[0],
      responseJson: res[1]
    };
  }

  async processInvalidToken() {
    this.props.navigation.navigate("Auth");
  }

  getValues() {
    var login_info = "Token " + this.state.user_data.token;

    console.log(login_info);
    fetch(`${API}/clients/${this.state.user_data.email}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: login_info
      }
    })
      .then(this.processResponse)
      .then(res => {

        let ingredients = [];

        const { statusCode, responseJson } = res;
        console.log(statusCode)


        if (statusCode == 401) {
          console.log("INVALID TOKEN")
          this.processInvalidToken();
        } else {
          //console.log(responseJson);
          if (responseJson.state == "Error") {
            //alert(json.message);
          } else {
            // Success
            let noFitbit = false;
            let photo = responseJson.message.photo;

            if (responseJson.message.steps == "") {
              console.log("NULL");
              noFitbit = true;
            }

            if (photo == "") { //passar para base64
              photo =
                "https://www.healthredefine.com/wp-content/uploads/2018/02/person-placeholder.jpg";
            } else {
            }
           
            this.setState({
              user_data: {
                name: responseJson.message.name,
                email: responseJson.message.email,
                phone_number: responseJson.message.phone_number,
                photo: photo,
                weight: responseJson.message.current_weight,
                height: responseJson.message.height,
                sex: responseJson.message.sex,
                weight_goal: responseJson.message.weight_goal,
                steps: responseJson.message.steps,
                distance: responseJson.message.distance,
                heartRate: responseJson.message.heart_rate,
                token:responseJson.token
              },
              Loading: false,
              refreshing:false,
              noFitbit: noFitbit

            });
            this._storeData(responseJson.token);

          }
        }
      })
      .catch(error => {
        //alert("Error adding Food Log.");
        console.log(error);
      });
  }

  renderFitbitMeasures() {
    console.log(this.state.noFitbit)
    if (this.state.Loading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.primary_color_2} />
        </View>
      );
    } else if (this.state.noFitbit) {
      return (
        <View
          style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableOpacity
            style={styles.connectFitbit}
            onPress={() => this.props.navigation.navigate("FitbitAuth")}
          >
            <Text style={styles.loginButtonText}>Connect your Fitbit</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "space-between",
            padding: scale(20)
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              alignContent: "space-between"
            }}
          >
            <Text
              style={{
                fontSize: theme.header,
                color: theme.white,
                fontWeight: "bold"
              }}
            >
              Steps
            </Text>
            <Text
              style={{
                fontSize: theme.body,
                color: theme.white,
                textAlign: "center"
              }}
            >
              {parseFloat(this.state.user_data.steps).toFixed(0)}
              
            </Text>
          </View>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              alignContent: "space-between"
            }}
          >
            <Text
              style={{
                fontSize: theme.header,
                color: theme.white,
                fontWeight: "bold"
              }}
            >
              Heartrate
            </Text>
            <Text
              style={{
                fontSize: theme.body,
                color: theme.white,
                textAlign: "center"
              }}
            >
              {parseFloat(this.state.user_data.heartRate).toFixed(0)} bpm
            </Text>
          </View>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <Text
              style={{
                fontSize: theme.header,
                color: theme.white,
                fontWeight: "bold",
                textAlign: "center"
              }}
            >
              Distance
            </Text>
            <Text
              style={{
                fontSize: theme.body,
                color: theme.white,
                textAlign: "center"
              }}
            >
              {parseFloat(this.state.user_data.distance).toFixed(0)} Km
            </Text>
          </View>
        </View>
      );
    }
  }

  handleRefresh = () => {
    // Refresh a zona de filtros tambem?
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.getValues()
      }
    );
  };

  render() {
    const {  refreshing } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: theme.primary_color,
            flex: 0.9,
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flex: 0.8
            }}
          >
            <Image
              style={{
                width: moderateScale(100),
                height: moderateScale(100),
                borderColor: "white",
                borderRadius: 400,
                resizeMode: "contain"
              }}
              source={{ uri: `data:image/png;base64,${this.state.user_data.photo}` }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <Text
              style={{
                fontSize: theme.h2,
                color: theme.white,
                fontWeight: "bold"
              }}
            >
              {this.state.user_data.name}
            </Text>
          </View>
          {this.renderFitbitMeasures()}
        </View>

        <Swiper 
          showsButtons={false}
          showsPagination={true}
          style={{flex:1.3}}
          loop={false}>
          <GaugeMetrics navigation={this.props.navigation} />
          <ScrollView
          style={{
            backgroundColor: theme.white,
            flex: 1,
            alignContent: "space-between"
          }}

          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.handleRefresh}
            />
          }
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              marginTop: moderateScale(20)
            }}
          >
            <Text
              style={{
                fontSize: theme.h1,
                color: theme.primary_color,
                fontWeight: "bold"
              }}
            >
              User Information
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              padding: 2
            }}
          >
            <Text
              style={{
                fontSize: theme.header,
                color: theme.primary_color,
                fontWeight: "bold"
              }}
            >
              Email:{" "}
            </Text>
            <Text style={{ fontSize: theme.body, color: theme.primary_color }}>
              {this.state.user_data.email}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              padding: 2
            }}
          >
            <Text
              style={{
                fontSize: theme.header,
                color: theme.primary_color,
                fontWeight: "bold"
              }}
            >
              Height:{" "}
            </Text>
            <Text style={{ fontSize: theme.body, color: theme.primary_color }}>
              {this.state.user_data.height} cm
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              padding: 2
            }}
          >
            <Text
              style={{
                fontSize: theme.header,
                color: theme.primary_color,
                fontWeight: "bold"
              }}
            >
              Weight:{" "}
            </Text>
            <Text style={{ fontSize: theme.body, color: theme.primary_color }}>
              {this.state.user_data.weight} kg
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              padding: 2
            }}
          >
            <Text
              style={{
                fontSize: theme.header,
                color: theme.primary_color,
                fontWeight: "bold"
              }}
            >
              Desired Weight:{" "}
            </Text>
            <Text style={{ fontSize: theme.body, color: theme.primary_color }}>
              {this.state.user_data.weight_goal} kg
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              padding: 2
            }}
          >
            <Text
              style={{
                fontSize: theme.header,
                color: theme.primary_color,
                fontWeight: "bold"
              }}
            >
              Phone Number:{" "}
            </Text>
            <Text style={{ fontSize: theme.body, color: theme.primary_color }}>
              {this.state.user_data.phone_number}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              padding: 2
            }}
          >
            <Text
              style={{
                fontSize: theme.header,
                color: theme.primary_color,
                fontWeight: "bold"
              }}
            >
              Gender:{" "}
            </Text>
            <Text style={{ fontSize: theme.body, color: theme.primary_color }}>
              {this.state.user_data.sex}
            </Text>
          </View>
        </ScrollView>
            
        </Swiper>


        <View
          style={{
            flex: 0.5,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            style={styles.loginGoogleButton}
            onPress={() =>
              this.props.navigation.navigate("EditProfile", {
                user_data: this.state.user_data,
                email: this.state.user_data.email,
                weight: this.state.user_data.weight,
                height: this.state.user_data.height,
                goal_weight: this.state.user_data.weight_goal,
                photo: this.state.user_data.photo,
                photo_64: this.state.user_data.photo_64
              })
            }
          >
            <Text style={styles.loginButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginGoogleButtonDoctor}
            onPress={() =>
              this.props.navigation.navigate("CheckDoctor", {
                email: this.state.user_data.email,
                token: this.state.user_data.token
              })
            }
          >
            <Text style={styles.loginButtonText}>Check Doctor</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.5
  },
  loginGoogleButton: {
    backgroundColor: theme.primary_color,
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(120),
    height: moderateScale(40),
    margin: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  loginGoogleButtonDoctor: {
    backgroundColor: "#85ba6a",
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(120),
    height: moderateScale(40),
    margin: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  connectFitbit: {
    backgroundColor: "#85ba6a",
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(160),
    height: moderateScale(40),
    margin: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  loginButtonText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700",
    width: "100%",
    fontSize: moderateScale(15)
  }
});
