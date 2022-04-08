/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Image, FlatList, SafeAreaView,RefreshControl, ScrollView, Keyboard } from 'react-native';
import CONSTANTS from '../../assets/constants';
import SearchBar from '../../components/SearchBar/search_bar_rekening_bank';
import Icon from 'react-native-vector-icons/FontAwesome5';
import iconAdd from '../../assets/icon/add.png';
import AwesomeAlert from 'react-native-awesome-alerts';
import CheckBox from '@react-native-community/checkbox';
const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const AddRekeningBank = ({route, navigation}) => {
    let {username, id_rekening_bank, nama_bank, logo} = route.params;
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
    const [no_rekening, setNoRekening] = useState("");
    const [atas_nama, setAtasNama] = useState("");
    const [inputAtasNama, setInputAtasNama] = useState();
    let task;
    
    const submitHandler = () => {
        if(no_rekening == ""){
            setAlert(true);
            setCancelButtonAlert(true);
            setConfirmButtonAlert(false);
            setCancelTextAlert("Tutup");
            setAlertMessage("No. Rekening Tidak Boleh Kosong");
        }
        else if(atas_nama == ""){
            setAlert(true);
            setCancelButtonAlert(true);
            setConfirmButtonAlert(false);
            setCancelTextAlert("Tutup");
            setAlertMessage("Atas Nama Tidak Boleh Kosong");
        }
        else{
            // setLoadingVisible(true);
            // setCancelButtonAlert(true);
            // setConfirmButtonAlert(false);

            // const timeout = setTimeout(() => {
            //     setAlert(true);
            //     setLoadingVisible(false);
            //     setCancelButtonAlert(true);
            //     setConfirmButtonAlert(false);
            //     setCancelTextAlert("Tutup");
            //     setAlertMessage("Permintaan Tidak Dapat Dipenuhi, Server Tidak Merespon");
            // }, 30000);

            // const params = {
            //     username,
            //     id_rekening_bank,
            //     no_rekening,
            //     atas_nama,

            // }
            // console.log(params);
            
            // const createFormData = (body) => {
            //     const data = new FormData();
            //     Object.keys(body).forEach(key => {
            //         data.append(key, body[key]);
            //     });
            //     return data;
            // }
            // const formData = createFormData(params);
            // fetch(base_url+'RekeningBank/get_api_add_rekening_bank',
            // {
            //     method: 'post',
            //     body: formData,
            //     headers: {
            //     'Content-Type': 'multipart/form-data; ',
            //     },
            // })
            // .then((response) => response.json())
            // .then((json) => {
            //     clearTimeout(timeout);
            //     setLoadingVisible(false);
            //     setAlert(true);
            //     if(json.response == 1){
            //         setAlert(true);
            //         setAlertMessage(json.msg);
            //         setCancelTextAlert("Tutup");
            //         setConfirmButtonAlert(false);
            //         setCancelButtonAlert(true);
            //         task = () => loadRekeningSaya();
            //         setAlertCancelTask(task);
            //     }
            //     else{
            //         setAlert(true);
            //         setAlertMessage(json.msg);
            //         setCancelTextAlert("Tutup");
            //         setConfirmButtonAlert(false);
            //         setCancelButtonAlert(true);
            //     }
            //     console.log(json);
            // })
            // .catch((error) => {
            //     clearTimeout(timeout);
            //     setAlert(true);
            //     setAlertMessage("Terjadi Kesalahan. \n"+error);
            //     setCancelTextAlert("Tutup");
            //     setConfirmButtonAlert(false);
            //     setCancelButtonAlert(true);
            //     setLoadingVisible(false);
            //     console.log(error);
            // });
            const parent = route.name;
            navigation.navigate("InputPin", {username, id_rekening_bank, no_rekening, atas_nama, parent });
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

    return(
        <View style={{flex:1}}>
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
            <SearchBar title={"Data Pemilik Rekening"} navigation={navigation} refresh ={false}  />
                <SafeAreaView style={{flex:1}}>
                    <View style={styles.formArea}>
                            <View style={styles.segmenWrapper}>
                                <Text style={styles.segmenTitle}>Input Nama & No. Rekening</Text>
                            </View>
                            <ScrollView>
                                <View style={styles.formGroup} >
                                    <View style={styles.listRekeningBankWrapper}>
                                        <Image style={styles.logoBank} source={{uri : base_url+"assets/icon/"+logo}} resizeMode="contain" />
                                        <View style={styles.detailRekeningBank}>
                                            <Text style={styles.namaBankLabel} >{nama_bank}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.formGroup} >
                                    <Text style={styles.formLabel}>No. Rekening</Text>
                                    <View style={styles.inputWrapper}>
                                        <TextInput style={styles.textInput} placeholder={"Masukkan No. Rekening"} placeholderTextColor= 'gray' value={no_rekening}  onChangeText = {(value) => {setNoRekening(value)}}  blurOnSubmit={false} returnKeyType="next" keyboardType={"numeric"} onSubmitEditing={() => inputAtasNama.focus() }  ></TextInput>

                                    </View>
                                </View>

                                <View style={styles.formGroup} >
                                    <Text style={styles.formLabel}>Atas Nama</Text>
                                    <View style={styles.inputWrapper}>
                                        <TextInput style={styles.textInput} placeholder={"Masukkan Atas Nama"} placeholderTextColor= 'gray' value={atas_nama}  onChangeText = {(value) => {setAtasNama(value)}} onSubmitEditing={() => {submitHandler()}} ref={(input) => setInputAtasNama(input) } ></TextInput>
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.btnSimpan} onPress={()=> {submitHandler()} }>
                                    {/* <Image style={styles.btnEditProfilIcon}  source={iconEdit} /> */}
                                    <Text style={styles.btnSimpanLabel}>LANJUTKAN</Text>
                                </TouchableOpacity>

                            </ScrollView>
                    </View>
                </SafeAreaView>
        </View>
    )
}

export default AddRekeningBank;

const styles = StyleSheet.create({
    segmenWrapper : {
        backgroundColor:'white',
        paddingTop:10,
        paddingBottom:20,
    },
    segmenTitle :{
        fontSize:13,
        fontWeight:'500',
    },
    rekeningBankArea: {
        justifyContent: 'center',
        backgroundColor:'#fff7f7',
        paddingHorizontal:10,
        marginBottom:10
    },
    listRekeningBankWrapper :{
        flexDirection:'row',
        justifyContent:'space-around',
        marginBottom:10
    },
    logoBank :{
        width:50,
        height:50
    },
    formArea:{
        flex:1,
        marginTop:20,
        paddingHorizontal:15,
        backgroundColor:"white",
    },
    formGroup:{
        marginBottom:15,
    },
    formLabel : {
        color:'black',
        fontSize:13,
        fontWeight:'300'
    },
    flatList :{
        flex:1,
        flexDirection:'row',
        backgroundColor:'#ededed',
        justifyContent:"space-between",
        marginBottom:10
    },
    detailRekeningBank:{
        justifyContent:'center'
    },
    namaBankLabel : {
        fontSize:15,
        fontWeight:'500'
    },
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"white",
        height:45,
        justifyContent:"center",
        color:"black"
    },
    textInput:{
        borderTopWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
        borderWidth:0.3,
        borderColor:"black",
        color:"black",
        borderRadius:5,
        fontSize:13,
        flex:1,
        marginHorizontal:10,
    },
    btnSimpan: {
        flexDirection:'row',
        backgroundColor:ORANGE,
        alignItems:"center",
        marginTop:20,
        marginBottom:30,
        height:40,
        borderRadius:10,
        justifyContent:"center"
       
    },
    btnSimpanLabel : {
        fontSize:15,
        color:'white',
        marginLeft:10
    },
    btnSimpanIcon:{
        width:22,
        height:22
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
});