//This is an example code for Bottom Navigation//
import React from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet,Platform,StatusBar } from 'react-native';
//import all the basic component we have used
//import Ionicons to show the icon for bottom options
//For React Navigation 2.+ import following
//import {createStackNavigator,createBottomTabNavigator} from 'react-navigation';
//For React Navigation 3.+ import following
import {
  createDrawerNavigator,
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator,
  HeaderBackButton
} from 'react-navigation';

//import createStackNavigator, createBottomTabNavigator, createAppContainer in our project
import PratoEspecifico from './screens/PratoEspecifico';
import AreaPessoal from './screens/AreaPessoal';
import AreaPessoalOthers from './screens/AreaPessoalOthers';

import teste from './screens/teste';

import Galeria from './screens/Galeria';

import PesquisaPessoas from './screens/PesquisaPessoas';
import PratosRestauranteSide from './screens/PratosRestauranteSide';
import Registo from './screens/Registo';
import RegistarRestaurante from './screens/RegistarRestaurante';
import LoginconnectRestaurante from './screens/LoginconnectRestaurante';
import LoginEmailRestaurante from './screens/EmailLoginV2';


import RecoverPassword from './screens/RecoverPassword';
import Notifications from './screens/Notifications';
import PessoalDrawer from '../PratoAPP/PessoalDrawer';
import Help from './screens/Help';
import EmailLogin from './screens/EmailLogin';
import AdicionarMenu from './components/PratosDiaRestaurante/AdicionarMenu';
import ClickPrato from './components/PratosDiaRestaurante/ClickPrato';
import MenuPratos from './screens/MenuPratos';
import MenuPratosRestaurante from './screens/MenuPratosRestaurante'
import EditarPrato from './components/PratosDiaRestaurante/EditarPrato';
import OutrosPratos from './components/PratosDiaRestaurante/OutrosPratos';
import EditarPerfil from './components/AreaPessoal/EditarPerfil';
import AreaPessoalRestaurante from './screens/AreaPessoalRestaurante';


import RestauranteDrawer from '../PratoAPP/RestauranteDrawer';
import EditarPerfilRestaurante from './components/AreaPessoalRestaurante/EditarPerfilRestaurante';
import EnviarMensagem from './components/AreaPessoalRestaurante/EnviarMensagem';

import Restaurantes from './screens/Restaurantes';
import AllRestaurants from './screens/AllRestaurants';
import Statistics from './screens/Statistics';
import ShoppingCart from './screens/ShoppingCart';

import Restaurante from './screens/Restaurante';
import PedidosRestaurante from './screens/PedidosRestaurante';
import PedidosUtilizador from './screens/PedidosUtilizador';
import ListagemTakeAway from './screens/ListagemTakeAway';

import ReservasRestaurante from './screens/ReservasRestaurante';
import ReservasUser from './screens/ReservasUtilizador';

import Contactos from './screens/Contactos';
import SeguirCompleto from './screens/SeguirCompleto';
import Top100Completo from './screens/Top100Completo';

import Avaliacoes from './screens/Avaliacoes';
import SeguidoresCompleto from './screens/SeguidoresCompleto';
import SeguidoresCompletoOthers from './screens/SeguidoresCompletoOthers';

import RestauranteViews from './screens/RestauranteViewers';


import ActionBarImage from './components/ActionBarImage'


import Login from './screens/Login'
import AuthLoadingScreen from './components/auth/AuthLoadingScreen'


import PratosDoDia from './screens/PratosDoDia';
import Icon from './components/Icon';
import Rank from './screens/Rank';
import HeaderRightNavBar from './components/HeaderRightNavBar'
import HeaderRightNavBarRestaurante from './components/PratosDiaRestaurante/HeaderRightNavBarRestaurante';
import HeaderNavBar from './components/AreaPessoal/HeaderNavBar'
import { Ionicons } from '@expo/vector-icons';

const LoginStack = createStackNavigator( //SignedOut Stack
  {
    //Defination of Navigaton from home screen
    Login: { screen: Login ,
      navigationOptions: {
          header: null,
        }
    },
    EmailLogin: {screen: EmailLogin,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Entrar',

      }
    },
    Registo : {screen: Registo,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Registar',

      }
    },
    RecoverPassword : {screen: RecoverPassword,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Recuperar Palavra-Passe',

      }
    },
    RegistarRestaurante: {screen: RegistarRestaurante,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Registar Restaurante',
        
        }
    },
    LoginRestaurante: {screen: LoginconnectRestaurante,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Registar Restaurante',
        
        }
    },
    LoginEmailRestaurante: {screen: LoginEmailRestaurante,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Registar Restaurante',
        
        }
    },

  },
  {
    //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
    defaultNavigationOptions: {
      //Header customization of the perticular Screen
      
      headerStyle: {
        marginTop: Platform.OS === "android" ?  0 : 20  
      },
     
    }
    
  }
);

const PratosRestauranteSideStack = createStackNavigator(
  {
    //Defination of Navigaton from home screen
    PratosRestauranteSide: { screen: PratosRestauranteSide, 
      navigationOptions : {
        headerLeft: <ActionBarImage tipo={1} />,
      },
      params: {
        refreshing: false,
        
      },
    
    
    },
    Galeria : {screen: Galeria, 
        navigationOptions: {
          header:null,
        }}, 
    AdicionarMenu: { screen: AdicionarMenu },
    MenuPratosRestaurante: { screen: MenuPratosRestaurante, },
    ClickPrato: { screen: ClickPrato },
    EditarPrato: { screen: EditarPrato },
    Notifications: { screen: Notifications },
    Help: { screen: Help },
    OutrosPratos: { screen: OutrosPratos },
  },
  {
    //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
    defaultNavigationOptions: {
      //Header customization of the perticular Screen
      headerStyle: {
        backgroundColor: '#c73737',
        marginTop: Platform.OS === "android" ? 0 : 20
      },
      headerTintColor: '#FFFFFF',
      title: 'Pratos do Dia',
      headerRight: '',
      //headerLeft: <ActionBarImage tipo={1} />,

      //Header title
    },
    navigationOptions: {
      tabBarLabel: "Editar Menus",
      tabBarIcon: ({ tintColor }) => <Ionicons name="md-restaurant" size={25} color={tintColor} />
    }
  }
);

const AreaPessoalRestauranteSideStack = createStackNavigator(
  {
    //Defination of Navigaton from home screen
    AreaPessoalRestaurante: { screen: RestauranteDrawer,
      navigationOptions: {
        header:null,
      }
    },
    Galeria : {screen: Galeria, 
      navigationOptions: {
        header:null,
      }}, 
    EditarPerfilRestaurante: { screen: EditarPerfilRestaurante,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Editar Perfil',

      }
    },
    EnviarMensagem: {
      screen: EnviarMensagem,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Enviar Mensagem',
        headerTitleStyle: {
          fontSize: 20,
        }

      }
    },
    PedidosRestaurante:{screen: PedidosRestaurante, 
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Pedidos',

      }},
      AreaPessoalOthers: {
        screen: AreaPessoalOthers,
        navigationOptions: {
          headerStyle: {
            backgroundColor: '#c73737',
            marginTop: Platform.OS === "android" ? 0 : 20
          },
          headerTintColor: '#FFFFFF',
          title: 'Perfil',
  
        }
      },
    ReservasRestaurante: { screen: ReservasRestaurante, 
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Reservas',

      }},
  },
  {
    //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
    
    navigationOptions: {
      tabBarLabel: "Meu Restaurante",
      tabBarIcon: ({ tintColor }) => <Ionicons name="md-home" size={25} color={tintColor} />
    }
  }
);

AreaPessoalRestauranteSideStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.routes[navigation.state.index].routeName === 'Galeria') {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
    tabBarLabel: "Meu Restaurante",
    tabBarIcon: ({ tintColor }) => <Ionicons name="md-home" size={25} color={tintColor} />
  };
};

const HomeStack = createStackNavigator(
  {
    //Defination of Navigaton from home screen
    Home: { screen: Restaurantes },
    AllRestaurants: { screen: AllRestaurants},
    PedidosUtilizador:{screen: PedidosUtilizador}, //mudar para a versao final
    ReservasUser:{screen: ReservasUser}, //mudar para a versao final


    AreaPessoal: { screen: PessoalDrawer,
      navigationOptions: {
        header: null,
      }},
    AreaPessoalOthers: {
      screen: AreaPessoalOthers,
    },
    EditarPerfil : { screen : EditarPerfil },
    Restaurante: { screen: Restaurante ,
        navigationOptions: {
            header: null,
          }
    },
    teste : { screen: teste},

    PesquisaPessoas : { screen: PesquisaPessoas},
    ShoppingCart: { screen: ShoppingCart },
    Notifications: { screen: Notifications },
    Help: {screen: Help},
    Contactos: { screen: Contactos },
    SeguirCompleto: { screen: SeguirCompleto },
    Top100Completo: { screen: Top100Completo },
    Avaliacoes: {screen: Avaliacoes},
    SeguidoresCompleto: { screen: SeguidoresCompleto },
    SeguidoresCompletoOthers: {screen: SeguidoresCompletoOthers},
    ListagemTakeAway:{ screen: ListagemTakeAway ,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Take Away',
        headerLeft:'',
        headerRight:''
        
        }},
   
  },
  {
    //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
    defaultNavigationOptions: {
      //Header customization of the perticular Screen
      headerStyle: {
        backgroundColor: '#c73737',
        marginTop: Platform.OS === "android" ? 0 : 20,
      },
      headerTintColor: '#FFFFFF',
      title: 'O Prato',
      headerLeft: <ActionBarImage tipo={0} />,

      

      headerRight: (
        <HeaderRightNavBar/>
      )
      //Header title
    },
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon os={Platform.os} icon="home" color={tintColor}   />
    }
  }
);

const PratosStack = createStackNavigator(
  {
    //Defination of Navigaton from home screen
    PratosDoDia: { screen:PratosDoDia, },
    ReservasUser:{screen: ReservasUser}, //mudar para a versao final
    ClickPrato: { screen: ClickPrato },
    MenuPratos: { screen: MenuPratos ,navigationOptions: {
      tabBarLabel:'',
      title:'',
    }},
    AreaPessoalOthers: {
      screen: AreaPessoalOthers,
    },
    AreaPessoal: {
      screen: PessoalDrawer,
      navigationOptions: {
        header: null,
      }
    },
    Galeria : {screen: Galeria, 
      navigationOptions: {
        header:null,
      }}, 
    EditarPerfil: { screen: EditarPerfil },
    PesquisaPessoas : { screen: PesquisaPessoas},
    Restaurante : { screen: Restaurante,
        navigationOptions: {
            header:null,
          }
    },
    ShoppingCart: { screen: ShoppingCart },
    Notifications: { screen: Notifications },
    Help: { screen: Help },
    ListagemTakeAway:{ screen: ListagemTakeAway ,
      navigationOptions: {
        
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ? 0 : 20
        },
        headerTintColor: '#FFFFFF',
        title: 'Take Away',
        headerLeft:'',
        headerRight:''
        
        }},

   
  },
  {
    //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
    defaultNavigationOptions: {
      
      //Header customization of the perticular Screen
      headerStyle: {
        backgroundColor: '#c73737',
        marginTop: Platform.OS === "android" ?  0 : 20  

      },
      headerTintColor: '#FFFFFF',
      title: 'Pratos do Dia',
      headerLeft: <ActionBarImage tipo={0} />,

      headerRight: (
        <HeaderRightNavBar/>
      )
      //Header title
    },
    navigationOptions: {
      
    }
  }
);

PratosStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.routes[navigation.state.index].routeName === 'Galeria') {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
    tabBarLabel:'Pratos do Dia',
    tabBarIcon: ({ tintColor }) => <Icon os={Platform.os} icon="restaurant" color={tintColor}    />
  };
};

const SettingsStack = createStackNavigator(
  {
    //Defination of Navigaton from setting screen
    Rank: { screen: Rank },
    AreaPessoalOthers: {
      screen: AreaPessoalOthers,
    },
    PedidosRestaurante:{screen: PedidosRestaurante},
    ReservasUser:{screen: ReservasUser}, //mudar para a versao final


    AreaPessoal: {
      screen: PessoalDrawer,
      navigationOptions: {
        header: null,
      }
    },
    EditarPerfil: { screen: EditarPerfil },
    PesquisaPessoas : { screen: PesquisaPessoas},
    Restaurante : { screen: Restaurante },
    ShoppingCart: { screen: ShoppingCart },
    Notifications: {screen: Notifications},
    Help: { screen: Help },

  },
  {
    //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
    defaultNavigationOptions: {
      //Header customization of the perticular Screen
      headerStyle: {
        backgroundColor: '#c73737',
        marginTop: Platform.OS === "android" ?  0 : 20  

      },
      headerTintColor: '#FFFFFF',
      title: 'Rank',
      headerLeft: <ActionBarImage tipo={0} />,

      headerRight: (
        <HeaderRightNavBar/>
      )
      
      //Header title
    },
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon os={Platform.os} icon="trophy" color={tintColor}    />
    }
  }
);

const ReservasStack = createStackNavigator(
    {
      //Defination of Navigaton from setting screen
      ReservasRestaurante:{screen: ReservasRestaurante},
      Help: { screen: Help },
  
    },
    {
      //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
      defaultNavigationOptions: {
        //Header customization of the perticular Screen
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ?  0 : 20  
  
        },
        headerTintColor: '#FFFFFF',
        title: 'Reservas',
        headerLeft: <ActionBarImage tipo={0} />,
  
        headerRight: (
          <HeaderRightNavBar/>
        )
        
        //Header title
      },
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon os={Platform.os} icon="people" color={tintColor}    />
      }
    }
  );

  const TakeAwayStack = createStackNavigator(
    {
      //Defination of Navigaton from setting screen
      PedidosRestaurante:{screen: PedidosRestaurante},
      Help: { screen: Help },
  
    },
    {
      //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
      defaultNavigationOptions: {
        //Header customization of the perticular Screen
        headerStyle: {
          backgroundColor: '#c73737',
          marginTop: Platform.OS === "android" ?  0 : 20  
  
        },
        headerTintColor: '#FFFFFF',
        title: 'Take-Away',
        headerLeft: <ActionBarImage />,
  
        headerRight: (
          <HeaderRightNavBar/>
        )
        
        //Header title
      },
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon os={Platform.os} icon="people" color={tintColor}    />
      }
    }
  );

const StatsStack = createStackNavigator(
    {
        //Defination of Navigaton from setting screen
        Statistics: { screen: Statistics },
        ReservasRestaurante:{screen: ReservasRestaurante},
        ShoppingCart: { screen: ShoppingCart },
        Notifications: {screen: Notifications},    
        Help: { screen: Help },   
        RestauranteViews: {
            screen: RestauranteViews,
            navigationOptions :
            {
                headerLeft:'',
                title:'Visualizações',
                tabBarLabel:'Visualizações'
            }
            },
            AreaPessoalOthers: {
              screen: AreaPessoalOthers,
            },
      },
      {
        //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
        defaultNavigationOptions: {
          //Header customization of the perticular Screen
          headerStyle: {
            backgroundColor: '#c73737',
            marginTop: Platform.OS === "android" ?  0 : 20  

          },
          headerTintColor: '#FFFFFF',
          title: 'Estatísticas',
          headerRight: '',
          headerLeft: <ActionBarImage tipo={1} />,

          
          //Header title
        },
        navigationOptions: {
          tabBarLabel:"Estatísticas",
          tabBarIcon: ({ tintColor }) => <Ionicons name="md-stats" size={25} color={tintColor}/>
        }
      }
    );

const AppNavigator = createBottomTabNavigator( //Signed In Stack
  {
    //Login:{screen: LoginStack},
    //AdiconarPrato: { screen: AdicionarPratoStack},
    //PratosRestauranteSide : { screen: PratosRestauranteSideStack},
    //AreaPessoal: { screen: PessoalStack},
    //PratoEspecifico: { screen: PratoEspecificoStack }, // alterei Gual
    PratosDoDia: { screen: PratosStack },
    Restaurantes: { screen: HomeStack },
    Rank: { screen: SettingsStack },
    
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      
    }),
    tabBarOptions: {
      activeTintColor: '#c73737',
      inactiveTintColor: 'gray',
      
    },
  }
);


const AppNavigatorRestaurante = createBottomTabNavigator( //Signed In Stack
  {
    //Login:{screen: LoginStack},
    //AdiconarPrato: { screen: AdicionarPratoStack},
    //PratosRestauranteSide : { screen: PratosRestauranteSideStack},
    //AreaPessoal: { screen: PessoalStack},
    //PratoEspecifico: { screen: PratoEspecificoStack }, // alterei Gual
    Restaurantes: { screen: AreaPessoalRestauranteSideStack },
    PratosDoDia: { screen: PratosRestauranteSideStack },
    Statistics : { screen: StatsStack},
    
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      

      
    }),
    tabBarOptions: {
      activeTintColor: '#c73737',
      inactiveTintColor: 'gray',
      
    },
  }
);

const AppNavigatorLite = createBottomTabNavigator( //Signed In Stack
    {
      //Login:{screen: LoginStack},
      //AdiconarPrato: { screen: AdicionarPratoStack},
      //PratosRestauranteSide : { screen: PratosRestauranteSideStack},
      //AreaPessoal: { screen: PessoalStack},
      //PratoEspecifico: { screen: PratoEspecificoStack }, // alterei Gual
      TakeAway: { screen: TakeAwayStack },
      Reservas: { screen: ReservasRestaurante },
           
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        
      }),
      tabBarOptions: {
        activeTintColor: '#c73737',
        inactiveTintColor: 'gray',
        
      },
    }
  );

//For React Navigation 2.+ need to export App only
//export default App;
//For React Navigation 3.+

//Business Mode Routing, mudar nas opçoes
const AppNavigatorFinal = createSwitchNavigator(
    {
      App:{
        screen: AppNavigator
      },
      AppLite:{
        //estamos a testar a versao lite
        //agora so precisamos que o user de login para termos acesso ao codrestaurante
        screen: AppNavigatorLite
      },
      Auth:{
        screen: LoginStack
      },
      AuthLoading: AuthLoadingScreen,
      AppRestaurante:{
        screen:AppNavigatorRestaurante
      },

  },
  {
    initialRouteName: 'AuthLoading', 
  }
);

export default createAppContainer(AppNavigatorFinal);