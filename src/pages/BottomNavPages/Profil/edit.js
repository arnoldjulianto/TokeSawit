/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React,{useEffect, useState} from 'react';
import {View, ScrollView, Text, TextInput, StyleSheet, Image, ActivityIndicator, RefreshControl, TouchableOpacity, Dimensions} from 'react-native';
import CONSTANTS from '../../../assets/constants';
import AsyncStorage from '@react-native-community/async-storage';
import Select2 from "../../../components/SelectTwo";
import iconIndo from '../../../assets/icon/indonesia.png';
import iconEdit from '../../../assets/icon/edit-white.png';
import SearchBar from '../../../components/SearchBar/search_bar_edit_profil';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';

const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const EditProfil =  ({route, navigation}) => {
    const [showAlert, setAlert] = useState(false);
    const closeAlert = () => {
        console.log("alert close");
        setAlert(false);
    }
    const [id_user, setIdUser] = useState("");
    const [username, setUsername] = useState("");
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    //TAMPUNG EDIT
    const [usernameEdit, setUsernameEdit] = useState("");
    const [nama_lengkapEdit, setNamaLengkapEdit] = useState("");
    const [no_teleponEdit, setNoTeleponEdit] = useState("");
    const [emailEdit, setEmailEdit] = useState("");
    const [provinsiEdit, setProvinsiEdit] = useState("");
    const [kota_kabupatenEdit, setKotaKabupatenEdit] = useState("");
    const [kecamatanEdit, setKecamatanEdit] = useState("");
    const [kelurahan_desaEdit, setKelurahanDesaEdit] = useState("");
    const [rtEdit, setRTEdit] = useState("");
    const [rwEdit, setRWEdit] = useState("");
    const [nama_jalanEdit, setNamaJalanEdit] = useState("");
    const [no_rumahEdit, setNoRumahEdit] = useState("");
    const [foto_profilEdit, setFotoProfilEdit] = useState("");
    //TAMPUNG EDIT
    const [inputUsername, setInputUsername] = useState();
    const [inputNamaLengkap, setInputNamaLengkap] = useState();
    const [inputNoTelepon, setInputNoTelepon] = useState();
    const [inputEmail, setInputEmail] = useState();
    const [inputNamaJalan, setInputNamaJalan] = useState();
    const [inputRW, setInputRW] = useState();
    const [inputRT, setInputRT] = useState();
    const [inputNoRumah, setInputNoRumah] = useState();
    
    const [arrProvinsi, setArrProvinsi] = useState([]); 
    const [arrKotaKabupaten, setArrKotaKabupaten] = useState([]); 
    const [arrKecamatan, setArrKecamatan] = useState([]); 
    const [arrKelurahanDesa, setArrKelurahanDesa] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [provinsi_title, setProvinsiTitle] = useState("Tidak Ada Item Terpilih");
    const [kota_kabupaten_title, setKotaKabupatenTitle] = useState("Tidak Ada Item Terpilih");
    const [kecamatan_title, setKecamatanTitle] = useState("Tidak Ada Item Terpilih");
    const [kelurahan_desa_title, setKelurahanDesaTitle] = useState("Tidak Ada Item Terpilih");

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            setLoadingVisible(true);
            getUser();  
        });
        return unsubscribe;
    },[]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getUser();
        setRefreshing(false);
      }, []);


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
            setUsername(value);  
            loadDataUser(value);
          }
        } catch (error) {
          // Error retrieving data
          console.log(error)
          setLoadingVisible(false);
        }
    };

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
                setTimeout(()=>{
                    loadProvinsi(json.username);
                    loadKotaKabupaten(json.provinsi);
                    loadKecamatan(json.kota_kabupaten);
                    loadKelurahanDesa(json.kecamatan);
                },100)

                setIdUser(json.id);
                setUsername(json.username);
                setUsernameEdit(json.username);
                setNamaLengkapEdit(json.nama_lengkap);
                setNoTeleponEdit(json.no_telepon);
                setEmailEdit(json.email);
                setProvinsiEdit(json.provinsi);
                setKotaKabupatenEdit(json.kota_kabupaten);
                setKecamatanEdit(json.kecamatan);
                setKelurahanDesaEdit(json.kelurahan_desa);
                setProvinsiTitle(json.prov_name);
                setKotaKabupatenTitle(json.city_name);
                setKecamatanTitle(json.dis_name);
                setKelurahanDesaTitle(json.subdis_name);
                setRWEdit(json.rw);
                setRTEdit(json.rt);
                setNamaJalanEdit(json.nama_jalan);
                setNoRumahEdit(json.no_rumah);
                if(json.foto_profil == "default.png") setFotoProfilEdit(json.foto_profil);
                else setFotoProfilEdit(json.username+"/"+json.foto_profil)
            }
            else{
                setAlert(true);
                setCancelButtonAlert(true);
                setConfirmButtonAlert(false);
                setCancelTextAlert("Tutup");
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

    const loadProvinsi = (value) => {
        let params;
        if(typeof value !== undefined) {
            params = {
                username:value
            }
        }
        else{
            params = {
                username
            }
        }
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

        
        console.log(params);
        
        const createFormData = (body) => {
            const data = new FormData();
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            return data;
        }
        const formData = createFormData(params);
        fetch(base_url+'User/get_api_provinsi',
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
            setAlert(false);
            setLoadingVisible(false);
            setAlertMessage(json.msg);
            if(json.response == 1){
                const data = [];
                json.province.forEach((value)=>{
                    data.push({
                        id : parseInt(value.prov_id),    
                        name : value.prov_name    
                    });
                })
                setArrProvinsi(data);
            }
            else{
                setCancelButtonAlert(true);
                setConfirmButtonAlert(false);
                setCancelTextAlert("Tutup");
            }
            //console.log(json);
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

    const loadKotaKabupaten = (prov_id) => {
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
            prov_id
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
        fetch(base_url+'User/get_api_kota_kabupaten',
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
            setAlert(false);
            setLoadingVisible(false);
            setAlertMessage(json.msg);
            if(json.response == 1){
                const data = [];
                json.cities.forEach((value)=>{
                    data.push({
                        id : parseInt(value.city_id),    
                        name : value.city_name    
                    });
                })
                setArrKotaKabupaten(data);
            }
            else{
                setCancelButtonAlert(true);
                setConfirmButtonAlert(false);
                setCancelTextAlert("Tutup");
            }
            //console.log(json);
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

    const loadKecamatan = (city_id) => {
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
            city_id
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
        fetch(base_url+'User/get_api_kecamatan',
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
            setAlert(false);
            setLoadingVisible(false);
            setAlertMessage(json.msg);
            if(json.response == 1){
                const data = [];
                json.districts.forEach((value)=>{
                    data.push({
                        id : parseInt(value.dis_id),    
                        name : value.dis_name    
                    });
                })
                setArrKecamatan(data);
            }
            else{
                setCancelButtonAlert(true);
                setConfirmButtonAlert(false);
                setCancelTextAlert("Tutup");
            }
            //console.log(json);
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

    const loadKelurahanDesa = (dis_id) => {
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
            dis_id
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
        fetch(base_url+'User/get_api_kelurahan_desa',
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
            setAlert(false);
            setLoadingVisible(false);
            setAlertMessage(json.msg);
            if(json.response == 1){
                const data = [];
                json.subdistricts.forEach((value)=>{
                    data.push({
                        id : parseInt(value.subdis_id),    
                        name : value.subdis_name    
                    });
                })
                setArrKelurahanDesa(data);
            }
            else{
                setCancelButtonAlert(true);
                setConfirmButtonAlert(false);
                setCancelTextAlert("Tutup");
            }
            //console.log(json);
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

    useEffect (() => {
        if(arrProvinsi.length > 0){
            arrProvinsi.forEach((value)=>{
                value.checked = true
                if(value.id != provinsiEdit ){
                    value.checked = false
                }
                else value.checked = true
            })
        }
        if(arrKotaKabupaten.length > 0){
            arrKotaKabupaten.forEach((value)=>{
                value.checked = true
                if(value.id != kota_kabupatenEdit ){
                    value.checked = false
                }
                else value.checked = true
            })
        }
        if(arrKecamatan.length > 0){
            arrKecamatan.forEach((value)=>{
                value.checked = true
                if(value.id != kecamatanEdit ){
                    value.checked = false
                }
                else value.checked = true
            })
        }
        
    },[arrProvinsi, arrKotaKabupaten, arrKecamatan])

    useEffect (() => {
        if(arrKelurahanDesa.length > 0){
            arrKelurahanDesa.forEach((value)=>{
                if(value.id == kelurahan_desaEdit ){
                    value.checked = true
                }
            })
        }
    },[arrKelurahanDesa])

    const editProfilHandler = () => {
        if(no_teleponEdit == "") {
            setAlert(true);
            setCancelButtonAlert(true);
            setConfirmButtonAlert(false);
            setCancelTextAlert("Tutup");
            setAlertMessage("No. Telepon Tidak Boleh Kosong");
        }
        else{
            prosesUpdateProfil();   
        }
    }

    const prosesUpdateProfil = () => {
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
            id:id_user,
            username_lama:username,
            username:usernameEdit,
            nama_lengkap:nama_lengkapEdit,
            no_telepon:no_teleponEdit,
            email:emailEdit,
            provinsi:provinsiEdit,
            kota_kabupaten:kota_kabupatenEdit,
            kecamatan:kecamatanEdit,
            kelurahan_desa:kelurahan_desaEdit,
            rt:rtEdit,
            rw:rwEdit,
            nama_jalan:nama_jalanEdit,
            no_rumah:no_rumahEdit,
        }
        console.log("Edit params : ");
        console.log(params);
        
        const createFormData = (body) => {
            const data = new FormData();
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            return data;
        }
        const formData = createFormData(params);
        fetch(base_url+'User/get_api_update_user_data',
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
                setAlert(false);
                try {
                    AsyncStorage.setItem('username', json.username);
                    getUser();
                } catch (error) {
                    // Error retrieving data
                    console.log(error)
                }
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
    const resetNoTelepon = (value) => {
        value = value.replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, "");
        if(value == "0"){
            value = "";
        }
        setNoTeleponEdit(value.replace("+62",""))
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

    const launchImageLibrary = async () => {
        const options = {
            usedCameraButton: true,
            allowedVideo: false,
            allowedPhotograph: true, // for camera : allow this option when you want to take a photos
            allowedVideoRecording: false, //for camera : allow this option when you want to recording video.
            maxVideoDuration: 60, //for camera : max video recording duration
            numberOfColumn: 3,
            maxSelectedAssets: 1,
            singleSelectedMode: false,
            doneTitle: 'Lanjutkan',
            isPreview: true,
            mediaType: 'image',
            isExportThumbnail: true,
        }
        const response = await MultipleImagePicker.openPicker(options);
        console.log(response);
        uploadFotoProfil(response);
    }

    const uploadFotoProfil = (value) => {
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
            id:id_user,
            username_lama:username,
            foto_lama:foto_profilEdit,
        }
        console.log("Edit params : ");
        
        const createFormData = (body) => {
            const data = new FormData();
            data.append("foto_profil", {
                name: value[0].fileName,
                type: 'image/gif',
                uri: 'file://'+value[0].realPath
            })
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            return data;
        }
        const formData = createFormData(params);
        console.log(value[0]);
        fetch(base_url+'User/get_api_upload_foto_profil',
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
                loadDataUser(json.username);
            }
            else{
                setAlert(true);
                setCancelButtonAlert(true);
                setConfirmButtonAlert(false);
                setCancelTextAlert("Tutup");
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

    return (
        <View style={{flex:1}}>
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
            <SearchBar title={"Edit Profil"} navigation={navigation} refresh ={false} />
            <View style={styles.container}>
                <ScrollView
                 refreshControl={
                    <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />
                } >
                    <View style={styles.segmenWrapper}>
                        <Text style={styles.segmenTitle}>Klik Foto Untuk Mengubah Foto Profil Anda</Text>
                        <TouchableOpacity onPress={()=> launchImageLibrary()}>
                            <Image style={styles.fotoProfil} source={{uri : base_url+"assets/upload/file user/"+foto_profilEdit}} resizeMethod="resize" resizeMode="cover" />
                         </TouchableOpacity> 
                    </View>
                    <View style={styles.segmenWrapper}>
                        <Text style={styles.segmenTitle}>Biodata</Text>
                        <View style={styles.formGroup}>
                            {/*<Text style={styles.formLabel}>Username</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput style={styles.textInput} placeholder={"Masukkan Username"} placeholderTextColor= 'gray' value={usernameEdit}   onChangeText = {(value) => setUsernameEdit(value)} onSubmitEditing={() => { inputNamaLengkap.focus()}} blurOnSubmit={false} returnKeyType="next"   ></TextInput>
                            </View> */}
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Nama Lengkap</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput style={styles.textInput} placeholder={"Masukkan Nama Lengkap"} placeholderTextColor= 'gray' value={nama_lengkapEdit} 
                                onChangeText = { (value) => setNamaLengkapEdit(value) } onSubmitEditing={() => { inputNoTelepon.focus()}} ref={(input) => { setInputNamaLengkap(input) }} blurOnSubmit={false} returnKeyType="next"   ></TextInput>

                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>No. Telepon</Text>
                            <View style={styles.inputWrapper}>
                                <Image source={iconIndo} style={styles.logoIndo} />
                                <Text style={styles.kodeNegaraLabel}>+62</Text>
                                <TextInput style={styles.textInput} placeholder={"Masukkan No. Telepon"} placeholderTextColor= 'gray' value={no_teleponEdit.replace("+62","")} keyboardType="numeric" onChangeText = { (value) => resetNoTelepon(value) }  onSubmitEditing={() => { inputEmail.focus()}} ref={(input) => { setInputNoTelepon(input) }} blurOnSubmit={false} returnKeyType="next"  ></TextInput>

                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput style={styles.textInput} placeholder={"Masukkan Alamat Email"} placeholderTextColor= 'gray' value={emailEdit}  onChangeText = {(value) => setEmailEdit(value)} ref={(input) => { setInputEmail(input) }}  ></TextInput>
                            </View>
                        </View>
                    </View>

                    <View style={styles.segmenWrapper}>
                        <Text style={styles.segmenTitle}>Alamat</Text>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Provinsi</Text>
                            <View style={styles.inputWrapper}>
                                <Select2
                                    isSelectSingle
                                    listEmptyTitle={"Tidak Ada Data Ditemukan"}
                                    style={styles.textInput}
                                    cancelButtonText={"Batal"}
                                    selectButtonText={"Pilih"}
                                    colorTheme="darkorange"
                                    popupTitle="Pilih Provinsi"
                                    title={provinsi_title}
                                    searchPlaceHolderText={"Cari disini"}
                                    selectedTitleStyle={{color:"black"}}
                                    inputStyle={{color:"black"}}
                                    data={arrProvinsi}
                                    onSelect={data => {
                                        if(typeof data[0] !=="undefined" ) {
                                            loadKotaKabupaten(data[0]);
                                            setProvinsiEdit(data[0]);
                                            setKotaKabupatenTitle("Tidak Ada Item Terpilih");
                                        }
                                    }}
                                    />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Kota/Kabupaten</Text>
                            <View style={styles.inputWrapper}>
                                <Select2
                                    isSelectSingle
                                    listEmptyTitle={"Tidak Ada Data Ditemukan"}
                                    style={styles.textInput}
                                    cancelButtonText={"Batal"}
                                    selectButtonText={"Pilih"}
                                    colorTheme="darkorange"
                                    popupTitle="Pilih Kota/Kabupaten"
                                    title={kota_kabupaten_title}
                                    searchPlaceHolderText={"Cari disini"}
                                    selectedTitleStyle={{color:"black"}}
                                    inputStyle={{color:"black"}}
                                    data={arrKotaKabupaten}
                                    onSelect={data => {
                                        if(typeof data[0] !=="undefined" ) {
                                            loadKecamatan(data[0]);
                                            setKotaKabupatenEdit(data[0]);
                                            setKecamatanTitle("Tidak Ada Item Terpilih");
                                        }
                                    }}
                                    />
                            </View>
                        </View>
                        
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Kecamatan</Text>
                            <View style={styles.inputWrapper}>
                                <Select2
                                    isSelectSingle
                                    listEmptyTitle={"Tidak Ada Data Ditemukan"}
                                    style={styles.textInput}
                                    cancelButtonText={"Batal"}
                                    selectButtonText={"Pilih"}
                                    colorTheme="darkorange"
                                    popupTitle="Pilih Kecamatan"
                                    title={kecamatan_title}
                                    searchPlaceHolderText={"Cari disini"}
                                    selectedTitleStyle={{color:"black"}}
                                    inputStyle={{color:"black"}}
                                    data={arrKecamatan}
                                    onSelect={data => {
                                        if(typeof data[0] !=="undefined" ) {
                                            loadKelurahanDesa(data[0])
                                            setKecamatanEdit(data[0]);
                                            setKelurahanDesaTitle("Tidak Ada Item Terpilih");
                                        }
                                    }}
                                    />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Kelurahan/Desa</Text>
                            <View style={styles.inputWrapper}>
                                <Select2
                                    isSelectSingle
                                    listEmptyTitle={"Tidak Ada Data Ditemukan"}
                                    style={styles.textInput}
                                    cancelButtonText={"Batal"}
                                    selectButtonText={"Pilih"}
                                    colorTheme="darkorange"
                                    popupTitle="Pilih Kelurahan/Desa"
                                    title={kelurahan_desa_title}
                                    searchPlaceHolderText={"Cari disini"}
                                    selectedTitleStyle={{color:"black"}}
                                    inputStyle={{color:"black"}}
                                    data={arrKelurahanDesa}
                                    onSelect={data => {
                                        if(typeof data[0] !=="undefined" ) setKelurahanDesaEdit(data[0]);
                                    }}
                                    />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Nama Jalan</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput style={styles.textInput} placeholder={"Masukkan Nama Jalan"} placeholderTextColor= 'gray' value={nama_jalanEdit}  onChangeText = {(value) => setNamaJalanEdit(value)} onSubmitEditing={() => { inputRT.focus()}} ref={(input) => { setInputNamaJalan(input) }} blurOnSubmit={false} returnKeyType="next"   ></TextInput>
                            </View>
                        </View>
                        
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex:1}}>
                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>RT</Text>
                                    <View style={styles.inputWrapper}>
                                        <TextInput style={styles.textInput} placeholder={"Masukkan Nomor"} placeholderTextColor= 'gray' value={rtEdit}  onChangeText = {(value) => setRTEdit(value)} keyboardType="numeric"  onSubmitEditing={() => { inputRW.focus()}} ref={(input) => { setInputRT(input) }} blurOnSubmit={false} returnKeyType="next"  ></TextInput>
                                    </View>
                                </View>
                            </View>

                            <View style={{flex:1}}>
                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>RW</Text>
                                    <View style={styles.inputWrapper}>
                                        <TextInput style={styles.textInput} placeholder={"Masukkan Nomor"} placeholderTextColor= 'gray' value={rwEdit}  onChangeText = {(value) => setRWEdit(value)} keyboardType="numeric"  onSubmitEditing={() => { inputNoRumah.focus()}} ref={(input) => { setInputRW(input) }} blurOnSubmit={false} returnKeyType="next"  ></TextInput>
                                    </View>
                                </View>
                            </View>
                        </View>
                        
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Nomor</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput style={styles.textInput} placeholder={"Masukkan Nomor"} placeholderTextColor= 'gray' value={no_rumahEdit}  onChangeText = {(value) => setNoRumahEdit(value)} keyboardType="numeric" ref={(input) => { setInputNoRumah(input) }} onSubmitEditing={() => { editProfilHandler() }} ></TextInput>
                            </View>
                        </View>
                    </View> 

                    <TouchableOpacity style={styles.btnEditProfil} onPress={()=> {editProfilHandler()} }>
                        <Text style={styles.btnEditProfilLabel}>Edit</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View> 
        </View>    
    );
}

export default EditProfil;

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:20,
        backgroundColor:'white'
    },
    fotoProfil :{
        width:200,
        height:200,
        alignSelf:'center',
        borderRadius:200
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
    logoIndo :{
        width:25,
        height:25,
        borderRadius:50/2
    },
    kodeNegaraLabel :{
        marginLeft:10,
        fontSize:13,
    },
    formGroup:{
        marginTop:7,
    },
    formLabel : {
        color:'black',
        fontSize:13,
        fontWeight:'300'
    },
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"white",
        height:45,
        justifyContent:"center",
        color:"black"
    },
    textInput:{
        borderTopWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
        borderWidth:0.3,
        borderColor:"black",
        color:"black",
        borderRadius:5,
        fontSize:13,
        flex:1,
        marginHorizontal:8,
    },
    btnEditProfil : {
        flexDirection:'row',
        backgroundColor:ORANGE,
        alignItems:"center",
        marginTop:20,
        marginBottom:30,
        height:40,
        justifyContent:"center",
        borderBottomWidth:0.3,
    },
    btnEditProfilIcon:{
        width:22,
        height:22,
    },
    btnEditProfilLabel : {
        fontSize:13,
        color:'white',
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