/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import CONSTANTS from '../../assets/constants';
import AwesomeAlert from 'react-native-awesome-alerts';
import iconIndo from '../../assets/icon/indonesia.png';
const DANGER = CONSTANTS.COLOR.DANGER;
const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const SmsVerification = ({route, navigation}) => {
    let {parent} = route.params;
    const closeAlert = () => {
        console.log("alert close");
        setAlert(false);
    }
    const [no_telepon, setNoTelepon] = useState("");
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
    //const route = useRoute();
    let task;

    const cekNoTelepon = () => {
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
        fetch(base_url+'User/get_api_cek_no_telepon',
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
                setCancelTextAlert("Lanjutkan");
                task = () => loadRegister();
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
        });
    } 

    const loadSmsVerification = () => () => {
        setAlertConfirmTask(() => closeAlert());
        const params = {
            no_telepon : "+62"+no_telepon, parent
        }
        navigation.navigate('SmsVerificationProvider', params);
    }

    const loadRegister = () => () => {
        setAlertConfirmTask(() => closeAlert());
        navigation.navigate('Register');
    }

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
                    setAlert(false)
                }}
                onConfirmPressed={alertConfirmTask}
            />
            
            <View style={styles.titleContainer}>
                <Text style={styles.inputNoHpTitle1}>Toke</Text>
                <Text style={styles.inputNoHpTitle2}>Sawit</Text>
                <Text style={styles.inputNoHpTitle3}> | No. Telepon</Text>
            </View>
            <Text style={styles.inputNoHpSubTitle}>Silahkan Mengisi Form di Bawah Ini Untuk Login Menggunakan No. Telepon</Text>
         
            <ScrollView style={styles.inputNoHpArea}>
                <View style={styles.formGroup} >
                    <View style={styles.inputWrapper}>
                        <Image source={iconIndo} style={styles.logoIndo} />
                        <Text style={styles.kodeNegaraLabel}>+62</Text>
                        <TextInput style={styles.textInput} placeholder="Masukkan No. Telepon" placeholderTextColor= 'gray' value={no_telepon} onChangeText = { (value) => resetNoTelepon(value) } keyboardType="numeric" onSubmitEditing={() => { cekNoTelepon() }}  />
                    </View>
                </View>
                <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {cekNoTelepon()} } > 
                    <Text style={styles.btnLanjutkanLabel}>Lanjutkan</Text>
                </TouchableOpacity>
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
    inputNoHpTitle1 : {
        fontSize : 28,
        color :'#FFFF',
    },
    inputNoHpTitle2 : {
        fontSize : 28,
        color :'yellow',
    },
    inputNoHpTitle3 : {
        fontSize : 18,
        color :'white',
        paddingTop:7
    },
    inputNoHpSubTitle : {
        fontSize : 13,
        color :'#FFFF',
        position:"absolute",
        top:115,
        marginHorizontal:35
    },
    inputNoHpArea:{
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
    logoIndo :{
        width:25,
        height:25,
        borderRadius:90/3
    },
    kodeNegaraLabel :{
        marginLeft:10,
        marginRight:5,
        fontSize:20,
    },
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"white",
        height:50,
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
        fontSize:20,
        flex:1,
        marginHorizontal:0,
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