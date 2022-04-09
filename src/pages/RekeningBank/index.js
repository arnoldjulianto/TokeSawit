/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback } from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Image, FlatList, SafeAreaView,RefreshControl, Dimensions } from 'react-native';
import CONSTANTS from '../../assets/constants';
import SearchBar from '../../components/SearchBar/search_bar_rekening_bank';
import Icon from 'react-native-vector-icons/FontAwesome5';
import iconNext from '../../assets/icon/next.png';
import iconVerified from '../../assets/icon/verified.png';
import iconPending from '../../assets/icon/pending.png';
import AwesomeAlert from 'react-native-awesome-alerts';
import NoData from '../../assets/img/no data.svg';
import AsyncStorage from '@react-native-community/async-storage';

const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const RekeningBank = ({route, navigation}) => {
    //let {username} = route.params;
    const [searchParam, setSearchParam] = useState("");
    const [arrRekeningBankSaya, setArrRekeningBankSaya] = useState([]);
    const [showAlert, setAlert] = useState(false);
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
    const [username, setUsername] = useState();

    useEffect (() => {
        setLoadingVisible(true);
        getUser();
    },[])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setLoadingVisible(true);
            getUser();  
        });
        return unsubscribe;
    }, [navigation]);

    const getUser = async () => {
        try {
          const value = await AsyncStorage.getItem('username');
          if (value === null) {
            // We have data!!
            setUsername("");
          }
          else{
            setUsername(value);
            setLoadingVisible(false);
            loadRekeningSaya();
          }
        } catch (error) {
          // Error retrieving data
          console.log(error)
          setLoadingVisible(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        
        getUser();
        setRefreshing(false);
      }, []);

    const loadRekeningSaya = () => {
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
            username
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
        fetch(base_url+'RekeningBank/get_api_rekening_bank_saya',
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
            setArrRekeningBankSaya(json);
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

    const renderItemRekeningBankSaya = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.rekeningBankArea} key={item.username+index} onPress={ ()=> {} } >
                <View style={styles.listRekeningBankWrapper}>
                    <Image style={styles.logoBank} source={{uri : base_url+"assets/icon/"+item.logo}} resizeMode="contain" />
                    <View style={styles.detailRekeningBank}>
                        <Text style={styles.atasNamaLabel} >a.n. {item.atas_nama} </Text>
                        <Text style={styles.namaBankLabel} >{item.nama_bank}</Text>
                        <Text style={styles.noRekeningLabel} >{item.no_rekening}</Text>
                        {item.status == 1 && (
                                <View style={{flex:1, flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                                    <Text style={styles.verifikasiLabel} >Sudah Diverifikasi</Text>
                                    <Image source={iconVerified} style={styles.verifikasiLogo} />
                                </View>
                            )
                        }
                        {item.status != 1 && (
                                <View style={{flex:1, flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                                    <Text style={styles.verifikasiLabel} >Menunggu Diverifikasi</Text>
                                    <Image source={iconPending} style={styles.verifikasiLogo} />
                                </View>
                            )
                        }
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

    return(
        <View style={{flex:1}} >
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
            <SearchBar title={"Daftar Rekening Saya"} navigation={navigation} refresh ={()=>loadRekeningSaya()} />
                <SafeAreaView style={{flex:10}}>
                    <View style={styles.formArea}>
                        {arrRekeningBankSaya.length == 0 && (
                                <View style={styles.noDataWrapper}>
                                    <NoData width={250} height={150} />
                                    <Text style={styles.noDataText1}>Tidak Ada Data Ditemukan</Text>
                                    <Text style={styles.noDataText2}>Jika Anda Belum Memiliki Rekenang Bank, Silahkan Menambah Rekening Bank Terlebih Dahulu.</Text>
                                </View>
                            )
                        }
                        {arrRekeningBankSaya.length > 0 && (
                                <View style={styles.formGroup} >
                                        <FlatList
                                            data={arrRekeningBankSaya}
                                            keyExtractor={(item, index) => (item.id) + index}
                                            renderItem={renderItemRekeningBankSaya}
                                            refreshControl={
                                                <RefreshControl
                                                refreshing={refreshing}
                                                onRefresh={onRefresh}
                                                />
                                            }
                                        />
                                </View>   
                            )
                        }
                    </View>
                </SafeAreaView>        
                
                <View style={{flex:1,justifyContent: 'flex-end',paddingHorizontal:12}}>
                    <TouchableOpacity style={styles.btnTambahRekening} onPress={()=> {navigation.navigate("PilihRekeningBank",{username})} }>
                        <View style={{flexDirection:"row",justifyContent:'center'}}>
                            <Text style={styles.btnTambahRekeningLabel}>TAMBAH REKENING BANK</Text>
                            <Image source={iconNext} style={styles.btnTambahRekeningIcon}  />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={()=> {loadRekeningSaya()} }
                    style={styles.FloatingActionButtonStyle1}>
                        <Image
                        source={iconRefresh}   
                        style={styles.FloatingActionButtonImageStyle}
                        />
                </TouchableOpacity> */}
        </View>
    )
}

export default RekeningBank;

const styles = StyleSheet.create({
    rekeningBankArea: {
        justifyContent: 'center',
        backgroundColor:'#fff7f7',
        paddingVertical:5,
        paddingHorizontal:10,
        marginBottom:20
    },
    listRekeningBankWrapper :{
        flexDirection:'row',
        justifyContent:'space-around',
        marginBottom:10
    },
    logoBank :{
        width:60,
        height:60
    },
    verifikasiLogo :{
        width:20,
        height:20
    },
    formArea:{
        flex:1,
        paddingTop:10,
        paddingHorizontal:15,
        backgroundColor:"white",
    },
    formGroup:{
        marginBottom:20,
    },
    formLabel :{
        fontSize:17,
        fontWeight:'bold'
    }, 
    flatList :{
        flex:1,
        flexDirection:'row',
        backgroundColor:'#ededed',
        justifyContent:"space-between",
        padding:5,
        marginBottom:15
    },
    detailRekeningBank:{
        flex:0.7,
        justifyContent:'center',
        alignItems:'flex-start'
    },
    atasNamaLabel : {
        fontSize:16,
        fontWeight:'500'
    },
    namaBankLabel : {
        fontSize:13,
        fontWeight:'400'
    },
    noRekeningLabel : {
        fontSize:15,
        fontWeight:'400'
    },
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"white",
        height:45,
        justifyContent:"center",
        marginTop:5
    },
    textInput:{
        borderWidth:1,
        borderTopWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
        borderColor:"lightgray",
        color:"black",
        fontSize:15,
        flex:1,
        paddingLeft:40,
    },
    btnTambahRekening: {
        backgroundColor:NAVY,
        alignItems:"center",
        height:40,
        width:Dimensions.get('window').width - 50,
        borderRadius:10,
        justifyContent:"center",
        bottom: 25,
        position: 'absolute',
        marginLeft:30
    },
    btnTambahRekeningIcon : {
        width:23,
        height:23,
        marginHorizontal:6,
        marginTop:1
    },
    btnTambahRekeningLabel : {
        fontSize:15,
        color:'white'
    },
    FloatingActionButtonStyle: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 50,
        backgroundColor:'transparent',
        borderColor:'#000000',
        borderRadius: 200/2
    },
    FloatingActionButtonStyle1: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 20,
        backgroundColor:'transparent',
        borderColor:'#000000',
        borderRadius: 200/2
    },
    FloatingActionButtonImageStyle: { 
        width: 60,
        height: 60,
    }, 
    centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop:0,
    },
    noDataWrapper:{
        alignItems:"center", 
        justifyContent:"center",
        paddingTop:50
    },
    noDataText1:{
        fontSize:16,
        color:ORANGE,
        textAlign:"center",
        marginTop:20
    },
    noDataText2:{
        width:300,
        textAlign:"center",
        fontSize:12,
        color:"gray"
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