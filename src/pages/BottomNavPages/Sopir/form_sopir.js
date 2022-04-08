/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable prettier/prettier */
import DateTimePicker from '@react-native-community/datetimepicker';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import CONSTANTS from '../../../assets/constants';
import iconCamera from '../../../assets/icon/camera.png';
import iconImage from '../../../assets/icon/image.png';
import iconSave from '../../../assets/icon/save.png';
import ProsesModal from '../../../components/ProsesModal';

const base_url = CONSTANTS.CONFIG.BASE_URL;

const FormSopir = ({route,navigation } ) => {
    let day   = new Date().getDate();
    let month = new Date().getMonth()+1;
    let year  = new Date().getFullYear();
    if(day.toString().length == 1 ) day = "0"+day;
    if(month.toString().length == 1 ) month = "0"+month;

    const { id_register_sopir1, title } = route.params;
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [id_register_sopir, setIdRegisterSopir] = useState(id_register_sopir1);
    const [nama_unik, setNamaUnik] = useState("");
    const [tempat_lahir, setTempatLahir] = useState("");
    const [no_hp, setNoHp] = useState("");
    const [tanggal_lahir, setTanggalLahir] = useState(year+"-"+month+"-"+day);
    const [jenis_kelamin, setJenisKelamin] = useState("Laki-laki");
    const [no_sim, setNoSIM] = useState("");
    const [jenis_sim, setJenisSIM] = useState("A");
    const [tanggal_pembuatan_sim, setTanggalPembuatanSIM] = useState(year+"-"+month+"-"+day);
    const [tanggal_berakhir_sim, setTanggalBerakhirSIM] = useState(year+"-"+month+"-"+day);
    const [jenis_datepicker, setJenisDatePicker] = useState("");
    const [file_sopir, setFileSopir] = useState("");
    const [file_sim, setFileSIM] = useState("");
    const [file_ktp, setFileKTP] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    useEffect (() => {
        if(id_register_sopir1 != "") getDetailSopir();
    },[id_register_sopir]);

    const getDetailSopir = () => {
        const params = {
            id_register_sopir,
        }
        setModalVisible(true);
        Axios.get(base_url+'Sopir/get_api_detail_sopir', {params})
        .then(response => {
            setIdRegisterSopir(response.data[0].id_register_sopir);
            setNamaUnik(response.data[0].nama_unik);
            setTempatLahir(response.data[0].tempat_lahir);
            let tanggal_lahir1 = year+"-"+month+"-"+day;
            if( response.data[0].tanggal_lahir != "0000-00-00" ) tanggal_lahir1 = response.data[0].tanggal_lahir ;
            setTanggalLahir(tanggal_lahir1);
            setNoHp(response.data[0].no_hp);
            setJenisKelamin(response.data[0].jenis_kelamin);
            setNoSIM(response.data[0].no_sim);
            setJenisSIM(response.data[0].jenis_sim);
            let tanggal_pembuatan_sim1 = year+"-"+month+"-"+day;
            if( response.data[0].tanggal_pembuatan_sim != "0000-00-00" ) tanggal_pembuatan_sim1 = response.data[0].tanggal_pembuatan_sim;
            setTanggalPembuatanSIM(tanggal_pembuatan_sim1);
            let tanggal_berakhir_sim1 = year+"-"+month+"-"+day;
            if( response.data[0].tanggal_berakhir_sim != "0000-00-00" ) tanggal_berakhir_sim1 = response.data[0].tanggal_berakhir_sim;
            setTanggalBerakhirSIM(tanggal_berakhir_sim1);
            let file_sopir,file_sim,file_ktp ="";
            if(response.data[0].file_sopir != "") {
                file_sopir = base_url+"assets/upload/file sopir/"+response.data[0].file_sopir
            }else file_sopir="";
            if(response.data[0].file_sim != "") {
                file_sim = base_url+"assets/upload/file sim/"+response.data[0].file_sim
            }else file_sim="";
            if(response.data[0].file_ktp != "") {
                file_ktp = base_url+"assets/upload/file ktp/"+response.data[0].file_ktp
            }else file_ktp="";
            setFileSopir(file_sopir);
            setFileSIM(file_sim);
            setFileKTP(file_ktp);
            setModalVisible(false);
        })
    }

    const onChange = (event, selectedDate) => {
         const currentDate = selectedDate || date;
        //  alert(currentDate)
         setShow(Platform.OS === 'ios');
         let day   = currentDate.getDate();
         let month = currentDate.getMonth()+1;
         let year  = currentDate.getFullYear();
         
         if(month.toString().length == 1 ) month = "0"+month;
         if(day.toString().length == 1 ) day = "0"+day;
         setDate(date);
         if(jenis_datepicker == "tanggal_lahir" ) {
            setTanggalLahir(year+"-"+month+"-"+day);
            setDate(new Date(tanggal_lahir));
         }
         else if(jenis_datepicker == "tanggal_pembuatan_sim" ) {
            setTanggalPembuatanSIM(year+"-"+month+"-"+day);
            setDate(new Date(tanggal_pembuatan_sim));
         }
         else if(jenis_datepicker == "tanggal_berakhir_sim" ) {
            setTanggalBerakhirSIM(year+"-"+month+"-"+day);
            setDate(new Date(tanggal_berakhir_sim));
         }
        //  setDate(date);
    };
  
    const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    };
  
    const showDatepicker = (a) => {
        //alert(jenis_datepicker)
        if(a == "tanggal_lahir" ) {
            setDate(new Date(tanggal_lahir));
        }
        else if(a == "tanggal_pembuatan_sim" ) {
            setDate(new Date(tanggal_pembuatan_sim));
        }
        else if(a == "tanggal_berakhir_sim" ) {
            setDate(new Date(tanggal_berakhir_sim));
        }
        showMode('date');
    };
  
    var radio_props = [
        {label: 'Laki-laki', value: 'Laki-laki' },
        {label: 'Perempuan', value: 'Perempuan' }
    ];
    
    var radio_props1 = [
        {label: 'A', value: 'A' },
        {label: 'BI', value: 'BI' },
        {label: 'BII', value: 'BII' },
        {label: 'BII Umum', value: 'BII Umum' },
    ];

    const RenderFoto = (props) => {
        if(props.src != "") {
            if(props.src.uri) {
                return (
                    <Image style={styles.tampungFoto} source={{uri: props.src.uri}} />
                )
            }
            else{
                return (
                    <Image style={styles.tampungFoto} source={{uri: props.src}} />
                )
            }
        }
        else {
            return (
                <View/>
            )
        }
    }

    const UploadArea = (props) => {
        return(
            <View style={styles.uploadFotoWrapper}>
                <TouchableOpacity style={styles.btnOpenGallery} onPress={ () => launchImageLibrary(props.jenis_file) } >
                    {/* <Text style={styles.btnOpenGalleryText}>Pilih Dari Galeri </Text> */}
                    <Image source={iconImage} style={styles.buttonIcon} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnTakePhoto} onPress={ () => launchCamera(props.jenis_file) }>
                    {/* <Text style={styles.btnTakePhotoText}>Ambil Photo </Text> */}
                    <Image source={iconCamera} style={styles.buttonIcon} />
                </TouchableOpacity>
            </View>
        )
    }

    const launchImageLibrary = (jenis_file) => {
        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.launchImageLibrary(options, (response) => {
          console.log('Response = ', response);
    
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            alert(response.customButton);
          } else {
            const source = { uri: response.uri };
            console.log('response', JSON.stringify(response));
           
            if(jenis_file == 'File Sopir'){
                setFileSopir(response.assets[0]);
            }
            else if(jenis_file == 'File SIM'){
                setFileSIM(response.assets[0]);
            }
            else if(jenis_file == 'File KTP'){
                setFileKTP(response.assets[0]);
            }
          }
        });
    
    }

    const launchCamera = (jenis_file) => {
        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.launchCamera(options, (response) => {
          console.log('Response = ', response);
    
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            alert(response.customButton);
          } else {
            const source = { uri: response.uri };
            console.log('response', JSON.stringify(response));
            if(jenis_file == 'File Sopir'){
                setFileSopir(response.assets[0]);
            }
            else if(jenis_file == 'File SIM'){
                setFileSIM(response.assets[0]);
            }
            else if(jenis_file == 'File KTP'){
                setFileKTP(response.assets[0]);
            }
          }
        });
    
    }

    const submit = () => {
        if(nama_unik == "") {
            Alert.alert("Pesan Dari AdminBES", "Nama Lengkap Tidak Boleh Kosong" );
        }
        else if(tempat_lahir == "") {
            Alert.alert("Pesan Dari AdminBES", "Tempat Lahir Tidak Boleh Kosong" );
        }
        else if(nama_unik == "") {
            Alert.alert("Pesan Dari AdminBES", "No. Hp Tidak Boleh Kosong" );
        }
        else if(no_sim == "") {
            Alert.alert("Pesan Dari AdminBES", "No. SIM Tidak Boleh Kosong" );
        }
        else if(file_sim == "") {
            Alert.alert("Pesan Dari AdminBES", "File SIM Tidak Boleh Kosong" );
        }
        else if(file_ktp == "") {
            Alert.alert("Pesan Dari AdminBES", "File KTP Tidak Boleh Kosong" );
        }
        else {
            Alert.alert(
                "Pesan Dari AdminBES",
                "Simpan ke Database?",
                [
                {
                    text: "Simpan",
                    onPress: () => prosesSimpan(),
                    style: "default",
                },
                {
                    text: "Batal",
                    style: "cancel",
                },
                ],
                {
                cancelable: true
                }
            );
        }
    }

    const createFormData = (file_sopir, file_sim, file_ktp, body) => {
        const data = new FormData();
        if(file_sopir == "" ){
        }
        else {
            if(file_sopir.fileName) {
                data.append("file_sopir", {
                name: file_sopir.fileName,
                type: file_sopir.type,
                uri:
                    Platform.OS === "android" ? file_sopir.uri : file_sopir.uri.replace("file://", "")
                });
            }
        }

        if(file_sim == "" ){
        }
        else{
            if(file_sim.fileName) {
                data.append("file_sim", {
                    name: file_sim.fileName,
                    type: file_sim.type,
                    uri:
                    Platform.OS === "android" ? file_sim.uri : file_sim.uri.replace("file://", "")
                });
            }
        }
        if(file_ktp == "" ){
        }
        else{
            if(file_ktp.fileName) {
                data.append("file_ktp", {
                    name: file_ktp.fileName,
                    type: file_ktp.type,
                    uri:
                    Platform.OS === "android" ? file_ktp.uri : file_ktp.uri.replace("file://", "")
                });
            }
        }

        Object.keys(body).forEach(key => {
          data.append(key, body[key]);
        });
        console.log(data);
        return data;
    };

    const prosesSimpan = () => {
        setModalVisible(true);
        const data = {
            id_register_sopir,
            nama_unik,
            tempat_lahir,
            no_hp,
            tanggal_lahir,
            jenis_kelamin,
            no_sim,
            jenis_sim,
            tanggal_pembuatan_sim,
            tanggal_berakhir_sim
        }
        //console.log(data);
        fetch(base_url+"Sopir/api_add_post", {
            method: "POST",
            body: createFormData(file_sopir, file_sim, file_ktp, data),
            headers: {
                'Content-Type': 'multipart/form-data; ',
            },
        })
        .then(response => response.json())
        .then(response => {
                if(response.response == 1) {
                    console.log("Data Berhasil Disimpan", response);
                    Alert.alert("Pesan Dari AdminBES", "Data Berhasil Disimpan");
                }
                else{
                    console.log("Data Gagal Disimpan", response);
                    Alert.alert("Pesan Dari AdminBES", "Data Gagal Disimpan");
                }
                if(id_register_sopir == ""){
                    refreshForm();
                }
                else{
                    setModalVisible(false);
                }
        })
        .catch(error => {
            console.log("Gagal Terhubung ke Server", error);
            Alert.alert("Pesan Dari AdminBES", "Gagal Terhubung ke Server");
            setModalVisible(false);
        });
    }

    const refreshForm = () => {
        let day   = new Date().getDate();
        let month = new Date().getMonth()+1;
        let year  = new Date().getFullYear();
        if(month.toString().length == 1 ) month = "0"+month;
        if(day.toString().length == 1 ) day = "0"+day;
        setNamaUnik("");
        setTempatLahir("");
        setNoHp("");
        setTanggalLahir(year+"-"+month+"-"+day);
        setJenisKelamin("Laki-laki");
        setNoSIM("");
        setJenisSIM("A");
        setTanggalPembuatanSIM(year+"-"+month+"-"+day);
        setTanggalBerakhirSIM(year+"-"+month+"-"+day);
        setFileSopir("");
        setFileSIM("");
        setFileKTP("");
        setModalVisible(false);
    }
    const back = () => {
        navigation.goBack();
    }

    return(
        <View style={styles.contentWrapper}>
            <ProsesModal setModalVisible={setModalVisible} modalVisible={modalVisible} />
            <View >
                <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => back() } >
                            <Icon name="arrow-left" type="ionicon" size={26} color="white" style={{marginRight:15, marginLeft:10}} />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>{title}</Text>
                        <View style={styles.modalButton}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonSimpan]}
                                onPress={submit}
                            >
                                <Image  source={iconSave} style={{height:26,width:26}} />
                            </TouchableOpacity>

                        </View>
                </View>
                <ScrollView style={{}}>
                    <View style={styles.modalContent} >
                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Nama Lengkap</Text>
                            <TextInput style={styles.textInput} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={nama_unik} onChangeText={(value) => setNamaUnik(value) } />
                        </View>

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Tempat Lahir</Text>
                            <TextInput style={styles.textInput} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tempat_lahir} onChangeText={(value) => setTempatLahir(value) } />
                        </View>

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>No. Hp</Text>
                            <TextInput style={styles.textInput} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={no_hp} onChangeText={(value) => setNoHp(value) } keyboardType="numeric" />
                        </View>

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Tanggal Lahir</Text>
                            <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_lahir");showDatepicker("tanggal_lahir");} }  >
                                <TextInput style={styles.textInput} placeholder="Wajib Diisi"  editable = {false} placeholderTextColor= 'gray' value={tanggal_lahir} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Jenis Kelamin</Text>
                            <RadioForm
                            formHorizontal={true}
                            animation={true}
                            >
                            {
                                radio_props.map((obj, i) => (
                                <RadioButton labelHorizontal={true} key={i} >
                                    <RadioButtonInput
                                    obj={obj}
                                    index={i}
                                    isSelected={jenis_kelamin === obj.value }
                                    onPress={(value) => setJenisKelamin(value)}
                                    borderWidth={1}
                                    buttonInnerColor={'#dc3545'}
                                    buttonOuterColor={jenis_kelamin === obj.value ? '' : '#000'}
                                    buttonSize={20}
                                    buttonOuterSize={20}
                                    buttonStyle={{}}
                                    buttonWrapStyle={{marginLeft: 10}}
                                    />
                                    
                                    <RadioButtonLabel
                                    obj={obj}
                                    index={i}
                                    labelHorizontal={true}
                                    onPress={(value) => setJenisKelamin(value)}
                                    labelStyle={{fontSize: 15, color: 'black'}}
                                    labelWrapStyle={{}}
                                    />
                                </RadioButton>
                                ))
                            }  
                            </RadioForm>
                        </View>
                        
                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>No. SIM</Text>
                            <TextInput style={styles.textInput} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={no_sim} onChangeText={(value) => setNoSIM(value) } keyboardType="numeric" />
                        </View>
                        
                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Jenis SIM</Text>
                            <RadioForm
                            formHorizontal={true}
                            animation={true}
                            >
                            {
                                radio_props1.map((obj, i) => (
                                <RadioButton labelHorizontal={true} key={i} >
                                    <RadioButtonInput
                                    obj={obj}
                                    index={i}
                                    isSelected={jenis_sim === obj.value }
                                    onPress={(value) => setJenisSIM(value)}
                                    borderWidth={1}
                                    buttonInnerColor={'#dc3545'}
                                    buttonOuterColor={jenis_sim === obj.value ? '' : '#000'}
                                    buttonSize={20}
                                    buttonOuterSize={20}
                                    buttonStyle={{}}
                                    buttonWrapStyle={{marginLeft: 10}}
                                    />
                                    <RadioButtonLabel
                                    obj={obj}
                                    index={i}
                                    labelHorizontal={true}
                                    onPress={(value) => setJenisSIM(value)}
                                    labelStyle={{fontSize: 15, color: 'black'}}
                                    labelWrapStyle={{}}
                                    />
                                </RadioButton>
                                ))
                            }  
                            </RadioForm>
                        </View>

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Tanggal Pembuatan SIM</Text>
                            <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_pembuatan_sim");showDatepicker("tanggal_pembuatan_sim");} }  >
                                <TextInput style={styles.textInput} placeholder="Wajib Diisi"  editable = {false} placeholderTextColor= 'gray' value={tanggal_pembuatan_sim} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Tanggal Berakhir SIM</Text>
                            <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_berakhir_sim");showDatepicker("tanggal_berakhir_sim"  );} }  >
                                <TextInput style={styles.textInput} placeholder="Wajib Diisi"  editable = {false} placeholderTextColor= 'gray' value={tanggal_berakhir_sim} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Foto Sopir (optional)</Text>
                            <View style={styles.tampungFotoWrapper}>
                                    <RenderFoto src={file_sopir} /> 
                            </View>
                            <View style={styles.uploadFotoWrapper}>
                                <UploadArea jenis_file ="File Sopir"   />
                            </View>
                        </View>    
                        
                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Foto SIM (wajib)</Text>   
                            <View style={styles.tampungFotoWrapper}>
                                <RenderFoto src={file_sim} /> 
                            </View>
                            <View style={styles.uploadFotoWrapper}>
                                <UploadArea jenis_file ="File SIM"  />
                            </View>
                        </View> 

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Foto KTP (wajib)</Text>   
                            <View style={styles.tampungFotoWrapper}>
                                <RenderFoto src={file_ktp} /> 
                            </View>
                            <View style={styles.uploadFotoWrapper}>
                                <UploadArea jenis_file ="File KTP" />
                            </View>
                        </View> 
                        <View style={{marginBottom:100}} ></View>
                    </View>
                </ScrollView> 
            </View>

            {show && (
                <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
                />
            )}
        </View>
    );
  };

export default FormSopir;

const styles = StyleSheet.create({
    //FORM SOPIR
    contentWrapper: {
        flex: 1,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalTitle: {
        fontSize:17,
        color:"white",
        textAlign: "center",
        marginLeft:10
    },
    modalContent:{
        flex:1,
    },
    modalHeader:{
        height:64,
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:15,
        backgroundColor:"#001f3f",
        alignItems:"center"
    },
    modalButton :{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-end'
    },
    button: {
        borderRadius: 5,
        padding: 3,
        elevation: 2
    },
    buttonSimpan: {
        backgroundColor: "#28a745",
        marginRight:15
    },
    buttonClose: {
        backgroundColor: "#dc3545",
        marginRight:10
    },
    formGroup:{
        paddingHorizontal:12,
        marginBottom:20
    },
    textInput:{
        borderWidth:1,
        borderColor:"gray",
        color:"black",
        borderRadius:5,
        fontSize:15
    },
    formLabel : {
        color:'black',
        fontSize:15,
        marginBottom:10
    },
    uploadFotoWrapper : {
        flexDirection : 'row',
        alignItems:'center',
        justifyContent: 'space-around'
    },
    btnOpenGallery : {
        backgroundColor:'#3d9970',
        height:40,
        width:90,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20,
        marginHorizontal:5
    },
    btnOpenGalleryText :{
        color:'white'
    },
    btnTakePhoto : {
        backgroundColor:'darkorange',
        height:40,
        width:90,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20,
        marginHorizontal:5,
    },
    btnTakePhotoText :{
        color:'white'
    },
    tampungFotoWrapper: {
        flex:1,
        alignItems:"center",
        marginBottom:10
    },
    tampungFoto:{
        height:130,
        width:130,
        borderRadius:8,
        marginBottom:0,
    },
    buttonIcon :{
        width:26,
        height:26
    }
    //FORM SOPIR

})
