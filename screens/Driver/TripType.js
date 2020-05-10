import React from 'react'
import { StyleSheet, View, Button, TextInput,Alert,Text,TouchableOpacity,Image } from 'react-native'
import * as firebase from 'firebase';
export default class TripType extends React.Component{
    constructor(props){
        super(props);
        this.state={
        }
    }

    ToUniversity = () =>{
        this.props.navigation.navigate('AvailableRoutesToUniversity');
    }
    render(){
        return(
        <View style={{marginTop:25}}>
            <Button title='From university'/>
            <Button title='To university' onPress={this.ToUniversity}/>
        </View>
        );
    }
    }