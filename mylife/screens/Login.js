//This is an example code for Bottom Navigation//
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../constants/theme.style.js';
import { scale,verticalScale, moderateScale } from 'react-native-size-matters';

//import react in our code.
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Text,
    Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('screen');
//import all the basic component we have used

export default class Login extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
    state = {
        email:'',
        password:'',
    }
  }

  makeRemoteRequest(){
      
  }

  render() {
    return (
        <View style={styles.container}>
            
            {/* Imagem e logo */}
            <Image style={{
                width: moderateScale(100),
                height: moderateScale(100),
                resizeMode: 'contain',
                }} source={require('../assets/icon.png')} />


            <View style={styles.inputView} >
                <TextInput  
                    style={styles.inputText}
                    placeholder="Email..." 
                    placeholderTextColor="#003f5c"
                    onChangeText={text => this.setState({email:text})}/>
            </View>

            <View style={styles.inputView} >
                <TextInput  
                    secureTextEntry
                    style={styles.inputText}
                    placeholder="Password..." 
                    placeholderTextColor="#003f5c"
                    onChangeText={text => this.setState({password:text})}/>
            </View>

            <TouchableOpacity>
                <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.loginText}>Signup</Text>
            </TouchableOpacity>

  
        </View>

    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: theme.primary_color,
        alignItems: 'center',
        paddingVertical:20,
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
        height:50,
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
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },

    loginText:{
        color:"white"
    },

    logo_text:{
        fontSize:theme.h1,
        color:theme.white,
        fontWeight:'bold'
    }
});