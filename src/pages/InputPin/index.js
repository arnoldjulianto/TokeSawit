/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Image, FlatList, SafeAreaView,RefreshControl, ScrollView, Keyboard } from 'react-native';
import CONSTANTS from '../../assets/constants';
import SearchBar from '../../components/SearchBar/search_bar_rekening_bank';
import Icon from 'react-native-vector-icons/FontAwesome5';
import iconAdd from '../../assets/icon/add.png';
import AwesomeAlert from 'react-native-awesome-alerts';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-community/async-storage';

const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const InputPin = ({route, navigation}) => {
    let {id_rekening_bank, no_rekening, atas_nama, nama_bank, logo, parent } = route.params;
    const inputPin1 = useRef();
    const [inputPin2, setInputPin2] = useState();
    const [inputPin3, setInputPin3] = useState();
    const [inputPin4, setInputPin4] = useState();
    const [inputPin5, setInputPin5] = useState();
    const [inputPin6, setInputPin6] = useState();
    const [pin1, setPin1] = useState();
    const [pin2, setPin2] = useState();
    const [pin3, setPin3] = useState();
    const [pin4, setPin4] = useState();
    const [pin5, setPin5] = useState();
    const [pin6, setPin6] = useState();
    const [showAlert, setAlert] = useState(false);
    const closeAlert = () => () => {
        console.log("alert close");
        setAlert(false);
    }
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [alertCancelTask, setAlertCancelTask] = useState(() => closeAlert() );
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [username, setUsername] = useState();
    let task;
    
    useEffect (() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setLoadingVisible(true);
            getUser();
            inputPin1.current.focus();
        });
        return unsubscribe;
    },[navigation])

    const getUser = async () => {
        try {
          const value = await AsyncStorage.getItem('username');
          if (value === null) {
            // We have data!!
            setUsername("");
          }
          else{
            setUsername(value);
          }
          console.log(value)
          setLoadingVisible(false);
        } catch (error) {
          // Error retrieving data
          console.log(error)
          setLoadingVisible(false);
        }
    };

    const addRekeningBankHandler = (pin6) => {
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
            user_pin:pin1+pin2+pin3+pin4+pin5+pin6,
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
                setAlertCancelTask( task );
            }
            else{
                setAlert(true);
                setAlertMessage(json.msg);
                setCancelTextAlert("Tutup");
                setConfirmButtonAlert(false);
                setCancelButtonAlert(true);
                setPin1("")
                setPin2("")
                setPin3("")
                setPin4("")
                setPin5("")
                setPin6("")
                inputPin1.current.focus()
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

    const loadRekeningBank = () => () => {
        setAlert(false)
        navigation.navigate("RekeningBank", {username});
    }

    const loadAddRekeningBank = () => () => {
        setAlert(false)
        navigation.navigate("AddRekeningBank", {username, id_rekening_bank, nama_bank, logo});
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

    return(
        <View style={{flex:1, backgroundColor:ORANGE}}>
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
            <SearchBar title={"Input Pin"} navigation={navigation} refresh ={false}  />
            <View style={styles.formArea}>
                <View style={styles.formGroup}>
                    <View style={styles.inputWrapper}>
                        <TextInput style={styles.textInput}  textAlign={'center'} keyboardType={"numeric"} autoFocus={true} ref={inputPin1} blurOnSubmit={false} maxLength={1} returnKeyType="next" onChangeText={(value)=>{
                            setPin1(value);
                            inputPin2.focus();
                        }} secureTextEntry={true} value={pin1}  />

                        <TextInput style={styles.textInput}  textAlign={'center'} keyboardType={"numeric"} ref={(input)=>setInputPin2(input) } blurOnSubmit={false} maxLength={1} returnKeyType="next" onChangeText={(value)=>{
                            setPin2(value);
                            inputPin3.focus();
                        }} secureTextEntry={true} value={pin2} onKeyPress={({ nativeEvent }) => {
                            if(nativeEvent.key === 'Backspace' ){
                                inputPin1.current.focus()
                                setPin1("");
                            } //do action : //other action
                        }} />

                        <TextInput style={styles.textInput}  textAlign={'center'} keyboardType={"numeric"} ref={(input)=>setInputPin3(input) } blurOnSubmit={false} maxLength={1} returnKeyType="next" onChangeText={(value)=>{
                            setPin3(value);
                            inputPin4.focus();
                        }} secureTextEntry={true} value={pin3} onKeyPress={({ nativeEvent }) => {
                            if(nativeEvent.key === 'Backspace' ){
                                inputPin2.focus()
                                setPin2("");
                            } //do action : //other action
                        }} />

                        <TextInput style={styles.textInput}  textAlign={'center'} keyboardType={"numeric"} ref={(input)=>setInputPin4(input) } blurOnSubmit={false} maxLength={1} returnKeyType="next" onChangeText={(value)=>{
                            setPin4(value);
                            inputPin5.focus();
                        }} secureTextEntry={true} value={pin4} onKeyPress={({ nativeEvent }) => {
                            if(nativeEvent.key === 'Backspace' ){
                                inputPin3.focus()
                                setPin3("");
                            } //do action : //other action
                        }}  />

                        <TextInput style={styles.textInput}  textAlign={'center'} keyboardType={"numeric"} ref={(input)=>setInputPin5(input) } blurOnSubmit={false} maxLength={1} returnKeyType="next" onChangeText={(value)=>{
                            setPin5(value);
                            inputPin6.focus();
                        }} secureTextEntry={true} value={pin5} onKeyPress={({ nativeEvent }) => {
                            if(nativeEvent.key === 'Backspace' ){
                                inputPin4.focus()
                                setPin4("");
                            } //do action : //other action
                        }} />

                        <TextInput style={styles.textInput}  textAlign={'center'} keyboardType={"numeric"} ref={(input)=>setInputPin6(input) } blurOnSubmit={false} maxLength={1} returnKeyType="next" onChangeText={(value)=>{
                            setPin6(value);
                            if(value != ""){
                                if(parent == "AddRekeningBank")  addRekeningBankHandler(value);
                            }
                        }} secureTextEntry={true} value={pin6} onKeyPress={({ nativeEvent }) => {
                            if(nativeEvent.key === 'Backspace' ){
                                inputPin5.focus()
                                setPin5("");
                            } //do action : //other action
                        }} />
                    </View>
                </View>
                
                <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                    <View style={{flex:1}}>
                        <Text style={styles.ketLabel}>Jika Anda Belum Membuat Pin, Maka Sistem Akan Menyimpan Pin Ini Sebagai Pin Baru</Text>
                    </View>

                    <View style={{flex:0.5}}>
                        <TouchableOpacity style={styles.btnLupaPin} onPress={()=> navigation.navigate("BuatPinBaru", {username, id_rekening_bank, no_rekening, atas_nama, nama_bank, logo, parent})}>
                            <Text style={styles.btnLupaPinLabel}>Lupa Pin?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default InputPin;

const styles = StyleSheet.create({
    formArea :{
        flex:1,
        paddingTop:10,
        paddingHorizontal:15,
    },
    formGroup:{
        backgroundColor:'transparent',
        marginBottom:15,
    },
    formLabel : {
        color:'white',
        fontSize:18,
        fontWeight:'400',
    },
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:ORANGE,
        height:100,
        justifyContent:"space-around",
        color:"black"
    },
    textInput:{
        borderTopWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
        borderWidth:3,
        borderColor:"white",
        color:"white",
        borderRadius:5,
        fontSize:25,
        flex:1,
        marginHorizontal:10,
        alignSelf:'center'
    },
    btnLupaPin: {
        flexDirection:'row',
        backgroundColor:ORANGE,
        marginTop:0,
        marginBottom:30,
        height:40,
        borderRadius:10,
        alignItems:'flex-start',
        justifyContent:"center"
       
    },
    btnLupaPinLabel : {
        flex:1,
        fontSize:16,
        color:'white',
        marginLeft:10,
        textAlign:'right'
    },
    ketLabel : {
        flex:1,
        fontSize:13,
        color:'white',
        marginLeft:10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop:0,
    },
    modalView: {
        flex:1,
        backgroundColor: ORANGE,
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