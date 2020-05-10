import { createStackNavigator } from 'react-navigation-stack';
import HomeDriver from '../screens/Driver/HomeDriver';
import TripType from '../screens/Driver/TripType';
import ViewRoute from '../screens/Driver/ViewRoute';
import AvailableRoutesToUniversity from '../screens/Driver/AvailableRoutesToUniversity';
import StartingPoint from '../screens/Driver/StartingPoint';
import SelectArrivalTime from '../screens/Driver/SelectArrivalTime';
import FinishTripSetup from '../screens/Driver/FinishTripSetup';
import ViewRequests from '../screens/Driver/ViewRequests';
import StartRide from '../screens/Driver/StartRide';
const DriverHomeNavigation = createStackNavigator(
    {
        HomeDriver:{screen:HomeDriver},
        TripType:{screen:TripType},
        ViewRoute:{screen:ViewRoute},
        AvailableRoutesToUniversity:{screen:AvailableRoutesToUniversity},
        StartingPoint:{screen:StartingPoint},
        SelectArrivalTime:{screen:SelectArrivalTime},
        FinishTripSetup:{screen:FinishTripSetup},
        ViewRequests:{screen:ViewRequests},
        StartRide:{screen:StartRide}
    },{
        initialRouteName:'HomeDriver',
        headerMode:'none'
    }
);
export default DriverHomeNavigation;