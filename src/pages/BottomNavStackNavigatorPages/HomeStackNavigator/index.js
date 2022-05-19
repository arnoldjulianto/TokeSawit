/* eslint-disable prettier/prettier */
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, View, ActivityIndicator, Platform, PermissionsAndroid} from 'react-native';
import BottomNavigation from '../../../components/BottomNavigation';
// import { Splash } from '../../../pages';
import { Login, Register,InputNoHp, SmsVerificationProvider, SmsVerificationAndroid, FotoKlaimDo, PreviewFotoKlaimDo, TentukanAgen, DetailJualDo, RekeningBank, PilihRekeningBank, AddRekeningBank, InputPin, BuatPinBaru, EditProfil, JadiPemilikDo, AddDoSaya, InputDoPPKS, BiayaBongkar, InputHargaDoPPKS, PreviewPemilikDo, LihatProfil, Following, ShowHargaKecuali, ShowHargaKepada, TentukanTipeDo, ResellerDo, UsersDOPPKS, FeeResellerDO } from '../';
import {AuthContext} from '../../../components/Context';
import AsyncStorage from '@react-native-community/async-storage';
import Splash from '../../Splash';
import CONSTANTS from '../../../assets/constants';
import AwesomeAlert from 'react-native-awesome-alerts';
import messaging from '@react-native-firebase/messaging';
import { navigationRef } from './RootNavigation';
import * as RootNavigation from './RootNavigation';
import codePush from "react-native-code-push";

const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;

const Stack = createStackNavigator();
const base_url = CONSTANTS.CONFIG.BASE_URL;

const DANGER = CONSTANTS.COLOR.DANGER;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };



const HomeStackNavigator =  () =>  {
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
    const [updateAppStatus, setUpdateAppStatus] = useState("");
    const [showSplash, setShowSplash] = useState(true);

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
            case 'APP_UPDATE' :
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
        if(!loginState.isLoading){
                messaging()
                .getInitialNotification()
                .then(remoteMessage => {
                if (remoteMessage) {
                    console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                    );
                    setInitialRoute("Home"); // e.g. "Settings"
                    //setTimeout(()=>{
                        console.log("Go TO PAGE")
                        if(typeof remoteMessage.data.screen !== "undefined" ) RootNavigation.navigate(remoteMessage.data.navigation, {screen:remoteMessage.data.screen});
                        else RootNavigation.navigate(remoteMessage.data.navigation);
                    //},5500)
                }
                });

                messaging().onNotificationOpenedApp(remoteMessage => {
                console.log(
                    'Notification caused app to open from background state:',
                    remoteMessage.notification,
                );
                if(typeof remoteMessage.data.screen !== "undefined" ) RootNavigation.navigate(remoteMessage.data.navigation, {screen:remoteMessage.data.screen});
                else RootNavigation.navigate(remoteMessage.data.navigation);
                });
        }
    },[loginState]);

    useEffect(()=>{
        if(!loginState.isLoading){
            requestPermission();
        }
    },[loginState])

    const requestPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_SMS,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ],
                    {
                        title: "TokeSawit Izin Akses",
                        message:
                        "TokeSawit Meminta Untuk Mengakses Kamera ",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can use the camera");
                } else {
                    console.log("Camera permission denied");
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    
    //PROSESING
    useEffect(() => {
        setTimeout(()=>{
            let userToken = null;
            try{
                userToken = AsyncStorage.getItem("username");
                dispatch({type:'APP_UPDATE', token:userToken});
            }catch(e){
                console.log("ERORR GET TOKEN");
            }
            codePush.sync({
                updateDialog: false,
                installMode: codePush.InstallMode.IMMEDIATE
            },onSyncStatusChange);
        },2000)
    },[]);
    //PROSESING

    const onSyncStatusChange = (SyncStatus) => {
        switch (SyncStatus) {
            case 5:
                setShowSplash(true);
                console.log("MEMERIKSA UPDATE")
                setUpdateAppStatus("MEMERIKSA UPDATE");
                break;
            case 6:
                setShowSplash(true);
                console.log("MENUNGGU USER ACTION")
                setUpdateAppStatus("MENUNGGU USER ACTION");
                break;
            case 7:
                setShowSplash(true)
                console.log("MENGUNDUH PACKAGE UPDATE");
                setUpdateAppStatus("MENGUNDUH PACKAGE UPDATE");;
                break;
            case 8:
                setShowSplash(true);
                console.log("MENGINSTALL UPDATE");
                setUpdateAppStatus("MENGINSTALL UPDATE");
                break;
            case 4:
                setShowSplash(false);
                console.log("PROSES SINKRONISASI UPDATE");
                setUpdateAppStatus("PROSES SINKRONISASI UPDATE");
                break; 
            case 3:
                setShowSplash(false);
                console.log("TERJADI KESALAHAN UPDATE APP")
                setUpdateAppStatus("TERJADI KESALAHAN UPDATE APP");
                break;  
            case 2:
                setShowSplash(false);
                console.log("UPDATE DIABAIKAN")
                setUpdateAppStatus("UPDATE DIABAIKAN");
                break;      
            case 1:
                setShowSplash(false);
                console.log("UPDATE TERINSTALL")
                setUpdateAppStatus("UPDATE TERINSTALL");
                setShowSplash(false);
                break;   
            case 0:
                setShowSplash(false);
                console.log("APLIKASI SUDAH TERUPDATE")
                setUpdateAppStatus("APLIKASI SUDAH TERUPDATE");
                break;            
        }
    }
    // {"AWAITING_USER_ACTION": 6, "CHECKING_FOR_UPDATE": 5, "DOWNLOADING_PACKAGE": 7, "INSTALLING_UPDATE": 8, "SYNC_IN_PROGRESS": 4, "UNKNOWN_ERROR": 3, "UPDATE_IGNORED": 2, "UPDATE_INSTALLED": 1, "UP_TO_DATE": 0}

    if( showSplash ){
        return(
            <View style={{flex:1}} >
                <Splash updateAppStatus={updateAppStatus} />
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
                    <Stack.Screen name="JadiPemilikDo" component={JadiPemilikDo} />
                    <Stack.Screen name="AddDoSaya" component={AddDoSaya} />
                    <Stack.Screen name="InputDoPPKS" component={InputDoPPKS} />
                    <Stack.Screen name="BiayaBongkar" component={BiayaBongkar} />
                    <Stack.Screen name="InputHargaDoPPKS" component={InputHargaDoPPKS} />
                    <Stack.Screen name="PreviewPemilikDo" component={PreviewPemilikDo} />
                    <Stack.Screen name="LihatProfil" component={LihatProfil} />
                    <Stack.Screen name="Following" component={Following} />
                    <Stack.Screen name="ShowHargaKecuali" component={ShowHargaKecuali} />
                    <Stack.Screen name="ShowHargaKepada" component={ShowHargaKepada} />
                    <Stack.Screen name="TentukanTipeDo" component={TentukanTipeDo} />
                    <Stack.Screen name="ResellerDo" component={ResellerDo} />
                    <Stack.Screen name="UsersDOPPKS" component={UsersDOPPKS} />
                    <Stack.Screen name="FeeResellerDO" component={FeeResellerDO} />
                    <Stack.Screen name="SmsVerificationProvider" component={SmsVerificationProvider} />
                    <Stack.Screen name="SmsVerificationAndroid" component={SmsVerificationAndroid} />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    );
    
};

export default codePush(codePushOptions)(HomeStackNavigator);

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
