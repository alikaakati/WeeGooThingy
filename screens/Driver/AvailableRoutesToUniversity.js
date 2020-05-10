import React from 'react'
import { StyleSheet, View, Button, TextInput,Alert,Text,TouchableOpacity,Image } from 'react-native'
import * as firebase from 'firebase';
export default class AvailableRoutesToUniversity extends React.Component{
    constructor(props){
        super(props);
        this.state={
            finishedLoading:false,
            BcharaDebbiyeh:null,
            ChevroletDebbiyeh:null,
            EducationDebbiyeh:null,
            colaDebbiyeh:null,

        }
    }
    GetRoutes = async() =>{
        let db = firebase.database();
        await db.ref('BcharaDebbiyeh').once('value',async (snapshot) =>{
            if(snapshot.exists()){
                this.state.BcharaDebbiyeh = snapshot.val();
            }
        });
        await db.ref('ChevroletDebbiyeh').once('value',async (snapshot) =>{
            if(snapshot.exists()){
                this.state.ChevroletDebbiyeh = snapshot.val();                
            }
        });
        await db.ref('EducationDebbiyeh').once('value',async (snapshot) =>{
            if(snapshot.exists()){
                this.state.EducationDebbiyeh = snapshot.val();                
            }
        });
        await db.ref('colaDebbiyeh').once('value',async (snapshot) =>{
            if(snapshot.exists()){
                this.state.colaDebbiyeh = snapshot.val();                
            }
        });
        console.log('done');
        this.state.finishedLoading = true;

    }
    Load = async() =>{
        let temp = await this.GetRoutes();
        console.log('Finished all routees loading');
        this.forceUpdate();
    }
    componentWillMount(){
        this.Load();
    }
    ViewBcharaOnMap = () =>{
        this.props.navigation.navigate('ViewRoute',{points:this.state.BcharaDebbiyeh.markers});
    }
    selectBchara = () =>{
        this.props.navigation.navigate('StartingPoint',{points:this.state.BcharaDebbiyeh.markers});
    }
    render(){
        if(this.state.finishedLoading == false){
            return(
                <View style={{marginTop:25}}>
                    <Text>Loading</Text>
                </View>
            )
    
        }
        
        else{
            return(
                <View>
                    <View>
                        {this.state.BcharaDebbiyeh.markers.map((data) => (
                            <View>
                            <Text>{data.title} </Text>
                            </View>
                        ))}
                        <Button title = 'View on map' onPress={this.ViewBcharaOnMap}/>
                        <Button title = 'Select route' onPress={this.selectBchara}/>
                    </View>
                </View>
            )
        }
    }
}