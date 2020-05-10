import React from 'react';
import {
  AsyncStorage,
  Image,
  Text,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export default class DriverRequests extends React.Component {
    constructor(props){
      super(props);
      this.GetRequests = this.GetRequests.bind(this);
      
  
     this.state={
       Username:'',
       isLoading:true,
       requests: [],
       id:'',
       usertype:'',
       name: '',

       
     }
    }

    sendPushNotification = async (item) => {
         var notificationToken = '';
         var name = await AsyncStorage.getItem("name");
  
          this.setState({name:name});
         
        await firebase.database().ref('loggedin/').once('value',function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
            
              var childData =  childSnapshot.val();
              console.log(childData);
              console.log(childData.fullname);
              if(item.From.ID == childData.ID){
                  notificationToken = childData.notificationToken;
                  
              }
            });
        });

        
        const message = {
          to: notificationToken,
          sound: 'default',
          title: 'Request Accepted',
          body:   this.state.name+' accepted your request',
          data: { data: 'You can view your trip info in the trip section' },
          _displayInForeground: true,
        };
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
      };


    acceptRequest = async(accept,item)=>{
      this.state.requests.splice(item.key, 1);
      this.forceUpdate();
      Alert.alert("Request Accepted");
        var passengersCounter = 0;
        id = await AsyncStorage.getItem("id");
        id = JSON.parse(id);
        if(accept == true){
            try{
            await firebase.database().ref('requests/').once('value', (snapshot)=> {
                snapshot.forEach(async(childSnapshot )=>{ 
                  var childData =  childSnapshot.val();
                  if(childData.From.ID == item.From.ID){
                    let reqref = firebase.database().ref('requests/'+childSnapshot.key);
                    await reqref.remove();
                    await this.sendPushNotification(item);
                   
                  }
                });
            });
            
            await firebase.database().ref('trips/'+id+'/Passengers').push({
            
                    
                        "ID":item.From.ID,
                        "name":item.From.name,
                        "station":{
                          "title":item.station.title,
                          "coordinates":{
                            "latitude":item.station.coordinates.latitude,
                            "longitude":item.station.coordinates.longitude
                          }
                        }
                   
                 
                });

             
            await firebase.database().ref('trips/'+id).once('value', (snapshot)=> {
        
                
              passengersCounter = snapshot.val().passengersCounter;
              passengersCounter++;

          });      

          await firebase.database().ref('trips/'+id).update({
        
              'passengersCounter':passengersCounter
            
        });   
        await firebase.database().ref('passengers/'+item.From.ID).update({
        
          'currentRideID':id
        
    });   
        
        }
        catch{
            Alert.alert("Error");
        }
    }
    else{
        try{
            await firebase.database().ref('requests/').once('value', (snapshot)=> {
                snapshot.forEach(async(childSnapshot )=>{ 
                  var childData =  childSnapshot.val();
                  if(childData.To == "1117001" && childData.From.ID == item.From.ID){
                      console.log(childSnapshot.key);
                    let reqref = firebase.database().ref('requests/'+childSnapshot.key);
                    await reqref.remove();
                    
                  }
                });
            });
            this.forceUpdate();
          
        }
        catch{
            Alert.alert("Error");
        }
    }
  
    }

    GetRequests= async () => {
     
      var id = await AsyncStorage.getItem("id");
      
      id = JSON.parse(id);
     
      // 7ot ma7al l "1" bel query el current user id
      await firebase.database().ref('requests/').once('value', (snapshot)=> {
        snapshot.forEach((childSnapshot )=>{ 
          var childData =  childSnapshot.val();
          if(childData.To == id){
            this.state.requests.push(childData);
          }
        });
        
       
      });
      
    this.setState({isLoading:false});
      
  
      
     
    }
     async componentDidMount() {
     await this.GetRequests();
    }
      
    static navigationOptions = {
      title: 'Requests',
    };
  
    
  
  showArrayItem = (item) => {
        console.log("working");
      Alert.alert(JSON.stringify(item));
   
    }
  
    render() {
      if(this.state.isLoading==false){
        if(this.state.requests.length > 0){
      return (
        <View>
       
       <ScrollView>
   
   {
     this.state.requests.map((item, key) => (
  
      <View style = {{backgroundColor:'#191970', marginBottom:20}}key={key} onPress={this.showArrayItem.bind(this, item)}>
  
      <Text> Request: {key+1} </Text>
      <Text> From: {item.From.name} </Text>
      <Text> Station: {item.station.title} </Text>
      <TouchableOpacity onPress={this.acceptRequest.bind(this,true,item)} style={{ alignItems: 'center',
      backgroundColor: 'white',
      padding: 20,
      margin:10,
      borderRadius: 50,}}><Text style ={{color:'#191970'}}>Accept</Text></TouchableOpacity>

<TouchableOpacity onPress={this.acceptRequest.bind(this,false,item)} style={{ alignItems: 'center',
      backgroundColor: 'white',
      padding: 20,
      margin:10,
      borderRadius: 50,}}><Text style ={{color:'#191970'}}>Refuse</Text></TouchableOpacity>
  
  
  
     
   
  
    </View>
   
     
     ))
   }
  
  </ScrollView>
        </View>
      );
    }
    else{
      return ( 
        <View>
          <Text style={{marginTop:50,fontSize: 32,fontWeight:'bold',color: '#000',padding:10}}>You have no requests</Text>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate("HomeDriver")} style={{ alignItems: 'center',
      backgroundColor: '#191970',
      padding: 20,
      margin:10,
      borderRadius: 50,}}><Text style ={{color:'white'}}>Back</Text></TouchableOpacity>
  
            </View>
            );
    }
  }

    else{
      return ( 
        <View>
          <Image
              source={
              
                  require('../../images/icon.png')
                
              }
            />
            
            </View>
            );
    }
  }
  
  }