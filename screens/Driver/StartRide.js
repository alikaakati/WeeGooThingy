import React from 'react'
import { StyleSheet, View, Button, TextInput,Alert,Text,TouchableOpacity,Image, AsyncStorage } from 'react-native'
import * as firebase from 'firebase';
import { Notifications } from 'expo';
import Constants from 'expo-constants';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView,{Marker, Callout} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
export default class StartRide extends React.Component{
    constructor(props){
        super(props);
        this.state={
            DriverID : '',
            RideInfo : null,
            finishedLoading : false,
            initialRegion:{
                latitude : null,
                longitude : null,
                latitudeDelta: 0.000,
                longitudeDelta: 0.1821,
            },
            currentLocation:{
                latitude:null,
                longitude:null
            }
        }
        

    }
    componentWillMount(){
        this.Load();
    }
    componentDidMount(){
        setInterval(() => {
            this._getLocationAsync();
            this.forceUpdate();
        }, 3000);
    }
    initializeUser = async() =>{
        this.state.DriverID = await AsyncStorage.getItem('username');
    }
    Load = async() =>{
        this.initializeUser();
        let db=firebase.database();
        let DriverID = this.state.DriverID;
        await db.ref('ongoingRides/'+DriverID).once('value',async(snapshot) =>{
            if(snapshot.exists()){
                this.state.RideInfo = snapshot.val();
                this.state.RideInfo = this.state.RideInfo[this.state.DriverID];
            }
        });
        await this.RideSetup();
        await this.send_request();        
    }
    RenderMarkers(){
        if(this.state.RideInfo.passengersCounter === 0){
            console.log('0');
        }
        else{
        }
    }


    send_request = async() =>{
        this.RenderMarkers();
        let startLocLatitude = this.state.currentLocation.latitude;
        let startLocLongitude = this.state.currentLocation.longitude;
        let endLocLatitude = this.state.RideInfo.To.coordinates.latitude;
        let endLocLongitude = this.state.RideInfo.To.coordinates.longitude;
        console.log(this.state.RideInfo.To.coordinates.latitude);
        const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.currentLocation.latitude},${this.state.currentLocation.longitude}&destination=${this.state.RideInfo.To.coordinates.latitude},${this.state.RideInfo.To.coordinates.longitude}&key=AIzaSyAlc2bh2v2rKRKZFZCjpi5bTFqDEDNAv0g`);
        const respJson = await resp.json();
        
        const response = await respJson.routes[0];
        const distanceTime = await response.legs[0];
        const distance = await distanceTime.distance.text;
        const time = await distanceTime.duration.text;
        //console.log(distance + "Distance <---------------------------");
        const points =  Polyline.decode(respJson.routes[0].overview_polyline.points);
        const coords =  points.map(point => {
        return {
        latitude: point[0],
        longitude: point[1]
        }
        });
        console.log(distance);
        //console.log('Distance');
        this.setState({ coords, distance, time });
        this.forceUpdate();
        //console.log(distance + " //////////////////////////// ");
    }





    RideSetup = async() =>{
        await this._getLocationAsync();    
        this.state.initialRegion.latitude = this.state.location.coords.latitude;
        this.state.initialRegion.longitude = this.state.location.coords.longitude;
        this.state.finishedLoading = true; 
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
        this.state.currentLocation.latitude = location.coords.latitude;
        this.state.currentLocation.longitude = location.coords.longitude;
        
        }
        } catch (error) {
        let status = Location.getProviderStatusAsync();
        if (!status.locationServicesEnabled) {
            this.state.permission = false;
        }
        }
  };


    
    render(){
        if(this.state.finishedLoading === false || this.state.coords === null|| this.state.initialRegion.latitude === null || this.state.currentLocation.latitude === null || this.state.RideInfo.To.coordinates.latitude === null){
            return(
                <View style={{marginTop:35}}>
                    <Text>Loading</Text>
                </View>
            );
        }
        else{
            return(
                <View style={styles.container}>
                <MapView style={styles.map}
                    initialRegion={this.state.initialRegion}           
                >
                {/*
                <MapView.Polyline
                  strokeWidth={2}
                  strokeColor="red"
                  coordinates={coords}
                /> 
                */}

                <MapView.Polyline
                  strokeWidth={2}
                  strokeColor="red"
                  coordinates={this.state.coords}
                />


                <Marker coordinate={this.state.currentLocation} title={'My current position'}>
                    <Image source={require('../../images/icon.png')} style={{width:30,height:30}}/>
                </Marker>

                </MapView>
            </View>
            );
        }
        }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
        flex:1
    },
  });