/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */

import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import iconHome from '../../assets/icon/home.png';
import iconHomeActive from '../../assets/icon/home-active.png';
import iconProfile from '../../assets/icon/profile.png';
import iconProfileActive from '../../assets/icon/profile-active.png';
import CONSTANTS from '../../assets/constants';
import { Beranda, FotoKlaimDo, Profil} from '../../pages';
import * as ImagePicker from 'react-native-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';

const DANGER = CONSTANTS.COLOR.DANGER;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const alert_title = "";
const Tab = createBottomTabNavigator();

const RenderImage = (props) => {
    return (
        <View style={{backgroundColor:props.backgroundColor, borderRadius:props.borderRadius, padding:props.padding,bottom:props.bottom}}  >
            <Image source={props.src}  style={{width:props.lebar,height:props.tinggi,marginBottom:props.marginBawah, marginHorizontal:10}}  />
        </View>
    );
};

const BottomNavigation = (props) => {
    const closeAlert = () => {
        console.log("alert close");
        setAlert(false);
    }
    const [file_klaim_do, setFileKlaimDo] = useState("");
    const [showAlert, setAlert] = useState(true);
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [alertCancelTask, setAlertCancelTask] = useState(() => closeAlert() );

    

    if(showAlert){
        return (
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={alert_title}
                message={alert_message}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={showCancelButtonAlert}
                showConfirmButton={showConfirmButtonAlert}
                cancelText={cancelTextAlert}
                confirmText={confirmTextAlert}
                confirmButtonColor={NAVY}
                cancelButtonColor={ORANGE}
                onCancelPressed={alertCancelTask}
                onConfirmPressed={alertConfirmTask}
                onDismiss = {()=>{
                    setAlert(false);
                }}
            />
        );
    }

    return (
        <Tab.Navigator 
        style={styles.bottomNav}
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused}) => {
                let tab_status = true;
                if (route.name === 'Beranda') {
                    tab_status = focused ? true : false;
                    return (
                        <RenderImage src={tab_status ? iconHomeActive : iconHome } lebar={26} tinggi={26} marginBawah={0} borderRadius={0} padding={0} backgroundColor={'white'} bottom={0}  />
                    );
                } 
                else if (route.name === 'Explore') {
                    tab_status = focused ? true : false;
                    return (
                        <RenderImage src={tab_status ? iconProfileActive : iconProfile } lebar={26} tinggi={26} marginBawah={0} borderRadius={0} padding={0} backgroundColor={'white'} bottom={0} />
                    );
                }
                else if (route.name === 'Profil') {
                    tab_status = focused ? true : false;
                    return (
                        <RenderImage src={tab_status ? iconProfileActive : iconProfile } lebar={26} tinggi={26} marginBawah={0} borderRadius={0} padding={0} backgroundColor={'white'} bottom={0} />
                    );
                }
            },
        })}
        tabBarOptions={{
                activeTintColor: ORANGE,
                inactiveTintColor: 'grey',
                keyboardHidesTabBar:true
        }}>
            <Tab.Screen name="Beranda" component={Beranda} />
            <Tab.Screen name="Explore" component={Beranda} />
            <Tab.Screen name="Profil" component={Profil}  />
        </Tab.Navigator>
    );
};

export default BottomNavigation;

const styles = StyleSheet.create({
});
