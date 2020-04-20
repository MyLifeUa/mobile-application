//This is an example code for Bottom Navigation//
import React from 'react';
import theme from '../constants/theme.style.js';
import { scale,verticalScale, moderateScale } from 'react-native-size-matters';
import CheckBox from 'react-native-check-box';

import Constants from 'expo-constants';//import react in our code.
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
    RefreshControl

} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { ScrollView,FlatList } from 'react-native-gesture-handler';
import themeStyle from '../constants/theme.style.js';
const { width, height } = Dimensions.get('screen');
const API_URL = 'http://mednat.ieeta.pt:8442';

//import all the basic component we have used

export default class Register extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
  }
  state = {
    email:'',
    first_name:'',
    last_name:'',
    password:'',
    height :'',
    current_weight:'',
    weight_goal:'',
    day:'Pick a day',
    sex:'',
    phone_number:'',
    photo:'../assets/tomas.png',
    photo_base64:'',
    number_of_servings:'',
    choosen_type_of_meal:'',
    dataSourceIngredients:[{"compare": false, "Name": "Arroz de Pato", "Calories": 30,"Proteins":30,"Fat":40,"Carbs":50,"id":1,"quantity":100}],
    type_of_meal:[
        { label: 'Traditional', value: 'Traditional' },
        { label: 'Fast Food', value: 'Fast Food' },
       
    ],
    placeholder_1: {
        label: 'Pick a type of meal',
        value: '0',
    },
    placeholder_2: {
        label: 'Pick a meal',
        value: '0',
    },
  }

  async componentDidMount(){

    //this.handleIngredients();
    
  }

  async handleIngredients() {

    var login_info = "Token "+this.state.user_token;
    console.log("adeus")

    fetch(`${API_URL}/meals`, {
        method: 'GET',
        headers: {
        "Content-Type": "application/json",
        "Authorization": login_info
        }

    }).then((response) => response.json())
      .then((responseJson) => {
        let mealDropdown = [];
        
        for(var i=0;i<responseJson.message.length;i++){
            mealDropdown.push({ label: responseJson.message[i].name, value: responseJson.message[i].id, compare:false})
        }
          

        this.setState({
          meals:mealDropdown
        })
        
        console.log("Dishes", mealDropdown);
        
    }).catch((error) => {
        console.log(error);
        
      })
      
  }

  makeRegisterRequest(){
      //unsecure way to send a post
    if (this.state.email=='' || this.state.first_name=='' || this.state.last_name=='' || this.state.password=='' || this.state.height=='' || this.state.current_weight=='' || this.state.weight_goal=='' || this.state.birthday=='Birthday' || this.state.sex=='') {
        alert("Fill in the required information!")
    } else {
        console.log("Fetching:" + `${API_URL}/clients`)
    fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ //change these params later
            email:this.state.email,
            first_name:this.state.first_name,
            last_name:this.state.last_name,
            password:this.state.password, //this shouldnt go out as clear text
            height :this.state.height,
            sex: this.state.sex,
            current_weight:this.state.current_weight,
            weight_goal:this.state.weight_goal,
            birth_date:this.state.birthday,
            phone_number:this.state.phone_number,
            photo:this.state.photo_base64,
        }),
      }).then((response) => response.json())
      .then((json) => {
            console.log(json);
            if (json.state == "Error"){
            //Credentials incorrect
                alert(json.message)
            }
            else { 
                //Navigate to home screen,  with fields: role, Token, data
                // So fazer o navigate if json.role == client
                alert(`Welcome to MyLife, ${this.state.first_name}!`)
            }
      })
      .catch((error) => {
          alert("Error fetching login")
          console.error(error);
      });
    }
    
  }

  // Get permissions from camera
  getPermissionAsync = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('To upload a photo, you must allow MyLife to access your gallery.');
      }
    }
  }

  selectPicture = async () => {
    await this.getPermissionAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        //aspect: [4, 3],
        base64: true,
    });


    if (!result.cancelled) {
        var base64image = result.base64.replace(/(?:\r\n|\r|\n)/g, '');
        this.setState({ photo: result.uri,photo_base64:base64image });
    }

    console.log(this.state)
    };


    openDatepicker = async () => {
        if (Platform.OS === 'android') { 
          try {
            const { action, year, month, day } = await DatePickerAndroid.open({
              // Use `new Date()` for current date.
              // May 25 2020. Month 0 is January.
              date: new Date(),
            });
            if (action !== DatePickerAndroid.dismissedAction) {
              this.setState({
                day: year.toString() + '-' + (month+1).toString() + '-' + day.toString(),
              })
            }
          } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
          }

        }
      }

      _listEmptyComponent = () => {
        return (
          <View style={{ flex:1,justifyContent:'center',alignItems:'center',padding:10,margin:10,borderRadius:10}} >
          <Text style={{fontSize:20,textAlign:'center',color:theme.black}}>Looks like you don't have any ingredients in this meal yet 🥫</Text>
        </View>
        )
    }

    renderItem = ({item, index}) => {
        //console.log("Reservas!!!",item)
        
                  {/*Aqui passar: ferias={item.ferias} */}
      return (
          <View style={{height:moderateScale(80),backgroundColor:"yellow",  borderBottomWidth: 1,borderColor:theme.gray}}>
              <View style={{flex:2,flexDirection:"row"}}>
                <View style={{flex:1.5,alignItems:"flex-start",justifyContent:"flex-end",marginLeft:20}}>
                    <Text style={{fontSize:20,color:theme.black,fontWeight:"600"}} >{item.Name}</Text>
                </View>
                <View style={{flex:1.5,flexDirection:"row",alignItems:"flex-end",justifyContent:"flex-end",marginRight:10}}>
                    <Text style={{fontSize:15,color:"gray",fontWeight:"400",marginBottom:5}} >Quantity: </Text>
                    <View style={styles.inputView3} >
                        <TextInput  
                            style={styles.inputText3}
                            placeholder="" 
                            
                            maxLength={4}
                            keyboardType={'numeric'}
                            onChangeText={text => this.setState({number_of_servings:text})}/>
                    </View>
                    
                </View>
              </View>
              <View style={{flex:1.5,justifyContent:"center",marginLeft:20}}>
              <Text style={{fontSize:15,color:"gray",fontWeight:"400"}} >{item.Calories} cal</Text>
              </View>

          </View>
      )
      
      
        
       }

    renderFooterList = () => {
        
    
        return (
          <View style={{paddingVertical:20}}>
            
      
      
          </View>
      
        )
      
      }

      renderList () {

        const {searchType,refreshing}=this.state;
    
        return (
        <View style={{flex:1}} >
            <FlatList
                Vertical
                showsVericalScrollIndicator={false}
                data={this.state.dataSourceIngredients}
                ListEmptyComponent={this._listEmptyComponent}
                ListFooterComponent={this.renderFooterList}


                refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={this.handleRefresh}
                />
                }
                renderItem={(item,index) => this.renderItem(item,index)}

                keyExtractor={val => val.id}
                initialNumToRender={2}           

                
                />
                
                    
                    
            
            </View>

        )
        
      }

  render() {  
    return (
        <View style={{height:moderateScale(100),  borderBottomWidth: 1,borderColor:theme.gray,flexDirection:"column"}}>
              <View style={{flex:2,flexDirection:"row"}}>
                <View style={{flex:2}}>
                  
                    <View style={{flex:2,alignItems:"flex-start",justifyContent:"flex-end",marginLeft:20}}>
                        <Text style={{fontSize:20,color:theme.black,fontWeight:"600"}} >{this.props.Name}</Text>
                    </View>
                    
                  
                  <View style={{flex:1.5,flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginLeft:20}}>
                    <Text style={{fontSize:15,color:"gray",fontWeight:"400"}} >{parseFloat(this.props.Calories).toFixed(0)} cal ({this.props.quantity} g)</Text>
                    
                    
                    
                  </View>
                  
                </View>
                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"flex-end",marginRight:30,marginBottom:10}}>
                        
                <CheckBox
                    style={{ padding: 15,height:20}}
                    onClick={() => {
                      this.props.change(this.props.id,this.props.checked)
                    }}
                    isChecked={this.props.checked}
                    leftText={"Prato disponível para Take-Away?"}
                    leftTextStyle={{ fontSize: 18 }}
                />
                      
                      
                </View>

              </View>

              <View style={{flex:1.5,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                <View style={{flex:1}}>
                <Text style={{fontSize:15,color:theme.primary_color_2,fontWeight:"bold",textAlign:"center"}} >Carbs</Text>
                  <Text style={{fontSize:15,color:"gray",fontWeight:"400",textAlign:"center"}} >{parseFloat(this.props.Carbs).toFixed(0)} g</Text>

                </View>
                <View style={{flex:1}}>
                  <Text style={{fontSize:15,color:theme.red,fontWeight:"bold",textAlign:"center"}} >Fat</Text>
                  <Text style={{fontSize:15,color:"gray",fontWeight:"400",textAlign:"center"}} >{parseFloat(this.props.Fats).toFixed(0)} g</Text>
      
                </View>
                <View style={{flex:1}}>
                <Text style={{fontSize:15,color:theme.green,fontWeight:"bold",textAlign:"center"}} >Protein</Text>
                  <Text style={{fontSize:15,color:"gray",fontWeight:"400",textAlign:"center"}} >{parseFloat(this.props.Proteins).toFixed(0)} g</Text>

                </View>
                  
                  
              </View>

              
              

          </View>

    );
  }
}

const styles = StyleSheet.create({
    secondHeaderText:{
        fontSize:moderateScale(20),
        textAlign:"left",
        width:"100%",
        color:"white",
        marginLeft:10,
        fontWeight:"500"
    },
    squaretext:{
        fontSize:moderateScale(20),
        textAlign:"center",
        width:"100%",
        color:"white",
        fontWeight:"bold"
    },
    squareView: {
        flex:1,
        width:moderateScale(75),
        height:moderateScale(75),
        marginVertical:width*0.03,
        marginHorizontal:moderateScale(11),
        borderRadius:moderateScale(10),
        backgroundColor:theme.primary_color_2,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    
      },
    
    addButton: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        backgroundColor:theme.primary_color,
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android
        width:moderateScale(70),
        height:moderateScale(70),
        right: 30,
        bottom: 30,
        borderRadius:40,
        position: 'absolute',
        justifyContent:'center',
        alignItems:'center'
    },
    loginGoogleButton: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        backgroundColor:'#fb5b5a',
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android
        width:moderateScale(150),
        height:moderateScale(40),
        margin: 10,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center'
    },
    loginButtonText: {
      textAlign:'center',
      color:"#FFF",
      fontWeight: '700',
      width:"100%",
      fontSize:moderateScale(25)
    },
    loginText:{
        color:'white'
    },
    photoText:{
        color:theme.primary_color
    },
    photoButton:{
        width:"80%",
        backgroundColor:theme.white,
        borderRadius:5,
        height:45,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },
    container:{
        marginTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight,
        flex: 1,
        //backgroundColor: theme.primary_color,
        alignItems: 'center',
        
        justifyContent: 'center',
    },

    containerScroll:{
        flex: 0.4,
        marginLeft:10,
        marginTop:10,
        //backgroundColor: theme.black,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },

    inputView:{
        width:"80%",
        backgroundColor:theme.white,
        color:theme.primary_color,
        borderColor:theme.primary_color_2,
        borderWidth:2,
        borderRadius:20,
        height:45,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    inputView3:{
        width:"30%",
        backgroundColor:theme.white,
        color:theme.primary_color,
        borderColor:theme.primary_color_2,
        borderWidth:2,
        borderRadius:10,
        height:10,
        
        justifyContent:"center",
        paddingVertical:12,
        paddingHorizontal:5
    },

    inputView_2:{
        flex:0.6,
        backgroundColor:theme.white,
        color:theme.primary_color,
        borderColor:theme.primary_color_2,
        borderWidth:2,
        borderRadius:20,
        height:45,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },

    birthday_placeholder:{
        fontSize: 0.02 * height,
        paddingHorizontal: 5,
        paddingVertical: 4,
        height: height * 0.05,
        color: '#FFFFFF',
        fontWeight: 'normal',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    
    inputText:{
        fontSize: 0.02* height,
        paddingHorizontal: 5,
        paddingVertical: 4,
        height: height * 0.05,
        color: 'black',
        fontWeight: 'normal',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputText3:{
        fontSize: 0.02 * height,
        textAlign:"center",
        paddingVertical: 2,
        height: height * 0.05,
        color: 'black',
        fontWeight: 'normal',
    },

    forgot:{
        color:theme.white,
        fontSize:14
    },
    
    loginBtn:{
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:45,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },

    register_title:{
        fontSize:theme.h2,
        color:theme.black,
        fontWeight:'bold'
    },

    logo_text:{
        fontSize:theme.h1,
        color:theme.white,
        fontWeight:'bold'
    },

    icon: {
        color: '#636e72'
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 0.02 * height,
      paddingVertical: 12,
      paddingHorizontal: 10,
      height: height * 0.05,
  
      color: 'black',
      fontWeight: 'normal',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 0.02 * height,
      paddingHorizontal: 5,
      paddingVertical: 4,
      height: height * 0.05,
      color: 'black',
      fontWeight: 'normal',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });