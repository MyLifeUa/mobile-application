import React, { Component } from "react";

import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import theme from "../constants/theme.style.js";
import NavigationService from "../components/NavigationService";

export default class ActionBarImage extends Component {
  state = {
    dataSource: {},
    isLoading: false,
    image:
    "https://www.brownweinraub.com/wp-content/uploads/2017/09/placeholder.jpg",
    data: [
      { name: "João Vasconcelos", type: "0" },
      { name: "Ponto Zero", type: "1" }
    ],

    errorMessage: ""
  };

  async componentDidMount() {
    //this.makeRemoteRequest();
  }
  async handleSwitch() {
    try {
      await AsyncStorage.setItem("SignedIn", "AppRestaurante");
      await AsyncStorage.setItem("currentUser", this.state.codigoRestaurante);
    } catch (error) {
      // Error saving data
    }
    NavigationService.navigate("AppRestaurante");
  }

  async changeProfile(value) {
    console.log("Tipo", value.type);
    const codutilizador = await AsyncStorage.getItem("cod");
    const codRestaurante = await AsyncStorage.getItem("codRestaurante");
    if (value.type == 1) {
      console.log("Adeus");
      try {
        await AsyncStorage.setItem("SignedIn", "AppRestaurante");
        await AsyncStorage.setItem("currentUser", codRestaurante);
      } catch (error) {
        console.log(error);
      }
      NavigationService.navigate("AppRestaurante");
    } else if (value.type == 0) {
      NavigationService.navigate("AreaPessoal", { userID: codutilizador });
    }
  }

  async makeRemoteRequest() {
    const codutilizador = await AsyncStorage.getItem("cod");

    return fetch(
      "http://www.prato.pt/webservices/get-profile_image.php?idutilizador=" +
        codutilizador +
        "&tipo=" +
        this.props.tipo
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          dataSource: responseJson,

          errorMessage: ""
        });

        //console.log(responseJson);
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          dataSource: [
            {
              codutilizador: "90",
              imagem: "http://www.prato.pt/files/images/placeholder.jpg"
            }
          ]
        });
      });
  }
  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;
    return (
      <TouchableOpacity
        underlayColor="cornflowerblue"
        onPress={() => {
          console.log("Clicked");
        }}
      >
        <View style={[styles.dropdown_2_row, { backgroundColor: "white" }]}>
          <Image
            style={styles.dropdown_2_image}
            mode="stretch"
            source={{ uri: rowData.imagem }}
          />
          <Text style={[styles.dropdown_2_row_text, { color: theme.black }]}>
            {`${rowData.name} `}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  _dropdown_2_renderButtonText(rowData) {
    const { name, age } = rowData;
    return `${name} ▼`;
  }

  render() {
    if (this.state.isLoading) {
      return <ActivityIndicator size="large" />;
    } else {
      return (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              NavigationService.navigate("Profile");
            }}
          >
            {/* <TouchableOpacity onPress = {()=>{this._dropdown_5 && this._dropdown_5.show();}}>
            <View style = {{height:40, alignItems:'center',flexDirection:'row'}}>
                <ModalDropdown 
                  ref={el => this._dropdown_5 = el}
                  defaultIndex={0}
                  renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}

                  defaultValue={this.state.dataSource[0].name+' ▼'}
                  options={this.state.dataSource}
                  onSelect={(index,value) => this.changeProfile(value)}
                  style={styles.modalPicker2}
                  renderRow={this._dropdown_2_renderRow.bind(this)}
                  
                  textStyle={{fontSize:16,color:'white'}}>
                  
              
                </ModalDropdown>
            </View>
          </TouchableOpacity>*/}

            <Image
                  source={{ uri: this.state.image }}
                  style={{
                width: 40,
                height: 40,
                borderRadius: 40 / 2,
                marginRight: 15,
                borderWidth: 1,
                borderColor: theme.gray2
              }}
            />
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  dropdown_2_image: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,

    borderWidth: 2,
    borderColor: theme.primary_color
  },
  modalPicker2: {
    width: 180,
    height: 40,
    marginLeft: 10,
    justifyContent: "center",

    borderRadius: 16
    //marginVertical:8,
  },
  dropdown_2: {
    alignSelf: "flex-end",
    width: 150,
    marginTop: 32,
    right: 8,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: "cornflowerblue"
  },
  dropdown_2_text: {
    marginVertical: 10,
    //marginHorizontal: 6,
    fontSize: 18,
    color: "white",
    textAlign: "center",
    textAlignVertical: "center"
  },
  dropdown_2_dropdown: {
    width: 150,
    height: 300,
    borderColor: "cornflowerblue",
    borderWidth: 2,
    borderRadius: 3
  },
  dropdown_2_row: {
    flexDirection: "row",
    height: 40,
    marginVertical: 5,
    paddingHorizontal: 5,
    alignItems: "center"
  },

  dropdown_2_row_text: {
    fontSize: 16,
    marginLeft: 5,
    color: "navy",
    textAlignVertical: "center"
  },
  dropdown_2_separator: {
    height: 1,
    backgroundColor: "cornflowerblue"
  }
});
