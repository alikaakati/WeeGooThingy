import {
    StyleSheet,  Dimensions
  } from 'react-native';

export default StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        paddingTop:25,
        backgroundColor:'white'
    },
    title:{
        fontSize:25,
        marginBottom:30
        
    },
    logo:{
        width:200,
        height:200,
        marginBottom:20
    },
    input:{
        width:200,
        height:40,
        alignItems:'center',
        borderWidth:3,
        borderColor:'blue',
        borderRadius:50,
        marginBottom:15
    },
    button:{
        marginTop:10,
        borderWidth:3,
        borderColor:'blue',
        paddingHorizontal:20,
        paddingVertical:10
        
    }


}
)