//This is an example code for Bottom Navigation//
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import HeartRateItem from "../components/ChartPageItem";
import moment from "moment";
import Swiper from 'react-native-swiper'
import GaugeHearthrate from "../components/GaugeHearthrate";
 
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
  FlatList
} from "react-native";
const { width, height } = Dimensions.get("screen");
import theme from "../constants/theme.style.js";
/*import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph
} from "react-native-chart-kit";*/

import LineChart from "../components/LineChartWithTooltips";
import { ThemeColors } from "react-navigation";
import { ThemeConsumer } from "react-native-elements";

//import all the basic component we have used
const API_URL = "http://mednat.ieeta.pt:8442";

export default class Login extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
  }

  state = {
    user_token: "",
    user_email: "",
    SharedLoading: true,
    Loading: true,
    refresh: false,
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    labels: [],
    chartData: null,
    mealName: "",
    number_of_servings: "",
    choosen_type_of_meal: "",
    dataSourceMetrics: [
      { day: "2020-04-14", value: "20" },
      { day: "Monday", value: "20" },
      { day: "Monday", value: "20" },
      { day: "Monday", value: "20" }
    ],
    checkedIngredients: new Map(),
    choosen_period: "week",
    scales : {},
    type_of_meal: [
      { label: "Month", value: "month" },
      { label: "3 Months", value: "3-months" }
    ],
    placeholder_1: {
      label: "Week",
      value: "week"
    },
    placeholder_2: {
      label: "Pick a meal",
      value: "0"
    },

    gauge_label: "",
    gauge_value: 0,
    gauge_sex: "",
    labels_array: []
  };

  _storeData = async token => {
    console.log("Storing Token: " + token);
    try {
      await AsyncStorage.setItem("token", token);
      this.setState({ user_token: token });
    } catch (error) {
      console.log(error);
    }
  };

  _removeData = async () => {
    // TODO Remove Fitbit flag
  };

  _retrieveData = async () => {
    console.log("HELLO");

    try {
      const value = await AsyncStorage.getItem("token");
      const email = await AsyncStorage.getItem("email");
      console.log(email);

      if (value !== null && email !== null) {
        // We have data!!
        this.setState({
          SharedLoading: false,
          user_token: value,
          user_email: email
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

  async componentDidMount() {
    await this._retrieveData();

    const today = new Date();
    const date = moment(today).format("D/MM");
    console.log(date);

    if (!this.state.SharedLoading) {
      this.getHeartStats();
      this.getHeartrateStats();
    }
  }

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
    this._removeData();
    this.props.navigation.navigate("Auth");
  }

  async getHeartStats() {
    var login_info = "Token " + this.state.user_token;
    console.log(
      `${API_URL}/health-stats/body/history/` +
        this.state.user_email +
        `?metric=heart&period=week`
    );

    await fetch(
      `${API_URL}/health-stats/body/history/` +
        this.state.user_email +
        `?metric=heart&period=` +
        this.state.choosen_period,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: login_info
        }
      }
    )
      .then(this.processResponse)
      .then(res => {
        const { statusCode, responseJson } = res;

        if (statusCode == 401) {
          this.processInvalidToken();
        } else {
          if (this.state.choosen_period == "week") {
            let labels = [];
            let chartData = [];
            let dataSourceWeek = [];
            for (var i = 0; i < responseJson.message.history.length; i++) {
              console.log(
                moment(
                  responseJson["message"]["history"][i]["dateTime"]
                ).format("D/MM")
              );
              labels.push(
                moment(
                  responseJson["message"]["history"][i]["dateTime"]
                ).format("D/MM")
              );
              chartData.push(responseJson["message"]["history"][i]["value"]);
              dataSourceWeek.push({
                day: moment(
                  responseJson["message"]["history"][i]["dateTime"]
                ).format("D MMMM"),
                value: responseJson["message"]["history"][i]["value"]
              });
            }

            console.log(labels);

            this.setState({
              Loading: false,
              labels: labels,
              chartData: [{ data: chartData },],
              dataSourceMetrics: dataSourceWeek.reverse()
            });
            console.log(this.state.chartData);
          }else if (this.state.choosen_period == "month") {
            let labels = [];
            let chartData = [];
            //console.log("Length: "+responseJson.message.history.length/4);
            /*for (var i = 0; i < responseJson.message.history.length; i=i+4) {
              
              labels.push(
                moment(
                  responseJson["message"]["history"][i]["dateTime"]
                ).format("D/MM")
              );
              
            }*/

            for (var i = 0; i < responseJson.message.history.length; i++) {
              
              
              chartData.push(responseJson["message"]["history"][i]["value"]);
              labels.push(
                moment(
                  responseJson["message"]["history"][i]["dateTime"]
                ).format("D/MM")
              );
              
            }

            console.log(labels);

            this.setState({
              Loading: false,
              labels: labels,
              chartData: [{ data: chartData }],
            });
            console.log(this.state.chartData);
          }else if (this.state.choosen_period == "3-months") {
            let labels = [];
            let chartData = [];
            //console.log("Length: "+responseJson.message.history.length/4);
            /*for (var i = 0; i < responseJson.message.history.length; i=i+12) {
              
              labels.push(
                moment(
                  responseJson["message"]["history"][i]["dateTime"]
                ).format("D/MM")
              );
              
            }*/

            for (var i = 0; i < responseJson.message.history.length; i++) {
              
              
              chartData.push(responseJson["message"]["history"][i]["value"]);
              labels.push(
                moment(
                  responseJson["message"]["history"][i]["dateTime"]
                ).format("D/MM")
              );
              
            }

            console.log(labels);

            this.setState({
              Loading: false,
              labels: labels,
              chartData: [{ data: chartData }],
            });
            console.log(this.state.chartData);
          }
        }
      })
      .catch(error => {
        console.log(error);
        //this._storeData(responseJson.token);
      });
  }

  renderItem = ({ item, index }) => {
    console.log("Reservas!!!", item);

    {
      /*Aqui passar: ferias={item.ferias} */
    }

    return <HeartRateItem date={item.day} value={item.value} metrics={"bpm"} />;
  };

  _listEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          margin: 10,
          borderRadius: 10
        }}
      >
        <Text
          style={{
            fontSize: moderateScale(20),
            textAlign: "center",
            color: theme.black
          }}
        >
          Looks like you don't have any metrics yet ❤️
        </Text>
      </View>
    );
  };

  renderList() {
    const { searchType, refreshing } = this.state;

    if (this.state.Loading) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 0.85 }}>
          <FlatList
            Vertical
            showsVericalScrollIndicator={false}
            data={this.state.dataSourceMetrics}
            extraData={this.state.refresh}
            ListEmptyComponent={this._listEmptyComponent}
            ListFooterComponent={this.renderFooterList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.handleRefresh}
              />
            }
            renderItem={(item, index) => this.renderItem(item, index)}
            keyExtractor={val => val.date}
            initialNumToRender={2}
          />
        </View>
      );
    }
  }

  renderGauge(){
    if (this.state.Loading) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return(
        <GaugeHearthrate navigation={this.props.navigation} scales={this.state.scales} sex={this.state.gauge_sex} value={this.state.gauge_value} label={this.state.gauge_label} labels_array={this.state.labels_array} />
      )
    }
  }

  renderChart() {
    if (this.state.Loading) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <LineChart
          data={{
            labels: this.state.labels,
            datasets: this.state.chartData,
            legend: ["Heart Rate / Day"] // optional
          }}
          width={Dimensions.get("window").width - moderateScale(30)} // from react-native
          height={verticalScale(200)}
          withVerticalLabels={false}
          chartConfig={{
            backgroundGradientFrom: theme.primary_color,
            //backgroundGradientFromOpacity: 0,
            backgroundGradientTo: theme.primary_color_2,
            //backgroundGradientToOpacity: 0.5,
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={{
            borderRadius: 16
          }}
        />
      );
    }
  }

  handleChange = value => {
    this.setState({ choosen_period: value, Loading: true }, () => {
      this.getHeartStats();
    });
  };

  getHeartrateStats() {
    var login_info = "Token " + this.state.user_token;
    console.log(
      `${API_URL}/health-stats/body/heart-rate/` +
        this.state.user_email
    );

    fetch(
      `${API_URL}/health-stats/body/heart-rate/` +
        this.state.user_email,
      {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          Authorization: login_info
        }
      }
    )
      .then(this.processResponse)
      .then(res => {
        const { statusCode, responseJson } = res;
        console.log("-------------------Hearthrate--------------------")
        console.log(responseJson)
        if (statusCode == 401) {
          this.processInvalidToken();
        } else {
          //what we got on success
          this.setState({
            labels_array: responseJson.message.scale_sizes,
            scales: responseJson.message.scale,
            gauge_value: responseJson.message.avg_heart_rate,
            gauge_label: responseJson.message.label,
            gauge_sex: responseJson.message.sex
          })
          this.forceUpdate()

        }
      })
      .catch(error => {
        console.log(error);
      });

  }


  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.6 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.gray2,
              margin: 10,
              borderRadius: 20
            }}
          >
            <View style={{ flex: 0.2, flexDirection: "row" }}>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 10
                }}
              >
                <Ionicons
                  name={"md-heart"}
                  size={moderateScale(20)}
                  color={theme.red}
                />

                <Text
                  style={{
                    fontSize: moderateScale(18),
                    color: theme.black,
                    marginLeft: 5
                  }}
                >
                  Heart Rate
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View style={styles.inputView}>
                  <RNPickerSelect
                    placeholder={this.state.placeholder_1}
                    placeholderTextColor="black"
                    items={this.state.type_of_meal}
                    onValueChange={value => {
                      this.handleChange(value);
                    }}
                    style={{
                      ...pickerSelectStyles,
                      iconContainer: {
                        top: 10,
                        right: 12
                      }
                    }}
                    value={this.state.choosen_period}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: "yellow" }}
                    Icon={() => {
                      return (
                        <Ionicons
                          name="md-arrow-down"
                          size={18}
                          style={styles.icon}
                        />
                      );
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1.3,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Swiper 
                showsButtons={false}
                showsPagination={true}
                
                loop={false}>
                  {this.renderGauge()}
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                  {this.renderChart()}
                </View>
              </Swiper>
            </View>
          </View>
        </View>
        <View style={{ flex: 0.4 }}>
          <View
            style={{
              flex: 0.15,
              backgroundColor: theme.primary_color,
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 10
            }}
          >
            <Ionicons
              name={"md-heart"}
              size={moderateScale(20)}
              color={theme.red}
            />

            <Text
              style={{
                fontSize: moderateScale(18),
                color: theme.white,
                marginLeft: 5
              }}
            >
              Heart Rate (Last 7 days)
            </Text>
          </View>
          {this.renderList()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputView: {
    width: "90%",
    backgroundColor: theme.gray2,
    color: theme.primary_color,
    borderColor: theme.primary_color_2,
    borderWidth: 2,
    borderRadius: 20,
    height: 45,
    justifyContent: "center",
    padding: 10
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 0.02 * height,
    paddingVertical: 12,
    paddingHorizontal: 10,
    height: height * 0.05,

    color: "black",
    fontWeight: "normal",
    paddingRight: 30 // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 0.02 * height,
    paddingHorizontal: 5,
    paddingVertical: 4,
    height: height * 0.05,
    color: "black",
    fontWeight: "normal",
    paddingRight: 30 // to ensure the text is never behind the icon
  }
});
