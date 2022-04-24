/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import CONSTANTS from '../../assets/constants';
import iconNext from '../../assets/icon/next.png';
import iconAddWhite from '../../assets/icon/add-white.png';
import iconImageWhite from '../../assets/icon/image-white.png';
import iconTrash from '../../assets/icon/trash.png';
import SearchBar from '../../components/SearchBar/search_bar_klaim_do';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';

const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const FotoKlaimDo =({route, navigation})=> {
    let {all_file_klaim_do} = route.params;
    const [arrFileKlaimDo, setArrFileKlaimDo] = useState(all_file_klaim_do);
    const closeAlert = () =>  {
        console.log("alert close");
        setAlert(false);
    }
    const [showAlert, setAlert] = useState(true);
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [username, setUsername] = useState("");
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [alertCancelTask, setAlertCancelTask] = useState(() => closeAlert() );
    
    useEffect (() => {
        arrFileKlaimDo.forEach((data) => {
            console.log(data.fileName);
        })
       getUser();
    },[arrFileKlaimDo])

    const getUser = async () => {
        try {
          const value = await AsyncStorage.getItem('username');
          if (value !== null) {
            // We have data!!
            setUsername(value);
          }
        } catch (error) {
          // Error retrieving data
          console.log(error)
        }
    };
    
    const launchImageLibrary = async () => {
        const options = {
            usedCameraButton: true,
            allowedVideo: false,
            allowedPhotograph: true, // for camera : allow this option when you want to take a photos
            allowedVideoRecording: false, //for camera : allow this option when you want to recording video.
            maxVideoDuration: 60, //for camera : max video recording duration
            numberOfColumn: 3,
            maxSelectedAssets: 20,
            singleSelectedMode: false,
            doneTitle: 'Lanjutkan',
            isPreview: true,
            mediaType: 'image',
            isExportThumbnail: true,
        }
        const response = await MultipleImagePicker.openPicker(options);
        const tampung = arrFileKlaimDo; 
        response.forEach((data) => {
            tampung.push(data);
        })
        const data = arrFileKlaimDo.filter(
            (item) =>
              item?.localIdentifier &&
              item?.localIdentifier !== null?.localIdentifier
        );
        setArrFileKlaimDo(data);
        setArrFileKlaimDo(tampung);
    }

    const addFoto = () => {
        launchImageLibrary();
    }

    const hapusFoto = (value) => {
        console.log("Delete Item "+value.fileName);
        setAlert(true);
        setCancelButtonAlert(true);
        setConfirmButtonAlert(true);
        setAlertMessage("Hapus Gambar?");
        setAlertCancelTask(() => () => closeAlert());
        setAlertConfirmTask(() => ()=> {
            const data = arrFileKlaimDo.filter(
                (item) =>
                  item?.localIdentifier &&
                  item?.localIdentifier !== value?.localIdentifier
            );
            setArrFileKlaimDo(data);
            setAlert(false);
        });
        setConfirmTextAlert("Lanjutkan");
        setCancelTextAlert("Batal");
    }

    const submitHandler = () => {
        const params = {
            'file_klaim_do' : arrFileKlaimDo
        }
        navigation.navigate("TentukanAgen", params);
    }
    
    const renderItem = ({ item, index }) => {
        return (
          <View style={{backgroundColor:'transparent'}}>
            <TouchableOpacity
                onPress = {() => { 
                    const params = {
                        file_klaim_do : {
                            uri : 'file://' + item.realPath
                        } 
                    }
                    navigation.navigate("PreviewFotoKlaimDo", params)
                    console.log("Navigate")
                }}
            >
                <Image
                source={{uri: 'file://' + item.realPath }}
                style={styles.tampungFoto}
                
                />
            </TouchableOpacity>  

            <TouchableOpacity
              onPress={() => hapusFoto(item)}
              style={styles.btnHapusFoto}
            >
                <View style={styles.btnHapusFotoWrapper}>
                    <Image source={iconTrash} style={styles.btnHapusFotoIcon}  />
                </View>
            </TouchableOpacity>
          </View>
        );
    };

    return(
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
                onCancelPressed={alertCancelTask}
                onConfirmPressed={alertConfirmTask}
                onDismiss = {()=>{
                    setAlert(false);
                }}
            />
            
            <SearchBar navigation={navigation}  title={"Foto Bukti Timbang"} />
                <ScrollView style={{marginBottom:0}}>
                    <View style={styles.tampungFotoWrapper}>
                        <FlatList
                            data={arrFileKlaimDo}
                            keyExtractor={(item, index) => (item?.filename ?? item?.path) + index}
                            renderItem={renderItem}
                            numColumns={3}
                        />
                    </View>
                </ScrollView>
                
                <View style={{justifyContent: 'flex-end',flexDirection:'row'}}>
                    <TouchableOpacity style={styles.btnAddFoto} onPress={()=> {addFoto()} }>
                            <Text style={styles.btnAddFotoLabel}>TAMBAH FOTO</Text>
                            <Image source={iconImageWhite} style={styles.btnLanjutkanIcon}  />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {submitHandler()} }>
                            <Text style={styles.btnLanjutkanLabel}>LANJUTKAN {"\n"} ( {arrFileKlaimDo.length} ) File  </Text>
                            <Image source={iconNext} style={styles.btnLanjutkanIcon}  />
                    </TouchableOpacity>
                </View>
        </View>
    );
}

export default FotoKlaimDo;

const styles = StyleSheet.create({
    container :{
        flexDirection:'column',
        paddingHorizontal:5,
        paddingTop:5,
    },
    tampungFoto :{
        width:120,
        height:120,
        marginHorizontal:5,
        marginBottom:10,
    },
    tampungFotoWrapper: {
        padding:20
    },
    btnLanjutkan: {
        flex:1,
        flexDirection:'row',
        backgroundColor:ORANGE,
        alignItems:"center",
        height:45,
        width:Dimensions.get('window').width / 2,
        borderRadius:5,
        justifyContent:"center",
        bottom: 10,
        marginHorizontal:5,
        paddingHorizontal:10,
    },
    btnLanjutkanIcon : {
        width:23,
        height:23,
        marginHorizontal:6,
        marginTop:1,
    },
    btnLanjutkanLabel : {
        fontSize:13,
        color:'white'
    },
    btnAddFoto: {
        flex:1,
        flexDirection:'row',
        backgroundColor:'teal',
        alignItems:"center",
        height:45,
        width:Dimensions.get('window').width / 2,
        borderRadius:5,
        justifyContent:"center",
        bottom: 10,
        marginHorizontal:5,
        paddingHorizontal:10
    },
    btnAddFotoIcon : {
        width:23,
        height:23,
        marginHorizontal:6,
        marginTop:1
    },
    btnAddFotoLabel : {
        fontSize:13,
        color:'white'
    },
    btnHapusFoto : {
        flex:1,
        alignItems:'center',
        position : 'relative',
        backgroundColor:'transparent',
        marginBottom:20
    },
    btnHapusFotoIcon : {
        width:26,
        height:26,
        marginHorizontal:6,
        marginTop:1,
    },
    btnHapusFotoWrapper : {
        backgroundColor:'transparent',
        flexDirection:"row"
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
})