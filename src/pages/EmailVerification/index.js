/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CONSTANTS from '../../assets/constants';
import Axios from 'axios';

const DANGER = CONSTANTS.COLOR.DANGER;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const EmailVerification = ({route, navigation}) => {
    const closeAlert = () => {
        console.log("alert close");
        setAlert(false);
    }

    let { username, nama_lengkap, tanggal_lahir, tempat_lahir, jenis_kelamin, email, no_telepon, alamat, file_user, password } = route.params;
    const [kodeOTP, setKodeOTP] = useState(Math.floor(Math.random() * (1000000 - 1 + 1) ) + 1);
    const [confirmKodeOTP, setConfirmKodeOTP] = useState("");
    const [showAlert, setAlert] = useState(false);
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [startCountDown, setStartCountDown] = useState(false);
    const [countDown, setCountDown] = useState(120);
    
    const base_url = CONSTANTS.CONFIG.BASE_URL;

    useEffect(() => {
        sendEmailVerification();
    }, [kodeOTP]);

    const sendEmailVerification = () => {
        const timeout = setTimeout(() => {
            setAlert(true);
            setLoadingVisible(false);
            setCancelButtonAlert(true);
            setConfirmButtonAlert(false);
            setCancelTextAlert("Tutup");
            setAlertMessage("Permintaan Tidak Dapat Dipenuhi, Server Tidak Merespon");
            navigation.navigate("Register");
        }, 30000);
        
        const params = {
            email,
            kodeOTP
        }

        const createFormData = (body) => {
            const data = new FormData();
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            console.log(data);
            return data;
        }

        Axios.post(base_url+'User/get_api_send_email_otp', createFormData(params))
        .then(response => {
            clearTimeout(timeout);
            setAlert(true);
            setLoadingVisible(false);
            setAlertMessage(response.data[0].msg);
            setCancelButtonAlert(true);
            setConfirmButtonAlert(false);
            setCancelTextAlert("Tutup");
            if(response.data[0].response == 1){
                setBtnDisabled(false);
            }
            else{
                setBtnDisabled(true);
            }
        })
        .catch(function (error) {
            clearTimeout(timeout);
            setAlert(true);
            setAlertMessage("Terjadi Kesalahan. \n"+error);
            setCancelTextAlert("Tutup");
            setConfirmButtonAlert(false);
            setCancelButtonAlert(true);
            setLoadingVisible(false);
            navigation.navigate("Register");
        })
    }

    const confirmCode = () => {
        if(btnDisabled){
            setAlert(true);
            setAlertMessage("Tidak Dapat Melanjutkan. Silahkan Mengirim Ulang Kode OTP.");
            setCancelTextAlert("Tutup");
            setConfirmButtonAlert(false);
            setCancelButtonAlert(true);
        }
        else{
            if(confirmKodeOTP == kodeOTP){
                console.log("Valid Code");
            }
            else{
                console.log("Invalid Code");
            }
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
             <View style={styles.titleContainer}>
                <Text style={styles.emailVerficationTitle1}>e</Text>
                <Text style={styles.emailVerficationTitle2}>Harvest</Text>
                <Text style={styles.emailVerficationTitle3}> | Verifikasi Email</Text>
            </View>
            <ScrollView style={styles.emailVerficationArea}>
                <View style={styles.formGroup} >
                    <View style={styles.inputWrapper}>
                        <Icon name="sms" type="ionicon" size={22} color="gray" style={{position:"absolute", left:5,bottom:10}} />
                        <TextInput style={styles.textInput} placeholder="Masukkan Kode OTP" placeholderTextColor= 'gray' value={confirmKodeOTP} onChangeText = { (value) => setConfirmKodeOTP(value) } keyboardType="number" />
                    </View>
                </View>

                <View style={styles.formGroup} >
                    
                    <Text style={styles.ketLabel} >Kami Telah Mengirimkan Kode OTP Melalui Email  </Text>
                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.ketLabel}>ke Alamat Email </Text>
                        <Text style={styles.emailLabel} >{email}</Text>
                    </View>
                    {
                        startCountDown != true ? (
                            <View style={{flexDirection:"row"}}>
                                <TouchableOpacity style={styles.btnSendOTP} onPress={()=> {sendEmailVerification()} } > 
                                    <Text style={styles.btnSendOTPLabel}>Kirim Ulang OTP</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{flexDirection:"row"}}>
                                <Text style={styles.ketLabel} >Kirim Ulang OTP Dalam Waktu </Text>
                                <Text style={styles.countDownLabel}>{countDown} Detik</Text>
                            </View>
                        )
                    }    
                    
                </View>

                <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {confirmCode()} } disabled={btnDisabled}  > 
                    <Text style={styles.btnLanjutkanLabel}>Lanjutkan</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    ) 
}


export default EmailVerification;


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:DANGER
    },
    titleContainer : {
        flex:1,
        flexDirection: 'row',
        position:"absolute",
        top:70,
        left:25
    },
    emailVerficationTitle1 : {
        fontSize : 28,
        color :'#FFFF',
    },
    emailVerficationTitle2 : {
        fontSize : 28,
        color :'yellow',
    },
    emailVerficationTitle3 : {
        fontSize : 18,
        color :'white',
        paddingTop:7
    },

    emailVerficationArea:{
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
        borderWidth:0.3,
        borderColor:"lightgray",
        color:"black",
        borderRadius:5,
        fontSize:15,
        flex:1,
        paddingLeft:35,
        paddingTop:10,
    },
    emailLabel:{
        fontSize:15,
        color:ORANGE,
        marginBottom:10,
        fontWeight:"500"
    },
    countDownLabel:{
        fontSize:13,
        color:DANGER
    },
    ketLabel:{
        fontSize:13,
        color:'black'
    },
    btnLanjutkan : {
        backgroundColor:DANGER,
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
    btnSendOTP : {
        backgroundColor:ORANGE,
        alignItems:"center",
        height:25,
        borderRadius:10,
        justifyContent:"center",
        color:"white"
    },
    btnSendOTPLabel : {
        fontSize:13,
        color:'white'
    },
})