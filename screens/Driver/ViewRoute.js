import React from 'react';
import MapView,{Marker, Callout} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions,Image,Alert, Button } from 'react-native';
import Constants from 'expo-constants';
import Polyline from '@mapbox/polyline';
import * as firebase from 'firebase';
export default class ViewRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            initialRegion:{
                latitude : 33.888630,
                longitude : 35.495480,
                latitudeDelta: 0.000,
                longitudeDelta: 0.1821,
            },
            waypoints:''
        }
    }
    componentWillMount(){
        this.getDirections();
    }
    componentDidMount(){
        setInterval(() => {
          this.forceUpdate();
        }, 2000);
    }
    componentWillUnmount(){
        clearInterval();
    }
    
    getDirections = async()=>{
        this.state.points = await this.props.navigation.state.params.points;
        console.log('got points');
        let test = await this.renderWayPointsForRequest(this.state.points);
        this.send_request();
    }
    renderWayPointsForRequest = (points) =>{
        let i = 0;
        for(i=0;i<points.length;i++){
            if(i==0){
                this.state.startLocLat = points[i].coordinates.latitude;
                this.state.startLocLong = points[i].coordinates.longitude;
                
            }
            else if(i==points.length-1){
                this.state.endLocLat = points[i].coordinates.latitude;
                this.state.endLocLong = points[i].coordinates.longitude;
                
            }
            else{
                if(i==points.length-2){
                    this.state.waypoints+=points[i].coordinates.latitude+"%2C"+points[i].coordinates.longitude;
                }
                else{
                    this.state.waypoints+=points[i].coordinates.latitude+"%2C"+points[i].coordinates.longitude+"%7C";
                    console.log(this.state.waypoints);
                    
                }
            }
            
        }
        console.log("doneRender");
    }
    send_request = async() =>{
        const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.startLocLat},${this.state.startLocLong}&destination=${this.state.endLocLat},${this.state.endLocLong}&waypoints=optimize:true%7C${this.state.waypoints}&key=AIzaSyAlc2bh2v2rKRKZFZCjpi5bTFqDEDNAv0g`);
        const respJson = await resp.json();
        
        const response = await respJson.routes[0];
        const distanceTime = await response.legs[0];
        const distance = await distanceTime.distance.text;
        const time = await distanceTime.duration.text;
        console.log(distance + "Distance");
        const points =  Polyline.decode(respJson.routes[0].overview_polyline.points);
        const coords =  points.map(point => {
        return {
        latitude: point[0],
        longitude: point[1]
        }
        });
        console.log(distance);
        console.log('Distance');
        this.setState({ coords, distance, time });
        this.forceUpdate();
    }

    render() {
        const {
          time,
          coords,
          distance,
          latitude,
          longitude,
          destination
        } = this.state
        if(coords == null){
        return(
            <View><Text>Please wait</Text></View>
        );
        }
        else{
        return(

            <View style={styles.container}>
                <MapView style={styles.map}
                    initialRegion={this.state.initialRegion}           
                >
                <MapView.Polyline
                  strokeWidth={2}
                  strokeColor="red"
                  coordinates={coords}
                />

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