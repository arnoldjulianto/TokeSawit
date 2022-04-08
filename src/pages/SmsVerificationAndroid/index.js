/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CONSTANTS from '../../assets/constants';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from '../../components/Context';
import SendSMS from 'react-native-sms'
import SmsAndroid from 'react-native-get-sms-android';

const DANGER = CONSTANTS.COLOR.DANGER;
const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const SmsVerification = ({route, navigation}) => {
    let {nama_lengkap, no_telepon, password, parent} = route.params;
    if( no_telepon.substr(0, 1) == "0" ){
        no_telepon = "+62"+no_telepon.substr(1);
    }
    const closeAlert = () => {
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
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [countDown, setCountDown] = useState();
    const [countDownStart, setCountDownStart] = useState(false);
    const [username, setUsername] = useState();
    const { signIn } = React.useContext(AuthContext);

    useEffect(() => {
        sendOTP(no_telepon);
        getDeviceToken();
    }, []);

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

    const countDownTimer = () => {
        if(countDownStart){
            var countDownDate = new Date().getTime()+ 1000 * 60;
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
            }, 1000);
        }
    }

    const sendOTP = (no_telepon) => {
        setLoadingVisible(true);
        console.log('sendSMS');
        // alert('clicked');
        SendSMS.send({
            body: 'Hello shadmna you have done well !',
            recipients: ['9928872286', '7014859919'],
            successTypes: ['sent', 'queued'],
            allowAndroidSendWithoutReadPermission: true
        }, (completed, cancelled, error) => {
            if (completed) {
                console.log('SMS Sent Completed');
            } else if (cancelled) {
                console.log('SMS Sent Cancelled');
            } else if (error) {
                console.log('Some error occured');
            }
            setLoadingVisible(false);
        });
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
                onCancelPressed={() => {
                    setAlert(false);
                }}
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
                        <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {confirmCode()} } > 
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