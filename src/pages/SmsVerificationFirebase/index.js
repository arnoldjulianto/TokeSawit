/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CONSTANTS from '../../assets/constants';
import { AuthContext } from '../../components/Context';
import auth from '@react-native-firebase/auth';

const DANGER = CONSTANTS.COLOR.DANGER;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
//

const SmsVerification = ({route, navigation}) => {
    let {nama_lengkap, no_telepon, password } = route.params;
    if( no_telepon.substr(0, 1) == "0" ){
        no_telepon = "+62"+no_telepon.substr(1);
    }
    const [kodeOTP, setKodeOTP] = useState("");
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    // If null, no SMS has been sent
    const [confirm, setConfirm] = useState(null);

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
        if(!user) console.log("Create User");
        else console.log("User Exist");
    }

     useEffect(() => {
        //if (!user) signInWithPhoneNumber(no_telepon);
        //verifyPhoneNumber(no_telepon);
        if(!user) {
            createAccount();
            console.log("Create Account : "+email);
        }
        else{
            verifyPhoneNumber(no_telepon);
            console.log("Verifiy No. Telepon : "+no_telepon);
        }
    }, [no_telepon]);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

   
    
    React.useEffect(
        () =>
          navigation.addListener('beforeRemove', (e) => {
            // Prevent default behavior of leaving the screen
            e.preventDefault();
          }),
        [navigation]
    );

    // SEND OTP
    
    async function signInWithPhoneNumber(phoneNumber) {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        //console.log(confirmation)
        setConfirm(confirmation);
    }
    /*
    async function confirmCode() {
        try {
          await confirm.confirm(kodeOTP);
          console.log('Valid code.');
          console.log('OTP : '+kodeOTP)
        } catch (error) {
          console.log('Invalid code.');
          console.log('OTP : '+kodeOTP)
        }
    }
    */
    async function verifyPhoneNumber(phoneNumber) {
        const confirmation = await auth().verifyPhoneNumber(phoneNumber);
        setConfirm(confirmation);
      }
      
      // Handle create account button press
    async function createAccount() {
        try {
        await auth().createUserWithEmailAndPassword(email, password);
            console.log('User account created & signed in!');
            verifyPhoneNumber(no_telepon);
            console.log("Verifiy No. Telepon : "+no_telepon);
        } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
            verifyPhoneNumber(no_telepon);
            console.log("Verifiy No. Telepon : "+no_telepon);
        }

        if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
        }
        console.error(error);
        }
    }

    // Handle confirm code button press
    async function confirmCode() {
        try {
          const credential = auth.PhoneAuthProvider.credential(confirm.verificationId, kodeOTP);
          let userData = await auth().currentUser.linkWithCredential(credential);
          setUser(userData.user);
          console.log("Valid Code");
        } catch (error) {
          if (error.code == 'auth/invalid-verification-code') {
            console.log('Invalid code.');
          } else {
            console.log('Account linking error');
          }
        }
    }

    if (initializing) return null;

    return (
        <View style={styles.container}>
             <View style={styles.titleContainer}>
                <Text style={styles.smsVerficationTitle1}>e</Text>
                <Text style={styles.smsVerficationTitle2}>Harvest</Text>
                <Text style={styles.smsVerficationTitle3}> | Verifikasi No. Telepon</Text>
            </View>
            <ScrollView style={styles.smsVerficationArea}>
                <View style={styles.formGroup} >
                    <View style={styles.inputWrapper}>
                        <Icon name="sms" type="ionicon" size={22} color="gray" style={{position:"absolute", left:5,bottom:10}} />
                        <TextInput style={styles.textInput} placeholder="Masukkan Kode OTP" placeholderTextColor= 'gray' value={kodeOTP} onChangeText = { (value) => setKodeOTP(value) } keyboardType="" />
                    </View>
                </View>

                <View style={styles.formGroup} >
                    
                    <Text style={styles.ketLabel} >Kami Telah Mengirimkan Kode OTP Melalui SMS  </Text>
                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.ketLabel}>ke Nomor </Text>
                        <Text style={styles.noHpLabel} >{no_telepon}</Text>
                    </View>
                        
                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.ketLabel} >Kirim Ulang OTP Dalam Waktu </Text>
                        <Text style={styles.countDownLabel}>59 Detik</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {confirmCode()} } > 
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
        backgroundColor:DANGER
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
        borderWidth:0.3,
        borderColor:"lightgray",
        color:"black",
        borderRadius:5,
        fontSize:15,
        flex:1,
        paddingLeft:35,
        paddingTop:10,
    },
    noHpLabel:{
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
})