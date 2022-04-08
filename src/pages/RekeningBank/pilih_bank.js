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

const PilihRekeningBank = ({route, navigation}) => {
    let {username} = route.params;
    const [showAlert, setAlert] = useState(false);
    const [arrMasterRekeningBank, setArrMasterRekeningBank] = useState([]);
    const closeAlert = () => {
        console.log("alert close");
        setAlert(false);
    }
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [refreshing, setRefreshing] = React.useState(false);
    const [showInputRekening, setShowInputRekening] = useState(true);
    const [showTampungArrRekeningBank, setShowTampungArrRekeningBank] = useState(false);
    const [isSelected, setSelection] = useState(false);
    const [searchParam, setSearchParam] = useState("");
    const [ didKeyboardShow, setKeyboardShow ] = useState(false);

    // useEffect (() => {
    //     loadMasterRekeningBank();
    //     Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    //     Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    
    //     //  Don't forget to cleanup with remove listeners
    //     return () => {
    //         Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
    //         Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    //     }
    // },[])

    useEffect (() => {
        loadMasterRekeningBank();
    },[searchParam])

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadMasterRekeningBank();
        setRefreshing(false);
    }, []);

    const _keyboardDidShow = () => {
        setShowInputRekening(false);
    }
    
    const _keyboardDidHide = () => {
        setShowInputRekening(true);
        if(searchParam == "") setShowTampungArrRekeningBank(false);
        else setShowTampungArrRekeningBank(true);
    }

    const loadMasterRekeningBank = () => {
        //if(searchParam == "") setLoadingVisible(true);
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
            searchParam
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
        fetch(base_url+'RekeningBank/get_api_all_rekening_bank',
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
            setArrMasterRekeningBank(json);
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

    const renderItemMasterRekeningBank = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.rekeningBankArea} key={item.username+index} onPress={ ()=> {navigation.navigate("AddRekeningBank", {username, id_rekening_bank:item.id, nama_bank:item.nama_bank, logo:item.logo} )} } >
                <View style={styles.listRekeningBankWrapper}>
                    <Image style={styles.logoBank} source={{uri : base_url+"assets/icon/"+item.logo}} resizeMode="contain" />
                    <View style={styles.detailRekeningBank}>
                        <Text style={styles.namaBankLabel} >{item.nama_bank}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
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

    const searchHandler = (value) => {
        setSearchParam(value);
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
                    onCancelPressed={() => {
                        setAlert(false);
                    }}
                    onConfirmPressed={alertConfirmTask}
            />
            <SearchBar title={"Pilih Rekening"} navigation={navigation} refresh ={()=>loadMasterRekeningBank()}  />
                <SafeAreaView style={{flex:1}}>
                    <View style={styles.formArea}>
                            <View style={styles.segmenWrapper}>
                                <Text style={styles.segmenTitle}>Pilih Rekening Bank</Text>
                            </View>
                            <View style={styles.formGroup} >
                                <View style={styles.inputWrapper}>
                                    <Icon name="search" type="ionicon" size={20} color="gray" style={{position:"absolute", left:5,bottom:10}} />
                                    <TextInput style={styles.textInput} placeholder="Cari nama bank" placeholderTextColor= 'gray' value={searchParam} onChangeText = { (value) => searchHandler(value) } 
                                    onFocus={()=> setShowInputRekening(false) }
                                    onBlur={()=> setShowInputRekening(true) }
                                    onSubmitEditing={Keyboard.dismiss}
                                    />
                                </View>
                            </View>
                            <View style={styles.formGroup} >
                                    <FlatList
                                        data={arrMasterRekeningBank}
                                        keyExtractor={(item, index) => (item.id) + index}
                                        renderItem={renderItemMasterRekeningBank}
                                        refreshControl={
                                            <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={onRefresh}
                                            />
                                        }
                                    />
                            </View>
                    </View>
                </SafeAreaView>
        </View>
    )
}

export default PilihRekeningBank;

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
        marginTop:10,
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
        marginHorizontal:35,
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