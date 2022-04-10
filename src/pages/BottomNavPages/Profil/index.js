/* eslint-disable prettier/prettier */
import React,{useEffect, useState} from 'react';
import {Keyboard, View, ScrollView, Text, TextInput, StyleSheet, Image, ActivityIndicator, useWindowDimensions, TouchableOpacity} from 'react-native';
import {AuthContext} from '../../../components/Context';
import CONSTANTS from '../../../assets/constants';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import iconEdit from '../../../assets/icon/edit-white.png';
import iconLogOut from '../../../assets/icon/logout.png';
import iconBankCardWhite from '../../../assets/icon/bank-card-white.png';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Select2 from "react-native-select-two";
import iconIndo from '../../../assets/icon/indonesia.png';

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
    const [allRekeningBank, setAllRekeningBank] = useState([]);
    const [arrProvinsi, setArrProvinsi] = useState([{id:0,name:"Pilih Provinsi",checked:true}]); 
    const [arrKotaKabupaten, setArrKotaKabupaten] = useState([{id:0,name:"Pilih Kota/Kabupaten",checked:true}]); 
    const [arrKecamatan, setArrKecamatan] = useState([{id:0,name:"Pilih Kecamatan",checked:true}]); 
    const [arrKelurahanDesa, setArrKelurahanDesa] = useState([{id:0,name:"Pilih Kelurahan/Desa",checked:true}]); 
    
    const [inputUsername, setInputUsername] = useState();
    const [inputNamaLengkap, setInputNamaLengkap] = useState();
    const [inputNoTelepon, setInputNoTelepon] = useState();
    const [inputEmail, setInputEmail] = useState();
    const [inputNamaJalan, setInputNamaJalan] = useState();
    const [inputRW, setInputRW] = useState();
    const [inputRT, setInputRT] = useState();
    const [inputNoRumah, setInputNoRumah] = useState();

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

    useEffect (() => {
        let i =0;
        arrProvinsi.forEach((value)=>{
            if(value.id == provinsiEdit ){
                value.checked = true
            }
            i++;
        })

        i =0;
        arrKotaKabupaten.forEach((value)=>{
            if(value.id == kota_kabupatenEdit ){
                value.checked = true
            }
            i++;
        })

        i =0;
        arrKecamatan.forEach((value)=>{
            if(value.id == kecamatanEdit ){
                value.checked = true
            }
            i++;
        })

        i =0;
        arrKelurahanDesa.forEach((value)=>{
            if(value.id == kelurahan_desaEdit ){
                value.checked = true
            }
            i++;
        })
    },[arrProvinsi, arrKotaKabupaten, arrKecamatan, arrKelurahanDesa])

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'first', title: 'Etalase Saya' },
      { key: 'second', title: 'Kerjasama Agen' },
      { key: 'third', title: 'Pengaturan Akun' }
    ]);

    const resetNoTelepon = (value) => {
        value = value.replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, "");
        if(value == "0"){
            value = "";
        }
        setNoTeleponEdit(value.replace("+62",""))
    }

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
              <View><TextInput value={inputRT} onChangeText={setInputRT} /></View>
            )
      
          case 'second':
            return (
              <View>
                  <Text>AA</Text>
                  <View><TextInput value={inputRT} onChangeText={setInputRT} /></View>
              </View>
            )
      
          case 'third':
            return (
                <View style={styles.settingAkunArea} >
                    <ScrollView keyboardShouldPersistTaps={"handled"} >
                        <View style={styles.segmenWrapper}>
                            <Text style={styles.segmenTitle}>Biodata</Text>
                            <View style={styles.formGroup}>
                                {/*<Text style={styles.formLabel}>Username</Text>
                                 <View style={styles.inputWrapper}>
                                    <TextInput style={styles.textInput} placeholder={"Masukkan Username"} placeholderTextColor= 'gray' value={usernameEdit}  onFocus = {()=> onInputFocusHandler()} onBlur={() => onInputBlurHandler() } onChangeText = {(value) => setUsernameEdit(value)} onSubmitEditing={() => { inputNamaLengkap.focus()}} blurOnSubmit={false} returnKeyType="next"   ></TextInput>
                                </View> */}
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Nama Lengkap</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput style={styles.textInput} placeholder={"Masukkan Nama Lengkap"} placeholderTextColor= 'gray' value={nama_lengkapEdit} onFocus = {()=> onInputFocusHandler()} onBlur={() => onInputBlurHandler()} 
                                    onChangeText = { (value) => setNamaLengkapEdit(value) } onSubmitEditing={() => { inputNoTelepon.focus()}} ref={(input) => { setInputNamaLengkap(input) }} blurOnSubmit={false} returnKeyType="next"   ></TextInput>

                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>No. Telepon</Text>
                                <View style={styles.inputWrapper}>
                                    <Image source={iconIndo} style={styles.logoIndo} />
                                    <Text style={styles.kodeNegaraLabel}>+62</Text>
                                    <TextInput style={styles.textInput} placeholder={"Masukkan No. Telepon"} placeholderTextColor= 'gray' value={no_teleponEdit.replace("+62","")} keyboardType="numeric" onChangeText = { (value) => resetNoTelepon(value) } onFocus = {()=> onInputFocusHandler()} onBlur={() => onInputBlurHandler() } onSubmitEditing={() => { inputEmail.focus()}} ref={(input) => { setInputNoTelepon(input) }} blurOnSubmit={false} returnKeyType="next"  ></TextInput>

                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Email</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput style={styles.textInput} placeholder={"Masukkan Alamat Email"} placeholderTextColor= 'gray' value={emailEdit} onFocus = {()=> onInputFocusHandler()} onBlur={() => onInputBlurHandler() } onChangeText = {(value) => setEmailEdit(value)} ref={(input) => { setInputEmail(input) }}  ></TextInput>
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
                                        colorTheme="black"
                                        popupTitle="Pilih Provinsi"
                                        title="Pilih Provinsi"
                                        searchPlaceHolderText={"Cari disini"}
                                        selectedTitleStyle={{color:"black"}}
                                        inputStyle={{color:"black"}}
                                        data={arrProvinsi}
                                        onSelect={data => {
                                            loadKotaKabupaten(data[0]);
                                            setProvinsiEdit(data[0]);
                                        }}
                                        onRemoveItem={data => {
                                            setProvinsiEdit("");
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
                                        colorTheme="black"
                                        modalStyle={{color:"black"}}
                                        popupTitle="Pilih Kota/Kabupaten"
                                        title="Pilih Pilih Kota/Kabupaten"
                                        searchPlaceHolderText={"Cari disini"}
                                        selectedTitleStyle={{color:"black"}}
                                        inputStyle={{color:"black"}}
                                        data={arrKotaKabupaten}
                                        onSelect={data => {
                                            loadKecamatan(data[0]);
                                            setKotaKabupatenEdit(data[0]);
                                        }}
                                        onRemoveItem={data => {
                                            setKotaKabupatenEdit("");
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
                                        colorTheme="black"
                                        popupTitle="Pilih Kecamatan"
                                        title="Pilih Pilih Kecamatan"
                                        searchPlaceHolderText={"Cari disini"}
                                        selectedTitleStyle={{color:"black"}}
                                        inputStyle={{color:"black"}}
                                        data={arrKecamatan}
                                        onSelect={data => {
                                            loadKelurahanDesa(data[0])
                                            setKecamatanEdit(data[0]);
                                        }}
                                        onRemoveItem={data => {
                                            setKecamatanEdit("");
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
                                        colorTheme="black"
                                        popupTitle="Pilih Kelurahan/Desa"
                                        title="Pilih Pilih Kelurahan/Desa"
                                        searchPlaceHolderText={"Cari disini"}
                                        selectedTitleStyle={{color:"black"}}
                                        inputStyle={{color:"black"}}
                                        data={arrKelurahanDesa}
                                        onSelect={data => {
                                            setKelurahanDesaEdit(data[0]);
                                        }}
                                        onRemoveItem={data => {
                                            setKelurahanDesaEdit("");
                                        }}
                                        />
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Nama Jalan</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput style={styles.textInput} placeholder={"Masukkan Nama Jalan"} placeholderTextColor= 'gray' value={nama_jalanEdit} onFocus = {()=> onInputFocusHandler()} onBlur={() => onInputBlurHandler() } onChangeText = {(value) => setNamaJalanEdit(value)} onSubmitEditing={() => { inputRT.focus()}} ref={(input) => { setInputNamaJalan(input) }} blurOnSubmit={false} returnKeyType="next"   ></TextInput>
                                </View>
                            </View>
                            
                            <View style={{flexDirection:'row'}}>
                                <View style={{flex:1}}>
                                    <View style={styles.formGroup}>
                                        <Text style={styles.formLabel}>RT</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput style={styles.textInput} placeholder={"Masukkan Nomor"} placeholderTextColor= 'gray' value={rtEdit} onFocus = {()=> onInputFocusHandler()} onBlur={() => onInputBlurHandler() } onChangeText = {(value) => setRTEdit(value)} keyboardType="numeric"  onSubmitEditing={() => { inputRW.focus()}} ref={(input) => { setInputRT(input) }} blurOnSubmit={false} returnKeyType="next"  ></TextInput>
                                        </View>
                                    </View>
                                </View>

                                <View style={{flex:1}}>
                                    <View style={styles.formGroup}>
                                        <Text style={styles.formLabel}>RW</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput style={styles.textInput} placeholder={"Masukkan Nomor"} placeholderTextColor= 'gray' value={rwEdit} onFocus = {()=> onInputFocusHandler()} onBlur={() => onInputBlurHandler() } onChangeText = {(value) => setRWEdit(value)} keyboardType="numeric"  onSubmitEditing={() => { inputNoRumah.focus()}} ref={(input) => { setInputRW(input) }} blurOnSubmit={false} returnKeyType="next"  ></TextInput>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Nomor</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput style={styles.textInput} placeholder={"Masukkan Nomor"} placeholderTextColor= 'gray' value={no_rumahEdit} onFocus = {()=> onInputFocusHandler()} onBlur={() => onInputBlurHandler() } onChangeText = {(value) => setNoRumahEdit(value)} keyboardType="numeric" ref={(input) => { setInputNoRumah(input) }} onSubmitEditing={() => { editProfilHandler() }} ></TextInput>
                                </View>
                            </View>
                        </View> 

                        <TouchableOpacity style={styles.btnEditProfil} onPress={()=> {editProfilHandler()} }>
                            <Image style={styles.btnEditProfilIcon}  source={iconEdit} />
                            <Text style={styles.btnEditProfilLabel}>Edit</Text>
                        </TouchableOpacity>

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

                setUsernameEdit(json.username);
                setNamaLengkapEdit(json.nama_lengkap);
                setNoTeleponEdit(json.no_telepon);
                setEmailEdit(json.email);
                setProvinsiEdit(json.provinsi);
                setKotaKabupatenEdit(json.kota_kabupaten);
                setKecamatanEdit(json.kecamatan);
                setKelurahanDesaEdit(json.kelurahan_desa);
                setRWEdit(json.rw);
                setRTEdit(json.rt);
                setNamaJalanEdit(json.nama_jalan);
                setNoRumahEdit(json.no_rumah);
                setFotoProfil(json.foto_profil);
            }
            else{
                setAlert(true);
                setCancelButtonAlert(true);
                setConfirmButtonAlert(false);
                setCancelTextAlert("Tutup");
            }        
            loadProvinsi();
            loadKotaKabupaten(json.provinsi);
            loadKecamatan(json.kota_kabupaten);
            loadKelurahanDesa(json.kecamatan);
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

    const loadProvinsi = () => {
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

    const onInputFocusHandler = () => {
        //navigation.setOptions({tabBarVisible: false});
    }

    const onInputBlurHandler = () => {
       // navigation.setOptions({tabBarVisible: true});
    }

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

                            <View style={{flexDirection:'row', justifyContent:"space-between",marginTop:10}} >
                                <View style={{flex:1, alignItems:'center'}} >
                                    <Text style={styles.countLabel} >10</Text>
                                    <Text style={styles.ketLabel} >Karyawan</Text>
                                </View>

                                <View style={{flex:1, alignItems:'center'}} >
                                    <Text style={styles.countLabel} >670</Text>
                                    <Text style={styles.ketLabel}>Mengikuti</Text>
                                </View>

                                <View style={{flex:1, alignItems:'center'}} >
                                    <Text style={styles.countLabel} >1170</Text>
                                    <Text style={styles.ketLabel} >Pengikut</Text>
                                </View>
                            </View>
                            {/* <Text style={styles.alamatLabel}>{nama_jalan+no_rumah+rw+rt+kelurahan_desa+kecamatan+kota_kabupaten+provinsi}</Text> */}
                        </View>
                    </View>
                    
                    <View style={{flexDirection:'row', justifyContent:'space-around'}} >
                        <TouchableOpacity style={styles.btnRekeningSaya} onPress={()=> {loadRekeningBank()} }>
                            <Image style={styles.btnRekeningSayaIcon}  source={iconBankCardWhite} />
                            <Text style={styles.btnRekeningSayaLabel}>Daftar Rekening Saya</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnLogOut} onPress={()=> {
                            signOut();
                            getUser();
                        }}>
                            <Image style={styles.btnLogoutIcon}  source={iconLogOut} />
                            <Text style={styles.btnLogOutLabel}>LogOut</Text>
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
    btnLogOut : {
        flex:0.5,
        flexDirection:'row',
        backgroundColor:ORANGE,
        height:40,
        justifyContent:"space-around",
        paddingTop:7,
        paddingHorizontal:10
    },
    btnLogoutIcon:{
        width:22,
        height:22,
        alignItems:"flex-start",
    },
    btnLogOutLabel : {
        flex:1,
        fontSize:15,
        color:'white',
        marginLeft:10,
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
    logoIndo :{
        width:25,
        height:25,
        borderRadius:50/2
    },
    kodeNegaraLabel :{
        marginLeft:10,
        fontSize:13,
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
    btnEditProfil: {
        flexDirection:'row',
        backgroundColor:ORANGE,
        alignItems:"center",
        marginTop:20,
        marginBottom:30,
        height:40,
        borderRadius:10,
        justifyContent:"center"
       
    },
    btnEditProfilLabel : {
        fontSize:15,
        color:'white',
        marginLeft:10
    },
    btnEditProfilIcon:{
        width:22,
        height:22
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
    inputKeyword: {
        height: 40, borderRadius: 5, borderWidth: 1, borderColor: '#cacaca',
        paddingLeft: 8, marginHorizontal: 24, marginTop: 16, color:'black'
    },
})