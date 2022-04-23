/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CONSTANTS from '../../assets/constants';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from '../../components/Context';
import SmsAndroid from 'react-native-get-sms-android';

const DANGER = CONSTANTS.COLOR.DANGER;
const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const SmsVerification = ({route, navigation}) => {
    let {usernameRoute, id_rekening_bank, no_rekening, atas_nama, user_new_pin, nama_bank, logo, email, nama_lengkap, no_telepon, password, parent} = route.params;
    if( no_telepon.substr(0, 1) == "0" ){
        no_telepon = "+62"+no_telepon.substr(1);
    }
    const closeAlert = () => () => {
        console.log("alert close");
        setAlert(false);
    }

    const [kodeOTP, setKodeOTP] = useState("");
    const [deviceToken, setDeviceToken] = useState("");
    const [confirmOTP, setConfirmOTP] = useState();
    const [showAlert, setAlert] = useState(false);
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [alertCancelTask, setAlertCancelTask] = useState(() => closeAlert() );
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [countDown, setCountDown] = useState();
    const [countDownStart, setCountDownStart] = useState(false);
    const [username, setUsername] = useState(usernameRoute);
    const [processConfirm, setProcessConfirm] = useState(usernameRoute);
    const { signIn } = React.useContext(AuthContext);
    
    const cekSMS = () => {
        var minDate = new Date("01/01/2022 00:00:00").getTime();
        var maxDate = Date.now();
        var filter = {
            box: 'inbox',
            minDate, // timestamp (in milliseconds since UNIX epoch)
            maxDate, // timestamp (in milliseconds since UNIX epoch)
            bodyRegex: '(.*)'+kodeOTP+'(.*)', // content regex to match
            read: 0, // 0 for unread SMS, 1 for SMS already read
            //address: '+19124613391', // sender's phone number
            body: kodeOTP, // content to match
            indexFrom: 0, // start from index 0
            maxCount: 10, // count of SMS to return each time
        };
        SmsAndroid.list(
            JSON.stringify(filter),
            (fail) => {
                console.log('Failed with this error: ' + fail);
            },
            (count, smsList) => {
                if(count == 1) {
                    setProcessConfirm(true);
                    setConfirmOTP(kodeOTP);
                }
            },
        );
    }

    let task;

    useEffect(() => {
        sendOTP(no_telepon);
        getDeviceToken();
    }, []);

    useEffect(() => {
        if(processConfirm){
            confirmCode()
        }
    },[confirmOTP])

    useEffect (() => {
        countDownTimer();
    },[countDownStart])
    
    const getDeviceToken = async () => {
        try{
            setDeviceToken(await AsyncStorage.getItem("deviceToken"));
            console.log('Device Token : '+deviceToken);
        }catch(e){
            console.log(e);
        }
    }

    React.useEffect(
        () =>
          navigation.addListener('beforeRemove', (e) => {
            // Prevent default behavior of leaving the screen
            //e.preventDefault();
          }),
        [navigation]
    );
    
    const countDownTimer = () => {
        if(countDownStart){
            var countDownDate = new Date().getTime()+ 1500 * 60;
            // Update the count down every 1 second
            var x = setInterval(function() {

                // Get today's date and time
                var now = new Date().getTime();
                
                // Find the distance between now and the count down date
                var distance = countDownDate - now;
                
                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                // Output the result in an element with id="demo"
                if(minutes < 10 && minutes > 0 ) minutes = (minutes/10).toString().replace(".","");
                else if(minutes <= 0) minutes = "00";

                if(seconds < 10 && seconds > 0 ) seconds = (seconds/10).toString().replace(".","");
                else if(seconds <= 0) seconds = "00";

                setCountDown( minutes+":" + seconds)
                
                // If the count down is over, write some text 
                if (distance < 0) {
                    clearInterval(x);
                    setKodeOTP(Math.floor(Math.random() * (1000000 - 1 + 1) ) + 1);
                    setCountDownStart(false);
                }
                cekSMS();
            }, 1000);
        }
    }

    const sendOTP = (no_telepon) => {
        let kode = Math.floor(Math.random() * (1000000 - 1 + 1) ) + 1;
        setKodeOTP(kode);
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

        const params = {
            no_telepon,
            "kodeOTP":kode
        }
        
        const createFormData = (body) => {
            const data = new FormData();
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            return data;
        }
        const formData = createFormData(params);
        fetch(base_url+'User/get_api_send_sms_otp_nusasms',
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
            setLoadingVisible(false);
            console.log(json);
            if(json.response == 1){
                setCountDownStart(true);
            }
            else{
                setAlert(true);
                setAlertMessage("Gagal Mengirim Kode OTP");
                setCancelTextAlert("Tutup");
                setConfirmButtonAlert(false);
                setCancelButtonAlert(true);
                setLoadingVisible(false);
            }
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
    }

    const confirmCode = () => {
        if(confirmOTP == kodeOTP){
            if(parent === 'Register') registerAkun();
            else if (parent === 'Login') signIn(username, password, no_telepon, deviceToken);
            else if (parent === 'AddRekeningBank') addRekeningBankHandler();
        }
        else{
            setAlert(true);
            setAlertMessage("Kode yang Anda Masukkan Salah.");
            setCancelTextAlert("Tutup");
            setConfirmButtonAlert(false);
            setCancelButtonAlert(true);
        }
    }

    const addRekeningBankHandler = () => {
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
            task = () => loadAddRekeningBank();
            setAlertCancelTask(task);
        }, 30000);

        const params = {
            username,
            id_rekening_bank,
            no_rekening,
            atas_nama,
            user_pin:user_new_pin,
        }
        console.log(params);
        
        const createFormData = (body) => {
            const data = new FormData();
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            return data;
        }
        const formData = createFormData(params);
        fetch(base_url+'RekeningBank/get_api_add_rekening_bank',
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
            setLoadingVisible(false);
            if(json.response == 1){
                setAlert(true);
                setAlertMessage(json.msg);
                setCancelTextAlert("Tutup");
                setConfirmButtonAlert(false);
                setCancelButtonAlert(true);
                task = () => loadRekeningBank();
                setAlertCancelTask(task);
            }
            else{
                setAlert(true);
                setAlertMessage(json.msg);
                setCancelTextAlert("Tutup");
                setConfirmButtonAlert(false);
                setCancelButtonAlert(true);
                task = () => loadAddRekeningBank();
                setAlertCancelTask(task);
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
            task = () => loadAddRekeningBank();
            setAlertCancelTask(task);
        });
    }

    const loadRekeningBank = ()=> () => {
        setAlert(false)
        navigation.navigate("RekeningBank", {username});
    }

    const loadAddRekeningBank = () => () => {
        setAlert(false)
        navigation.navigate("AddRekeningBank", {username, id_rekening_bank, nama_bank, logo});
    }

    const registerAkun = () => {
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

        const params = {
            nama_lengkap,
            no_telepon,
            'device_token': deviceToken,
            password
        }
        
        const createFormData = (body) => {
            const data = new FormData();
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            return data;
        }
        const formData = createFormData(params);
        fetch(base_url+'User/get_api_register',
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
            setAlert(false);
            setLoadingVisible(false);
            if(json.status == 1){
                setUsername(json.username);
                berhasilRegister(json.username);
                navigation.navigate("Home");
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
    }

    const berhasilRegister = async (username) => {
        try{
            AsyncStorage.setItem("username", username);
            AsyncStorage.setItem("no_telepon", no_telepon);
            console.log("Username Registered : "+username)
        }catch(e){
            console.log(e);
        }
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

    return (
        <View style={styles.container}>
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
                onCancelPressed={alertCancelTask}
                onConfirmPressed={alertConfirmTask}
            />
            
            <View style={styles.titleContainer}>
                <Text style={styles.smsVerficationTitle1}>Toke</Text>
                <Text style={styles.smsVerficationTitle2}>Sawit</Text>
                <Text style={styles.smsVerficationTitle3}> | Verifikasi No. Telepon</Text>
            </View>
            <ScrollView style={styles.smsVerficationArea}>
                <View style={styles.formGroup} >
                    <View style={styles.inputWrapper}>
                        <Icon name="sms" type="ionicon" size={22} color="gray" style={{position:"absolute", left:5,bottom:10}} />
                        <TextInput style={styles.textInput} placeholder="Masukkan Kode OTP" placeholderTextColor= 'gray' value={confirmOTP} onChangeText = { (value) => setConfirmOTP(value) } keyboardType="numeric" onSubmitEditing={()=> confirmCode() } />
                        
                    </View>
                </View>

                <View style={styles.formGroup} >
                    <Text style={styles.ketLabel} >Kami Telah Mengirimkan Kode OTP Melalui SMS  </Text>
                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.ketLabel}>ke Nomor </Text>
                        <Text style={styles.noHpLabel} >{no_telepon}</Text>
                    </View>

                    {
                        countDownStart ? ( 
                            <View style={{flexDirection:"row"}}>
                                <Text style={styles.ketLabel} >Kirim Ulang OTP Dalam Waktu </Text>
                                <Text style={styles.countDownLabel}>{countDown}</Text>
                            </View>    
                        ) : (
                            <View>
                                <TouchableOpacity style={styles.btnKirimOTP} onPress={()=>{sendOTP(no_telepon)}}>
                                    <Text style={styles.btnKirimOTPLabel}>Kirim Ulang OTP</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                    
                </View>
                {
                    countDownStart && ( 
                        <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {setProcessConfirm(true)} } > 
                            <Text style={styles.btnLanjutkanLabel}>Lanjutkan</Text>
                        </TouchableOpacity>
                    )
                }
            </ScrollView>
        </View>
    )       
}


export default SmsVerification;


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:ORANGE
    },
    titleContainer : {
        flex:1,
        flexDirection: 'row',
        position:"absolute",
        top:70,
        left:25
    },
    smsVerficationTitle1 : {
        fontSize : 28,
        color :'#FFFF',
    },
    smsVerficationTitle2 : {
        fontSize : 28,
        color :'yellow',
    },
    smsVerficationTitle3 : {
        fontSize : 18,
        color :'white',
        paddingTop:7
    },

    smsVerficationArea:{
        flex:1,
        top:150,
        marginTop:20,
        paddingTop:50,
        paddingHorizontal:25,
        position:"relative",
        borderRadius:40,
        backgroundColor:"white",
        marginHorizontal:0
    },
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"white",
        height:45,
        justifyContent:"center",
    },
    formGroup:{
        marginBottom:20,
    },
    textInput:{
        borderTopWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
        borderWidth:0.3,
        borderColor:"black",
        color:"black",
        borderRadius:5,
        fontSize:15,
        flex:1,
        marginHorizontal:35,
    },
    noHpLabel:{
        fontSize:15,
        color:ORANGE,
        marginBottom:10,
        fontWeight:"500"
    },
    countDownLabel:{
        fontSize:13,
        color:ORANGE
    },
    ketLabel:{
        fontSize:13,
        color:'black'
    },
    btnLanjutkan : {
        backgroundColor:ORANGE,
        alignItems:"center",
        marginTop:20,
        height:40,
        borderRadius:10,
        justifyContent:"center",
        color:"white"
    },
    btnLanjutkanLabel : {
        fontSize:17,
        color:'white'
    },
    btnKirimOTP : {
        width:130,
        backgroundColor:NAVY,
        alignItems:"center",
        marginTop:10,
        height:30,
        borderRadius:0,
        justifyContent:"center",
    },
    btnKirimOTPLabel : {
        fontSize:13,
        color:'white'
    },
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