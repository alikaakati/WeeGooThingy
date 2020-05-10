import { createStackNavigator } from 'react-navigation-stack';
import Loading from '../screens/Loading/Loading';
import Type from '../screens/Loading/Type';
const LoadingNavigation = createStackNavigator(
    {
      Loading:{screen: Loading},
      Type:{screen:Type}
    },{
        initialRouteName:'Loading',
        headerMode:'none'
    }
)
export default LoadingNavigation;