/* eslint-disable prettier/prettier */
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, View, ActivityIndicator, Platform } from 'react-native';
import BottomNavigation from '../../../components/BottomNavigation';
// import { Splash } from '../../../pages';
import { Login, Register,InputNoHp, SmsVerificationProvider, SmsVerificationAndroid, FotoKlaimDo, PreviewFotoKlaimDo, TentukanAgen, DetailJualDo, RekeningBank, PilihRekeningBank, AddRekeningBank, InputPin, BuatPinBaru, EditProfil } from '../';
import {AuthContext} from '../../../components/Context';
import AsyncStorage from '@react-native-community/async-storage';
import Splash from '../../Splash';
import CONSTANTS from '../../../assets/constants';
import AwesomeAlert from 'react-native-awesome-alerts';
import messaging from '@react-native-firebase/messaging';
import { navigationRef } from './RootNavigation';
import * as RootNavigation from './RootNavigation';

const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;

const Stack = createStackNavigator();
const base_url = CONSTANTS.CONFIG.BASE_URL;

const DANGER = CONSTANTS.COLOR.DANGER;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;


const HomeStackNavigator = () => {
    //const navigation =useNavigation();
    const closeAlert = () => {
        console.log("alert close");
        setAlert(false);
    }
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [showAlert, setAlert] = useState(false);
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [initialRoute, setInitialRoute] = useState("Home");

    
    useEffect(() => {
        messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage.notification,
            );
            setInitialRoute("Home"); // e.g. "Settings"
            setTimeout(()=>{
                console.log("Go TO PAGE")
                RootNavigation.navigate(remoteMessage.data.navigation);
            },5500)
          }
        });

        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
          );
          RootNavigation.navigate(remoteMessage.data.navigation);
        });
    },[]);

    const initialLoginState ={
        isLoading : true,
        userName : null,
        userToken : null
    };

    const loginReducer = (prevState, action) => {
        switch ( action.type ) {
            case 'RETRIEVE_TOKEN' :
                return {
                    ...prevState,
                    userToken : action.token,
                    isLoading : false,
                };
            case 'LOGIN' :
                return {
                    ...prevState,
                    userName : action.id,
                    userToken : action.token,
                    isLoading : false,
                };    
            case 'LOGOUT' :
                return {
                    ...prevState,
                    userName : null,
                    userToken : null,
                    isLoading : false,
                };
            case 'REGISTER' :
                return {
                    ...prevState,
                    userName : action.id,
                    userToken : action.token,
                    isLoading : false,
                };              
        }
    }

    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

    const authContext = React.useMemo(() => ({
        signIn : (username, password, no_telepon, device_token) => {
            if(typeof username === "undefined") username = null;
            if(typeof password === "undefined") password = null;

            const params = {
                username,
                password,
                no_telepon,
                device_token,
            }
            console.log(params);
            setLoadingVisible(true);
            setCancelButtonAlert(true);
            setConfirmButtonAlert(false);
    
            const timeout = setTimeout(() => {
                setAlert(true);
                setLoadingVisible(false);
                setCancelButtonAlert(true);
                setConfirmButtonAlert(false);
                setCancelTextAlert("Tutup");
                setAlertMessage("Permintaan Tidak Dapat Dipenuhi, Server Tidak Merespon");
            }, 30000);
            
            const createFormData = (body) => {
                const data = new FormData();
                Object.keys(body).forEach(key => {
                    data.append(key, body[key]);
                });
                return data;
            }
            const formData = createFormData(params);
            fetch(base_url+'User/get_api_login',
            {
                method: 'post',
                body: formData,
                headers: {
                  'Content-Type': 'multipart/form-data; ',
                },
            })
            .then((response) => response.json())
            .then((json) => {
                clearTimeout(timeout);
                setAlert(true);
                setLoadingVisible(false);
                if(json.response == 1){
                    //navigation.navigate("Home")
                    setAlertMessage("Berhasil Login, Selamat Datang "+json.nama_lengkap);
                    setCancelButtonAlert(true);
                    setConfirmButtonAlert(false);
                    setCancelTextAlert("Tutup");
                    AsyncStorage.setItem("username", json.username);
                    AsyncStorage.setItem("no_telepon", json.no_telepon);
                    AsyncStorage.setItem("deviceToken", json.device_token);
                }
                else{
                    //navigation.navigate("Login");
                    setAlertMessage("Login Gagal. " +json.msg);
                    setCancelButtonAlert(true);
                    setConfirmButtonAlert(false);
                    setCancelTextAlert("Tutup");
                }
                console.log(json);
            })
            .catch((error) => {
                clearTimeout(timeout);
                setAlert(true);
                setAlertMessage("Terjadi Kesalahan. \n"+error);
                setCancelTextAlert("Tutup");
                setConfirmButtonAlert(false);
                setCancelButtonAlert(true);
                setLoadingVisible(false);
                console.log(error);
            });
        },
        signOut : async () => {
            try{
                await AsyncStorage.removeItem("username");
            }catch(e){
                console.log(e);
            }
            dispatch({type:'LOGOUT'});
            
        },
    }),[]);

    useEffect(() => {
        setTimeout( async() => {
            let userToken = null;
            try{
                userToken = await AsyncStorage.getItem("userToken");
            }catch(e){
                console.log(e);
            }
            dispatch({type:'RETRIEVE_TOKEN', token:userToken});
        }, 3000)
    },[]);
    
    if( loginState.isLoading ){
        return(
            <View style={{flex:1}} >
                <Splash />
            </View>
        );
    }

    if(loadingVisible){
        return(
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <ActivityIndicator size={70} color="yellow" />
                </View>  
            </View>
        );
    }
    
    if(showAlert){
        return(
            <View>
                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title={alert_title}
                    message={alert_message}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={showCancelButtonAlert}
                    showConfirmButton={showConfirmButtonAlert}
                    cancelText={cancelTextAlert}
                    confirmText={confirmTextAlert}
                    confirmButtonColor={NAVY}
                    cancelButtonColor={ORANGE}
                    onCancelPressed={() => {
                        setAlert(false);
                    }}
                    onConfirmPressed={alertConfirmTask}
                />
            </View>
        )
    }

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator headerMode="none" initialRouteName={initialRoute} >
                    {/* {
                        loginState.userToken != null ? (
                            <Stack.Screen name="Home" component={BottomNavigation} />
                        ) : (
                            <Stack.Screen name="Home" component={Login} />
                        )
                    } */}
                    <Stack.Screen name="Home" component={BottomNavigation} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="EditProfil" component={EditProfil} />
                    <Stack.Screen name="InputNoHp" component={InputNoHp} />
                    <Stack.Screen name="FotoKlaimDo" component={FotoKlaimDo} />
                    <Stack.Screen name="PreviewFotoKlaimDo" component={PreviewFotoKlaimDo} />
                    <Stack.Screen name="TentukanAgen" component={TentukanAgen} />
                    <Stack.Screen name="DetailJualDo" component={DetailJualDo} />
                    <Stack.Screen name="RekeningBank" component={RekeningBank} />
                    <Stack.Screen name="PilihRekeningBank" component={PilihRekeningBank} />
                    <Stack.Screen name="AddRekeningBank" component={AddRekeningBank} />
                    <Stack.Screen name="InputPin" component={InputPin} />
                    <Stack.Screen name="BuatPinBaru" component={BuatPinBaru} />
                    <Stack.Screen name="SmsVerificationProvider" component={SmsVerificationProvider} />
                    <Stack.Screen name="SmsVerificationAndroid" component={SmsVerificationAndroid} />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    );
    
};

export default HomeStackNavigator;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop:0,
    },
    modalView: {
        flex:1,
        backgroundColor:ORANGE,
        borderRadius: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        justifyContent: "center",
        alignItems: "center",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

})
