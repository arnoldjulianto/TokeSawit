/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, TouchableOpacity, ActivityIndicator,RefreshControl, Image, ScrollView } from 'react-native';
import iconNext from '../../assets/icon/next.png';
import CONSTANTS from '../../assets/constants';
import AwesomeAlert from 'react-native-awesome-alerts';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const DANGER = CONSTANTS.COLOR.DANGER;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const DetailPemilikDo = (props) => {
    const [showAlert, setAlert] = useState(false);
    const closeAlert = () => () => {
        console.log("alert close");
        setAlert(false);
    }
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [nama_ppks, setNamaPPKS] = useState("");
    const [refreshing, setRefreshing] = React.useState(false);
    let bulan = props.tanggal_perubahan_harga.substr(5,2);
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
    const[privasiHarga, setPrivasiHarga] = useState("Pengikut");

    useEffect(()=>{
        loadDetailPPKS()
    },[])

    useEffect(() => {
        if(privasiHarga == "Pengikut_kecuali"){
            console.log(privasiHarga)
            props.navigation.navigate("ShowHargaKecuali", {currentUser:props.username});
            props.setModalVisible(false);
        }
        else if(privasiHarga == "Hanya_pada"){
            console.log(privasiHarga)
            props.navigation.navigate("ShowHargaKepada", {});
            props.setModalVisible(false);
        }
    },[privasiHarga])

    const loadDetailPPKS = () => {
        setLoadingVisible(true);
        const timeout = setTimeout(() => {
            setLoadingVisible(false);
        }, 30000);

        const params = {
            id_ppks:props.id_ppks
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
        fetch(base_url+'PPKS/get_api_detail_ppks',
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
            setNamaPPKS(json[0].nama_ppks)
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(error);
        });
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadDetailPPKS();
        setRefreshing(false);
    }, []);

    const submitHandler = () =>{
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
            clearTimeout(timeout);
        }, 30000);

        const params = {
            id_do_ppks:props.id_do_ppks, 
            username:props.username, 
            id_ppks:props.id_ppks, 
            nama_do:props.nama_do, 
            tanggal_perubahan_harga:props.tanggal_perubahan_harga, 
            hargaDoPPKS:props.hargaDoPPKS, 
            keterangan_biaya_bongkar:props.keterangan_biaya_bongkar, 
            keterangan_harga:props.keterangan_harga, 
            edit:props.edit
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
        fetch(base_url+'PemilikDo/get_api_add_pemilik_do',
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
            setAlert(true);
            setAlertMessage(json.msg);
            setCancelTextAlert("Tutup");
            setConfirmButtonAlert(false);
            setCancelButtonAlert(true);
            setLoadingVisible(false);
            if(json.response == 1) props.navigation.navigate("JadiPemilikDo", {username:props.username})
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

    const loadEditPemilikDo = (page) => {
        if(props.edit){
            if(page == "harga") props.navigation.navigate("EditHarga", {id_do_ppks:props.id_do_ppks});
        }
    }

    const radio_props1 = [
        {label: 'Pengikut Saya', value: 'Pengikut' },
        {label: 'Pengikut Saya Kecuali ...', value: 'Pengikut_kecuali' },
        {label: 'Hanya Pada ...', value: 'Hanya_pada' },
    ];

    return (
        <View style={styles.container}>
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
            <ScrollView 
                    refreshControl={
                    <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />
                }>
                        {loadingVisible && (
                            <ActivityIndicator size={50} color={ORANGE} />
                        )}
                        {!loadingVisible && (
                            <View>
                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Nama PPKS</Text>
                                    <Text style={styles.formSeparator}>:</Text>
                                    <Text style={styles.ketBoldLabel}>{nama_ppks}</Text>
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Nama Do</Text>
                                    <Text style={styles.formSeparator}>:</Text>
                                    <Text style={styles.ketBoldLabel}>{props.nama_do}</Text>
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Biaya Bongkar</Text>
                                    <Text style={styles.formSeparator}>:</Text>
                                    <Text style={styles.ketLabel}>{props.keterangan_biaya_bongkar}</Text>
                                    <View style={{flex:0.3}}></View>
                                </View>

                                <TouchableOpacity style={styles.formGroup} onPress={()=> loadEditPemilikDo("harga") }>
                                    <Text style={styles.formLabel}>Harga</Text>
                                    <Text style={styles.formSeparator}>:</Text>
                                    <Text style={styles.ketBoldLabel}>Rp {props.hargaDoPPKS+" / Kg"+"\n"} <Text style={{color:ORANGE,fontSize:13,fontWeight:"600"}}>update terakhir {props.tanggal_perubahan_harga.substr(8,2)+" "+bulan+" "+props.tanggal_perubahan_harga.substr(0,4)}</Text> </Text>
                                </TouchableOpacity>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Catatan</Text>
                                    <Text style={styles.formSeparator}>:</Text>
                                    <Text style={styles.ketLabel}>{props.keterangan_harga}</Text>
                                </View>
                                
                                <View style={styles.privasiHarga}>
                                    <Text style={styles.formLabel}>Privasi Harga</Text>
                                    <View>
                                        <Text style={[{marginBottom:20}]}>Siapa saja yang dapat melihat perubahan harga</Text>
                                        <RadioForm
                                            formHorizontal={false}
                                            animation={true}
                                            >
                                            {
                                                radio_props1.map((obj, i) => (
                                                <RadioButton labelHorizontal={true} key={i} style={{marginBottom:20}} >
                                                    <RadioButtonInput
                                                    obj={obj}
                                                    index={i}
                                                    isSelected={privasiHarga === obj.value }
                                                    onPress={(value) => setPrivasiHarga(value)}
                                                    borderWidth={1}
                                                    buttonInnerColor={ORANGE}
                                                    buttonOuterColor={privasiHarga === obj.value ? ORANGE : '#000'}
                                                    buttonSize={15}
                                                    buttonOuterSize={30}
                                                    buttonStyle={{}}
                                                    buttonWrapStyle={{borderColor:ORANGE,marginLeft: 10}}
                                                    />
                                                    <RadioButtonLabel
                                                    obj={obj}
                                                    index={i}
                                                    labelHorizontal={true}
                                                    onPress={(value) => setPrivasiHarga(value)}
                                                    labelStyle={{fontSize: 15, color: 'black'}}
                                                    labelWrapStyle={{}}
                                                    />
                                                </RadioButton>
                                                ))
                                            }  
                                            </RadioForm>
                                    </View>
                                </View>

                                {/* {!props.edit && ( */}
                                        <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {submitHandler()} }>
                                        <View style={{flexDirection:"row",justifyContent:'center'}}>
                                            <Text style={styles.btnLanjutkanLabel}>Simpan</Text>
                                            <Image source={iconNext} style={styles.btnLanjutkanIcon}  />
                                        </View>
                                    </TouchableOpacity>
                                {/* )} */}
                                
                            </View>
                        )}
                </ScrollView>  
        </View>
    )
}

export default DetailPemilikDo;

const styles = StyleSheet.create({
    container:{
        marginTop:15,
        marginHorizontal:15,
        padding:10,
        backgroundColor:'white',
    },
    formGroup :{
        flexDirection:'row',
        marginBottom:20,
        backgroundColor:'white',
        justifyContent:"space-between",
        borderBottomWidth:0.5,
        paddingBottom:15
    },
    formLabel : {
        flex:0.75,
        color:'black',
        fontSize:16,
        fontWeight:'600'
    },
    formSeparator : {
        flex:0.1,
        color:'black',
        fontSize:16,
        fontWeight:'600'
    },
    ketLabel : {
        flex:1.5,
        color:'black',
        fontSize:15,
        fontWeight:'400',
        textAlign:'center',
    },
    ketBoldLabel : {
        flex:1.5,
        color:'black',
        fontSize:16,
        fontWeight:'600',
        textAlign:'center',
    },
    btnLanjutkan: {
        backgroundColor:NAVY,
        alignItems:"center",
        height:40,
        borderRadius:10,
        justifyContent:"center",
        marginTop:10
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
    btnEdit: {
        flex:0.3,
        backgroundColor:'teal',
        alignItems:"center",
        height:30,
        borderRadius:5,
        justifyContent:"center",
        marginLeft:10
    },
    btnEditLabel : {
        fontSize:14,
        color:'white'
    },
})