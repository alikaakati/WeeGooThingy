import { createStackNavigator } from 'react-navigation-stack';
import LoginDriver from '../screens/authentication/LoginDriver';
const DriverAuthNavigation = createStackNavigator(
    {
      LoginDriver:{screen:LoginDriver},
      
    },{
        initialRouteName:'LoginDriver',
        headerMode:'none'
    
    }
);
export default DriverAuthNavigation