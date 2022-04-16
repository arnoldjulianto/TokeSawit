/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable prettier/prettier */
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import CONSTANTS from '../../../assets/constants';
import iconCamera from '../../../assets/icon/camera.png';
import iconImage from '../../../assets/icon/image.png';
import { BukaTutupBukuContext } from '../../../components/Context';
import ProsesModal from '../../../components/ProsesModal';
import DetailBukaTutupBuku from './detail_buka_tutup_buku';
import Axios from 'axios';

const base_url = CONSTANTS.CONFIG.BASE_URL;
const DANGER =CONSTANTS.COLOR.DANGER;
const NAVY =CONSTANTS.COLOR.NAVY;
const ORANGE =CONSTANTS.COLOR.ORANGE;
const SUCCESS =CONSTANTS.COLOR.SUCCESS;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const FormBukaTutupBuku = (props) => {
    let radio_props = [
        {label: 'Buka', value: 'Buka' },
        {label: 'Tutup', value: 'Tutup' }
    ];
    const [modalVisible, setModalVisible] = useState(false);
    const [loop, setLoop] = useState(0);
    let day   = new Date().getDate();
    let month = new Date().getMonth()+1;
    let year  = new Date().getFullYear();
    if(day.toString().length == 1 ) day = "0"+day;
    if(month.toString().length == 1 ) month = "0"+month;

    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    if(hours.toString().length == 1 ) hours = "0"+hours;
    if(minutes.toString().length == 1 ) minutes = "0"+minutes;
    if(seconds.toString().length == 1 ) seconds = "0"+seconds;
    const [no_buka_tutup_buku, setNoBukaTutupBuku] = useState(props.no_buka_tutup_buku);
    const [tanggal_buka_tutup_buku, setTanggalBukaTutupBuku] = useState(year+"-"+month+"-"+day);
    const [jam_buka_tutup_buku, setJamBukaTutupBuku] = useState(hours+":"+minutes);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [jenis_datepicker, setJenisDatePicker] = useState("");
    const [jenis_buka_tutup_buku, setJenisBukaTutupBuku] = useState( "");
    const [file_buka_tutup_buku1, setFileBukaTutupBuku1] = useState("");
    const [file_buka_tutup_buku2, setFileBukaTutupBuku2] = useState("");
    const [refreshForm, setRefreshForm] = useState(false);
    const [detailBukaTutupBuku, setDetailBukaTutupBuku] = useState([]);

    useEffect (() => {
        setRefreshForm(props.refreshForm);
        if(refreshForm){
            doRefreshForm();
        }
        
        if(no_buka_tutup_buku != ""){
            getBukaTutupBuku();
        }
    },[refreshForm,no_buka_tutup_buku]);

   
    const getBukaTutupBuku = () => {
        setModalVisible(true);
        const params = {
            no_buka_tutup_buku,
        }
        Axios.get(base_url+'BukaTutupBuku/get_api_edit_buka_tutup_buku', {params} )
        .then(response => {
            let waktu_buka_tutup_buku = response.data[0].waktu_buka_tutup_buku;
            setJenisBukaTutupBuku(response.data[0].jenis_buka_tutup_buku);
            setTanggalBukaTutupBuku(waktu_buka_tutup_buku.substr(0,10));
            setJamBukaTutupBuku(waktu_buka_tutup_buku.substr(11,5));
            if(response.data[0].file_buka_tutup_buku1 != "") {
                setFileBukaTutupBuku1(base_url+"assets/upload/file buka tutup buku 1/"+response.data[0].file_buka_tutup_buku1);
            }
            if(response.data[0].file_buka_tutup_buku2 != "") {
                setFileBukaTutupBuku2(base_url+"assets/upload/file buka tutup buku 2/"+response.data[0].file_buka_tutup_buku2);
            }
            setModalVisible(false);
            getDetailBukaTutupBuku();
        })
        .catch(function (error) {
            Alert.alert(alert_title, "Terjadi Kesalahan\n"+error);
            setModalVisible(false);
        })
    }

    const getDetailBukaTutupBuku = () => {
        setModalVisible(true);
        const params = {
            no_buka_tutup_buku,
        }
        Axios.get(base_url+'BukaTutupBuku/api_get_detail_buka_tutup_buku', {params} )
        .then(response => {
            setDetailBukaTutupBuku(response);
            setModalVisible(false);
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
          if(a == "tanggal_buka_tutup_buku" ) {
              setDate(new Date(tanggal_buka_tutup_buku));
          }
          else if(a == "jam_buka_tutup_buku" ) {
            hours = jam_buka_tutup_buku.substr(0,2);
            minutes = jam_buka_tutup_buku.substr(3,2);  
            setTime(new Date(year, month, day, hours, minutes, seconds));
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
        if(jenis_datepicker == "tanggal_buka_tutup_buku" ) {
           
           setTanggalBukaTutupBuku(year+"-"+month+"-"+day);
           setDate(new Date(tanggal_buka_tutup_buku));
        }
        else if(jenis_datepicker == "jam_buka_tutup_buku" ) {
            if(selectedDate) {
                hours = currentDate.getHours();
                minutes = currentDate.getMinutes();
                seconds = currentDate.getSeconds();
                if(hours.toString().length == 1 ) hours = "0"+hours;
                if(minutes.toString().length == 1 ) minutes = "0"+minutes;
                if(seconds.toString().length == 1 ) seconds = "0"+seconds;
                setJamBukaTutupBuku(hours+":"+minutes);
                setTime(new Date(year, month, day, hours, minutes, seconds));
            }
        }
       //  setDate(date);
   };
   //DATEPICKER

    //ADD NEW DETAIL BUKA TUTUP BUKU
    function useForceUpdate(){
        return () => { 
            setLoop(loop => loop + 1);
        }
    }
    const forceUpdate = useForceUpdate();
    //ADD NEW DETAIL BUKA TUTUP BUKU

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
           
            if(jenis_file == 'File Buka Tutup Buku 1'){
                setFileBukaTutupBuku1(response.assets[0]);
            }
            else if(jenis_file == 'File Buka Tutup Buku 2'){
                setFileBukaTutupBuku2(response.assets[0]);
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
            if(jenis_file == 'File Buka Tutup Buku 1'){
                setFileBukaTutupBuku1(response.assets[0]);
            }
            else if(jenis_file == 'File Buka Tutup Buku 2'){
                setFileBukaTutupBuku2(response.assets[0]);
            }
          }
        });
    }
    const { getDataForm } = React.useContext(BukaTutupBukuContext);
    const submit = () => {
        getDataForm(jenis_buka_tutup_buku, tanggal_buka_tutup_buku, jam_buka_tutup_buku, file_buka_tutup_buku1, file_buka_tutup_buku2, true);
    }

    const doRefreshForm = () => {
        setModalVisible(false);
        setLoop(0);
        day   = new Date().getDate();
        month = new Date().getMonth()+1;
        year  = new Date().getFullYear();
        if(day.toString().length == 1 ) day = "0"+day;
        if(month.toString().length == 1 ) month = "0"+month;
        hours = new Date().getHours();
        minutes = new Date().getMinutes();
        seconds = new Date().getSeconds();
        if(hours.toString().length == 1 ) hours = "0"+hours;
        if(minutes.toString().length == 1 ) minutes = "0"+minutes;
        if(seconds.toString().length == 1 ) seconds = "0"+seconds;
        setTanggalBukaTutupBuku(year+"-"+month+"-"+day);
        setJamBukaTutupBuku(hours+":"+minutes);
        setDate(new Date());
        setTime(new Date());
        setMode('date');
        setShow(false);
        setJenisDatePicker("");
        setJenisBukaTutupBuku("");
        setFileBukaTutupBuku1("");
        setFileBukaTutupBuku2("");
    }

    return(
        <View style={styles.contentWrapper}>
                 {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={jenis_datepicker == "tanggal_buka_tutup_buku" ? date : time}
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
                                {no_buka_tutup_buku != "" &&
                                    <Text style={{fontSize:14}}>{"\n"}No. : {no_buka_tutup_buku}</Text>
                                }
                            </Text>
                         
                </View>
                <ScrollView >
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
                                    isSelected={jenis_buka_tutup_buku === obj.value }
                                    onPress={(value) => setJenisBukaTutupBuku(value)}
                                    borderWidth={1}
                                    buttonInnerColor={'#dc3545'}
                                    buttonOuterColor={jenis_buka_tutup_buku === obj.value ? '' : '#000'}
                                    buttonSize={20}
                                    buttonOuterSize={20}
                                    buttonStyle={{}}
                                    buttonWrapStyle={{marginLeft: 10}}
                                    />
                                    
                                    <RadioButtonLabel
                                    obj={obj}
                                    index={i}
                                    labelHorizontal={true}
                                    onPress={(value) => setJenisBukaTutupBuku(value)}
                                    labelStyle={{fontSize: 15, color: 'black'}}
                                    labelWrapStyle={{}}
                                    />
                                </RadioButton>
                                ))
                            }  
                            </RadioForm>
                        </View>

                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Tanggal & Waktu Transaksi</Text>
                            <View style={styles.dateTimeWrapper}>
                                <TouchableOpacity  onPress={() => {setJenisDatePicker("tanggal_buka_tutup_buku");showDatePicker("tanggal_buka_tutup_buku", "date" )} } style={{flex:1}} >
                                    <TextInput style={styles.textInput} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_buka_tutup_buku} editable={false} />
                                </TouchableOpacity>

                                <TouchableOpacity  onPress={() => {setJenisDatePicker("jam_buka_tutup_buku");showDatePicker("jam_buka_tutup_buku", "time")} } style={{flex:1}}  >
                                    <TextInput style={styles.textInput} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={jam_buka_tutup_buku} editable={false} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Detail Buka / Tutup Buku</Text>
                            <DetailBukaTutupBuku loop={loop} detailBukaTutupBuku={detailBukaTutupBuku} />
                        </View>

                        <View style={styles.formGroup} >
                            <TouchableOpacity style={styles.btnAddRow} onPress={forceUpdate} >
                                 <Icon name="plus-circle" type="ionicon" size={26} color="white" />
                            </TouchableOpacity>
                        </View>    
                        
                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Foto 1 (wajib)</Text>   
                            <View style={styles.tampungFotoWrapper}>
                                <RenderFoto src={file_buka_tutup_buku1} /> 
                            </View>
                            <View style={styles.uploadFotoWrapper}>
                                <UploadArea jenis_file ="File Buka Tutup Buku 1" />
                            </View>
                        </View> 
                        
                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Foto 2 (wajib)</Text>   
                            <View style={styles.tampungFotoWrapper}>
                                <RenderFoto src={file_buka_tutup_buku2} /> 
                            </View>
                            <View style={styles.uploadFotoWrapper}>
                                <UploadArea jenis_file ="File Buka Tutup Buku 2" />
                            </View>
                        </View> 

                        <View style={{marginBottom:50}} ></View>
                        <View style={styles.formGroup} >
                            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                <TouchableOpacity style={styles.btnSave} onPress={()=> submit()}   >
                                        <Icon name="save" type="ionicon" size={20} color="white" />
                                        <Text style={{color:'white', marginLeft:10}}>Simpan</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btnRefresh} onPress={()=> doRefreshForm()}   >
                                        <Icon name="undo" type="ionicon" size={20} color="white" />
                                        <Text style={{color:'white', marginLeft:10}}>Refresh</Text>
                                </TouchableOpacity>
                            </View>
                        </View>  
                    </View>    
                </ScrollView>  
                
                <ProsesModal setModalVisible={setModalVisible} modalVisible={modalVisible} />   
        </View>
    );
    
}

export default FormBukaTutupBuku;

const styles = StyleSheet.create({
    contentWrapper: {
        flex: 1,
    },
    dateTimeWrapper : {
        flex:1,
        flexDirection:"row",
        justifyContent :"space-between"
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