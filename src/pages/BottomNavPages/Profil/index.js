/* eslint-disable prettier/prettier */
import React,{useEffect, useState} from 'react';
import {View, ScrollView, Text, TextInput, StyleSheet, Image, ActivityIndicator, useWindowDimensions, TouchableOpacity} from 'react-native';
import {AuthContext} from '../../../components/Context';
import CONSTANTS from '../../../assets/constants';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import iconNextOrange from '../../../assets/icon/next-orange.png';
import iconLogOut from '../../../assets/icon/logout.png';
import iconBankCardWhite from '../../../assets/icon/bank-card-white.png';
import { TabView, TabBar } from 'react-native-tab-view';

const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const Profil =  ({route, navigation}) => {
    const [showAlert, setAlert] = useState(false);
    const closeAlert = () => {
        console.log("alert close");
        setAlert(false);
    }
    const { signOut } = React.useContext(AuthContext);
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [id_user, setIdUser] = useState("");
    const [username, setUsername] = useState("");
    const [nama_lengkap, setNamaLengkap] = useState("");
    const [no_telepon, setNoTelepon] = useState("");
    const [email, setEmail] = useState("");
    const [provinsi, setProvinsi] = useState("");
    const [kota_kabupaten, setKotaKabupaten] = useState("");
    const [kecamatan, setKecamatan] = useState("");
    const [kelurahan_desa, setKelurahanDesa] = useState("");
    const [rt, setRT] = useState("");
    const [rw, setRW] = useState("");
    const [nama_jalan, setNamaJalan] = useState("");
    const [no_rumah, setNoRumah] = useState("");
    const [foto_profil, setFotoProfil] = useState("");

    useEffect(()=>{
        setLoadingVisible(true);
        getUser();
    },[]);

    const getUser = async () => {
        try {
          const value = await AsyncStorage.getItem('username');
          if (value === null) {
            // We have data!!
            navigation.navigate("Login");
            setLoadingVisible(false);
            setUsername("");
          }
          else{
            const timeout = setTimeout(() => {
                loadDataUser(value);
                clearTimeout(timeout);
            },0)  
          }
        } catch (error) {
          // Error retrieving data
          console.log(error)
          setLoadingVisible(false);
        }
    };

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'first', title: 'Etalase Saya' },
      { key: 'second', title: 'Kerjasama Agen' },
      { key: 'third', title: 'Pengaturan Akun' }
    ]);

    const layout = useWindowDimensions();
    const renderTabBar = props => (
        <TabBar
          {...props}
          keyboardDismissMode={"none"}
          indicatorStyle={{ backgroundColor: ORANGE }}
          style={{ backgroundColor: 'white' }}
          renderLabel={({ route, focused, color }) => (
            <Text style={{ color:ORANGE, margin: 5, fontSize:12 }}>
              {route.title}
            </Text>
          )}
        />
    );

    const _renderTabs = ({route}) => {
        switch (route.key) {
          case 'first':
            return (
              <View></View>
            )
      
          case 'second':
            return (
              <View>
                  <Text>AA</Text>
              </View>
            )
      
          case 'third':
            return (
                <View style={styles.settingAkunArea} >
                    <ScrollView keyboardShouldPersistTaps={"handled"} >
                        <View style={styles.segmenWrapper}>
                            <Text style={styles.segmenTitle}>Akun</Text>
                                
                                <TouchableOpacity style={styles.btnPengaturanAkun} onPress={()=> {
                                    navigation.navigate("EditProfil")
                                }}>
                                    <Text style={styles.btnPengaturanAkunLabel}>Edit Profil</Text>
                                    <Image style={styles.btnPengaturanAkunIcon}  source={iconNextOrange} />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btnPengaturanAkun} onPress={()=> {
                                signOut();
                                getUser();
                                }}>
                                    <Text style={styles.btnPengaturanAkunLabel}>Logout</Text>
                                    <Image style={styles.btnPengaturanAkunIcon}  source={iconNextOrange} />
                                </TouchableOpacity>
                        </View>    
                    </ScrollView>
                </View>        
            )
        }
    }

    const loadDataUser = (username) => {
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
        fetch(base_url+'User/get_api_user_data',
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
                setIdUser(json.id);
                setUsername(json.username);
                setNamaLengkap(json.nama_lengkap);
                setNoTelepon(json.no_telepon);
                setEmail(json.email);
                if(json.provinsi != "") setProvinsi(" , "+json.prov_name);
                if(json.kota_kabupaten != "") setKotaKabupaten(", "+json.city_name);
                if(json.kecamatan != "") setKecamatan(" Kec. "+json.dis_name);
                if(json.kelurahan_desa != "") setKelurahanDesa(" Kel./Desa "+json.subdis_name+", ");
                if(json.rw != "") setRW(" RW "+json.rw);
                if(json.rt != "") setRT(" RT "+json.rt);
                if(json.nama_jalan != "") setNamaJalan(json.nama_jalan+" ");
                if(json.no_rumah != "") setNoRumah(" No. "+json.no_rumah);
                setFotoProfil(json.foto_profil)
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

    const loadRekeningBank = () => {
        const params = {
            username
        };
        navigation.navigate("RekeningBank", params);
    }

    return (
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
            {username == "" &&(
                <TouchableOpacity style={styles.titleWrapper} onPress={()=>{navigation.navigate("Login")}}>
                    <Text style={styles.titleLabel}>Klik Disini Untuk Login</Text>
                </TouchableOpacity>
            )}    

        {username != "" &&
            (
                <View>
                    <View style={styles.profilArea}>
                        <Image style={styles.fotoProfil} source={{uri : base_url+"assets/upload/file user/"+foto_profil}} />
                        <View style={styles.profilWrapper}> 
                            <Text style={styles.namaLengkapLabel}>{nama_lengkap}</Text>
                            {/* <Text style={styles.noHpLabel}>{no_telepon.substring(0,6)+no_telepon.substring(6,4).replace(no_telepon.substring(6,4),"****")+no_telepon.substring(10)}</Text> */}

                            <Text style={styles.noHpLabel}>{username}</Text>
                            {/* <Text style={styles.alamatLabel}>{nama_jalan+no_rumah+rw+rt+kelurahan_desa+kecamatan+kota_kabupaten+provinsi}</Text> */}
                        </View>
                    </View>

                    <View style={styles.followersArea}>
                        <View style={{flex:1,flexDirection:'row', justifyContent:"space-between",marginTop:10}} >
                            <View style={{flex:1, alignItems:'center'}} >
                                <Text style={styles.countLabel} >1</Text>
                                <Text style={styles.ketLabel} >Atasan</Text>
                            </View>
                            <View style={{flex:1, alignItems:'center'}} >
                                <Text style={styles.countLabel} >10</Text>
                                <Text style={styles.ketLabel} >Karyawan</Text>
                            </View>
                        </View>

                        <View style={{flex:1,flexDirection:'row', justifyContent:"space-between",marginTop:10}} >
                            <View style={{flex:1, alignItems:'center'}} >
                                <Text style={styles.countLabel} >670</Text>
                                <Text style={styles.ketLabel}>Mengikuti</Text>
                            </View>

                            <View style={{flex:1, alignItems:'center'}} >
                                <Text style={styles.countLabel} >1170</Text>
                                <Text style={styles.ketLabel} >Pengikut</Text>
                            </View>
                        </View>
                    </View>    
                    
                    <View style={{flexDirection:'row', justifyContent:'space-around'}} >
                        <TouchableOpacity style={styles.btnRekeningSaya} onPress={()=> {loadRekeningBank()} }>
                            <Image style={styles.btnRekeningSayaIcon}  source={iconBankCardWhite} />
                            <Text style={styles.btnRekeningSayaLabel}>Daftar Rekening Saya</Text>
                        </TouchableOpacity>

                        
                    </View>
            </View>
            )
        } 

        {username != "" && (
            <TabView
                    //swipeEnabled={true}
                    navigationState={{ index, routes }}
                    renderScene={_renderTabs}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    //renderTabBar={renderTabBar}
                    renderTabBar={renderTabBar}
            />
        )}
                
        </View> 
    );
    
};

export default Profil;


const styles = StyleSheet.create({
    titleWrapper:{
        backgroundColor:ORANGE,
        alignItems:'center',
        paddingTop:5
    },
    titleLabel:{
        fontSize : 20,
        color:'white',
        fontWeight:'300'
    },
    countLabel : {
        fontSize : 16,
        color:'white',
        fontWeight:'600'
    },
    ketLabel : {
        fontSize : 15,
        color:'white',
        fontWeight:'300'
    },
    btnRekeningSaya: {
        flex:1,
        flexDirection:'row',
        backgroundColor:ORANGE,
        height:40,
        justifyContent:"space-around",
        paddingTop:7,
        paddingHorizontal:10
    },
    btnRekeningSayaLabel : {
        flex:1,
        fontSize:15,
        color:'white',
        marginLeft:10,
        alignItems:"flex-start",
    },
    btnRekeningSayaIcon:{
        width:22,
        height:22,
        alignItems:"flex-start",
    },
    settingAkunArea :{
        flex:1,
        paddingTop:10,
        paddingHorizontal:5
    },
    segmenWrapper : {
        backgroundColor:'white',
        padding:10,
        marginTop:5,
        marginBottom:10
    },
    segmenTitle :{
        fontSize:16,
        fontWeight:'500',
        marginBottom:10,
    },
    profilArea: {
        flexDirection:'row',
        backgroundColor:ORANGE,
        justifyContent:'space-around',
        paddingVertical:15,
        paddingHorizontal:20,
    },
    followersArea: {
        flexDirection:'row',
        backgroundColor:ORANGE,
        justifyContent:'space-around',
        paddingBottom:20,
    },
    rekeningBankArea: {
        backgroundColor:'white',
        paddingVertical:15,
        paddingHorizontal:20,
        marginVertical:20,
        marginHorizontal:10,
        borderRadius:10
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
    detailRekeningBank : {
        flex:0.7
    },
    fotoProfil :{
        width:70,
        height:70,
        borderRadius:140/2,
    },
    profilWrapper :{
        flex:1,
        justifyContent:'flex-start',
        alignItems:'flex-start',
        paddingHorizontal:20
    },
    namaLengkapLabel :{
        fontSize : 18,
        color:'white',
        fontWeight:'700'
    },
    noHpLabel :{
        fontSize : 15,
        color:'white'
    },
    alamatLabel :{
        fontSize : 13,
        color:'white'
    },
   
    btnPengaturanAkun : {
        flexDirection:'row',
        backgroundColor:'white',
        alignItems:"center",
        marginTop:10,
        marginBottom:20,
        height:40,
        justifyContent:"space-between",
        borderBottomWidth:0.3,
    },
    btnPengaturanAkunIcon:{
        width:22,
        height:22,
    },
    btnPengaturanAkunLabel : {
        fontSize:13,
        color:'black',
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