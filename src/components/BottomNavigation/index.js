/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */

import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, AppState } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import iconHome from '../../assets/icon/home.png';
import iconHomeActive from '../../assets/icon/home-active.png';
import iconNotification from '../../assets/icon/notification.png';
import iconNotificationActive from '../../assets/icon/notification-active.png';
import iconProfile from '../../assets/icon/profile.png';
import iconProfileActive from '../../assets/icon/profile-active.png';
import CONSTANTS from '../../assets/constants';
import { Beranda, Notifikasi, Profil} from '../../pages';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const alert_title = "";
const Tab = createBottomTabNavigator();
const base_url = CONSTANTS.CONFIG.BASE_URL;

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
    const [tabBarBadge, setTabBarBadge] = useState(null);
    const [notif_belum_dibaca, setNotifBelumDibaca] = useState(null);
    const appState = useRef(AppState.currentState);
    const [username, setUsername] = useState("");

    let myInterval = null;
    useEffect(() => {
        clearInterval(myInterval);
        getUser();
    },[])

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
          ) {
            console.log("App has come to the foreground!");
            getUser()
          }
          appState.current = nextAppState;
          if(appState.current == 'background'){
            clearInterval(myInterval);
          }
          console.log("AppState", appState.current);
        });
    
        return () => {
          subscription.remove();
        };
      }, []);

    const getNotifBelumDibaca =  (value) => {
        let params;
        if(typeof value !== "undefined" ){
            params = {
                username:value
            }
        }
        else{
            params = {
                username
            }
        }
        //console.log(params);
        const createFormData = (body) => {
            const data = new FormData();
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            return data;
        }
        const formData = createFormData(params);
        fetch(base_url+'Notifikasi/get_api_notifikasi_belum_dibaca',
        {
            method: 'post',
            body: formData,
            headers: {
            'Content-Type': 'multipart/form-data; ',
            },
        })
        .then((response) => response.json())
        .then((json) => {
            if(parseInt(json.belum_dibaca) > 0){
                setNotifBelumDibaca(json.belum_dibaca);
                setTabBarBadge(json.belum_dibaca);
            }
            else{
                setNotifBelumDibaca(0);
                setTabBarBadge(null);
            }
            //console.log(json);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const getUser = async () => {
        try {
          const value = await AsyncStorage.getItem('username');
          if (value === null) {
            // We have data!!
          }
          else{  
            setUsername(value);
            myInterval = setInterval(() => {
                getNotifBelumDibaca(value);
            },2000)
          }
        } catch (error) {
          // Error retrieving data
          console.log(error)
        }
    };

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
                else if (route.name === 'Notifikasi') {
                    tab_status = focused ? true : false;
                    return (
                        <RenderImage src={tab_status ? iconNotificationActive : iconNotification } lebar={26} tinggi={26} marginBawah={0} borderRadius={0} padding={0} backgroundColor={'white'} bottom={0}  />
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
                keyboardHidesTabBar:true,
        }}>
            <Tab.Screen name="Beranda" component={Beranda} />
            <Tab.Screen name="Notifikasi" component={Notifikasi} options={{tabBarBadge}} initialParams={{notif_belum_dibaca}} />
            <Tab.Screen name="Profil" component={Profil} />
        </Tab.Navigator>
    );
};

export default BottomNavigation;

const styles = StyleSheet.create({
    bottomNav:{
        height:40
    }
});
