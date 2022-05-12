/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import CONSTANTS from '../../../assets/constants';
import SearchBar from '../../../components/SearchBar/search_bar_beranda';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SearchAkunModal from '../../../components/SearchAkunModal';
import AwesomeAlert from 'react-native-awesome-alerts';
import MenuHomeAtom from '../../../components/MenuHomeAtom';
import iconPemilikDo from '../../../assets/icon/pemilik-do.png';
import iconAgenDo from '../../../assets/icon/agen-do.png';
import iconAdminDo from '../../../assets/icon/admin-do.png';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'

const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const DANGER = CONSTANTS.COLOR.DANGER;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const Beranda = (props) => {
    const [searchParam, setSearchParam, modal] = useState("");
    const [username, setUsername] = useState("");
    const [nama_lengkap, setNamaLengkap] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingVisible, setLoadingVisible] = useState(true);
    const [showAlert, setAlert] = useState(false);
    const closeAlert = () => () => {
        console.log("alert close");
        setAlert(false);
    }
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [alertCancelTask, setAlertCancelTask] = useState(() => closeAlert() );
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    
    if(modal) setModalVisible(true);
    
    useEffect(() => {
        setLoadingVisible(true);
        getUser();
    },[])

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            //setLoadingVisible(true);
            getUser();
        });
        return unsubscribe;
    },[])

    const onRefresh = React.useCallback(() => {
        setLoadingVisible(true);
        getUser();
      }, []);

    const getUser = async () => {
        try {
          const value = await AsyncStorage.getItem('username');
          if (value === null) {
            // We have data!!
            setLoadingVisible(false)
            setUsername("");
            setNamaLengkap("");
          }
          else{
            setLoadingVisible(false)
            setUsername(value);
            loadDataUser(value)
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
            setLoadingVisible(false);
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
                setNamaLengkap("Selamat Datang, "+pecah_nama[0]+" "+pecah_nama[1]+" ! ");
            }      
            console.log(json);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(error);
        });
    }

    const konfirmasiPemilikDo = () => {
        setAlert(true);
        setCancelButtonAlert(true);
        setConfirmButtonAlert(true);
        setConfirmTextAlert("Lanjutkan");
        setCancelTextAlert("Batal");
        setAlertMessage("Pemilik Do (Delivery Order) adalah akun yang memiliki kerjasama langsung dengan PPKS BUKAN PERANTARA, jika Anda adalah perantara Do maka pilih menu jadi Agen.");
        setAlertConfirmTask(()=>loadPemilikDo())
        setAlertCancelTask(()=>closeAlert())
    }

    const konfirmasiAgenDo = () => {
        
    }

    const konfirmasiAdmin = () => {
        
    }
    const loadPemilikDo = ()=> {
        if(username == "")  props.navigation.navigate("Login");
        else props.navigation.navigate("JadiPemilikDo", {username} );
        setAlert(false);
    }


    const MyLoader = () => (
        <ContentLoader 
            viewBox="0 0 400 50" 
            foregroundColor="grey"
            style={{backgroundColor:"transparent", height:73}}
        >
          <Rect x="0" y="5" rx="3" ry="0" width="300" height="18" />
          <Rect x="0" y="35" rx="3" ry="0" width="180" height="13" />
        </ContentLoader>
    )

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
                    onCancelPressed={alertCancelTask}
                    onConfirmPressed={alertConfirmTask}
            />
            <SearchAkunModal setModalVisible={setModalVisible} modalVisible={modalVisible}  currentUser={username} navigation={props.navigation} />
            <SearchBar setLoadingVisible={setLoadingVisible} loadingVisible={loadingVisible}  />
            <ScrollView 
                style={styles.container}
                refreshControl={
                    <RefreshControl
                    refreshing={loadingVisible}
                    onRefresh={onRefresh}
                    />
                }
            >
                
                <View style={styles.topArea}>
                    <TouchableOpacity onPress={()=>setModalVisible(true)}>
                        <View style={styles.inputWrapper}>
                            <Icon name="search" type="ionicon" size={20} color="gray" style={{position:"absolute", left:10,bottom:10}} />
                            <Text style={styles.textInput}>Cari Sesuatu Disini . . .</Text>
                        </View>
                    </TouchableOpacity>

                    {loadingVisible && (
                        <MyLoader />
                    )}
                    {!loadingVisible && (
                        <View>
                            <Text style={styles.topAreaTitle}>
                                {nama_lengkap}
                            </Text>

                            <Text style={styles.topAreaSubTitle}>
                                Tentukan posisi Anda sebagai
                            </Text>
                        </View>
                    )}

                    <View style={styles.topButtonWrapper}>
                        {/* <TouchableOpacity style={styles.btnPemilikDo} onPress={()=> konfirmasiPemilikDo()} >
                            <Image source={iconPemilikDo} style={styles.btnTopAreaIcon} />
                            <Text style={styles.btnPemilikDoLabel}>Pemilik DO</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity style={styles.btnAgen} onPress={()=> {
                            loadPemilikDo();
                        }} >
                            <Image source={iconAgenDo} style={styles.btnTopAreaIcon} />
                            <Text style={styles.btnAgenLabel}>Agen DO</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnAdmin} onPress={()=> konfirmasiAdmin()} >
                            <Image source={iconAdminDo} style={styles.btnTopAreaIcon} />
                            <Text style={styles.btnAdminLabel}>Admin DO</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <MenuHomeAtom username={username} klaimDo={true} beliDo={true} rekapDoSaya={true} buatInvoice={true} bayarInvoice={true} kasihDeposit={true} daftarHutang={true} menuTop={-100}  navigation={props.navigation} /> 

                        

                
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
        flex:0.5,
        paddingTop:0,
        paddingBottom:90,
        paddingHorizontal:15
    },
    topAreaTitle :{
        fontSize:18,
        fontWeight:'500',
        marginTop:10,
        marginBottom:5,
        color:'white'
    },
    topAreaSubTitle :{
        fontSize:13,
        fontWeight:'400',
        marginBottom:10,
        color:'white'
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
    topButtonWrapper :{
        flexDirection : "row",
        justifyContent : "space-between",
    },
    segmenWrapper :{
        padding:10
    },
    btnTopAreaIcon : {
        width:45,
        height:45
    },
    btnAgen :{
        flex:1,
        flexDirection:'column',
        backgroundColor:'white',
        justifyContent:"center",
        alignItems:'center',
        height:90,
        marginHorizontal:8,
        borderRadius:5,
        marginBottom:10,
        paddingTop:10
    },  
    btnAgenLabel :{
        flex:1,
        fontSize:15,
        color:'grey',
        textAlign:'center'
    },
    btnPemilikDo :{
        flex:1,
        backgroundColor:'white',
        justifyContent:"center",
        alignItems:'center',
        height:90,
        borderRadius:5,
        marginBottom:10,
        paddingTop:10
    },  
    btnPemilikDoLabel :{
        flex:1,
        fontSize:15,
        color:'grey',
        textAlign:'center'
    },
    btnAdmin :{
        flex:1,
        backgroundColor:'white',
        justifyContent:"center",
        alignItems:'center',
        height:90,
        borderRadius:5,
        marginBottom:10,
        paddingTop:10
    },  
    btnAdminLabel :{
        flex:1,
        fontSize:15,
        color:'grey',
        textAlign:'center'
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