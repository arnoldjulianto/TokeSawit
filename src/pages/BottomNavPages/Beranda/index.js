/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import iconCameraPurple from '../../../assets/icon/camera-purple.png';
import iconInvoiceGreen from '../../../assets/icon/invoice-green.png';
import iconListRed from '../../../assets/icon/list-red.png';
import iconShoppingCartBlue from '../../../assets/icon/shopping-cart-blue.png';
import iconCashierMachineBlack from '../../../assets/icon/cashier-machine-black.png';
import iconLoanYellow from '../../../assets/icon/loan-yellow.png';
import iconPeopleListPink from '../../../assets/icon/people-list-pink.png';
import CONSTANTS from '../../../assets/constants';
import SearchBar from '../../../components/SearchBar/search_bar_beranda';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SearchAkunModal from '../../../components/SearchAkunModal';
import AwesomeAlert from 'react-native-awesome-alerts';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const DANGER = CONSTANTS.COLOR.DANGER;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const Beranda = (props) => {
    const [searchParam, setSearchParam] = useState("");
    const [username, setUsername] = useState("");
    const [nama_lengkap, setNamaLengkap] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [showAlert, setAlert] = useState(false);
    const closeAlert = () => {
        console.log("alert close");
        setAlert(false);
    }
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            getUser();
        });
        return unsubscribe;
    })

    const launchImageLibrary = async () => {
        if(username != ""){
            const options = {
                usedCameraButton: true,
                allowedVideo: false,
                allowedPhotograph: true, // for camera : allow this option when you want to take a photos
                allowedVideoRecording: false, //for camera : allow this option when you want to recording video.
                maxVideoDuration: 60, //for camera : max video recording duration
                numberOfColumn: 3,
                maxSelectedAssets: 20,
                singleSelectedMode: false,
                doneTitle: 'Lanjutkan',
                isPreview: true,
                mediaType: 'image',
                isExportThumbnail: true,
            }
            const response = await MultipleImagePicker.openPicker(options);
            console.log(response);
            const params = {
                'all_file_klaim_do' : response
            }
            props.navigation.navigate('FotoKlaimDo', params);
        }
        else  props.navigation.navigate('Login');
    }

    const getUser = async () => {
        try {
          const value = await AsyncStorage.getItem('username');
          if (value === null) {
            // We have data!!
          }
          else{
            setUsername(value);
            loadDataUser(username)
          }
        } catch (error) {
          // Error retrieving data
          console.log(error)
        }
    };

    const loadDataUser = (username) => {
        //setLoadingVisible(true);
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
        fetch(base_url+'User/get_api_user_data_only',
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
            setAlertMessage(json.msg);
            if(json.response == 1){
                setUsername(json.username);
                const pecah_nama = json.nama_lengkap.split(" ")
                setNamaLengkap(pecah_nama[0]+" "+pecah_nama[1]);
            }
            else{
                setAlert(true);
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
        <View>
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
            <SearchAkunModal setModalVisible={setModalVisible} modalVisible={modalVisible} currentUser={username} navigation={props.navigation} />
            <SearchBar />
            <ScrollView style={styles.container}>
                <View style={styles.topArea}>
                    <TouchableOpacity onPress={()=>setModalVisible(true)}>
                        <View style={styles.inputWrapper}>
                            <Icon name="search" type="ionicon" size={20} color="gray" style={{position:"absolute", left:10,bottom:10}} />
                            <Text style={styles.textInput}>Ikuti PPKS, Pemilik Do, atau Agen</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.menuArea}>
                    <View style={styles.menuRow}>
                        <TouchableOpacity style={styles.btnMenu} onPress={()=> {launchImageLibrary()} }>
                            <View style={styles.btnMenu}>
                                <Image source={iconCameraPurple} style={styles.btnMenuIcon}  />
                                <Text style={styles.btnMenuLabel}>Klaim Do</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnMenu} onPress={()=> {} }>
                            <View style={styles.btnMenu}>
                                <Image source={iconShoppingCartBlue} style={styles.btnMenuIcon}  />
                                <Text style={styles.btnMenuLabel}>Beli Do</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnMenu} onPress={()=> {} }>
                            <View style={styles.btnMenu}>
                                <Image source={iconListRed} style={styles.btnMenuIcon}  />
                                <Text style={styles.btnMenuLabel}>Rekap Do Saya</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnMenu} onPress={()=> {} }>
                            <View style={styles.btnMenu}>
                                <Image source={iconInvoiceGreen} style={styles.btnMenuIcon}  />
                                <Text style={styles.btnMenuLabel}>Buat {'\n'} Invoice</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.menuRow}>
                        <TouchableOpacity style={styles.btnMenu} onPress={()=> {} }>
                            <View style={styles.btnMenu}>
                                <Image source={iconCashierMachineBlack} style={styles.btnMenuIcon}  />
                                <Text style={styles.btnMenuLabel}>Bayar Invoice</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnMenu} onPress={()=> {} }>
                            <View style={styles.btnMenu}>
                                <Image source={iconLoanYellow} style={styles.btnMenuIcon}  />
                                <Text style={styles.btnMenuLabel}>Kasih Deposit</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnMenu} onPress={()=> {} }>
                            <View style={styles.btnMenu}>
                                <Image source={iconPeopleListPink} style={styles.btnMenuIcon}  />
                                <Text style={styles.btnMenuLabel}>Daftar Hutang</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.segmenArea}>
                    <Text style={styles.segmenTitle}>Hi {nama_lengkap}, Tentukan posisi Anda</Text>
                    {/* <ScrollView horizontal={true}> */}
                        <View style={styles.segmenWrapper}>
                                <TouchableOpacity style={styles.btnPemilikDo} >
                                    <Text style={styles.btnPemilikDoLabel}>Pemilik Do</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btnAgen} >
                                    <Text style={styles.btnAgenLabel}>Agen</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btnBantuRekapDo} >
                                    <Text style={styles.btnBantuRekapDoLabel}>Bantu Rekap Do</Text>
                                </TouchableOpacity>
                        </View>
                    {/* </ScrollView> */}
                </View>
                
            </ScrollView>
        </View>
    )
}
export default Beranda;

const styles = StyleSheet.create({
    container :{
        top:0
    },
    topArea:{
        backgroundColor:ORANGE,
        flex:1,
        paddingTop:0,
        paddingBottom:90,
        paddingHorizontal:15
        
    },
    menuArea :{
        marginTop:20,
        backgroundColor:'white',
        height:190,
        top:-95,
        marginHorizontal:20,
        borderRadius:10,
        padding:10
    },
    menuRow :{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        marginBottom:90
    },
    segmenArea :{
        marginTop:-80,
        backgroundColor:'white',
        marginHorizontal:20,
        borderRadius:10,
        paddingLeft:10,
        paddingBottom:20
    },
    segmenTitle :{
        fontSize:14,
        fontWeight:'500',
        marginTop:10,
        marginBottom:10,
    },
    segmenWrapper :{
        flexDirection : "row",
        justifyContent : "space-around",
    },
    btnAgen :{
        width:80,
        backgroundColor:NAVY,
        justifyContent:"center",
        alignItems:'center',
        height:50,
        marginRight:5,
        borderRadius:10
    },  
    btnAgenLabel :{
        fontSize:12,
        color:'white',

    },
    btnPemilikDo :{
        width:120,
        backgroundColor:ORANGE,
        justifyContent:"center",
        alignItems:'center',
        height:50,
        marginRight:5,
        borderRadius:10
    },  
    btnPemilikDoLabel :{
        fontSize:12,
        color:'white',
        textAlign:'center'
    },
    btnBantuRekapDo :{
        width:120,
        backgroundColor:DANGER,
        justifyContent:"center",
        alignItems:'center',
        height:50,
        marginRight:10,
        borderRadius:10
    },  
    btnBantuRekapDoLabel :{
        fontSize:12,
        color:'white',
        textAlign:'center'
    },
    btnMenu: {
        backgroundColor:'transparent',
        alignItems:"center",
        height:80,
        width:90,
        justifyContent:"center",
    },
    btnMenuIcon : {
        width:36,
        height:36,
        marginTop:1
    },
    btnMenuLabel : {
        fontSize:11,
        color:'grey',
        textAlign: 'center',
        marginTop:5
    },
    noDataWrapper:{
        alignItems:"center", 
        justifyContent:"center",
        paddingTop:50
    },
    inputWrapper:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"white",
        height:45,
        justifyContent:"space-between",
        color:"black",
        borderRadius:5,
    },
    textInput:{
        borderColor:"black",
        color:"gray",
        fontSize:13,
        flex:1,
        marginHorizontal:45,
    },
    usernameLabel :{
        fontSize:13,
        fontWeight:'700'
    },
    namaLengkapLabel : {
        fontSize:15,
        color:'grey',
        fontWeight:'400'
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