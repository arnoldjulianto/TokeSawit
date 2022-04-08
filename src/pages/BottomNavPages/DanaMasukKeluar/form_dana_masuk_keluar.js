/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable prettier/prettier */
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import CONSTANTS from '../../../assets/constants';
import iconCamera from '../../../assets/icon/camera.png';
import iconImage from '../../../assets/icon/image.png';
import { DanaMasukKeluarContext } from '../../../components/Context';
import ProsesModal from '../../../components/ProsesModal';
import Axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'

const base_url = CONSTANTS.CONFIG.BASE_URL;
const DANGER =CONSTANTS.COLOR.DANGER;
const NAVY =CONSTANTS.COLOR.NAVY;
const ORANGE =CONSTANTS.COLOR.ORANGE;
const SUCCESS =CONSTANTS.COLOR.SUCCESS;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const FormDanaMasukKeluar = (props) => {
    let radio_props = [
        {label: 'Dana Masuk', value: 'Dana Masuk' },
        {label: 'Dana Keluar', value: 'Dana Keluar' }
    ];
    const [modalVisible, setModalVisible] = useState(false);
    let day   = new Date().getDate();
    let month = new Date().getMonth()+1;
    let year  = new Date().getFullYear();
    if(day.toString().length == 1 ) day = "0"+day;
    if(month.toString().length == 1 ) month = "0"+month;
    const [refreshForm, setRefreshForm] = useState(false);
    const [new_no_dana_masuk_keluar, setNewNoDanaMasukKeluar] = useState("");
    const [no_dana_masuk_keluar, setNoDanaMasukKeluar] = useState(props.no_dana_masuk_keluar);
    const [tanggal_transaksi, setTanggalTransaksi] = useState(year+"-"+month+"-"+day);
    const [tanggal_nota, setTanggalNota] = useState(year+"-"+month+"-"+day);
    const [jenis_dana, setJenisDana] = useState("");
    const [pelaksana, setPelaksana] = useState("");
    const [default_pelaksana, setDefaultPelaksana] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [id_satuan, setIdSatuan] = useState("");
    const [nilai, setNilai] = useState("");
    const [keterangan_dana_masuk_keluar, setKeteranganDanaMasukKeluar] = useState("");
    const [file_dana_masuk_keluar, setFileDanaMasukKeluar] = useState("");
    const [data_satuan, setDataSatuan] = useState([]);
    const [data_pelaksana, setDataPelaksana] = useState([]);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [jenis_datepicker, setJenisDatePicker] = useState("");


    const formatAngka = (angka) => {
        if(angka != "") {
            let separator, prefix = "";
            let number_string = angka.replace(/[^,\d]/g, '').toString(),
            split   	= number_string.split(','),
            sisa     	= split[0].length % 3,
            rupiah     	= split[0].substr(0, sisa),
            ribuan     	= split[0].substr(sisa).match(/\d{3}/gi);
         
            // tambahkan titik jika yang di input sudah menjadi angka ribuan
            if(ribuan){
                separator = sisa ? '.' : '';
                rupiah += separator + ribuan.join('.');
            }
            rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
            if(angka < 0) {
                rupiah = "-"+rupiah;
            }
            return prefix == undefined ? rupiah : (rupiah ? '' + rupiah : '');
        }
        else{
            let prefix, rupiah = "";
            return prefix == undefined ? rupiah : (rupiah ? '' + rupiah : '');
        }
    }

    useEffect (() => {
        setRefreshForm(props.refreshForm);
        if(refreshForm){
            doRefreshForm();
        }
        
        if(no_dana_masuk_keluar != ""){
            getDanaMasukKeluar();
        }
        getDataSatuan();
    },[refreshForm,no_dana_masuk_keluar]);

    useEffect (() => {
        getDataSatuan();
    },[]);

    const doRefreshForm = () => {

    }

    const getDanaMasukKeluar = () => {
        setModalVisible(true);
        const params = {
            no_dana_masuk_keluar,
        }
        Axios.get(base_url+'DanaMasukKeluar/get_api_edit_dana_masuk_keluar', {params} )
        .then(response => {
            setNewNoDanaMasukKeluar(response.data[0].new_no_dana_masuk_keluar);
            setTanggalTransaksi(response.data[0].tanggal_transaksi);
            setTanggalNota(response.data[0].tanggal_nota);
            setJenisDana(response.data[0].jenis_dana);
            setPelaksana(response.data[0].pelaksana);
            setDefaultPelaksana(response.data[0].default_pelaksana);
            setQuantity(formatAngka(response.data[0].quantity.replace('.',',')));
            setIdSatuan(response.data[0].id_satuan);
            setNilai(formatAngka(response.data[0].nilai));
            setKeteranganDanaMasukKeluar(response.data[0].keterangan_dana_masuk_keluar);
            if(response.data[0].file_dana_masuk_keluar != "") {
                setFileDanaMasukKeluar(base_url+"assets/upload/file dana masuk keluar/"+response.data[0].file_dana_masuk_keluar);
            }
            setModalVisible(false);
        })
        .catch(function (error) {
            Alert.alert(alert_title, "Terjadi Kesalahan\n"+error);
            setModalVisible(false);
        })
    }

    const getDataSatuan = () => {
        if(id_satuan == "") {
            setModalVisible(true);
            Axios.get(base_url+'DanaMasukKeluar/api_get_data_satuan')
            .then(response => {
                setDataSatuan(response.data);
                //setModalVisible(false);
                console.log(response.data);
                getDataPelaksana();
            })
            .catch(function (error) {
                Alert.alert(alert_title, "Terjadi Kesalahan\n"+error);
                setModalVisible(false);
            })
        }
    }

    const getDataPelaksana = () => {
        setModalVisible(true);
        Axios.get(base_url+'DanaMasukKeluar/api_get_data_pelaksana')
        .then(response => {
            setDataPelaksana(response.data);
            setModalVisible(false);
            console.log(data_pelaksana);
        })
        .catch(function (error) {
            Alert.alert(alert_title, "Terjadi Kesalahan\n"+error);
            setModalVisible(false);
        })
    }

    //DATEPICKER
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    
    const showDatePicker = (a, mode) => {
          //alert(jenis_datepicker)
          if(a == "tanggal_transaksi" ) {
            setDate(new Date(tanggal_transaksi));
          }
          else if(a == "tanggal_nota" ) {
            setDate(new Date(tanggal_nota));
          }
          showMode(mode);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        day   = currentDate.getDate();
        month = currentDate.getMonth()+1;
        year  = currentDate.getFullYear();
        
        if(month.toString().length == 1 ) month = "0"+month;
        if(day.toString().length == 1 ) day = "0"+day;
        setDate(date);
        if(jenis_datepicker == "tanggal_transaksi" ) {
           setTanggalTransaksi(year+"-"+month+"-"+day);
           setDate(new Date(tanggal_transaksi));
        }
        else if(jenis_datepicker == "tanggal_nota" ) {
            setTanggalNota(year+"-"+month+"-"+day);
            setDate(new Date(tanggal_nota));
        }
       //  setDate(date);
    };
   //DATEPICKER

    const goback = () =>{
        props.navigation.goBack();
    }

    const RenderFoto = (props) => {
        if(props.src != "") {
            if(props.src.uri) {
                return (
                    <Image style={styles.tampungFoto} source={{uri: props.src.uri}} resizeMethod="resize"  />
                )
            }
            else{
                return (
                    <Image style={styles.tampungFoto} source={{uri: props.src}} resizeMethod="resize"  />
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
                    <Image source={iconImage} style={styles.buttonIcon} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnTakePhoto} onPress={ () => launchCamera(props.jenis_file) }>
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
        
            setFileDanaMasukKeluar(response.assets[0]);
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
            setFileDanaMasukKeluar(response.assets[0]);
        }
        });
    }

    //CONTEXT
    const { getDataForm } = React.useContext(DanaMasukKeluarContext);
    const submit = () => {
        getDataForm(tanggal_transaksi, tanggal_nota, jenis_dana, pelaksana, quantity, id_satuan, nilai, keterangan_dana_masuk_keluar, file_dana_masuk_keluar, true)
        console.log(pelaksana);
    }
    const refresh = () => {
        
    }
    //CONTEXT

    const convertQuantity = (value) => {
        value = formatAngka(value.toString());
        setQuantity(value);
        console.log(pelaksana);
    }

    const convertNilai = (value) => {
        value = formatAngka(value.toString());
        setNilai(value);
    }

    const [loading, setLoading] = useState(false)
    const dropdownController = useRef(null)
    const searchRef = useRef(null)

    const getSuggestions = useCallback(async (q) => {
        setPelaksana(q);
        setLoading(true);
        const params = {
            search : q
        }
        Axios.get(base_url+'DanaMasukKeluar/api_get_autocomplete_data_pelaksana', {params})
        .then(response => {
            setDataPelaksana(response.data);
            setLoading(false)
            console.log(data_pelaksana);
        })
        .catch(function (error) {
            Alert.alert(alert_title, "Terjadi Kesalahan\n"+error);
            setModalVisible(false);
        })
    }, [])

    const setSelectedItem = (item) => {
        if(item != null){
            //alert("selected!"+item.id)
            setPelaksana(item.title);
            console.log(pelaksana);
        }
    }

    return(
        <View style={styles.contentWrapper}>
                 {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    maximumDate={new Date()}
                    />
                )}
                <View style={styles.topBarHeader}>
                    <TouchableOpacity onPress={() => goback() } >
                        <Icon name="arrow-left" type="ionicon" size={26} color="white" style={{marginRight:0, marginLeft:10}} />
                    </TouchableOpacity>
                    
                    <Text style={styles.topBarTitle}>{props.title}
                        {no_dana_masuk_keluar != "" &&
                            <Text style={{fontSize:14}}>{"\n"}No. : {no_dana_masuk_keluar}</Text>
                        }
                    </Text>
                </View>
                <ScrollView>
                    <View style={styles.content} >
                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Pilih Salah Satu <Text style={{fontSize:13,fontStyle:"italic",color:DANGER}}>* (wajib diisi)</Text></Text>
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
                                    isSelected={jenis_dana === obj.value }
                                    onPress={(value) => setJenisDana(value)}
                                    borderWidth={1}
                                    buttonInnerColor={'#dc3545'}
                                    buttonOuterColor={jenis_dana === obj.value ? '' : '#000'}
                                    buttonSize={20}
                                    buttonOuterSize={20}
                                    buttonStyle={{}}
                                    buttonWrapStyle={{marginLeft: 10}}
                                    />
                                    
                                    <RadioButtonLabel
                                    obj={obj}
                                    index={i}
                                    labelHorizontal={true}
                                    onPress={(value) => setJenisDana(value)}
                                    labelStyle={{fontSize: 15, color: 'black'}}
                                    labelWrapStyle={{}}
                                    />
                                </RadioButton>
                                ))
                            }  
                            </RadioForm>
                        </View>
                        
                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Tanggal Transaksi</Text>
                            <TouchableOpacity  onPress={() => {setJenisDatePicker("tanggal_transaksi");showDatePicker("tanggal_transaksi", "date" )} } style={{flex:1}} >
                                <TextInput style={styles.textInput} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_transaksi} editable={false} />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Tanggal Nota</Text>
                            <TouchableOpacity  onPress={() => {setJenisDatePicker("tanggal_nota");showDatePicker("tanggal_nota", "date" )} } style={{flex:1}} >
                                <TextInput style={styles.textInput} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_nota} editable={false} />
                            </TouchableOpacity>
                        </View> 

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Pelaksana</Text>
                            <AutocompleteDropdown
                                clearOnFocus={true}
                                closeOnBlur={false}
                                closeOnSubmit={false}
                                onSelectItem={(item) => setSelectedItem(item)}
                                //onChangeText={getSuggestions}
                                dataSet={data_pelaksana}
                                initialValue={pelaksana}
                                ref={searchRef}
                                controller={(controller) => {
                                  dropdownController.current = controller
                                }}
                                suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
                                loading={loading}
                                useFilter={false} // prevent rerender twice
                                textInputProps={{
                                    onChangeText:getSuggestions,
                                    value:pelaksana,
                                    placeholder:"Wajib diisi",
                                    placeholderTextColor:"gray",
                                    style: {
                                        borderWidth:1,
                                        borderColor:"gray",
                                        color:"black",
                                        borderRadius:5,
                                        fontSize:15,
                                        backgroundColor:"transparent"
                                    }
                                }}
                                rightButtonsContainerStyle={{
                                    borderRadius: 25,
                                    right: 8,
                                    height: 30,
                                    top: 10,
                                    alignSelfs: "center",
                                    backgroundColor: "transparent"
                                }}
                                inputContainerStyle={{
                                    backgroundColor: "transparent",
                                    color:"black"
                                }}
                                suggestionsListContainerStyle={{
                                    backgroundColor: "white",
                                    color:"black"
                                }}
                                containerStyle={{ flexGrow: 1, flexShrink: 1 }}
                                renderItem={(item, text) => (
                                    <Text style={{ color: NAVY, padding: 15 }}>{item.title}</Text>
                                  )}
                                  ChevronIconComponent={
                                    <Icon name="chevron-down" size={18} color={NAVY} />
                                  }
                                  inputHeight={50}
                                  //showChevron={false}
                                  showClear={false}
                            />
                        </View>
                        

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Quantity</Text>
                            <View style={styles.quantityWrapper}>
                                <TextInput style={styles.textInputQuantity} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={quantity} onChangeText={(value) => convertQuantity(value)}  />
                                <View>
                                    <TouchableOpacity style={styles.selectSatuan}>
                                        <Picker
                                            selectedValue={id_satuan}
                                            style={{ height: 50, width:130 }}
                                            onValueChange={(itemValue) => setIdSatuan(itemValue)}
                                        >
                                            {
                                                data_satuan.map((data) => (
                                                    <Picker.Item label={data.nama_satuan} value={data.id_satuan} />
                                                ))
                                            }
                                        </Picker>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Nilai</Text>
                            <TextInput style={styles.textInput} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={nilai} onChangeText={(value) => convertNilai(value) } keyboardType="numeric" />
                        </View>

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Keterangan</Text>
                            <TextInput style={styles.textInput} placeholder="Optional" placeholderTextColor= 'gray' value={keterangan_dana_masuk_keluar} onChangeText={(value) => setKeteranganDanaMasukKeluar(value) } multiline={true} numberOfLines={5}  />
                        </View>
                        
                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Foto (optional)</Text>   
                            <View style={styles.tampungFotoWrapper}>
                                <RenderFoto src={file_dana_masuk_keluar} /> 
                            </View>
                            <View style={styles.uploadFotoWrapper}>
                                <UploadArea jenis_file ="File Dana Masuk Keluar" />
                            </View>
                        </View> 
                        
                        <View style={{marginBottom:50}} ></View>
                        <View style={styles.formGroup} >
                            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                <TouchableOpacity style={styles.btnSave} onPress={()=> submit()}   >
                                        <Icon name="save" type="ionicon" size={20} color="white" />
                                        <Text style={{color:'white', marginLeft:10}}>Simpan</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btnRefresh} onPress={()=> refresh()}   >
                                        <Icon name="undo" type="ionicon" size={20} color="white" />
                                        <Text style={{color:'white', marginLeft:10}}>Refresh</Text>
                                </TouchableOpacity>
                            </View>
                        </View> 

                    </View>
                    <ProsesModal setModalVisible={setModalVisible} modalVisible={modalVisible} /> 
                </ScrollView>
        </View>

    );
}

export default FormDanaMasukKeluar;

const styles = StyleSheet.create({
    contentWrapper: {
        flex: 1,
    },
    dateTimeWrapper : {
        flex:1,
        flexDirection:"row",
        justifyContent :"space-between"
    },
    quantityWrapper : {
        flex:1,
        flexDirection:"row",
        justifyContent :"space-between",
    },
    selectSatuan : {
        borderWidth:1, 
        alignItems:'center', 
        justifyContent:'center',
        borderColor:"gray",
        borderRadius:5,
        flex:1,
        marginRight:0
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    topBarTitle: {
        fontSize:17,
        color:"white",
        marginLeft:20
    },
    content:{
        flex:1,
    },
    topBarHeader:{
        height:64,
        flexDirection:"row",
        marginBottom:15,
        backgroundColor:DANGER,
        alignItems:"center"
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
    textInputQuantity : {
        borderWidth:1,
        borderColor:"gray",
        color:"black",
        borderRadius:5,
        fontSize:15,
        width:"60%"
    },
    formLabel : {
        color:'black',
        fontSize:15,
        marginBottom:10
    },
    btnAddRow : {
        backgroundColor:DANGER,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:10,
        paddingVertical:5
    },
    btnSave : {
        flex:1,
        flexDirection:'row',
        backgroundColor:SUCCESS,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:10,
        marginRight: 10
    },
    btnRefresh: {
        flex:1,
        flexDirection:'row',
        backgroundColor:ORANGE,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:10,
        height:50,
        paddingVertical:5,
        marginLeft:10
    },
    uploadFotoWrapper : {
        flexDirection : 'row',
        alignItems:'center',
        justifyContent: 'space-around'
    },
    btnOpenGallery : {
        backgroundColor:NAVY,
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
        backgroundColor:DANGER,
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
});