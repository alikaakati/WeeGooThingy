import React, {useState} from 'react';
import {View, Button, Platform, Picker,Text} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class SelectArrivalTime extends React.Component{
    constructor(props){
        super(props);
        this.state={
            hour:8,
            minutes:0,
            daytime:'AM'

        }
    }
    finish = () =>{
        let hour = this.state.hour;
        let minutes = this.state.minutes;
        let daytime = this.state.daytime;
        let tripInfo = this.props.navigation.state.params.tripInfo;
        this.props.navigation.navigate("FinishTripSetup",{tripInfo:tripInfo,hour:hour,minutes:minutes,daytime:daytime})


    }
    render(){
        return(
            <View style={{marginTop:10,marginLeft:15}}>
                <Text>Arrival time</Text>
                <Picker selectedValue={this.state.hour} style={{width:100}} onValueChange={(itemValue,itemIndex) => this.setState({hour:itemValue})}>
                    <Picker.Item label='1' value='1'/>
                    <Picker.Item label='2' value='2'/>
                    <Picker.Item label='3' value='3'/>
                    <Picker.Item label='4' value='4'/>
                    <Picker.Item label='5' value='5'/>
                    <Picker.Item label='6' value='6'/>
                    <Picker.Item label='7' value='7'/>
                    <Picker.Item label='8' value='8'/>
                    <Picker.Item label='9' value='9'/>
                    <Picker.Item label='10' value='10'/>
                    <Picker.Item label='11' value='11'/>
                    <Picker.Item label='12' value='12'/>
                </Picker>
                <Picker selectedValue={this.state.minutes} style={{width:100}} onValueChange={(itemValue,itemIndex) => this.setState({minutes:itemValue})}>
                    <Picker.Item label='0' value='0'/>
                    <Picker.Item label='10' value='10'/>
                    <Picker.Item label='20' value='20'/>
                    <Picker.Item label='30' value='30'/>
                    <Picker.Item label='40' value='40'/>
                    <Picker.Item label='50' value='50'/>
                    <Picker.Item label='60' value='60'/>
                </Picker> 
                <Picker selectedValue={this.state.daytime} style={{width:100}} onValueChange={(itemValue,itemIndex) => this.setState({daytime:itemValue})}>
                    <Picker.Item label='AM' value='AM'/>
                    <Picker.Item label='PM' value='PM'/>
                </Picker>
                <Button title="Continue" onPress={this.finish}/>
            </View>
        );
    }

}
/*const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View style={{marginTop:25}}>
      <View>
        <Button onPress={showDatepicker} title="Show date picker!" />
      </View>
      <View>
        <Button onPress={showTimepicker} title="Show time picker!" />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default SelectArrivalTime;
*/