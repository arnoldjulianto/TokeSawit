/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import CONSTANTS from '../../assets/constants';
import AwesomeAlert from 'react-native-awesome-alerts';
const DANGER = CONSTANTS.COLOR.DANGER;
const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
import Icon from 'react-native-vector-icons/FontAwesome5';
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const Register = ({navigation}) => {
    const closeAlert = () => {
        console.log("alert close");
        setAlert(false);
    }
    const [secureTextEntry, setSecureTextEntry ] = useState(true);
    const [nama_lengkap, setNamaLengkap] = useState("");
    const [no_telepon, setNoTelepon] = useState("");
    const [device_token, setDeviceToken] = useState("");
    const [password, setPassword] = useState("");
    const [konfirmasi_password, setKonfirmasiPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [showAlert, setAlert] = useState(false);
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [inputTelepon, setInputTelepon] = useState();
    const [inputPassword, setInputPassword] = useState();
    const [inputConfirmPassword, setInputConfirmPassword] = useState();
    let task = () => closeAlert();
    const route = useRoute();

    const cekPassword = (password) => {
        setPassword(password);
        let passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
        if(password == ""){
            setPasswordCheck("");
            setBtnDisabled(false);
            setShowPasswordCheck(false);
        }
        else {
            if(password.match(passw)){
                setBtnDisabled(false);
                setPasswordCheck("");
                setShowPasswordCheck(false);
            }
            else{
                setBtnDisabled(true);
                setPasswordCheck("* Password Harus Memiliki 8-20 Karakter yang Berisi Setidaknya Satu Digit Angka, Satu Huruf Besar dan Satu Huruf Kecil");
                setShowPasswordCheck(true);
            }
        }
    }
//PROSES KE DATABASE
    
    const registerHandle = () => {
        setConfirmButtonAlert(false);
        setCancelTextAlert("Tutup");
        if(nama_lengkap == "") {
            setAlert(true);
            setAlertMessage("Nama Lengkap Tidak Boleh Kosong");
            
        }
        else if(no_telepon == "") {
            setAlert(true);
            setAlertMessage("No. Telepon Tidak Boleh Kosong");
            
        }
        else if(password == "") {
            setAlert(true);
            setAlertMessage("Password Tidak Boleh Kosong");
            
        }
        else if(konfirmasi_password == "") {
            setAlert(true);
            setAlertMessage("Konfirmasi Password Tidak Boleh Kosong");
            
        }
        else if(password != konfirmasi_password) {
            setAlert(true);
            setAlertMessage("Password & Konfirmasi Password Tidak Sama");
        }
        else {
            //task = () => cekRegister;
            setAlertConfirmTask(() => cekRegister());
            setAlert(true);
            setAlertMessage("Simpan Perubahan?");
            setConfirmTextAlert("Lanjutkan");
            setCancelTextAlert("Batal");
            setConfirmButtonAlert(true);
        }
    }

    const cekRegister = () => () => {
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
            no_telepon : "+62"+no_telepon
        }
        
        const createFormData = (body) => {
            const data = new FormData();
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            return data;
        }
        const formData = createFormData(params);
        fetch(base_url+'User/get_api_cek_register',
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
            setAlertMessage(json.msg);
            if(json.response == 1){
                setConfirmButtonAlert(true);
                setCancelButtonAlert(true);
                task = () => loadSmsVerification();
                setAlertConfirmTask(task);
                setConfirmTextAlert("Kirim OTP");
                setCancelTextAlert("Batal");
            }
            else{
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
    }    
    
    const loadSmsVerification = () => () => {
        setAlertConfirmTask(() => closeAlert());
        const parent = route.name;
        const params = {
            nama_lengkap, no_telepon : "+62"+no_telepon, password, parent
        }
        navigation.navigate('SmsVerificationProvider', params);
    }

    const loadEmailVerification = () => () => {
        setAlertConfirmTask(() => closeAlert());
        const params = {
            nama_lengkap, no_telepon, password
        }
        navigation.navigate('EmailVerification', params);
        
        //console.log("Sms Verification");
    }
//PROSES KE DATABASE

    const resetNoTelepon = (value) => {
        value = value.replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, "");
        if(value == "0"){
            value = "";
        }
        setNoTelepon(value)
        
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
                <Text style={styles.registerTitle1}>Toke</Text>
                <Text style={styles.registerTitle2}>Sawit</Text>
                <Text style={styles.registerTitle3}> | Register</Text>
            </View>
            
            <Text style={styles.registerSubTitle}>Silahkan Mengisi Form di Bawah Ini Untuk Melakukan Registrasi</Text>
         
                <View style={styles.registerArea}>
                    <ScrollView>
                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Nama Lengkap</Text>
                            <View style={styles.inputWrapper}>
                                <Icon name="user" type="ionicon" size={18} color="gray" style={{position:"absolute", left:5,bottom:10}} />
                                <TextInput style={styles.textInput} placeholder="wajib diisi" placeholderTextColor= 'gray' value={nama_lengkap} onChangeText = { (value) => setNamaLengkap(value) } onSubmitEditing={() => { inputTelepon.focus()}} blurOnSubmit={false} returnKeyType="next"  />
                            </View>
                        </View>
                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>No. Telepon</Text>
                            <View style={styles.inputWrapper}>
                                <Icon name="phone" type="ionicon" size={18} color="gray" style={{position:"absolute", left:5,bottom:10}} />
                                <Text style={styles.kodeNegaraLabel}>+62</Text>
                                <TextInput style={styles.textInputNoTelepon} placeholder="wajib diisi" placeholderTextColor= 'gray' value={no_telepon} onChangeText = { (value) => resetNoTelepon(value) } keyboardType="numeric" onSubmitEditing={() => { inputPassword.focus()}} ref={(input) => { setInputTelepon(input) }} blurOnSubmit={false} returnKeyType="next" />
                            </View>
                        </View>

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <Icon name="lock" type="ionicon" size={18} color="gray" style={{position:"absolute", left:5,bottom:10}} />
                                <TextInput style={styles.textInput} placeholder="wajib diisi" placeholderTextColor= 'gray' secureTextEntry={secureTextEntry} value={password} onChangeText = { (value) => cekPassword(value) } onSubmitEditing={() => { inputConfirmPassword.focus()}} ref={(input) => { setInputPassword(input) }} blurOnSubmit={false} returnKeyType="next" >
                                </TextInput>
                            </View>    
                            {
                            showPasswordCheck && (
                            <Text  style={styles.textPasswordCheck} >{passwordCheck}</Text>
                            )
                            }
                        </View>

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Konfirmasi Password</Text>
                            <View style={styles.inputWrapper}>
                                <Icon name="lock" type="ionicon" size={18} color="gray" style={{position:"absolute", left:5,bottom:10}} />
                                <TextInput style={styles.textInput} placeholder="wajib diisi" placeholderTextColor= 'gray' secureTextEntry={secureTextEntry} value={konfirmasi_password} onChangeText = { (value) => setKonfirmasiPassword(value) } ref={(input) => { setInputConfirmPassword(input) }} onSubmitEditing={() => registerHandle() }>
                                </TextInput>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.btnRegister} onPress={()=> {registerHandle()} } disabled={btnDisabled}  >
                            <Text style={styles.btnRegisterLabel}>Register</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnLogIn}  onPress={()=> navigation.navigate("Login")} > 
                            <Text style={styles.btnLogInLabel}>Login</Text>
                        </TouchableOpacity>
                    </ScrollView>    
                </View>
        </View>
    )
}

export default Register;

const styles = StyleSheet.create({
    textPasswordCheck :{
        fontSize:12,
        color:ORANGE,
        fontStyle:"italic"
    },
    container:{
        flex:1,
        backgroundColor:ORANGE
    },
    titleContainer : {
        flex:1,
        flexDirection: 'row',
        position:"relative",
        top:70,
        left:25
    },
    registerTitle1 : {
        fontSize : 28,
        color :'#FFFF',
    },
    registerTitle2 : {
        fontSize : 28,
        color :'yellow',
    },
    registerTitle3 : {
        fontSize : 18,
        color :'white',
        paddingTop:7
    },
    registerSubTitle : {
        fontSize : 13,
        color :'#FFFF',
        position:"absolute",
        top:115,
        marginHorizontal:35
    },
    registerArea:{
        paddingTop:20,
        paddingHorizontal:25,
        borderTopLeftRadius:40,
        borderTopRightRadius:40,
        backgroundColor:"white",
    },
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"white",
        height:45,
        justifyContent:"center",
    },
    formGroup:{
        marginTop:20,
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
    textInputNoTelepon:{
        borderTopWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
        borderWidth:0.3,
        borderColor:"black",
        color:"black",
        borderRadius:5,
        fontSize:15,
        flex:1,
        marginRight:35,
    },
    kodeNegaraLabel :{
        marginLeft:35,
        marginRight:5,
        fontSize:15,
    },
    textArea:{
        borderWidth:0.3,
        borderColor:"lightgray",
        color:"black",
        borderRadius:5,
        fontSize:15,
        flex:1,
        paddingLeft:10,
        paddingTop:0,
    },
    formLabel : {
        color:'black',
        fontSize:17,
        marginBottom:10
    },
    lupaPasswordLabel:{
        fontSize:13,
        color:ORANGE
    },
    btnShowPassword:{
        position:"relative", 
        width:40,
        height:30, 
        backgroundColor:"white", 
        alignItems:"center", 
        justifyContent:"center"
    },
    btnLogIn : {
        backgroundColor:"lightgray",
        alignItems:"center",
        marginTop:30,
        height:40,
        borderRadius:10,
        justifyContent:"center",
        marginBottom:50
    },
    btnLogInLabel : {
        fontSize:17,
        color:'white'
    },
    btnRegister: {
        backgroundColor:ORANGE,
        alignItems:"center",
        marginTop:40,
        height:40,
        borderRadius:10,
        justifyContent:"center"
       
    },
    btnRegisterLabel : {
        fontSize:17,
        color:'white'
    },
    btnOpenGallery : {
        backgroundColor:NAVY,
        height:40,
        width:90,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20,
        marginHorizontal:5
    },
    btnOpenGalleryText :{
        color:'white'
    },
    btnTakePhoto : {
        backgroundColor: ORANGE,
        height:40,
        width:90,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20,
        marginHorizontal:5,
    },
    btnTakePhotoText :{
        color:'white'
    },
    uploadFotoWrapper : {
        flexDirection : 'row',
        alignItems:'center',
        justifyContent: 'space-around'
    },
    tampungFotoWrapper: {
        flex:1,
        alignItems:"center",
        marginBottom:10
    },
    tampungFoto:{
        height:130,
        width:130,
        borderRadius:8,
        marginBottom:0,
    },
    buttonIcon :{
        width:26,
        height:26
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
