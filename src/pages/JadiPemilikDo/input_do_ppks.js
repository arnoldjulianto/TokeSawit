/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React,{useEffect, useState} from 'react';
import {View, ScrollView, Text, TextInput, StyleSheet, Image, ActivityIndicator, RefreshControl, TouchableOpacity, Dimensions, FlatList} from 'react-native';
import CONSTANTS from '../../assets/constants';
import SearchBar from '../../components/SearchBar/search_bar_jadi_pemilik_do';
import AwesomeAlert from 'react-native-awesome-alerts';
import Select2 from "../../components/SelectTwo";
import iconNext from '../../assets/icon/next.png';
import iconAddWhite from '../../assets/icon/add-white.png';
import iconTrash from '../../assets/icon/trash.png';

const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const InputDoPPKS = ({route, navigation}) => {
    let {username} = route.params;
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
    const [arrPPKS, setArrPPKS] = useState([]);
    //const [listppksTerpilih, setListppksTerpilih] = useState([{nama_pks:"", enableDelete:false}]);
    const [ppksTerpilih, setPpksTerpilih] = useState(null);
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        loadDaftarPPKS()
        console.log(username)
    },[])
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
    }, []);

    const loadDaftarPPKS = () => {
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
        fetch(base_url+'PPKS/get_api_all_ppks',
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
                json.list_ppks.forEach((value)=>{
                    data.push({
                        id : parseInt(value.id),    
                        name : value.nama_ppks    
                    });
                })
                setArrPPKS(data);
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

    // const renderItemDaftarPks = ({item, index}) => {
    //     return(
    //         <View style={styles.inputWrapper}>
    //             {/* <Text>{index}</Text> */}
    //             <Select2
    //                 isSelectSingle
    //                 listEmptyTitle={"Tidak Ada Data Ditemukan"}
    //                 style={styles.textInput}
    //                 cancelButtonText={"Batal"}
    //                 selectButtonText={"Pilih"}
    //                 colorTheme="darkorange"
    //                 popupTitle="Pilih PPKS"
    //                 title={"Klik Untuk Memilih PPKS"}
    //                 searchPlaceHolderText={"Cari disini"}
    //                 selectedTitleStyle={{color:"black"}}
    //                 inputStyle={{color:"black"}}
    //                 data={arrPPKS}
    //                 onSelect={data => {
                        
    //                 }}
    //                 />
    //             {item.enableDelete && (
    //                 <TouchableOpacity style={styles.btnHapusPPKS} onPress={()=> {
    //                     setListppksTerpilih((prevState) => {
    //                         prevState.splice(index, 1)
    //                         return [...prevState]
    //                     })
    //                 }} >
    //                     <Image source={iconTrash} style={styles.btnHapusPPKSIcon} />
    //                 </TouchableOpacity>    
    //             )}    
    //         </View>
    //     )
    // }

    const loadAddDoSaya = () => {
        navigation.navigate("AddDoSaya", {username, id_ppks:ppksTerpilih} );
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
                    onCancelPressed={() => {
                        setAlert(false);
                    }}
                    onConfirmPressed={alertConfirmTask}
                />
            <SearchBar title={"Pilih PPKS"} refresh={false} navigation={navigation} />
            <View style={styles.container}>
                <ScrollView
                 refreshControl={
                    <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />
                } >
                    
                    <View style={styles.segmenWrapper}>
                        <View style={styles.formGroup}>
                        <View style={styles.inputWrapper}>
                            <Select2
                                isSelectSingle
                                listEmptyTitle={"Tidak Ada Data Ditemukan"}
                                style={styles.textInput}
                                cancelButtonText={"Batal"}
                                selectButtonText={"Pilih"}
                                colorTheme="darkorange"
                                popupTitle="Pilih PPKS"
                                title={"Klik Untuk Memilih PPKS"}
                                searchPlaceHolderText={"Cari disini"}
                                selectedTitleStyle={{color:"black"}}
                                inputStyle={{color:"black"}}
                                data={arrPPKS}
                                onSelect={data => {
                                    setPpksTerpilih(data[0]);
                                }}
                            />  
                        </View>
                            {/* <FlatList
                                data={listppksTerpilih}
                                keyExtractor={(item, index) => (item.id) + index}
                                renderItem={renderItemDaftarPks}
                                //extraData={listppksTerpilih}
                            /> */}
                        </View>  
                        {/* <TouchableOpacity style={styles.btnTambahPPKS} onPress={()=> {
                            const data = listppksTerpilih;
                            data.push({nama_pks:"", enableDelete:true});
                            console.log(data);
                            setListppksTerpilih((prevState) => {
                                prevState = data
                                return [...prevState]
                            })
                        }}>
                            <Image source={iconAddWhite} style={styles.btnTambahPPKSIcon} />
                            <Text style={styles.btnTambahPPKSLabel}>Tambah</Text>
                        </TouchableOpacity>  */}
                        {ppksTerpilih != null  && (
                            <View style={styles.formGroup}>
                                <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {loadAddDoSaya()} }>
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
        </View>
    );
}
export default InputDoPPKS;

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:20,
        backgroundColor:'transparent'
    },
    segmenWrapper : {
        backgroundColor:'white',
        padding:10,
        marginTop:20,
        marginBottom:10
    },
    segmenTitle :{
        fontSize:16,
        fontWeight:'500',
        marginBottom:10,
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
        color:"black",
        marginBottom:20
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
    btnTambahPPKS : {
        flexDirection:'row',
        backgroundColor:NAVY,
        alignItems:"center",
        marginTop:20,
        marginBottom:10,
        height:40,
        justifyContent:"center",
        borderBottomWidth:0.3,
    },
    btnTambahPPKSIcon:{
        width:26,
        height:26,
    },
    btnTambahPPKSLabel : {
        fontSize:15,
        color:'white',
        marginLeft:10,
    },
    btnHapusPPKSIcon:{
        width:26,
        height:26,
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