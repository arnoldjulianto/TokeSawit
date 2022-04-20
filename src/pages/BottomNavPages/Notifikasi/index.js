/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import CONSTANTS from '../../../assets/constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SearchBar from '../../../components/SearchBar/search_bar_notifikasi';
import AsyncStorage from '@react-native-community/async-storage';
import ProsesModal from '../../../components/ProsesModal';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const PRIMARY = CONSTANTS.COLOR.PRIMARY;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const Notifikasi = ({route, navigation}) => {
    const [username, setUsername] = useState("");
    const [username_edit, setUsernameEdit] = useState("");
    const [arrPermintaanMengikuti, setArrPermintaanMengikuti] = useState([]);
    const [arrWaktuNotifikasi, setArrWaktuNotifikasi] = useState([]);
    const [arrNotifikasiHariIni, setArrNotifikasiHariIni] = useState([]);
    const [arrNotifikasiKemarin, setArrNotifikasiKemarin] = useState([]);
    const [arrNotifikasiMingguIni, setArrNotifikasiMingguIni] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [hari_ini_belum_dibaca, setHariIniBelumDibaca] = useState(0);
    const [kemarin_belum_dibaca, setKemarinBelumDibaca] = useState(0);
    const [minggu_ini_belum_dibaca, setMingguIniBelumDibaca] = useState(0);

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            getUser();
            setModalVisible(false);
        });
        return unsubscribe;
    },[navigation]);

    const getUser = async () => {
        try {
          const value = await AsyncStorage.getItem('username');
          if (value === null) {
            // We have data!!
          }
          else{
            setUsername(value);
            loadNotifikasi(value)
          }
        } catch (error) {
          // Error retrieving data
          console.log(error)
        }
    };
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getUser();
    }, []);

    const loadNotifikasi = (value) => {
        const timeout = setTimeout(() => {
            setRefreshing(false);
        }, 30000);
        let params;
        if(typeof value !== "undefined" ){
            params = {
                username:value
            }
        }
        else{
            params = {
                username
            }
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
        fetch(base_url+'Notifikasi/get_api_notifikasi',
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
            setRefreshing(false);
            setArrNotifikasiHariIni(json.notifikasi_hari_ini);
            setArrNotifikasiKemarin(json.notifikasi_kemarin);
            setArrNotifikasiMingguIni(json.notifikasi_minggu_ini);
            setArrPermintaanMengikuti(json.permintaan_mengikuti);
            let waktu = [];
            if(json.notifikasi_hari_ini.length > 0) waktu.push({waktu:"Hari Ini"}) 
            if(json.notifikasi_kemarin.length > 0) waktu.push({waktu:"Kemarin"}) 
            if(json.notifikasi_minggu_ini.length > 0) waktu.push({waktu:"Minggu Ini"}) 
            setArrWaktuNotifikasi(waktu);
            setHariIniBelumDibaca(json.hari_ini_belum_dibaca);
            setKemarinBelumDibaca(json.kemarin_belum_dibaca);
            setMingguIniBelumDibaca(json.minggu_ini_belum_dibaca);
            console.log(json);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setRefreshing(false);
            console.log(error);
        });
    }

    const tandaiSudahDibaca = (waktu) => {
        setModalVisible(true);
        const timeout = setTimeout(() => {
            setModalVisible(false);
        }, 30000);
        const params = {
            username,
            waktu,
        }
        console.log(params)
        const createFormData = (body) => {
            const data = new FormData();
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            return data;
        }
        const formData = createFormData(params);
        fetch(base_url+'Notifikasi/get_api_tandai_sudah_dibaca',
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
            if(json.response == 1) loadNotifikasi();
            console.log(json);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setModalVisible(false);
            console.log(error);
        });
    }

    const followReqResponse = (response, from, id_notif) => {
        setModalVisible(true);
        const timeout = setTimeout(() => {
            setModalVisible(false);
        }, 30000);
        const params = {
            username,
            response,
            from,
            id_notif,
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
        fetch(base_url+'Following/get_api_response_follow_request',
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
                loadNotifikasi();
                console.log(json);
            }
            setModalVisible(false);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setModalVisible(false);
            console.log(error);
        });
    }

    const renderItemPermintaanMengikuti = ({item, index}) => {
        let foto_profil = "";
        if(item.foto_profil == "default.png" ) foto_profil = item.foto_profil;
        else foto_profil = item.from+"/"+item.foto_profil

        return(
            <View style={[styles.notifWrapper,{backgroundColor:'#f0f5f5'}]}>
                <Image style={styles.fotoProfil} source={{uri : base_url+"assets/upload/file user/"+foto_profil}} resizeMethod="resize" resizeMode="cover" />
                <Text style={styles.notifMsg} ><Text style={styles.usernameLabel}>{item.from}</Text> {item.message}</Text>

                <TouchableOpacity style={styles.btnNotif1} onPress={()=>{
                    followReqResponse("acc", item.from, item.id);
                }} >
                    <Text style={styles.btnNotif1Label} >Terima</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnNotif2} onPress={()=>{
                    followReqResponse("reject", item.from, item.id);
                }}  >
                    <Text style={styles.btnNotif2Label} >Abaikan</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderItemWaktuNotifikasi = ({item, index}) => {
        return(
            <View style={styles.segmenWrapper}> 
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={styles.segmenTitle}>{item.waktu}</Text>
                    <TouchableOpacity onPress={()=> tandaiSudahDibaca(item.waktu) }>
                            {item.waktu == "Hari Ini" && hari_ini_belum_dibaca > 0  && (
                                 <Text style={styles.segmenTitle2}>Tandai Sudah Dibaca ({hari_ini_belum_dibaca})</Text>
                            )}
                           
                            {item.waktu == "Kemarin" && kemarin_belum_dibaca > 0 && (
                                 <Text style={styles.segmenTitle2}>Tandai Sudah Dibaca ({kemarin_belum_dibaca} )</Text>
                            )}

                            {item.waktu == "Minggu Ini" && minggu_ini_belum_dibaca > 0 && (
                                 <Text style={styles.segmenTitle2}>Tandai Sudah Dibaca ({minggu_ini_belum_dibaca} )</Text>
                            )}
                    </TouchableOpacity>
                </View>

                {item.waktu == "Hari Ini" && (
                    <FlatList
                        data={arrNotifikasiHariIni}
                        keyExtractor={(item, index) => index}
                        renderItem={renderItemNotifikasiHariIni}
                    />
                )}

                {item.waktu == "Kemarin" && (
                    <FlatList
                        data={arrNotifikasiKemarin}
                        keyExtractor={(item, index) => index}
                        renderItem={renderItemNotifikasiKemarin}
                    />
                )}

                {item.waktu == "Minggu Ini" && (
                    <FlatList
                        data={arrNotifikasiMingguIni}
                        keyExtractor={(item, index) => index}
                        renderItem={renderItemNotifikasiMingguIni}
                    />
                )}
                
            </View>    
        )
    }

    const renderItemNotifikasiHariIni = ({item, index}) => {
        let foto_profil = "";
        if(item.foto_profil == "default.png" ) foto_profil = item.foto_profil;
        else foto_profil = item.from+"/"+item.foto_profil
        
        let bgColor = 'transparent';
        if(item.status_dibaca == 'Belum Dibaca') bgColor = '#f0f5f5'
        return(
            <View style={[styles.notifWrapper,{backgroundColor:bgColor}]}>
                <TouchableOpacity onPress={() => navigation.navigate("LihatProfil", {currentUser:username, username:item.from, setModalVisible}) } >
                    <Image style={styles.fotoProfil} source={{uri : base_url+"assets/upload/file user/"+foto_profil}} resizeMethod="resize" resizeMode="cover" />
                </TouchableOpacity>
                
                <Text style={styles.notifMsg} >
                    <TouchableOpacity onPress={() => navigation.navigate("LihatProfil", {currentUser:username, username:item.from, setModalVisible}) } >
                        <Text style={styles.usernameLabel}>{item.username_edit}</Text> 
                    </TouchableOpacity> 
                    {item.message}
                </Text>
            </View>
        )
    }

    const renderItemNotifikasiKemarin = ({item,index}) => {
        let foto_profil = "";
        if(item.foto_profil == "default.png" ) foto_profil = item.foto_profil;
        else foto_profil = item.from+"/"+item.foto_profil

        let bgColor = 'transparent';
        if(item.status_dibaca == 'Belum Dibaca') bgColor = '#f0f5f5'
        return(
            <View style={[styles.notifWrapper,{backgroundColor:bgColor}]}>
                <TouchableOpacity onPress={() => navigation.navigate("LihatProfil", {currentUser:username, username:item.from, setModalVisible}) } >
                    <Image style={styles.fotoProfil} source={{uri : base_url+"assets/upload/file user/"+foto_profil}} resizeMethod="resize" resizeMode="cover" />
                </TouchableOpacity>
                <Text style={styles.notifMsg} >
                    <TouchableOpacity onPress={() => navigation.navigate("LihatProfil", {currentUser:username, username:item.from, setModalVisible}) } >
                        <Text style={styles.usernameLabel}>{item.username_edit}</Text>
                    </TouchableOpacity>
                {item.message}</Text>
            </View>
        )
    }

    const renderItemNotifikasiMingguIni = ({item, index}) => {
        let foto_profil = "";
        if(item.foto_profil == "default.png" ) foto_profil = item.foto_profil;
        else foto_profil = item.from+"/"+item.foto_profil

        let bgColor = 'transparent';
        if(item.status_dibaca == 'Belum Dibaca') bgColor = '#f0f5f5'
        return(
            <View style={[styles.notifWrapper,{backgroundColor:bgColor}]}>
                <TouchableOpacity onPress={() => navigation.navigate("LihatProfil",     {currentUser:username, username:item.from, setModalVisible}) } >
                    <Image style={styles.fotoProfil} source={{uri : base_url+"assets/upload/file user/"+foto_profil}} resizeMethod="resize" resizeMode="cover" />
                </TouchableOpacity>    
                <Text style={styles.notifMsg} >
                    <TouchableOpacity onPress={() => navigation.navigate("LihatProfil",     {currentUser:username, username:item.from, setModalVisible}) } >
                        <Text style={styles.usernameLabel}>{item.from}</Text>
                    </TouchableOpacity> 
                    {item.message}</Text>
            </View>
        )
    }
    

    return(
        <View style={{flex:1}}>
            <ProsesModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
            <SearchBar title={"Notifikasi"} refresh={false} onBack={""} notif_belum_dibaca={""} />
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        />
                    }
                >
                    {arrPermintaanMengikuti.length > 0 && (
                        <View style={styles.segmenWrapper}> 
                            <Text style={styles.segmenTitle}>Permintaan Mengikuti</Text>
                            <FlatList
                                data={arrPermintaanMengikuti}
                                keyExtractor={(item, index) => index}
                                renderItem={renderItemPermintaanMengikuti}
                            />
                        </View>
                    )}    
                    
                    <FlatList
                        data={arrWaktuNotifikasi}
                        keyExtractor={(item, index) => index}
                        renderItem={renderItemWaktuNotifikasi}
                    />
                    
                </ScrollView>    
            </View>
        </View>
    );
}

export default Notifikasi;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal:5,
        paddingVertical:10,
    },
    segmenWrapper :{
        backgroundColor:'white',
        borderRadius:10,
        padding:15,
        marginBottom:15
    },
    segmenTitle :{
        fontSize:15,
        fontWeight:'600'
    },
    segmenTitle2 :{
        fontSize:13,
        color:ORANGE,
        fontWeight:'400'
    },
    notifWrapper :{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:5,
        paddingVertical:10,
        marginTop:15,
        alignItems:'center',
        borderRadius:5
    },
    fotoProfil :{
        width:50,
        height:50,
        borderRadius:50,
        marginRight:10
    },
    usernameLabel :{
        fontWeight:'500'
    },
    notifMsg:{
        flex:1.3,
        fontSize:13,
        fontWeight:'300',
        color:'black',
        marginTop:10
    },
    btnNotif1 :{
        flex:0.3,
        backgroundColor:NAVY,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        height:40,
        marginHorizontal:10,
        paddingHorizontal:5
    },
    btnNotif1Label :{
        color:'white',
        fontSize:11
    },
    btnNotif2 :{
        flex:0.4,
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        height:40,
    },
    btnNotif2Label :{
        color:'black',
        fontSize:11
    },
})

