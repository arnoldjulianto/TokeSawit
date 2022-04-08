/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, Platform,} from 'react-native';
import CONSTANTS from '../../assets/constants';
import iconNext from '../../assets/icon/next.png';
import SearchBar from '../../components/SearchBar/search_bar_klaim_do';
import ImageResizer from 'react-native-image-resizer';
import AwesomeAlert from 'react-native-awesome-alerts';
import clear from 'react-native-clear-app-cache'

const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const DetailKlaimDo =({route, navigation}) => {
    const closeAlert = () => {
        console.log("alert close");
        setAlert(false);
    }
    let {file_klaim_do, username_agen, nama_lengkap_agen, foto_profil_agen} = route.params;
    const [arrFileKlaimDo, setArrFileKlaimDo] = useState(file_klaim_do);
    const [showAlert, setAlert] = useState(false);
    const [showCancelButtonAlert, setCancelButtonAlert] = useState(true);
    const [showConfirmButtonAlert, setConfirmButtonAlert] = useState(false);
    const [alert_message, setAlertMessage] = useState("");
    const [confirmTextAlert, setConfirmTextAlert] = useState("");
    const [cancelTextAlert, setCancelTextAlert] = useState("");
    const [alertConfirmTask, setAlertConfirmTask] = useState(() => closeAlert() );
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [username, setUsername] = useState("arnoldjulianto97");
    const [tampungCompressedImage, setTampungCompressedImage ] = useState([]);
    let task;

    useEffect (() => {
        arrFileKlaimDo.forEach((data) => {
            console.log(data.fileName);
        })
        clear.getAppCacheSize((value, unit) => {
            console.log("Value : ", value)
            console.log("Unit : ", unit)
         })
    },[arrFileKlaimDo])

    const loadSubmitReport = (status, msg) => {
        const params = {
            status,
            msg
        }
        navigation.navigate("SubmitReport", params);
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
          </View>
        );
    };

    const imageResizeHandler = () => {
        setLoadingVisible(true);
        let i =0;
        let compressed = [];
        file_klaim_do.forEach((item) => {
            ImageResizer.createResizedImage(item.path, 600, 600, 'PNG', 100, 0)
            .then(response => {
                // response.uri is the URI of the new image that can now be displayed, uploaded...
                // response.path is the path of the new image
                // response.name is the name of the new image with the extension
                // response.size is the size of the new image
                console.log("Compressed Image ke "+i)
                console.log("Size :" +response.size)
                console.log(response)
                i++;
                compressed.push({
                    name: response.name,
                    type: 'image/gif',
                    uri: response.uri
                });
                if( (i) == file_klaim_do.length ){
                    console.log("Array Compressed : ");
                    console.log(compressed);
                    setTampungCompressedImage(compressed);
                    setLoadingVisible(false);
                    submitHandler(compressed);
                }
            })
            .catch(err => {
                // Oops, something went wrong. Check that the filename is correct and
                // inspect err to get more details.
                console.log(err)
            });
        })
    }

    const submitHandler = (arrCompressedImage) => {
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
            username,
            'agen' : username_agen
        }
        
        const createFormData = (body) => {
            const data = new FormData();
            let i = 0;
            file_klaim_do.forEach((item) => {
                data.append("file_jual_do"+i, arrCompressedImage[i]);
                console.log("Arr Compressed Img "+i)
                console.log(arrCompressedImage[i])
                i++;
            })
            data.append("total_data", i)
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            console.log(data)
            return data;
            
        }
        const formData = createFormData(params);
        fetch(base_url+'Jual_do/get_api_add_jual_do',
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
            setLoadingVisible(false);
            setAlertMessage(json.msg);
            setCancelTextAlert("Tutup");
            //task = () => loadSubmitReport(json.status, json.msg);
            //setAlertConfirmTask(task);
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
            <SearchBar navigation={navigation}  title={"Preview Do"} />
                <View style={styles.agenTitleWrapper}>
                    <Text style={styles.agenTitle} >Jual Ke Agen</Text>
                </View>
                <View style={styles.dataAgenArea}>
                    <Image source={{ uri :base_url+"assets/upload/file user/"+foto_profil_agen }}  style={styles.fotoProfil} resizeMode="cover" resizeMethod='resize'  />
                    <View style={styles.agenDetailArea}>
                        <Text style={styles.namaLengkapLabel} >{nama_lengkap_agen}</Text>
                        <Text style={styles.usernameLabel} >{username_agen}</Text>
                    </View>
                </View>   

                <View style={styles.fotoDoArea}>
                    <View style={styles.tampungFotoWrapper}>
                        <FlatList
                            data={file_klaim_do}
                            keyExtractor={(item, index) => (item?.filename ?? item?.path) + index}
                            renderItem={renderItem}
                            numColumns={3}
                        />
                    </View>
                </View>    

                <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {imageResizeHandler()} }>
                    <View style={{flexDirection:"row",justifyContent:'center'}}>
                        <Text style={styles.btnLanjutkanLabel}>JUAL SEKARANG</Text>
                        <Image source={iconNext} style={styles.btnLanjutkanIcon}  />
                    </View>
                </TouchableOpacity>
        </View>
    )
}

export default DetailKlaimDo;

const styles = StyleSheet.create({
    fotoDoTitleWrapper : {
        justifyContent:'flex-start',
        alignItems: 'flex-start',
        backgroundColor:'#fcfcfc',
        marginHorizontal:15,
        padding:5,
        marginTop:-10
    },
    fotoDoTitle : {
        marginBottom:15,
        fontSize : 17,
        fontWeight:'700'
    },
    fotoDoArea :{
        height:500,
        flexDirection:'column',
        backgroundColor:'#fcfcfc',
        justifyContent:"center",
        alignItems:"center",
        marginHorizontal:15,
        bottom:10
    },
    tampungFoto :{
        width:120,
        height:120,
        marginHorizontal:5,
        marginBottom:10,
    },
    tampungFotoWrapper: {
        flex:1,
        padding:5
    },
    btnLanjutkan: {
        backgroundColor:NAVY,
        alignItems:"center",
        height:40,
        borderRadius:10,
        justifyContent:"center",
        bottom: 7,
        position:'absolute',
        width:Dimensions.get('window').width,
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
    agenTitleWrapper : {
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor:'#fcfcfc',
        marginHorizontal:15,
        paddingHorizontal:15,
        paddingTop:10,
        marginTop:20
    },
    agenTitle : {
        fontSize : 17,
        fontWeight:'700'
    },
    dataAgenArea :{
        height:120,
        flexDirection:'row',
        backgroundColor:'#fcfcfc',
        justifyContent:"center",
        alignItems:"center",
        marginHorizontal:15,
        marginBottom:20
    },
    agenDetailArea :{
        flex:1,
        backgroundColor:'transparent',
        justifyContent:"center",
        alignItems:"center",
        marginTop:10
    },
    fotoProfil:{
        width:100,
        height:100,
        borderRadius:150/2,
        left:20
    },
    usernameLabel :{
        fontSize:17,
        color:'grey',
        fontWeight:'400'
    },
    namaLengkapLabel : {
        fontSize:20,
        fontWeight:'700'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop:0,
    },
    modalView: {
        flex:1,
        backgroundColor:ORANGE,
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