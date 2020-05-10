import React from 'react'
import { StyleSheet, View, Button, TextInput,Alert,Text,TouchableOpacity,Image, AsyncStorage } from 'react-native'
import * as firebase from 'firebase';
import { Notifications } from 'expo';
import Constants from 'expo-constants';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
export default class HomeDriver extends React.Component{
    constructor(props){
        super(props);
        this.state={
            DriverID:null,
            fullname:null,
            gender:null,
            smoker:null,
            phone:null,
            rating:null,
            coins:null,
            age:null,
            hasTrip : null,
            tripInfo:null,
            PassingByText:null,
            passengers:null,
            finishedLoading : false
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

    initializeUser = async() =>{
        this.state.DriverID = await AsyncStorage.getItem('username');
        this.state.age = await AsyncStorage.getItem('age');
        this.state.coins = await AsyncStorage.getItem('coins');
        this.state.coins = parseInt(this.state.coins,10);
        this.state.fullname = await AsyncStorage.getItem('fullname');
        this.state.gender = await AsyncStorage.getItem('gender');
        this.state.phone = await AsyncStorage.getItem('phone');
        this.state.rating = await AsyncStorage.getItem('rating');
        this.state.rating = parseFloat(this.state.rating,10);
        this.state.smoker = await AsyncStorage.getItem('smoker');
    }
    

    checkIfDriverHasRide = async() =>{
        let db=firebase.database();
        let state=this.state;
        let DriverID = state.DriverID;
        await db.ref('ongoingRides/'+DriverID).once('value',async(snapshot) =>{
            if(snapshot.exists()){
                this.state.rideInfo = await snapshot.val();
                this.state.hasRide = true;
                this.state.passengers = await snapshot.val().passengers;
                this.props.navigation.navigate('StartRide');
                return;
            
            }
            else{
                return null;
            }
        });
    }
    
    checkIfDriverHasTrip = async() =>{
        let db=firebase.database();
        let state=this.state;
        let DriverID = state.DriverID;
        await db.ref('trips/'+DriverID).once('value',async(snapshot) =>{
            if(snapshot.exists()){
                this.state.tripInfo = await snapshot.val();
                this.state.passengers = await snapshot.val().passengers;
                this.state.hasTrip = true;
                return true;
            }
            else{
                return false;
            }
        });
        
        

                
    }
    Load = async() =>{
        let temp = await this.initializeUser();
        let checkForRide = await this.checkIfDriverHasRide();
        let checkForTrip = await this.checkIfDriverHasTrip();
        this.state.finishedLoading = true;
        this.forceUpdate();
    }

    BookATrip = () =>{
        this.props.navigation.navigate('TripType');
    }
    startRide = () =>{
        if(this.state.tripInfo.passengersCounter == 1){
            this.cancelRide();
        }
        let DriverID=this.state.DriverID;
        let fullname = this.state.tripInfo.fullname;
        let From = this.state.tripInfo.From;
        let To = this.state.tripInfo.To;
        let PassingBy = this.state.tripInfo.PassingBy;
        let EstimatedArrivalTime = this.state.tripInfo.EstimatedArrivalTime;
        firebase.database().ref('ongoingRides/'+DriverID).set({
            Driver:{
                DriverID:DriverID,
            },
            From:From,
            To:To,
            PassingBy:PassingBy,
            passengersCounter:0,
            EstimatedArrivalTime:EstimatedArrivalTime
        });
    }
    LogOut = async() =>{
        AsyncStorage.clear();
        this.props.navigation.navigate('Type');
    }
    componentDidMount(){
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
        setInterval(() => {
            this.Load();
        }, 1000);
        this.forceUpdate();

    }
    _handleNotification = notification => {
        Vibration.vibrate();
        this.setState({ notification: notification });
      };
    componentWillUnmount(){
        clearInterval();
    }

    ViewTripInfo = () =>{
        this.props.navigation.navigate('TripInfo');
    }
    ViewRequests = () =>{
        this.props.navigation.navigate('ViewRequests');
    }
    cancelRide = () =>{
        firebase.database().ref('trips/'+this.state.DriverID).remove();
        this.state.hasTrip = false;
        this.forceUpdate();
    }
    render(){
        if(this.state.finishedLoading == true){
            if(this.state.hasTrip == true){
            return(
                <View style={{marginTop:50}}>
                        <Button title='Start ride' onPress={this.startRide}/>
                        <Button title='View trip info' onPress={this.ViewTripInfo}/>
                        <Button title='View Requests' onPress={this.ViewRequests}/>
                        <Button title="Cancel ride" onPress={this.cancelRide}/>
                        <Button title='Logout' onPress={this.LogOut} />
                </View>
            );
            }
            else if(this.state.hasRide == true){
                return(
                    <View>
                        <Text>Has ride</Text>
                        <Button title='Logout' onPress={this.LogOut} />
                    </View>
                );
            }
            else{
                return(
                    <View style={{marginTop:25}}>
                        <Button title='Book a trip' onPress={this.BookATrip}/>
                        <Button title='Logout' onPress={this.LogOut} />
                    </View>
                )
            }

    }
    else{
        return(
            <View>
                <Text>Loading</Text>
            </View>
        )   
    }
}

}