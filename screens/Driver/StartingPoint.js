import React from 'react'
import { StyleSheet, View, Button, TextInput,Alert,Text,TouchableOpacity,Image } from 'react-native'
import * as firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
export default class StartingPoint extends React.Component{
    constructor(props){
        super(props);
        this.state={
            stationID:0,
            allmarkers:this.props.navigation.state.params.points
        }
    }
    newRoute = () =>{
        let x = this.state.stationID;
        let newmarkers=[];
        for(let i = x;i<this.state.allmarkers.length;i++){
            newmarkers.push(this.state.allmarkers[i]);
        }
        let From=null;
        let To=null;
        let PassingBy=[];
        for(let i= 0 ; i <newmarkers.length;i++){
            if(i==0){
                From = newmarkers[i];
            }
           else if(i==newmarkers.length-1){
                To = newmarkers[i];
            }
            else{
                PassingBy.push(newmarkers[i]);
            }
        }
        let tripInfo = {From:From,To:To,PassingBy:PassingBy};
        this.props.navigation.navigate('SelectArrivalTime',{tripInfo:tripInfo})
        
    }
    render(){
        return(
            <View>
                <Text>
                    {'\n'}{'\n'}{'\n'}{'\n'}
                    Please choose a starting station : {this.state.allmarkers[this.state.stationID].title}
                </Text>
                <TouchableOpacity onPress={this.newRoute}>
                    <Text>Continue</Text>
                </TouchableOpacity>



                <ScrollView style={{marginTop:25,height:'100%',marginBottom:15}}>
                {
                    this.state.allmarkers.map((data,key) => {
                        return(
                            <View style={{marginBottom : 20}}>
                                <Button title={data.title}  id={key}
                                onPress={() => {
                                    this.state.stationID = key;
                                    this.forceUpdate();
                                }}
                                />
                            </View>
                        );
                    })
                }
                </ScrollView>

            </View>
        );
    }
}