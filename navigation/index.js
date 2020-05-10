import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import LoadingNavigation from '../navigation/LoadingNavigation';
import DriverAuthNavigation from '../navigation/DriverAuthNavigation';
import DriverNavigation from '../navigation/DriverNavigation';

const SwitchNavigator = createSwitchNavigator(
  {
    LoadingNavigation: LoadingNavigation,
    DriverAuthNavigationm:DriverAuthNavigation,
    DriverNavigation:DriverNavigation
  },
  {
    initialRouteName: 'LoadingNavigation',
    headerMode:'none'
    
  }
)

const AppContainer = createAppContainer(SwitchNavigator)

export default AppContainer