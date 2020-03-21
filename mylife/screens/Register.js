//This is an example code for Bottom Navigation//
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../constants/theme.style.js';
import { scale,verticalScale, moderateScale } from 'react-native-size-matters';
import { Icon } from 'react-native-elements'

//import react in our code.
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Text,
    KeyboardAvoidingView,
    Dimensions
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('screen');
//import all the basic component we have used

export default class Register extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
    state = {
        email:'',
        first_name:'',
        last_name:'',
        password:'',
        height :'',
        weight_goal:'',
        birthday:'',
        phone_number:null,
        photo:null,
    }
  }

  componentDidMount(){
    
  }

  makeLoginRequest(){
      //unsecure way to send a post
    fetch('https://mywebsite.com/endpoint/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ //change these params later
            email:'',
            first_name:'',
            last_name:'',
            password:'',
            height :'',
            weight_goal:'',
            birthday:'',
            phone_number:null,
            photo:null,
        }),
      });
  }

  uploadPhoto(){
      //stuff here to upload or just update base64 of image?
  }

  render() {
    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
            

            <Text style={styles.register_title}>Registo</Text>

            <View style={{flexDirection:'row' ,justifyContent:'center', alignContent:'center',paddingVertical:10}}>
                    <Image style={{
                        width: moderateScale(100),
                        height: moderateScale(100),
                        borderColor:'white',
                        resizeMode: 'contain',
                        }} source={require('../assets/tomas.png')} />
            </View>

            <TouchableOpacity onPress={() => this.uploadPhoto()} style={styles.photoButton}>
                <Text style={styles.photoText}><Icon name='md-camera' color='#00aced'/> Upload Photo</Text>
            </TouchableOpacity>
                
            <ScrollView style={{width:'100%'}}>
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
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Birthdate" 
                            placeholderTextColor="#003f5c"
                            onChangeText={text => this.setState({birthday:text})}/>
                    </View>

                    {/* Intro */}
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Phone Number (optional)" 
                            placeholderTextColor="#003f5c"
                            onChangeText={text => this.setState({phone_number:text})}/>
                    </View>

                    {/* Intro */}
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Current Height" 
                            placeholderTextColor="#003f5c"
                            onChangeText={text => this.setState({height:text})}/>
                    </View>

                    {/* Intro */}
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Weight Goal" 
                            placeholderTextColor="#003f5c"
                            onChangeText={text => this.setState({weight_goal:text})}/>
                    </View>

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
        borderRadius:25,
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