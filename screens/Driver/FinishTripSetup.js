import React, {useState} from 'react';
import {View, Button, Platform, Picker, AsyncStorage,Text} from 'react-native';
import * as firebase from 'firebase';
export default class FinishRouteSetup extends React.Component{
    constructor(props){
        super(props);
        this.state={
            hour:null,
            minutes:null,
            daytime:null,
            From:null,
            To:null,
            PassingBy:null,
            DriverID:null,
            Load:false
        }
    }
    componentWillMount(){
        this.intializeInfo();
        this.forceUpdate();
    }
    intializeInfo = async() =>{
        this.state.hour = this.props.navigation.state.params.hour;
        this.state.minutes = this.props.navigation.state.params.minutes;
        if(this.state.minutes = 0){
            this.state.minutes = '00';
        }
        this.state.daytime = this.props.navigation.state.params.daytime;
        this.state.From = this.props.navigation.state.params.tripInfo.From;
        this.state.PassingBy = this.props.navigation.state.params.tripInfo.PassingBy;
        this.state.To = this.props.navigation.state.params.tripInfo.To;
        this.state.DriverID = await AsyncStorage.getItem('username');
        this.state.Load = true;
        this.forceUpdate();
    }
    submitTrip = async() =>{
        let DriverID = this.state.DriverID;
        let fullname = await AsyncStorage.getItem('username');
        let gender= await AsyncStorage.getItem('gender');
        let smoker= await AsyncStorage.getItem('smoker');
        let From = this.state.From;
        let To = this.state.To;
        let PassingBy = this.state.PassingBy;
        let EstimatedArrivalTime = {hour:this.state.hour,minutes:this.state.minutes,daytime:this.state.daytime};
        firebase.database().ref('trips/'+DriverID).set({
            Driver:{
                DriverID:DriverID,
                fullname:fullname,
                gender:gender,
                smoker:smoker
            },
            From:From,
            To:To,
            PassingBy:PassingBy,
            passengersCounter:0,
            EstimatedArrivalTime:EstimatedArrivalTime
        });
        this.props.navigation.navigate('HomeDriver');

    }

    render(){
        if(this.state.Load == false){
        return(
            <View><Text>Loading</Text></View>
        );
        }
        else{
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text>
                    Trip info{'\n'}
                    Driver name : {this.state.DriverID}{'\n'}
                    From : {this.state.From.title}{'\n'}
                    Passing by : {this.state.PassingBy[0].title} - {this.state.PassingBy[1].title} ..{'\n'}
                    To : {this.state.To.title}{'\n'}
                    Arrival time : {this.state.hour}:{this.state.minutes} {this.state.daytime}
                </Text>
            <Button title='Submit trip' onPress={this.submitTrip}/>
            </View>
        );
        }
    }
}