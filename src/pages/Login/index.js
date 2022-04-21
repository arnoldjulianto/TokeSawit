/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CONSTANTS from '../../assets/constants';
import { AuthContext } from '../../components/Context';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';
import { useRoute } from '@react-navigation/native';

import ProsesModal from '../../components/ProsesModal';
const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const Login = ({navigation}) => {
    const [secureTextEntry, setSecureTextEntry ] = useState(true);
    const [iconEye, setIconEye ] = useState("eye-slash");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [deviceToken, setDeviceToken] = useState("");
    const [showAlert, setAlert] = useState(false);
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [inputPassword, setInputPassword] = useState();
    const route = useRoute();

    useEffect(() => {
        getDeviceToken();
    }, []);

    const getDeviceToken = async () => {
        try{
            const token = await AsyncStorage.getItem("deviceToken");
            setDeviceToken(token);
            console.log('Device Token : '+token);
        }catch(e){
            console.log(e);
        }
    }

    const showPassword = () => {
        if(secureTextEntry == true) {
            setSecureTextEntry(false);
            setIconEye("eye");
        }
        else{
            setSecureTextEntry(true);
            setIconEye("eye-slash");
        }
    }

    const { signIn } = React.useContext(AuthContext);
    const loginHandler = () => {
        setConfirmButtonAlert(false);
        setCancelTextAlert("Tutup");
        if(username == "") {
            setAlert(true);
            setAlertMessage("Username Tidak Boleh Kosong");
            
        }
        else if(password == "") {
            setAlert(true);
            setAlertMessage("Password Tidak Boleh Kosong");
            
        }
        else {
            signIn(username, password, null, deviceToken);
        }
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
                onConfirmPressed={() => {
                    setAlert(false);
                }}
            />
            <View style={styles.titleContainer}>
                <Text style={styles.loginTitle1}>Toke</Text>
                <Text style={styles.loginTitle2}>Sawit</Text>
                <Text style={styles.loginTitle3}> | Login</Text>
            </View>
            
            <Text style={styles.loginSubTitle}>Silahkan Mengisi Form di Bawah Ini Untuk Login</Text>
            <ScrollView style={styles.loginArea}>
                <View>
                    <View style={styles.formGroup} >
                        <Text style={styles.formLabel}>Username</Text>
                        <View style={styles.inputWrapper}>
                            <Icon name="user" type="ionicon" size={22} color="gray" style={{position:"absolute", left:5,bottom:10}} />
                            <TextInput style={styles.textInput} placeholder="Masukkan Username Anda" placeholderTextColor= 'gray' value={username} onChangeText = { (value) => setUserName(value) } onSubmitEditing={() => { inputPassword.focus()}} blurOnSubmit={false} returnKeyType="next" />
                        </View>
                    </View>
                    
                    <View style={styles.formGroup} >
                        <Text style={styles.formLabel}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <Icon name="lock" type="ionicon" size={22} color="gray" style={{position:"absolute", left:5,bottom:10}} />
                            <TextInput style={styles.textInput} placeholder="Masukkan Password Anda" placeholderTextColor= 'gray' secureTextEntry={secureTextEntry} value={password} onChangeText = { (value) => setPassword(value) } ref={(input) => { setInputPassword(input) }} onSubmitEditing={() => {loginHandler()}} >
                            </TextInput>
                            <TouchableOpacity style={styles.btnShowPassword} onPress={() => showPassword() } > 
                                <Icon name={iconEye} type="ionicon" size={20} color={ORANGE}  />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.btnLogInNoHp} onPress={()=> navigation.navigate("InputNoHp", {parent:route.name}) }> 
                        <Text style={styles.gunakanNoHpLabel} >Gunakan No. Telepon Untuk Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnLogIn} onPress={()=> {loginHandler()} } > 
                        <Text style={styles.btnLogInLabel}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnRegister} onPress={()=> navigation.navigate("Register")} >
                        <Text style={styles.btnRegisterLabel}>Register</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    )
}

export default Login;

const styles = StyleSheet.create({
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
    loginTitle1 : {
        fontSize : 28,
        color :'#FFFF',
    },
    loginTitle2 : {
        fontSize : 28,
        color :'yellow',
    },
    loginTitle3 : {
        fontSize : 18,
        color :'white',
        paddingTop:7
    },
    loginSubTitle : {
        fontSize : 13,
        color :'#FFFF',
        position:"absolute",
        top:115,
        marginHorizontal:35
    },
    loginArea:{
        paddingTop:50,
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
    formLabel : {
        color:'black',
        fontSize:17,
        marginBottom:10
    },
    gunakanNoHpLabel:{
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
    btnLogInNoHp : {
        flex:1,
        justifyContent:'center',
        height:50,
    },
    btnLogIn : {
        backgroundColor:ORANGE,
        alignItems:"center",
        marginTop:10,
        height:40,
        borderRadius:10,
        justifyContent:"center"
    },
    btnLogInLabel : {
        fontSize:17,
        color:'white'
    },
    btnRegister: {
        backgroundColor:"lightgray",
        alignItems:"center",
        marginTop:30,
        height:40,
        borderRadius:10,
        justifyContent:"center"
    },
    btnRegisterLabel : {
        fontSize:17,
        color:'white'
    },
})
