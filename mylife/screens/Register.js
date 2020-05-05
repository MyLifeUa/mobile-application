//This is an example code for Bottom Navigation//
import React, { PureComponent } from 'react';
import theme from '../constants/theme.style.js';
import { scale,verticalScale, moderateScale } from 'react-native-size-matters';
import { Icon, CheckBox } from 'react-native-elements'

//import react in our code.
import {
    View, 
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Picker,
    TextInput,
    DatePickerAndroid,
    Text,
    AsyncStorage,
    KeyboardAvoidingView,
    Dimensions,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
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
    diabetic: false,
    colesterol: false,
    weight_goal:'',
    birthday:'Birthdate',
    sex:'M',
    phone_number:'',
    photo:'https://www.healthredefine.com/wp-content/uploads/2018/02/person-placeholder.jpg',
    photo_base64:''
  }

  componentDidMount(){
    
  }

  _storeData = async (token) => {
    console.log("Storing Token: "+token)
    try {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('email', this.state.email);

        this.setState({user_token:token})
  
    } catch (error) {
        console.log(error)
    }
};

  makeRegisterRequest(){
      //unsecure way to send a post
    if (this.state.email=='' || this.state.first_name=='' || this.state.last_name=='' || this.state.password=='' || this.state.height=='' || this.state.current_weight=='' || this.state.weight_goal=='' || this.state.birthday=='Birthday' || this.state.sex=='') {
        alert("Fill in the required information!")
    } else {
        console.log("Fetching:" + `${API_URL}/clients`)
        console.log(JSON.stringify({ //change these params later
            email:this.state.email,
            first_name:this.state.first_name,
            last_name:this.state.last_name,
            password:this.state.password, //this shouldnt go out as clear text
            height :this.state.height,
            sex: this.state.sex,
            has_high_colesterol: this.state.colesterol,
            is_diabetic: this.state.diabetic,
            current_weight:this.state.current_weight,
            weight_goal:this.state.weight_goal,
            birth_date:this.state.birthday,
            phone_number:this.state.phone_number,
            photo:this.state.photo_base64,
        }))
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
            has_high_colesterol: this.state.colesterol,
            is_diabetic: this.state.diabetic,
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
                this.makeLoginRequest();
            }
      })
      .catch((error) => {
          alert("Error fetching login")
          console.error(error);
      });
    }
    
  }

  makeLoginRequest(){
    //unsecure way to send a post
  
    console.log("Fetching:" + `${API_URL}/login`)
    fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        username: this.state.email,
        password: this.state.password,
        }),
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        if (json.detail != undefined){
            //Credentials incorrect
            alert("Login Credentials are invalid.")
        }
        else { 
        this._storeData(json.token)
            
        this.props.navigation.navigate('FitbitAuth')
        }
    })
    .catch((error) => {
        alert("Error fetching login")
        console.error(error);
    });
  
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
                birthday: year.toString() + '-' + (month+1).toString() + '-' + day.toString(),
              })
            }
          } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
          }

        }
      }

    onChanged(text){
        let newText = '';
        let numbers = '0123456789';
    
        for (var i=0; i < text.length; i++) {
            if(numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                alert("Please enter numbers only.");
            }
        }
        this.setState({ phone_number: newText });
    }

    async setSelectedGender(gender) {
        console.log("New gender: " + gender)
        await this.setState({
            sex: gender
        })
    }

  render() {  
    return (
        <KeyboardAvoidingView style={styles.container} enabled>
            


            <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center' }}>
                    <Image style={{
                        width: moderateScale(130),
                        height: moderateScale(130),
                        borderColor:'white',
                        resizeMode: 'contain',
                        borderWidth:2
                        }} source={{uri:this.state.photo}} />
            </View>

            

            <TouchableOpacity style={styles.photoButton} onPress={()=>{
                      this.selectPicture()
                      }
                    }>
                <Text style={styles.photoText}> Upload Photo</Text>
            </TouchableOpacity>
                
            <ScrollView style={{width:'100%', maxHeight:verticalScale(250)}}>
                <View style={styles.containerScroll}>

                    {/* FN */}
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="First Name" 
                            placeholderTextColor="#003f5c"
                            onChangeText={text => this.setState({first_name:text})}/>
                    </View>

                    {/* LN */}
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Last Name" 
                            placeholderTextColor="#003f5c"
                            onChangeText={text => this.setState({last_name:text})}/>
                    </View>

                    {/* Intro */}
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Email" 
                            placeholderTextColor="#003f5c"
                            onChangeText={text => this.setState({email:text})}/>
                    </View>

                    {/* Password */}
                    <View style={styles.inputView} >
                        <TextInput  
                            secureTextEntry
                            style={styles.inputText}
                            placeholder="Password" 
                            placeholderTextColor="#003f5c"
                            onChangeText={text => this.setState({password:text})}/>
                    </View>

                    {/* Intro */}
                    <TouchableOpacity onPress={() => this.openDatepicker()} style={styles.inputView}>
                        <Text style={styles.inputText}>{this.state.birthday}</Text>
                    </TouchableOpacity>

                    {/* Intro */}
                    {/* Only working for portuguese numbers */}
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Phone Number (optional)" 
                            placeholderTextColor="#003f5c"
                            keyboardType='numeric'
                            onChangeText={(text)=> this.onChanged(text)}
                            maxLength={9}/> 
                    </View>

                    {/* Intro */}
                        <Picker
                            selectedValue={this.state.sex}
                            style={styles.inputView}
                            onValueChange={(itemValue,itemIndex) => this.setSelectedGender(itemValue)}
                        >
                            <Picker.Item label="Male" value="M" />
                            <Picker.Item label="Female" value="F" />
                        </Picker>

                    {/* Intro */}
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Current Height (Ex: 183 (cm))" 
                            placeholderTextColor="#003f5c"
                            maxLength={3}
                            keyboardType={'numeric'}
                            onChangeText={text => this.setState({height:text})}/>
                    </View>

                    {/* Current Weight */}
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Current Weight (Ex: 75 (kg))" 
                            placeholderTextColor="#003f5c"
                            maxLength={3}
                            keyboardType={'numeric'}
                            onChangeText={text => this.setState({current_weight:text})}/>
                    </View>

                    {/* Intro */}
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Weight Goal (Ex: 70 (kg))" 
                            placeholderTextColor="#003f5c"
                            maxLength={3}
                            keyboardType={'numeric'}
                            onChangeText={text => this.setState({weight_goal:text})}/>
                    </View>


                    <CheckBox
                            style={styles.inputView} 
                            title='Are you diabetic?'
                            checked={this.state.diabetic}
                            onPress={() => this.setState({diabetic: !this.state.diabetic})}
                            />
                    
                    <CheckBox
                            style={styles.inputView} 
                            title='Do you have high colesterol?'
                            checked={this.state.colesterol}
                            onPress={() => this.setState({colesterol: !this.state.colesterol})}
                            />
                    

                </View>
            </ScrollView>
 
            <TouchableOpacity onPress={() => this.makeRegisterRequest()} style={styles.loginBtn}>
                <Text style={styles.loginText}>REGISTER</Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>

    );
  }
}

const styles = StyleSheet.create({
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
        flex: 1,
        backgroundColor: theme.primary_color,
        alignItems: 'center',
        paddingVertical:10,
        justifyContent: 'center',
    },

    containerScroll:{
        flex: 1,
        width:'100%',
        height:'20%',
        backgroundColor: theme.primary_color,
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputView:{
        width:"80%",
        backgroundColor:theme.white,
        color:theme.primary_color,
        borderRadius:20,
        height:45,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    
    inputText:{
        height:40,
        color:theme.primary_color,
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
        color:theme.white,
        fontWeight:'bold'
    },

    logo_text:{
        fontSize:theme.h1,
        color:theme.white,
        fontWeight:'bold'
    }
});