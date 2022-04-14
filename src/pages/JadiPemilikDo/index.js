/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import CONSTANTS from '../../assets/constants';
import SearchBar from '../../components/SearchBar/search_bar_jadi_pemilik_do';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SearchAkunModal from '../../components/SearchAkunModal';
import AwesomeAlert from 'react-native-awesome-alerts';
import MenuPemilikDoAtom from '../../components/MenuPemilikDoAtom';
import iconAddWhite from '../../assets/icon/add-white.png';
import iconNextOrange from '../../assets/icon/next-orange.png';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const DANGER = CONSTANTS.COLOR.DANGER;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const JadiPemilikDo = ({route, navigation}) => {
    let { username } = route.params;
    const [arrListDo, setArrListDo] = useState([]);
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

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            loadListDoSaya();
        });
        return unsubscribe;
    },[navigation])

    useEffect(()=>{
        console.log("List DO : ");
        console.log(arrListDo)
    },[arrListDo])

    const loadListDoSaya = () => {
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
        fetch(base_url+'PemilikDo/get_api_list_do',
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
            setArrListDo(json.list_do);
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

    const loadAddDoSaya = () => {
        navigation.navigate("InputDoPPKS",{username});
    }

    const renderItemListDo = ({item, index}) => {
        return(
            <TouchableOpacity style={styles.renderItemArea} >
                <Text style={styles.namaDoLabel}>{item.nama_do}</Text>
                <Image style={styles.btnItemIcon}  source={iconNextOrange} />
            </TouchableOpacity>
        )
    }

    return(
        <View style={{flex:1}}>
            <SearchBar title={"Menu Pemilik Do"} refresh={()=> loadListDoSaya()} navigation={navigation} />
            <View style={styles.container}>
                <View style={styles.segmenWrapper}>
                    <Text style={styles.segmenTitle}>List Do Saya</Text>
                    {loadingVisible && (
                        <View >
                            <ActivityIndicator size={50} color={ORANGE} />
                        </View>
                    )}
                    <FlatList
                        data={arrListDo}
                        keyExtractor={(item, index) => (item.id) + index}
                        renderItem={renderItemListDo}
                    />
                    
                </View>    
            </View>
            <View style={{flex:1,justifyContent: 'flex-end',paddingHorizontal:12}}>
                <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {loadAddDoSaya()} }>
                    <View style={{flexDirection:"row",justifyContent:'center'}}>
                        <Text style={styles.btnLanjutkanLabel}>Tambah Do</Text>
                        <Image source={iconAddWhite} style={styles.btnLanjutkanIcon}  />
                    </View>
                </TouchableOpacity>
            </View>  
        </View>
    );
}
export default JadiPemilikDo;

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:10,
        backgroundColor:'transparent',
        marginBottom:50
    },
    renderItemArea:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#fcfcfc',
        padding:10,
        borderBottomWidth:0.5
    },
    btnItemIcon:{
        width:22,
        height:22,
    },
    namaDoLabel :{
        color:'black',
        fontSize:16
    },
    segmenWrapper : {
        backgroundColor:'white',
        padding:10,
        marginTop:20,
        marginBottom:10
    },
    segmenTitle :{
        fontSize:16,
        fontWeight:'500',
        marginBottom:10,
    },
    FloatingActionButtonStyle: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 70,
        backgroundColor:'transparent',
        borderColor:'#000000',
        borderRadius: 200/2
    },
    FloatingActionButtonImageStyle: { 
        width: 60,
        height: 60,
    },
    btnLanjutkan: {
        backgroundColor:NAVY,
        alignItems:"center",
        height:40,
        width:Dimensions.get('window').width,
        borderRadius:10,
        justifyContent:"center",
        bottom: 15,
        position: 'absolute',
        
    },
    btnLanjutkanIcon : {
        width:23,
        height:23,
        marginHorizontal:6,
        marginTop:1
    },
    btnLanjutkanLabel : {
        fontSize:15,
        color:'white'
    },
})