/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, RefreshControl, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import CONSTANTS from '../../assets/constants';
import iconNext from '../../assets/icon/next.png';
import SearchBar from '../../components/SearchBar/search_bar_jadi_pemilik_do';
import AwesomeAlert from 'react-native-awesome-alerts';
import RadioPrivasiHarga from '../../components/RadioPrivasiHarga';
import AsyncStorage from '@react-native-community/async-storage';

const DANGER = CONSTANTS.COLOR.DANGER;
const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const FeeResellerDO = ({route, navigation}) => {
    const closeAlert = () => () => {
        console.log("alert close");
        setAlert(false);
    }
    let {id, username,username_edit, type, nama_lengkap} = route.params;
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [harga, setHarga] = useState("0");
    const [fee, setFee] = useState("");
    const [hargaJual, setHargaJual] = useState("0");
    const [keterangan_biaya_bongkar, setKetBiayaBongkar] = useState("");
    const [showAlert, setAlert] = useState(false);
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [alertCancelTask, setAlertCancelTask] = useState(() => closeAlert() );
    const [privasiHarga, setPrivasiHarga] = useState("Publik");
    const [modalVisible, setModalVisible] = useState(false);
    const [startCekPrivasiHarga, setStartCekPrivasiHarga] = useState(false);
    const [currentUser, setCurrentUser] = useState("");

    useEffect(()=>{
        getUser();
    },[])

    useEffect(()=>{
        if(currentUser != "") clearPrivasiHargaUndefined();
    },[currentUser])

    useEffect(()=>{
        if(fee != "" && typeof fee !== "undefined"){
            let num1 = parseInt(harga.replace(".",""));
            let num2 = parseInt(fee.replace(".",""));
            setHargaJual( formatRupiah( ( num1 - num2 ).toString() ) )
        }
        else{
            setHargaJual(formatRupiah(harga));
        }
    },[fee])

    useEffect(()=>{
        if(hargaJual != "0" && typeof hargaJual !== "undefined"){
            if(parseInt(hargaJual.replace(".", "")) < 0 )  {
                setAlertMessage("Harga yang Anda Jual Tidak Boleh Lebih Kecil Dari Nol");
                setHargaJual(formatRupiah(harga));
                setCancelTextAlert("Tutup");
                setFee("");
                setAlert(true);
            }
        }
        
    },[hargaJual])

    useEffect(() => {
        if(fee == ""){
            setHargaJual(formatRupiah(harga));
        }
    },[harga])
    

    const onRefresh = React.useCallback(() => {
        getUser();
    }, []);

    const getUser = async () => {
        try {
          const value = await AsyncStorage.getItem('username');
          if (value === null) {
            // We have data!!
          }
          else{
              setCurrentUser(value);
              loadDataDO(); 
              clearPrivasiHargaUndefined(value); 
          }
        } catch (error) {
          // Error retrieving data
          console.log(error)
        }
    };

    const loadDataDO = () => {
        setLoadingVisible(true);
        const timeout = setTimeout(() => {
            setLoadingVisible(false);
        }, 30000);

        const params = {
            id,
            type,
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
        fetch(base_url+'PemilikDo/get_api_data_pemilik_do',
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
            setHarga(formatRupiah(json.harga.toString()));
            setStartCekPrivasiHarga(true);
            setLoadingVisible(false);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(error);
        });
    }    

    const clearPrivasiHargaUndefined = (currentUser) => {
        const timeout = setTimeout(() => {
            setLoadingVisible(false);
        }, 30000);

        const params = {
            id_do_ppks:"undefined",
            id_reseller_do:"undefined",
            pemilik_do_ppks:currentUser,
            type:"Reseller DO",
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
        fetch(base_url+'PrivasiHarga/clear_undefined',
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
            console.log("Deleted")
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(error);
        });
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

    const submitHandler = () => {
        if(typeof fee === "undefined" || fee == ""){
            setAlertMessage("Harap Masukkan Fee Yang Anda Inginkan");
            setCancelTextAlert("Tutup");
            setAlert(true);
        }
        else{
            setLoadingVisible(true);
            const timeout = setTimeout(() => {
                setLoadingVisible(false);
                setAlertMessage("Permintaan Tidak Dapat Dipenuhi, Server Tidak Merespons");
                setCancelTextAlert("Tutup");
                setAlert(true);
            }, 30000);

            const params = {
                id:id,
                currentUser,
                jenis_reseller:type,
                fee,
                privasi_harga:privasiHarga,
                keterangan_biaya_bongkar,
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
            fetch(base_url+'PemilikDo/get_api_add_reseller_do',
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
                    setAlertMessage("Data Berhasil Disimpan");
                    setCancelTextAlert("Tutup");
                    setAlert(true);
                    setAlertCancelTask(()=> loadJadiPemilikDo());
                }
            })
            .catch((error) => {
                clearTimeout(timeout);
                setLoadingVisible(false);
                setAlertMessage("Terjadi Kesalahan \n"+ error);
                setCancelTextAlert("Tutup");
                setAlert(true);
                console.log(error);
            });
        }
    }

    const loadJadiPemilikDo = () => () => {
        navigation.navigate("JadiPemilikDo", {username:currentUser});
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
            <SearchBar title={"Tentukan Fee"} refresh={false} navigation={navigation} />
            <ScrollView 
                refreshControl={
                    <RefreshControl
                    refreshing={loadingVisible}
                    onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.container} >
                    {!loadingVisible && currentUser != "" && (
                        <View>
                            <View style={styles.segmenWrapper} >
                                <Text style={styles.segmenTitle} >Fee</Text>
                                <View style={styles.segmenRow}>
                                    <Text style={styles.lblHeader} >Harga {nama_lengkap}</Text>
                                    <Text style={styles.lblContent}>Rp {harga}</Text>
                                </View>

                                <View style={styles.segmenRow}>
                                    <Text style={styles.lblHeader} >Tentukan Fee Anda</Text>
                                    <View style={styles.inputWrapperFee}>
                                        
                                        <Text style={styles.lblContent}>Rp</Text>
                                        <TextInput style={styles.textInputFee} placeholder="" placeholderTextColor= 'gray' value={fee} onChangeText = { (value) => {setFee(formatRupiah(value))} } keyboardType={"numeric"} 
                                        />
                                    </View>
                                </View>

                                <View style={styles.segmenRow}>
                                    <Text style={styles.lblHeader} >Harga Yang Ingin Anda Jual</Text>
                                    <Text style={styles.lblContent}>Rp {hargaJual}</Text>
                                </View>
                            </View>

                            <View style={styles.segmenWrapper} >
                                <Text style={styles.segmenTitle}>Privasi Harga</Text>
                                <RadioPrivasiHarga startCekPrivasiHarga={startCekPrivasiHarga} setStartCekPrivasiHarga={setStartCekPrivasiHarga} privasiHarga={privasiHarga} setPrivasiHarga={setPrivasiHarga} setModalVisible={setModalVisible} modalVisible={modalVisible} navigation={navigation} loadingVisible={loadingVisible} setLoadingVisible={setLoadingVisible} id_do_ppks={"undefined"} id_reseller_do={"undefined"} type={"Reseller DO"} currentUser={currentUser}  />                    
                            </View> 

                            <View style={styles.segmenWrapper} >
                                <Text style={styles.segmenTitle} >Keterangan Biaya Bongkar</Text>
                                <Text style={styles.ketLabel} >
                                        <Text style={{fontWeight:'bold'}}>LEWATI</Text> Jika Tidak Ada Biaya Bongkar.{"\n"}
                                        Jika Ada, Tuliskan Pada Kolom Deskripsi.{"\n"}
                                        </Text>
                                        <Text style={styles.ketLabel} >* Contoh :{"\n"}
                                            - Bak Mati Rp 100.000 / Do{"\n"}
                                            - Dump Truk Rp 20.000 / Do{"\n"}
                                            atau{"\n"}
                                        " Rp 25 / Kg x Tonase Kotor "{"\n"}
                                </Text>
                                <View style={styles.inputWrapperBiayaBongkar}>
                                    <TextInput style={styles.textInputBiayaBongkar} placeholder="Deskripsikan . . ." placeholderTextColor= 'gray' value={keterangan_biaya_bongkar} onChangeText = { (value) => {setKetBiayaBongkar(value)} } multiline={true} numberOfLines={4}
                                    />
                                </View>
                            </View> 
                        
                            <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {submitHandler()} } >
                                    <View style={{flexDirection:"row",justifyContent:'center'}}>
                                        <Text style={styles.btnLanjutkanLabel}>Lanjutkan</Text>
                                        <Image source={iconNext} style={styles.btnLanjutkanIcon}  />
                                    </View>
                            </TouchableOpacity> 
                        </View>
                    )}    
                    
                </View>
            </ScrollView>
        </View>
    )
}

export default FeeResellerDO;

const styles = StyleSheet.create({
    container : {
        paddingHorizontal:5,
        paddingTop:10,
        paddingBottom:70
    },
    segmenWrapper:{
        backgroundColor:'white',
        borderRadius:10,
        padding:10,
        marginBottom:20
    },
    segmenTitle:{
        fontSize:15.5,
        fontWeight:'500',
        marginBottom:10
    },
    segmenRow :{
        paddingHorizontal:10,
        flexDirection:'row',
        justifyContent:'space-between',
        borderBottomWidth:0.3,
        paddingBottom:10,
        marginBottom:20
    },
    lblHeader:{
        fontWeight:'300',
        fontSize:15.5
    },
    lblContent:{
        fontWeight:'500',
        fontSize:20
    },
    inputWrapperFee:{
        flex:0.5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"white",
        height:45,
        justifyContent:"flex-end",
        color:"black",
        borderBottomWidth:0.3,
    },
    textInputFee:{
        flex:1,
        borderColor:"black",
        color:"black",
        fontSize:20,
        fontWeight:'500',
        textAlign:'center'
    },
    ketLabel:{
        fontSize:14
    },
    inputWrapperBiayaBongkar:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent:"flex-start",
        color:"black"
    },
    textInputBiayaBongkar:{
        flex:1,
        borderWidth:0.5,
        borderColor:"black",
        color:"black",
        marginHorizontal:10,
        height: 200,
        justifyContent: "flex-start",
        textAlignVertical: 'top',
        fontSize:15
    },
    btnLanjutkan: {
        backgroundColor:NAVY,
        alignItems:"center",
        height:40,
        borderRadius:10,
        justifyContent:"center",
        
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