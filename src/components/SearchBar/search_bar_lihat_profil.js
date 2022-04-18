/* eslint-disable prettier/prettier */
import { useRoute } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Animated, TextInput } from 'react-native';
import iconBack from '../../assets/icon/back.png';
import iconRefreshWhite from '../../assets/icon/refresh-white.png';
import CONSTANTS from '../../assets/constants';
const DANGER = CONSTANTS.COLOR.DANGER;
const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const TopIcon = (props) => {
    return(
        <View>
            <View style={styles.searchBarTopIconWrapper}>
                <Image  style={styles.searchBarTopIcon}/>
            </View>
        </View>
    );
}

const SearchBar = (props) => {
    return (
        <View style={styles.searchBarWrapper}>
            <View style={styles.searchBarTopWrapper}>
                <View style={styles.searchBarTitleWrapper}>
                    <TouchableOpacity onPress={ ()=> {
                        props.navigation.goBack();
                        props.setModalVisible(true);
                    }}>
                        <Image source={iconBack} style={styles.searchBarIcon}  />
                    </TouchableOpacity>
                    <Text style={styles.searchBarTitle}>{props.title}</Text>
                    {props.refresh != false &&
                    <View style={{flex:1,alignItems:'flex-end', justifyContent:'flex-end', right:10}}>
                        <TouchableOpacity style={{justifyContent:'flex-end'}}  onPress={ ()=> {props.refresh()} }>
                            <Image source={iconRefreshWhite} style={styles.searchBarIcon}  />
                        </TouchableOpacity>
                    </View>
                    }
                </View>
            </View>
        </View>
    );
    
};

export default SearchBar;

const styles = StyleSheet.create({
    cartegoryArea : {
        backgroundColor:DANGER,
        height:200
    },
    searchBarWrapper : {
        height:54,
        backgroundColor:ORANGE,
        justifyContent:'center'
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
        flexDirection: 'row',
    },
    searchBarTitle : {
        fontSize:20,
        marginLeft:20,
        marginTop:3,
        fontFamily : 'arial',
        fontWeight : '800',
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
        width:330
    },
    searchBarIcon : {
        height: 40,
        width: 40,
    },
    searchBarInput : {
        flex:1,
        fontSize:14,
        fontWeight : '100',
        color:NAVY,
        paddingLeft:10,
        height:45
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
