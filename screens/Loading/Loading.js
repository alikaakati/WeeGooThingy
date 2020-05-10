import React from 'react';
import { StyleSheet, Text, View, Dimensions,Image,Alert, Button,AsyncStorage } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase';
import styles from './styles/Loading';
// FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyDZsDfuaYFgc3t_rA5RZydLoLo0MftZmLo",
  authDomain: "weego-2c9a4.firebaseapp.com",
  databaseURL: "https://weego-2c9a4.firebaseio.com",
  projectId: "weego-2c9a4",
  storageBucket: "weego-2c9a4.appspot.com",
  messagingSenderId: "428713023809",
  appId: "1:428713023809:web:91a21391f46c3a28bbe9c0"
};
// FIREBASE INITIALIZATION
firebase.initializeApp(firebaseConfig);

export default class Loading extends React.Component {
    constructor(props){
        super(props);
        this.state={
            DeviceID : Expo.Constants.deviceId,
            permission : false
        }
    }

  componentDidMount(){
    this.login();
  }
  _getLocationAsync = async () => {
    try {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied'
        });
        return;
      }
      else{
      this.state.permission = true;
      let location = await Location.getCurrentPositionAsync({});
      this.setState({ location });
      console.log(location);
      }
    //  console.log(this.state.location);
  //    console.log('//////////');
    } catch (error) {
      let status = Location.getProviderStatusAsync();
      if (!status.locationServicesEnabled) {
        this.state.permission = false;
      }
    }
  };

  login = async()=>{
      const username = await AsyncStorage.getItem('username');
      const password = await AsyncStorage.getItem('password');
      const type = await AsyncStorage.getItem('type');
      console.log(username + password + type);
      firebase.database().ref('drivers/'+username).once('value',(snapshot) => {
          if(snapshot.exists()){
            console.log('Yes');
            let dbPass = snapshot.val().password;
            let verified = snapshot.val().verified;
            if(password == dbPass){
              if(verified == true){
                if(type=='drivers'){
                  this.props.navigation.navigate('HomeDriver');
                  return;
                }
                if(type=='passengers'){
                  this.props.navigation.navigate('HomePassenger');
                  return;
                }
              }
          }
        }
        else{
          console.log("NO");
          this.props.navigation.navigate('Type');
          return;
        
        }
      });

  }
  
  
  render(){
    return(
      <View>
          <Image source={require('../../images/icon.png')} style={styles.logo} />
      </View>
    );
  }
}