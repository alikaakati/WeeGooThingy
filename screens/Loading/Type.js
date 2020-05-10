import React from 'react'
import { StyleSheet, View, Button, TextInput,Alert,Text,TouchableOpacity,Image } from 'react-native'
import styles from './styles/Type';
// THE USER TYPE THAT THE APP WILL BE WORKING WITH
export default class Type extends React.Component {
    constructor(props){
        super(props);
        this.state={

        }
    }
    
    
    static navigationOptions = {
        title: 'Continue as ..',
      };
    
    GoToPassengerStack = () => {
        let navigation = this.props.navigation;
        navigation.navigate('LoginPassenger');
    }
    
    GoToDriverStack = () => {
        let navigation = this.props.navigation;
        navigation.navigate('LoginDriver');
    }
    
    
    
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.banner}>
                    <Text style={styles.title}>Continue as ..</Text>
                
                    <TouchableOpacity style={styles.button} onPress = {this.GoToPassengerStack}>
                        <Text style={styles.buttonText}>
                            Passenger
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress = {this.GoToDriverStack}>
                        <Text style={styles.buttonText2}>
                            Driver
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
