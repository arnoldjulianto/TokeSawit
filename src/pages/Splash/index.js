/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import CONSTANTS from '../../assets/constants';
import iconTokeSawit from '../../assets/icon/logo.png';
import packageJson from '../../../package.json';

const DANGER = CONSTANTS.COLOR.DANGER;
const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;

const Splash = ({navigation}) => {
    useEffect (() => {
        // setTimeout( ()=> {
        //     navigation.replace('Home');
        // }, 3000)
        //{'\u00A9'}
    },[navigation]);

    return (
        <View style={styles.container}> 
            <View style={styles.titleContainer}>
                <View style={styles.content}>
                    <Image source={iconTokeSawit} style={styles.logo} />
                </View>
            </View>
             
            <Text style={styles.splashSubTitle}></Text>
            <View style={styles.splashText}>
                <Text style={styles.splashTitle1}>Version {packageJson.version}</Text> 
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
        flexDirection:"row",
        alignItems:'flex-end',
        justifyContent: 'flex-end',
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
        fontSize : 28,
        color : 'yellow',
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
