/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import CONSTANTS from '../../../assets/constants';
import SearchBar from '../../../components/SearchBar/search_bar_beranda';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SearchAkunModal from '../../../components/SearchAkunModal';
import AwesomeAlert from 'react-native-awesome-alerts';
import MenuHomeAtom from '../../../components/MenuHomeAtom';

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
    const [loadingVisible, setLoadingVisible] = useState(false);
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
        const unsubscribe = props.navigation.addListener('focus', () => {
            getUser();
        });
        return unsubscribe;
    })

   

    const getUser = async () => {
        try {
          const value = await AsyncStorage.getItem('username');
          if (value === null) {
            // We have data!!
          }
          else{
            setUsername(value);
            loadDataUser(value)
          }
        } catch (error) {
          // Error retrieving data
          console.log(error)
        }
    };

    const loadDataUser = (username) => {
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
                setNamaLengkap("Hi, "+pecah_nama[0]+" "+pecah_nama[1]+ " Tentukan posisi Anda");
            }      
            console.log(json);
        })
        .catch((error) => {
            clearTimeout(timeout);
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
    const loadPemilikDo = () => ()=> {
        if(username == "")  props.navigation.navigate("Login");
        else props.navigation.navigate("JadiPemilikDo", {username} );
        setAlert(false);
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
                    onCancelPressed={alertCancelTask}
                    onConfirmPressed={alertConfirmTask}
            />
            <SearchAkunModal setModalVisible={setModalVisible} modalVisible={modalVisible} currentUser={username} navigation={props.navigation} />
            <SearchBar />
            <ScrollView style={styles.container}>
                <View style={styles.topArea}>
                    <TouchableOpacity onPress={()=>setModalVisible(true)}>
                        <View style={styles.inputWrapper}>
                            <Icon name="search" type="ionicon" size={20} color="gray" style={{position:"absolute", left:10,bottom:10}} />
                            <Text style={styles.textInput}>Cari Sesuatu Disini . . .</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                
                <MenuHomeAtom username={username} klaimDo={true} beliDo={true} rekapDoSaya={true} buatInvoice={true} bayarInvoice={true} kasihDeposit={true} daftarHutang={true} menuTop={-95}  navigation={props.navigation} />

                <View style={styles.segmenArea}>
                    <Text style={styles.segmenTitle}>
                        {nama_lengkap}
                    </Text>
                        <View style={styles.segmenWrapper}>
                                <TouchableOpacity style={styles.btnPemilikDo} onPress={()=> konfirmasiPemilikDo()} >
                                    <Text style={styles.btnPemilikDoLabel}>Pemilik DO</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btnAgen} onPress={()=> konfirmasiAgenDo()} >
                                    <Text style={styles.btnAgenLabel}>Agen DO</Text>
                                </TouchableOpacity>
                        </View>

                        <View style={styles.segmenWrapper}>
                                <TouchableOpacity style={styles.btnAdmin} onPress={()=> konfirmasiAdmin()} >
                                    <Text style={styles.btnAdminLabel}>Admin DO</Text>
                                </TouchableOpacity>
                        </View>
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
        justifyContent : "space-between",
    },
    btnAgen :{
        flex:1,
        flexDirection:'row',
        backgroundColor:'#f5f5f0',
        justifyContent:"space-between",
        alignItems:'center',
        height:45,
        marginRight:5,
        borderRadius:5,
        marginBottom:10
    },  
    btnAgenLabel :{
        flex:1,
        fontSize:15,
        color:ORANGE,
        textAlign:'center'
    },
    btnPemilikDo :{
        flex:1,
        flexDirection:'row',
        backgroundColor:'#f5f5f0',
        justifyContent:"space-between",
        alignItems:'center',
        height:45,
        marginRight:5,
        borderRadius:5,
        marginBottom:10
    },  
    btnPemilikDoLabel :{
        flex:1,
        fontSize:15,
        color:ORANGE,
        textAlign:'center'
    },
    btnAdmin :{
        flex:1,
        flexDirection:'row',
        backgroundColor:'#f5f5f0',
        justifyContent:"space-between",
        alignItems:'center',
        height:45,
        marginRight:5,
        borderRadius:5,
        marginBottom:10
    },  
    btnAdminLabel :{
        flex:1,
        fontSize:15,
        color:ORANGE,
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