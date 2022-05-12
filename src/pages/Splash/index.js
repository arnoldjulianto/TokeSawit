/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import CONSTANTS from '../../assets/constants';
import iconTokeSawit from '../../assets/icon/logo.png';
import packageJson from '../../../package.json';

const DANGER = CONSTANTS.COLOR.DANGER;
const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;

const Splash = (props) => {
    return (
        <View style={styles.container}> 
            <View style={styles.titleContainer}>
                <View style={styles.content}>
                    <Image source={iconTokeSawit} style={styles.logo} />
                   
                </View>
            </View>
             
            <Text style={styles.splashSubTitle}></Text>
            <View style={styles.splashText}>
                <Text style={styles.splashTitle2}>
                    {props.updateAppStatus}
                </Text> 
                <Text style={styles.splashTitle1}>
                    Version Alpha {packageJson.version}
                </Text> 
                
            </View>
        </View>
    )
}

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex : 1,
        flexDirection:"column",
        backgroundColor : ORANGE,
        alignItems:'center',
        justifyContent: 'center'
    },
    content:{
        flex : 1,
        flexDirection:"column",
        alignItems:'center',
        justifyContent: 'center'
    },
    splashText :{
        position:'absolute',
        flexDirection:"column",
        alignItems:'center',
        justifyContent: 'center',
        bottom:15
    },
    titleContainer : {
        flexDirection: 'row',
    },
    splashTitle1 : {
        fontSize : 15,
        color :'#FFFF',
    },
    splashTitle2 : {
        marginBottom:0,
        fontSize : 11,
        color : 'white',
    },
    splashSubTitle : {
        fontSize : 15,
        fontStyle: 'italic',
        color :'#FFFF',
    },
    logo :{
        width : 200,
        height :200,
        borderRadius:100,
        resizeMode:"contain"
    }
})
