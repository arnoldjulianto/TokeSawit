/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import CONSTANTS from '../../assets/constants';
import SearchBar from '../../components/SearchBar/search_bar_lihat_profil';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SearchAkunModal from '../../components/SearchAkunModal';
import AwesomeAlert from 'react-native-awesome-alerts';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const DANGER = CONSTANTS.COLOR.DANGER;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const LihatProfil = ({route, navigation}) => {
    let {username, currentUser, setModalVisible} = route.params;
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
    const [id_user, setIdUser] = useState("");
    const [username_edit, setUsernameEdit] = useState("");
    const [nama_lengkap, setNamaLengkap] = useState("");
    const [no_telepon, setNoTelepon] = useState("");
    const [email, setEmail] = useState("");
    const [foto_profil, setFotoProfil] = useState("");
    const [followingText, setFollowingText] = useState("");
    const [requesting, setRequesting] = useState(false);
    const [total_atasan, setTotalAtasan] = useState("");
    const [total_karyawan, setTotalKaryawan] = useState("");
    const [total_followers, setTotalFollowers] = useState("");
    const [total_following, setTotalFollowing] = useState("");

    useEffect(()=>{
        loadDataUser();
    },[username]);

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            console.log(setModalVisible)
            loadDataUser();
        });
        return unsubscribe;
    },[navigation]);

    useEffect(
        () =>
          navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            navigation.dispatch(e.data.action);
            setModalVisible(true);
          }),
        [navigation]
    );

    const loadDataUser = () => {
        setLoadingVisible(true);
        setCancelButtonAlert(true);
        setConfirmButtonAlert(false);
        setFollowingText("");
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
            
            if(json.response == 1){
                setIdUser(json.id);
                setUsernameEdit(json.username_edit);
                setNamaLengkap(json.nama_lengkap);
                setNoTelepon(json.no_telepon);
                setEmail(json.email);
                if(json.foto_profil == 'default.png') setFotoProfil(json.foto_profil)
                else setFotoProfil(json.username+'/'+json.foto_profil)
                cekFollowing();
            }   
            else{
                setLoadingVisible(false);
            }
            console.log(json);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(error);
        });
    }

    const cekFollowing = () => {
        setLoadingVisible(true);
        setCancelButtonAlert(true);
        setConfirmButtonAlert(false);

        const timeout = setTimeout(() => {
            setLoadingVisible(false);
        }, 30000);

        const params = {
            username,
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
        fetch(base_url+'Following/get_api_cek_following',
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
                setFollowingText(json.msg);
                getTotalKoneksi();
            }   
            else setLoadingVisible(false);
            console.log(json);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(error);
        });
    }

    const getTotalKoneksi = () => {
        setLoadingVisible(true);
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
        fetch(base_url+'Following/get_api_total_koneksi',
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
            if(json.response == 1){
                setTotalAtasan(json.atasan);
                setTotalKaryawan(json.karyawan);
                setTotalFollowers(json.followers);
                setTotalFollowing(json.following);
            }  
            setLoadingVisible(false)
            console.log(json);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(error);
        });
    }

    const followRequest = () => {
        if(followingText != "" && followingText == "Ikuti" ){
            setRequesting(true);
            const timeout = setTimeout(() => {
                setRequesting(false);
            }, 30000);
    
            const params = {
                username,
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
            fetch(base_url+'Following/get_api_request_follow',
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
               if(json.response == 1) {
                   setRequesting(false);
                   setFollowingText("Diminta");
               }
            })
            .catch((error) => {
                clearTimeout(timeout);
                setRequesting(false);
                console.log(error);
            });
        }
        else if(followingText == "Diminta" || followingText == "Diikuti" ){
            Unfollow();
        }
    }

    const Unfollow = () => {
        setRequesting(true);
            const timeout = setTimeout(() => {
                setRequesting(false);
            }, 30000);
    
            const params = {
                username,
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
            fetch(base_url+'Following/get_api_unfollow',
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
               if(json.response == 1) {
                   setRequesting(false);
                   setFollowingText("Ikuti");
                   getTotalKoneksi();
               }
            })
            .catch((error) => {
                clearTimeout(timeout);
                setRequesting(false);
                console.log(error);
            });
    }

    return(
        <View style={{flex:1}}>
            <SearchBar refresh={false} title={username_edit} navigation={navigation} setModalVisible={setModalVisible} />
            <View style={styles.container}>
                    <ScrollView style={{flex:1}}>
                        <View style={styles.profilArea}>
                                <Image style={styles.fotoProfil} source={{uri : base_url+"assets/upload/file user/"+foto_profil}} resizeMethod="resize" resizeMode="cover" />
                                <View style={styles.profilWrapper}> 
                                    <Text style={styles.namaLengkapLabel}>{nama_lengkap}</Text>
                                    {/* <Text style={styles.noHpLabel}>{no_telepon.substring(0,6)+no_telepon.substring(6,4).replace(no_telepon.substring(6,4),"****")+no_telepon.substring(10)}</Text> */}

                                    {/* <Text style={styles.usernameLabel}>{username}</Text> */}
                                    {/* <Text style={styles.alamatLabel}>{nama_jalan+no_rumah+rw+rt+kelurahan_desa+kecamatan+kota_kabupaten+provinsi}</Text> */}

                                    <TouchableOpacity style={styles.btnIkuti} onPress={() => followRequest()} >
                                        {!requesting && (
                                            <Text style={styles.btnIkutiLabel}>{followingText}</Text>
                                        )}

                                        {requesting && (
                                            <ActivityIndicator size={22} color={ORANGE} />    
                                        )}
                                    </TouchableOpacity>
                                </View>
                        </View>
                        {loadingVisible && (
                            <ActivityIndicator size={50} color={ORANGE} />    
                        )}

                        {!loadingVisible &&(
                            <View style={{flex:1}}>
                                <View style={styles.followersArea}>
                                <View style={{flex:1,flexDirection:'row', justifyContent:"space-between",marginTop:10}} >
                                    <View style={{flex:1, alignItems:'center'}} >
                                        <Text style={styles.countLabel} >{total_atasan}</Text>
                                        <Text style={styles.ketLabel} >Atasan</Text>
                                    </View>
                                    <View style={{flex:1, alignItems:'center'}} >
                                        <Text style={styles.countLabel} >{total_karyawan}</Text>
                                        <Text style={styles.ketLabel} >Karyawan</Text>
                                    </View>
                                </View>

                                <View style={{flex:1,flexDirection:'row', justifyContent:"space-between",marginTop:10}} >
                                    <View style={{flex:1, alignItems:'center'}} >
                                        <Text style={styles.countLabel} >{total_following}</Text>
                                        <Text style={styles.ketLabel}>Mengikuti</Text>
                                    </View>

                                    <View style={{flex:1, alignItems:'center'}} >
                                        <Text style={styles.countLabel} >{total_followers}</Text>
                                        <Text style={styles.ketLabel} >Pengikut</Text>
                                    </View>
                                </View>
                                </View> 

                                <View style={styles.privateAccount} >
                                    <Icon type={"ios"} name={"lock"} size={55} color={"grey"} />
                                    <Text style={styles.privateAccountLabel}>Akun Ini Privat, Ikuti Untuk Mengetahui Profil & Produk Yang Dimiliki Oleh {username_edit}</Text>
                                </View>
                            </View>
                        )}
                    
                    </ScrollView>  
            </View>  
        </View>
    )
}

export default LihatProfil;

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    profilArea: {
        flex:1,
        flexDirection:'row',
        backgroundColor:ORANGE,
        justifyContent:'space-around',
        paddingVertical:15,
        paddingHorizontal:20,
    },
    followersArea: {
        flex:1,
        flexDirection:'row',
        backgroundColor:ORANGE,
        justifyContent:'space-around',
        paddingBottom:20,
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
        fontWeight:'700',
        textAlign:'center',
        justifyContent:'center',
        alignSelf:'center',
    },
    usernameLabel :{
        fontSize : 15,
        color:'white'
    },
    btnIkuti :{
        flexDirection:'row',
        marginTop:10,
        backgroundColor:'white',
        height:40,
        width:250,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5
    },
    btnIkutiLabel:{
        fontSize:16
    },
    privateAccount :{
        height:Dimensions.get("window").height / 1.45,
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:40,
        paddingBottom:0
    },
    privateAccountLabel :{
        marginTop:10,
        textAlign:'center',
        fontSize:13,
        color:'darkgrey',
    }
    
})