/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import CONSTANTS from '../../assets/constants';
import iconTokeSawit from '../../assets/icon/logo.png';

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
                    <View style={styles.splashText}>
                        <Text style={styles.splashTitle1}>Toke</Text>
                        <Text style={styles.splashTitle2}>Sawit</Text> 
                    </View>
                </View>
            </View>
             
            <Text style={styles.splashSubTitle}></Text>
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
        flexDirection:"row",
        alignItems:'center',
        justifyContent: 'center'
    },
    titleContainer : {
        flexDirection: 'row',
    },
    splashTitle1 : {
        fontSize : 28,
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
