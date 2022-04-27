/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, TouchableOpacity, ActivityIndicator,RefreshControl, Image, ScrollView,  FlatList, TextInput } from 'react-native';
import CONSTANTS from '../../assets/constants';
import SearchBar from '../../components/SearchBar/search_bar_privasi_harga';
import ProsesModal from '../../components/ProsesModal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CheckBox from '@react-native-community/checkbox';
import iconDoneWhite from '../../assets/icon/done-white.png';
import AwesomeAlert from 'react-native-awesome-alerts';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const DANGER = CONSTANTS.COLOR.DANGER;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const ShowHargaKepada = ({route, navigation}) => {
    const [showAlert, setAlert] = useState(false);
    let {id_do_ppks, currentUser, showEditPemilikDoModal} = route.params;
    const closeAlert = () => {
        console.log("alert close");
        setAlert(false);
    }
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [searchParam, setSearchParam] = useState("");
    const [arrFollowers, setArrFollowers] = useState([]);
    const [arrTampilkanHargaKepada, setArrTampilkanHargaKepada] = useState([]);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [checkedAll, setCheckedAll] = useState(false);

    useEffect(()=>{
        console.log(searchParam)
        setArrFollowers([]);
        const delayDebounceFn = setTimeout(() => {
            loadTampilkanHargaKepada()
        }, 500)
        return () => clearTimeout(delayDebounceFn)
    },[searchParam])

    useEffect(
        () =>
          navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            navigation.dispatch(e.data.action);
            showEditPemilikDoModal(true);
          }),
        [navigation]
    );

    useEffect(() => {
        if(arrTampilkanHargaKepada.length > 0){
            const cek = cekJumlahChecked();
            if(!cek) setCheckedAll(false);
            else if(cek) setCheckedAll(true);
        }
    },[arrTampilkanHargaKepada])

    const loadTampilkanHargaKepada = () => {
        setLoadingVisible(true);
        const timeout = setTimeout(() => {
            setLoadingVisible(false);
        }, 30000);

        const params = {
            id_do_ppks,
            searchParam,
            currentUser
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
        fetch(base_url+'PrivasiHarga/get_api_tampilkan_harga_kepada',
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
            if(arrTampilkanHargaKepada.length == 0) {
                setArrTampilkanHargaKepada(json.arrTampilkanHargaKepada)
            }
            else{
                arrTampilkanHargaKepada.forEach((value, index) => {
                    if(!value.isChecked) value.isChecked = json.arrTampilkanHargaKepada[index].isChecked
                })
            }
            setArrFollowers(json.followers);
            console.log(json);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(error);
        });
    }

    const submitHandler = () => {
        setModalVisible(true);
        const timeout = setTimeout(() => {
            setModalVisible(false);
            setAlert(true);
            setCancelButtonAlert(true);
            setConfirmButtonAlert(false);
            setCancelTextAlert("Tutup");
            setAlertMessage("Permintaan Tidak Dapat Dipenuhi, Server Tidak Merespon");
        }, 30000);

        const params = {
            id_do_ppks,
            pemilik_do_ppks:currentUser,
            arrTampilkanHargaKepada:JSON.stringify(arrTampilkanHargaKepada)
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
        fetch(base_url+'PrivasiHarga/get_api_add_tampilkan_harga_kepada',
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
            setModalVisible(false);
            if(json.response == 1){
                showEditPemilikDoModal(true)
                navigation.goBack();
            }
            console.log(json);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setModalVisible(false);
            setAlert(true);
            setCancelButtonAlert(true);
            setConfirmButtonAlert(false);
            setCancelTextAlert("Tutup");
            setAlertMessage("Terjadi Kesalahan. \n"+error);
            console.log(error);
        });
    }

    const checkAll = () =>{
        let temp = arrTampilkanHargaKepada.map((value) => {
            if(value.isChecked) value.isChecked = false;
            else if(!value.isChecked) value.isChecked = true;
            return value;
        });
        setArrTampilkanHargaKepada(temp);
        const cek = cekJumlahChecked();
        if(!cek) setCheckedAll(false);
        else if(cek) setCheckedAll(true);
    }

    const handleChange = (id) => {
        let temp = arrTampilkanHargaKepada.map((value) => {
          if (id === value.username) {
            return { ...value, isChecked: !value.isChecked };
          }
          return value;
        });
        setArrTampilkanHargaKepada(temp);
        const cek = cekJumlahChecked();
        if(!cek) setCheckedAll(true);
        else if(cek) setCheckedAll(false);
    };

    const cekJumlahChecked = () =>{
        let x = true;
        for (var i = 0; i < arrTampilkanHargaKepada.length; i++){
            if(!arrTampilkanHargaKepada[i].isChecked) {
                x = false;
                break;
            }
        }
        return x;
    }

    const renderItemFollowers = ({item,index}) => {
        let uri = '';
        if(item.foto_profil == 'default.png') uri = base_url+"assets/upload/file user/"+item.foto_profil;
        else uri = base_url+"assets/upload/file user/"+item.username+"/"+item.foto_profil;

        return (
            <TouchableOpacity style={styles.renderItemUserArea} key={item.username+index} onPress={()=>{
                handleChange(item.username)
            }} >
                <Image style={styles.fotoProfil} source={{uri}} resizeMode="cover" resizeMethod="resize" />
                <View style={styles.detailUser}>
                    <Text style={styles.usernameLabel} >{item.username_edit}</Text>
                    <Text style={styles.namaLengkapLabel} >{item.nama_lengkap}</Text>
                </View>
                <CheckBox
                    disabled={false}
                    value={arrTampilkanHargaKepada[parseInt(index)].isChecked}
                    tintColors={{ true: ORANGE, false: 'black' }}
                    onChange={(newValue) => {
                        handleChange(item.username)
                    }}
                />
            </TouchableOpacity>
        )
    }

    

    return(
        <View style={{flex:1}}>
            <ProsesModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
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
            <SearchBar title={"Tampilkan Harga Hanya Kepada..."} navigation={navigation} setModalVisible={showEditPemilikDoModal} />
            <View style={styles.container} >
                <View style={styles.inputWrapper}>
                    <Icon name="search" type="ionicon" size={20} color="gray" style={{position:"absolute", left:10,bottom:10}} />
                    <TextInput style={styles.textInput} placeholder="Cari ..." placeholderTextColor= 'gray' value={searchParam} onChangeText = { (value) => {setSearchParam(value)} } 
                    />
                    
                </View>

                <View style={styles.segmenWrapper}>
                    {loadingVisible && (
                        <View >
                            <ActivityIndicator size={50} color={ORANGE} />
                        </View>
                    )}
                    {!loadingVisible && (
                        <View>
                            <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-around', marginBottom:15}} onPress={() =>{
                                checkAll();
                            }}>
                                <View style={{flex:1}}>
                                    <CheckBox
                                        disabled={false}
                                        value={checkedAll}
                                        tintColors={{ true: ORANGE, false: 'black' }}
                                        onChange={(newValue) => {
                                            checkAll()
                                        }}
                                        style={{alignSelf:'flex-end'}}
                                    />
                                </View>

                                <View style={{flex:0.5}}>
                                    <Text style={{marginTop:5,alignSelf:'flex-start'}}>Centang Semua</Text>
                                </View>
                            </TouchableOpacity>

                            <FlatList
                                data={arrFollowers}
                                keyExtractor={(item, index) => index}
                                renderItem={renderItemFollowers}
                                maxToRenderPerBatch={5} updateCellsBatchingPeriod={20}
                            /> 
                        </View>
                    )}    
                </View>
                
            </View> 

            <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>{submitHandler()}}
                    style={styles.touchableOpacityStyle}>
                    <Image
                        source={iconDoneWhite}
                        style={styles.floatingButtonStyle}
                    />
            </TouchableOpacity>
        </View>
    )
}

export default ShowHargaKepada;

const styles = StyleSheet.create({
    container: {
        paddingVertical:15,
        paddingHorizontal:10
    },
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"white",
        height:45,
        justifyContent:"center",
        color:"black",
        borderBottomWidth:1,
    },
    textInput:{
        borderColor:"black",
        color:"black",
        borderRadius:5,
        fontSize:13,
        flex:1,
        marginLeft:35,
    },
    segmenWrapper : {
        backgroundColor:'white',
        paddingVertical:20,
        paddingHorizontal:5,
        marginTop:5,
        marginBottom:10,
        borderRadius:5
    },
    segmenTitle :{
        fontSize:14,
        fontWeight:'700',
        color:'black',
        marginBottom:10
    },
    renderItemUserArea :{
        flexDirection:'row',
        backgroundColor:'#fcfcfc',
        justifyContent:"space-around",
        marginTop:12,
        borderWidth:0.3,
        paddingVertical:10,
        borderRadius:5
    },
    detailUser :{
        flex:0.7,
        backgroundColor:'transparent',
        justifyContent:"center",
        alignItems:"flex-start",
    }, 
    usernameLabel :{
        fontSize:13,
        color:'grey',
        fontWeight:'400'
    },
    namaLengkapLabel : {
        fontSize:15,
        color:'black',
        fontWeight:'700'
    },
    fotoProfil:{
        width:50,
        height:50,
        borderRadius:120/2,
        alignItems:"flex-start",
    },
    touchableOpacityStyle: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
        backgroundColor:ORANGE,
        borderRadius:60
    },
    floatingButtonStyle: {
        resizeMode: 'contain',
        width: 30,
        height: 30,
        //backgroundColor:'black'
    }
})