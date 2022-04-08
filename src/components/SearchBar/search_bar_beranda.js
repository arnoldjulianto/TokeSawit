/* eslint-disable prettier/prettier */
import { useRoute } from '@react-navigation/native';
import React, { useState, useRef, useEffect} from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Animated, TextInput } from 'react-native';
import iconAdd from '../../assets/icon/add.png';
import iconSearch from '../../assets/icon/search.png';
import CONSTANTS from '../../assets/constants';
import { BerandaContext } from '../Context';
const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
import Icon from 'react-native-vector-icons/FontAwesome5';

const TopIcon = (props) => {
    return(
        <View>
            <View style={styles.searchBarTopIconWrapper}>
                <Image  style={styles.searchBarTopIcon}/>
                <TouchableOpacity onPress={() => props.navigation.navigate('ContextBukaTutupBuku', {
                    no_buka_tutup_buku1: '',
                    title: 'History DO'
                    }) } style={styles.topBarAddButton} >
                <Image source={iconAdd} style={styles.searchBarTopIcon} />
            </TouchableOpacity>
            </View>
        </View>
    );
}



const SearchBarBeranda = (props) => {
    const route = useRoute();
    return (
        <View style={styles.searchBarWrapper}>
            <View style={styles.searchBarTopWrapper}>
                <Text style={styles.searchBarTitle}>Rp 250.000.000</Text>
            </View>
        </View>
    );
};



export default SearchBarBeranda;

const styles = StyleSheet.create({
    cartegoryArea : {
        backgroundColor:ORANGE,
        height:200
    },
    searchBarWrapper : {
        position:'relative',
        height:56,
        backgroundColor:ORANGE,
        padding:10,
    },
    searchBarTopWrapper : {
        flexDirection : 'row',
    },
    searchBarTopIconWrapper :{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    searchBarTitleWrapper : {
        flex:1,
    },
    searchBarTitle : {
        fontSize:17,
        fontFamily : 'arial',
        fontWeight : '500',
        color : 'white',
    },
    searchBarTopIcon : {
        width:23,
        height:23,
        marginHorizontal:6,
        marginTop:7
    },
    searchBarInputWrapper : {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius:3,
        backgroundColor:"#fff",
        height:35,
        flex:1
    },
    searchBarIcon : {
        marginLeft:10,
        height: 20,
        width: 20,
        position:'relative',
    },
    searchBarInput : {
        fontSize:14,
        fontWeight : '100',
        color:NAVY,
        paddingLeft:10,
        height:45,
        left:20
    },
    topBarAddButton :{
        backgroundColor:NAVY,
        width:30,
        height:30,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
    }
});
