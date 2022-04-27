/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import CONSTANTS from '../../assets/constants';
import SearchBar from '../../components/SearchBar/search_bar_jadi_pemilik_do';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EditPemilikDoModal from '../../components/EditPemilikDoModal';
import AwesomeAlert from 'react-native-awesome-alerts';
import MenuPemilikDoAtom from '../../components/MenuPemilikDoAtom';
import iconAddWhite from '../../assets/icon/add-white.png';
import iconNextOrange from '../../assets/icon/next-orange.png';
import iconEditBlue from '../../assets/icon/edit-blue.png';

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
    const [modalVisible, setModalVisible] = useState(false);
    const [header1focus, setHeader1Focus] = useState(true);
    const [header2focus, setHeader2Focus] = useState(false);
    const [header3focus, setHeader3Focus] = useState(false);
    const [iconSort, setIconSort] = useState("sort-alpha-down");
    const [id_do_ppks, setIdDoPPKS] = useState("");
    const [id_ppks, setIdPPKS] = useState("");
    const [nama_do, setNamaDo] = useState("");
    const [tanggal_perubahan_harga, setTanggalPerubahanHarga] = useState("");
    const [hargaDoPPKS, setHargaDoPPKS] = useState("");
    const [keterangan_biaya_bongkar, setKetBiayaBongkar] = useState("");
    const [keterangan_harga, setKetHargaDoPPKS] = useState("");
    const [privasi_harga, setPrivasiHarga] = useState("");

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            loadListDoSaya();
        });
        return unsubscribe;
    },[navigation])

    useEffect(() => {
        if(arrListDo.length > 0){
            if(header1focus) sortPPKS(false);
            else if(header2focus) sortNamaDo(false);
            else if(header3focus) sortHarga(false);
        }
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
            if(json.response == 1){
                const data = [];
                json.list_do.forEach((value)=>{
                    data.push({
                        id_do_ppks : value.id_do_ppks,    
                        id_ppks : value.id_ppks,    
                        nama_ppks : value.nama_ppks,    
                        nama_do : value.nama_do,    
                        keterangan_biaya_bongkar : value.keterangan_biaya_bongkar,    
                        keterangan_harga : value.keterangan_harga,    
                        harga : value.harga,    
                        tanggal_perubahan_harga : value.tanggal_perubahan_harga,    
                        privasi_harga : value.privasi_harga,    
                    });
                })
                setArrListDo(data);
            }
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

    const loadDoPPKS = () => {
        navigation.navigate("InputDoPPKS",{username});
    }

    const formatRupiah = (angka, prefix) => {
        if(angka != "") {
            var number_string = angka.replace(/[^,\d]/g, '').toString(),
            split   		= number_string.split(','),
            sisa     		= split[0].length % 3,
            rupiah     		= split[0].substr(0, sisa),
            ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);
         
            // tambahkan titik jika yang di input sudah menjadi angka ribuan
            if(ribuan){
                let separator = sisa ? '.' : '';
                rupiah += separator + ribuan.join('.');
            }
            rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
            if(angka < 0) {
                rupiah = "-"+rupiah;
            }
            return prefix == undefined ? rupiah : (rupiah ? '' + rupiah : '');
        }
        else{
            return prefix == undefined ? rupiah : (rupiah ? '' + rupiah : '');
        }
    }

    const renderItemListDo = ({item, index}) => {    
        let bulan = item.tanggal_perubahan_harga.substr(5,2);
        if(bulan == "01") bulan = "Januari";
        else if(bulan == "02") bulan = "Februari";
        else if(bulan == "03") bulan = "Maret";
        else if(bulan == "04") bulan = "April";
        else if(bulan == "05") bulan = "Mei";
        else if(bulan == "06") bulan = "Juni";
        else if(bulan == "07") bulan = "Juli";
        else if(bulan == "08") bulan = "Agustus";
        else if(bulan == "09") bulan = "September";
        else if(bulan == "10") bulan = "Oktober";
        else if(bulan == "11") bulan = "November";
        else if(bulan == "12") bulan = "Desember";

        return(
            <TouchableOpacity style={styles.renderItemArea} onPress={() => {
                    setIdDoPPKS(item.id_do_ppks)
                    setIdPPKS(item.id_ppks)
                    setNamaDo(item.nama_do)
                    setKetBiayaBongkar(item.keterangan_biaya_bongkar)
                    setKetHargaDoPPKS(item.keterangan_harga)
                    setHargaDoPPKS(formatRupiah(item.harga))
                    setTanggalPerubahanHarga(item.tanggal_perubahan_harga)
                    setPrivasiHarga(item.privasi_harga)
                    setModalVisible(true)
                }} >
                <Text style={styles.namaPPKSLabel}>{item.nama_ppks.toUpperCase()}</Text>
                <Text style={styles.namaDoLabel}>{item.nama_do}</Text>
                <Text style={styles.hargaLabel}>Rp {formatRupiah(item.harga)}
                    {"\n"}
                    <Text style={{marginTop:5, color:ORANGE}}>{item.tanggal_perubahan_harga.substr(8,2)+" "+bulan+" "+item.tanggal_perubahan_harga.substr(2,2)}</Text>
                </Text>
            </TouchableOpacity>
        )
    }

    const sortHeader = (value) =>{
        setIconSort("sort-alpha-down");
        if (value == 1) {
            let data = arrListDo;
            data.sort((a, b) => {
                let fa = a.nama_ppks.toLowerCase(),
                fb = b.nama_ppks.toLowerCase();
                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            })
            setArrListDo(data);
            setHeader1Focus(true);
            setHeader2Focus(false);
            setHeader3Focus(false);
            cekSorting(value);
        }
        else if (value == 2) {
            let data = arrListDo;
            data.sort((a, b) => {
                let fa = a.nama_do.toLowerCase(),
                fb = b.nama_do.toLowerCase();
                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            })
            setArrListDo(data);
            setHeader1Focus(false);
            setHeader2Focus(true);
            setHeader3Focus(false);
            cekSorting(value);
        }
        else if (value == 3) {
            let data = arrListDo;
            data.sort((a, b) => {
                return parseInt(a.harga) - parseInt(b.harga);
            })
            setArrListDo(data);
            setHeader1Focus(false);
            setHeader2Focus(false);
            setHeader3Focus(true);
            cekSorting(value);
        }
    }

    const cekSorting = (value) =>{
        if(value == 1 ){
            if(header1focus){
               sortPPKS(true);
            }
        }
        else if(value == 2 ){
            if(header2focus){
                sortNamaDo(true);
            }
        }
        else if(value == 3 ){
            if(header3focus){
                sortHarga(true);
            }
        }   
    }

    const sortPPKS = (changeIcon) => {
        let data = arrListDo;
        if(iconSort == 'sort-alpha-down') {
            if(changeIcon) setIconSort("sort-alpha-down-alt");
            data.sort((a, b) => {
                let fa = a.nama_ppks.toLowerCase(),
                fb = b.nama_ppks.toLowerCase();
                if (fa < fb) {
                    if(changeIcon) return 1;
                    else return -1;
                }
                if (fa > fb) {
                    if(changeIcon) return -1;
                    else return 1;
                }
                return 0;
            })
        }
        else {
            if(changeIcon) setIconSort("sort-alpha-down");
            data.sort((a, b) => {
                let fa = a.nama_ppks.toLowerCase(),
                fb = b.nama_ppks.toLowerCase();
                if (fa < fb) {
                    if(changeIcon)  return 1;
                    else return -1;
                }
                if (fa > fb) {
                    if(changeIcon)  return 1;
                    else return -1;
                }
                return 0;
            })
        }
        setArrListDo(data);
    }

    const sortNamaDo = (changeIcon) => {
        let data = arrListDo;
        if(iconSort == 'sort-alpha-down') {
            if(changeIcon) setIconSort("sort-alpha-down-alt");
            
            data.sort((a, b) => {
                let fa = a.nama_do.toLowerCase(),
                fb = b.nama_do.toLowerCase();
                if (fa < fb) {
                    return changeIcon ? 1 : -1;
                }
                if (fa > fb) {
                    return changeIcon ? -1 : 1;
                }
                return 0;
            })
        }
        else {
            if(changeIcon) setIconSort("sort-alpha-down");
            data.sort((a, b) => {
                let fa = a.nama_do.toLowerCase(),
                fb = b.nama_do.toLowerCase();
                if (fa < fb) {
                    return changeIcon ? -1 : 1;
                }
                if (fa > fb) {
                    return changeIcon ? 1 : -1;
                }
                return 0;
            })
        }
        setArrListDo(data);
    }

    const sortHarga = (changeIcon) => {
        let data = arrListDo;
        if(iconSort == 'sort-alpha-down') {
            if(changeIcon) setIconSort("sort-alpha-down-alt");
            data.sort((a, b) => {
                if(changeIcon) return parseInt(b.harga) - parseInt(a.harga);
                else return parseInt(a.harga) - parseInt(b.harga);
            })
        }
        else {
            if(changeIcon) setIconSort("sort-alpha-down");
            data.sort((a, b) => {
                if(changeIcon) return parseInt(a.harga) - parseInt(b.harga);
                else return parseInt(b.harga) - parseInt(a.harga);
            })
        }
        setArrListDo(data);
    }

    return(
        <View style={{flex:1}}>
            <EditPemilikDoModal setModalVisible={setModalVisible} modalVisible={modalVisible} navigation={navigation} id_do_ppks={id_do_ppks} username={username} id_ppks={id_ppks} nama_do={nama_do} tanggal_perubahan_harga={tanggal_perubahan_harga} hargaDoPPKS={hargaDoPPKS} keterangan_biaya_bongkar={keterangan_biaya_bongkar} keterangan_harga={keterangan_harga} privasi_harga={privasi_harga} />

            <SearchBar title={"Menu Pemilik Do"} refresh={()=> loadListDoSaya()} navigation={navigation} />
            <View style={styles.container}>
                <View style={styles.segmenWrapper}>
                    <Text style={styles.segmenTitle}>List Do Saya</Text>
                    <View style={styles.headerItemArea} >
                        <TouchableOpacity style={styles.headerItem1} onPress={()=> sortHeader(1) } >
                            <Text style={styles.headerLabel1}>PPKS</Text>
                            {header1focus && (
                                <Icon name={iconSort} type="ionicon" size={20} color="white"  />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.headerItem2} onPress={()=> sortHeader(2) } >
                            <Text style={styles.headerLabel2}>Nama Do</Text>
                            {header2focus && (
                                <Icon name={iconSort}  type="ionicon" size={20} color="white"  />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.headerItem3} onPress={()=> sortHeader(3) } >
                            <Text style={styles.headerLabel3}>Harga </Text>
                            {header3focus && (
                                <Icon name={iconSort}  type="ionicon" size={20} color="white"  />
                            )}
                        </TouchableOpacity>     
                    </View>
                    {loadingVisible && (
                        <View >
                            <ActivityIndicator size={50} color={ORANGE} />
                        </View>
                    )}

                    {!loadingVisible && (
                        <FlatList
                            data={arrListDo}
                            extraData={arrListDo}
                            keyExtractor={(item, index) => (item.id_do_ppks) + index}
                            renderItem={renderItemListDo}
                        />
                    )}
                </View>    
            </View>
            <View style={{justifyContent: 'flex-end',paddingHorizontal:12}}>
                <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {loadDoPPKS()} }>
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
    headerItemArea:{
        flexDirection:'row',
        justifyContent:'space-around',
        backgroundColor:ORANGE,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
    },
    headerItem1 : {
        flex:0.8,
        flexDirection:'row',
        height:50,
        justifyContent:'center', 
        alignItems:'center', 
        padding:10
    }, 
    headerItem2 : {
        flex:0.8,
        flexDirection:'row',
        height:50,
        justifyContent:'center', 
        alignItems:'center', 
        padding:10
    },
    headerItem3 : {
        flex:0.7,
        flexDirection:'row',
        height:50,
        justifyContent:'center', 
        alignItems:'center', 
        padding:10
    },  
    headerLabel1 :{
        flex:0.8,
        color:'white',
        fontSize:14,
        fontWeight:'600',
        textAlign: "center",
        backgroundColor:'transparent'
    },
    headerLabel2 :{
        flex:0.8,
        color:'white',
        fontSize:14,
        fontWeight:'600',
        textAlign: "center",
        backgroundColor:'transparent'
    },
    headerLabel3 :{
        flex:0.6,
        color:'white',
        fontSize:14,
        fontWeight:'600',
        textAlign: "center",
        backgroundColor:'transparent'
    },
    renderItemArea:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#fcfcfcfc',
        paddingVertical:20,
        borderWidth:0.5,
        marginBottom:10
    },
    btnItemIcon:{
        width:22,
        height:22,
    },
    namaPPKSLabel :{
        flex:0.8,
        color:'black',
        fontSize:14,
        fontWeight:'500',
        textAlign: "center",
        backgroundColor:'transparent'
    },
    namaDoLabel :{
        flex:0.8,
        color:'black',
        fontSize:14.5,
        backgroundColor:"transparent",
        textAlign: "center"
    },
    hargaLabel :{
        flex:0.6,
        color:'black',
        fontSize:14.5,
        textAlign: "center"
    },
    segmenWrapper : {
        backgroundColor:'white',
        padding:10,
        marginTop:20,
        marginBottom:100
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
        width:Dimensions.get('window').width / 1.5,
        borderRadius:10,
        justifyContent:"center",
        left: Dimensions.get('window').width / 6,
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