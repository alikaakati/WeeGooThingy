import React from 'react'
import { StyleSheet, View, Button, TextInput,Alert,Text,TouchableOpacity,Image,AsyncStorage} from 'react-native'
import * as firebase from 'firebase';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Modal from 'react-native-modal';
import { Notifications } from 'expo';
import styles from './styles/Login';
export default class LoginDriver extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            DriverID:'',
            password:'',
            DeviceID:Expo.Constants.deviceId


        }
    }
    registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = await Notifications.getExpoPushTokenAsync();
          this.state.pushToken = token;
          console.log(token);
          return token;
        } else {
          alert('Must use physical device for Push Notifications');
        }
    
        if (Platform.OS === 'android') {
          Notifications.createChannelAndroidAsync('default', {
            name: 'default',
            sound: true,
            priority: 'max',
            vibrate: [0, 250, 250, 250],
          });
        }
      };


    login = async() =>{
        let db=firebase.database();
        let navigation=this.props.navigation;
        let DriverID = this.state.DriverID;
        let password = this.state.password;
        if(DriverID == '' || password == ''){
            Alert.alert('Please fill in all the fields');
            return;
        }
        else{
            db.ref('drivers/'+DriverID).once('value',async(snapshot) =>{
                if(snapshot.exists()){
                    let dbPass = snapshot.val().password;
                    let verified = snapshot.val().verified;
                    let age = snapshot.val().age;
                    let coins = snapshot.val().coins;
                    let fullname = snapshot.val().fullname;
                    let rating = snapshot.val().rating;
                    let gender = snapshot.val().gender;
                    let smoker = snapshot.val().smoker;
                    if(dbPass != password){
                        Alert.alert('Error while logging in');
                    }
                    if(dbPass == password && verified == false){
                        Alert.alert('Not verified yet')
                    }
                    if(dbPass == password && verified == true){
                        
                        await AsyncStorage.setItem('username', DriverID);
                        
                        await AsyncStorage.setItem('password', password);
                        
                        await AsyncStorage.setItem('age', age);
                        
                        await AsyncStorage.setItem('coins', coins.toString());
                        await AsyncStorage.setItem('fullname', fullname);
                        await AsyncStorage.setItem('rating', rating.toString());
                        await AsyncStorage.setItem('gender', gender);
                        await AsyncStorage.setItem('smoker', smoker);
                        await AsyncStorage.setItem('type', 'drivers');
                        let temp = (await AsyncStorage.getItem('type')).toString();
                        Alert.alert(temp);

                        let myPushToken = await this.registerForPushNotificationsAsync();
                        console.log(myPushToken);
                        await firebase.database().ref('drivers/'+DriverID+'/pushtoken').set(myPushToken);
                        navigation.navigate('HomeDriver')
                    }
                }
                else{
                    Alert.alert('Error while logging in');
                }
            })
        }
    }
    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.title}>
                    Log in as a driver
                </Text>
                <Image source={require('../../images/icon.png')} style={styles.logo} />
                <TextInput style={styles.input} placeholder='ID' textAlign={'center'} onChangeText={(ID) => this.state.DriverID = ID} />
                <TextInput style={styles.input} placeholder='Password' secureTextEntry={true} textAlign={'center'} onChangeText={(password) => this.state.password = password} />
                <TouchableOpacity style={styles.button} onPress={this.login}>
                    <Text style={styles.buttonText}>
                        Login
                    </Text>
                </TouchableOpacity>
                <Text>Dont have an account ? {'\n'}<Text onPress={this.goToRegistrationPage}>Register !</Text></Text>
            </View>
        );
    }
}