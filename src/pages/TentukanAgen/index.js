/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text,TextInput, StyleSheet, Image, FlatList, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../assets/constants';
import iconNext from '../../assets/icon/next.png';
import SearchBar from '../../components/SearchBar/search_bar_klaim_do';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TentukanAgenContext } from '../../components/Context';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from './loading';
import NoData from '../../assets/img/no data.svg';
import FitImage from 'react-native-fit-image';
import { LogBox } from 'react-native';

// Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);

//Ignore all log notifications
LogBox.ignoreAllLogs();

const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const TentukanAgen = (props) => {
    const [searchParam, setSearchParam] = useState("");
    const [showBtnLanjut, setShowBtnLanjut] = useState(true);
    //const { getJualDoTerbaru} = React.useContext(TentukanAgenContext);
    const searchInput = useRef("searchInput");
    const [username, setUsername] = useState("");
    const [dataJualDoTerbaru, setDataJualDoTerbaru] = useState([]);
    const [dataAgenFollowing, setDataAgenFollowing] = useState([]);
    const [dataAgenNotFollowing, setDataAgenNotFollowing] = useState([]);
    const [showLoading,setShowLoading] = useState(true);
    const [showJualDoTerbaru,setShowJualDoTerbaru] = useState(true);
    const [serverResponse, setServerResponse] = useState(true);

    useEffect (() => {
        autoFocus();
        getUser();
    },[])

    useEffect (() => {
        const delayDebounceFn = setTimeout(() => {
            console.log(searchParam)
            if(searchParam !='') {
                searchAgenFollowing(username, searchParam);
            }
            else {
                getJualDoTerbaru(username);
            }
        }, 400)
        return () => clearTimeout(delayDebounceFn)
    },[searchParam])

    const autoFocus = () =>{
        searchInput.current.focus()
    }

    const getUser = async () => {
        try {
          const value = await AsyncStorage.getItem('username');
          if (value !== null) {
            // We have data!!
            setUsername(value);
          }
          if(showJualDoTerbaru) getJualDoTerbaru(username);
        } catch (error) {
          // Error retrieving data
          console.log(error)
        }
    };

    const submitHandler = () =>{

    }
    
    const searchHandler = (value) => {
        setSearchParam(value);
    }

    const getJualDoTerbaru = (username) => {
        setShowLoading(true);
        setShowJualDoTerbaru(true);
        console.log("Cari Klaim Terbaru ..."+username);
        const timeout = setTimeout(() => {
            setServerResponse("Permintaan Tidak Dapat Dipenuhi, Server Tidak Merespon");
            console.log("Permintaan Tidak Dapat Dipenuhi, Server Tidak Merespon")
            setShowLoading(false);
            setDataAgenFollowing([]);
            setDataAgenNotFollowing([]);
        }, 30000);

        const params = {
            username
        }
        
        const createFormData = (body) => {
            const data = new FormData();
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            return data;
        }
        const formData = createFormData(params);
        fetch(base_url+'Jual_do/get_api_jual_do_terbaru',
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
            setDataJualDoTerbaru(json);
            console.log(json)
            setShowLoading(false);
            setServerResponse(1);
            setDataAgenFollowing([]);
            setDataAgenNotFollowing([]);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setShowLoading(false);
            setServerResponse("Permintaan Tidak Dapat Dipenuhi, Server Tidak Merespon");
            console.log(error);
            setDataAgenFollowing([]);
            setDataAgenNotFollowing([]);
        });
    }

    const searchAgenFollowing = (username, searchParam) => {
        console.log("Search : "+searchParam)
        if(searchParam != ""){
            setShowJualDoTerbaru(false);
            setShowLoading(true);
            console.log("Cari Agen ..."+username);
            const timeout = setTimeout(() => {
                setServerResponse("Permintaan Tidak Dapat Dipenuhi, Server Tidak Merespon");
                console.log("Permintaan Tidak Dapat Dipenuhi, Server Tidak Merespon")
                setShowLoading(false);
            }, 30000);
    
            const params = {
                username,
                searchParam,
            }
            const createFormData = (body) => {
                const data = new FormData();
                Object.keys(body).forEach(key => {
                    data.append(key, body[key]);
                });
                return data;
            }
            const formData = createFormData(params);
            fetch(base_url+'Following/get_api_search_agen_following',
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
                setDataAgenFollowing(json);
                console.log(json)
                setShowLoading(false);
                setServerResponse(1);
                searchAgenNotFollowing(username, searchParam, json);
            })
            .catch((error) => {
                clearTimeout(timeout);
                setShowLoading(false);
                setServerResponse("Permintaan Tidak Dapat Dipenuhi, Server Tidak Merespon");
                console.log(error);
            });
            
        }
        else{
            setShowJualDoTerbaru(true);
        }
    }
    
    const searchAgenNotFollowing = (username, searchParam, arr) => {
        console.log("Search : "+searchParam)
        if(searchParam != ""){
            setShowJualDoTerbaru(false);
            setShowLoading(true);
            console.log("Cari Agen Not Following..."+searchParam);
            const timeout = setTimeout(() => {
                setServerResponse("Permintaan Tidak Dapat Dipenuhi, Server Tidak Merespon");
                console.log("Permintaan Tidak Dapat Dipenuhi, Server Tidak Merespon")
                setShowLoading(false);
            }, 30000);
    
            const params = {
                username,
                searchParam,
            }
            
            const createFormData = (body) => {
                const data = new FormData();
                Object.keys(body).forEach(key => {
                    data.append(key, body[key]);
                });
                return data;
            }
            const formData = createFormData(params);
            fetch(base_url+'Following/get_api_search_agen_not_following',
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
                let result = json;
                let i = 0;
                json.forEach((value) => {
                    if(typeof arr[i] !== 'undefined' ){
                        result = json.filter(
                            (item) =>  item.username !== arr[i].username
                        );
                        console.log("Filtered")
                    }
                    i++;
                });
                setDataAgenNotFollowing(result);
                setShowLoading(false);
                setServerResponse(1);
            })
            .catch((error) => {
                clearTimeout(timeout);
                setShowLoading(false);
                setServerResponse("Permintaan Tidak Dapat Dipenuhi, Server Tidak Merespon");
                console.log(error);
            });
        }
        else{
            setShowJualDoTerbaru(true);
        }
    }

    const agenPressHandler = (username_agen, nama_lengkap_agen, foto_profil_agen) => {
        console.log(props.file_klaim_do)
        const params = {
            username_agen,
            nama_lengkap_agen,
            foto_profil_agen,
            'file_klaim_do' : props.file_klaim_do,
        }
        props.navigation.navigate("DetailJualDo", params);
    }

    const renderItemJualDoTerbaru = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.flatList} key={"following"+item.username+index} onPress={ ()=> agenPressHandler(item.username, item.nama_lengkap, item.foto_profil ) } >
              <Image source={{ uri :base_url+"assets/upload/file user/"+item.foto_profil }}  style={styles.fotoProfil} resizeMode="cover" resizeMethod='resize'  />
              <Text style={styles.usernameLabel} >{item.following}</Text>
              <Text style={styles.namaLengkapLabel} >{item.nama_lengkap}</Text>
            </TouchableOpacity>
        )
    }

    const renderItemAgenFollowing = ({ item, index }) => {
        return (
          <TouchableOpacity style={styles.flatList} key={"following"+item.username+index} onPress={ ()=> agenPressHandler(item.username, item.nama_lengkap, item.foto_profil ) } >
              <Image source={{ uri :base_url+"assets/upload/file user/"+item.foto_profil }}  style={styles.fotoProfil} resizeMode="cover" resizeMethod='resize'  />
              <View style={styles.userDetailArea}>
                <Text style={styles.usernameLabel} >{item.following}</Text>
                <Text style={styles.namaLengkapLabel} >{item.nama_lengkap}</Text>
                <Text style={styles.followingLabel} >Mengikuti</Text>
              </View>
          </TouchableOpacity>
        )
    }

    const renderItemAgenNotFollowing = ({ item, index }) => {
        return (
          <TouchableOpacity style={styles.flatList} key={"notfollowing"+item.username+index} onPress={ ()=> agenPressHandler(item.username, item.nama_lengkap, item.foto_profil) } >
              <Image source={{ uri :base_url+"assets/upload/file user/"+item.foto_profil }}  style={styles.fotoProfil} resizeMode="cover" resizeMethod='resize'  />
              <View style={styles.userDetailArea}>
                <Text style={styles.usernameLabel} >{item.username}</Text>
                <Text style={styles.namaLengkapLabel} >{item.nama_lengkap}</Text>
                {/* <Text style={styles.followingLabel} >Mengikuti</Text> */}
              </View>
          </TouchableOpacity>
        )
    }


    return(
        <View style={{flex:1}}>
            <SearchBar navigation={props.navigation}   title={"Tentukan Agen"} />
                <View style={styles.container}>
                    <View style={styles.formArea}>
                        <View style={styles.formGroup} >
                            <Text style={styles.formLabel}>Cari Agen</Text>
                            <View style={styles.inputWrapper}>
                                <Icon name="search" type="ionicon" size={20} color="gray" style={{position:"absolute", left:5,bottom:10}} />
                                <TextInput style={styles.textInput} placeholder="nama agen, username, atau lainnya" placeholderTextColor= 'gray' value={searchParam} onChangeText = { (value) => searchHandler(value) }  onFocus={()=> setShowBtnLanjut(false) }
                                onBlur={()=> setShowBtnLanjut(true) } ref= {searchInput} />
                            </View>
                        </View>
                        <View style={styles.formGroup} >
                            {
                                showJualDoTerbaru  ?
                                (
                                    showLoading  ? (
                                            <View>
                                                <Text style={styles.formLabel}>Jual Do Terbaru</Text>
                                                <View style={{marginTop:20}}>
                                                    <Loading/>
                                                    <Loading/>
                                                    <Loading/>
                                                    <Loading/>
                                                    <Loading/>
                                                    <Loading/>
                                                </View>
                                            </View>        
                                    ) : dataJualDoTerbaru.length == 0 && serverResponse != 1 ? (
                                                <View>
                                                    <Text style={styles.formLabel}>Jual Do Terbaru</Text>
                                                    <View style={styles.noDataWrapper}>
                                                        <NoData width={250} height={150} />
                                                        <Text style={styles.noDataText1}>Tidak Ada Data Ditemukan</Text>
                                                        <Text style={styles.noDataText2}>{serverResponse}. Harap periksa koneksi internet Anda.</Text>
                                                    </View>
                                                </View>
                                                
                                        ) : (
                                                <View>
                                                    {dataJualDoTerbaru.length > 0 && (
                                                        <Text style={styles.formLabel}>Jual Do Terbaru</Text>
                                                        )
                                                    }
                                                    <FlatList
                                                        data={dataJualDoTerbaru}
                                                        keyExtractor={(item, index) => (item.id) + index}
                                                        renderItem={renderItemJualDoTerbaru}
                                                        numColumns={1}
                                                    />
                                                </View>
                                        )
                                ) : (
                                    //FOLLOWING AREA
                                    showLoading  ? (
                                        <View>
                                            <View style={{marginTop:10}}>
                                                <Loading/>
                                                <Loading/>
                                                <Loading/>
                                                <Loading/>
                                            </View>
                                        </View>        
                                    ) : dataAgenFollowing.length == 0 && serverResponse != 1 && !showJualDoTerbaru ? (
                                        <View>
                                            <View style={styles.noDataWrapper}>
                                                <NoData width={250} height={150} />
                                                <Text style={styles.noDataText1}>Tidak Ada Data Ditemukan</Text>
                                                <Text style={styles.noDataText2}>{serverResponse}. Harap periksa koneksi internet Anda.</Text>
                                            </View>
                                        </View>
                                        
                                    ) : (
                                        <View>
                                            <FlatList
                                                data={dataAgenFollowing}
                                                keyExtractor={(item, index) => (item.id) + index}
                                                renderItem={renderItemAgenFollowing}
                                            />
                                        </View>
                                    )
                                 )   
                            }

                            {
                                showLoading  ? (
                                    <View>
                                        <View style={{marginTop:10}}>
                                            <Loading/>
                                            <Loading/>
                                        </View>
                                    </View>        
                                ) :
                                 dataAgenNotFollowing.length == 0 && dataAgenFollowing.length > 0 && serverResponse != 1 && !showJualDoTerbaru ? (
                                    <View>
                                        <View style={styles.noDataWrapper}>
                                            <NoData width={250} height={150} />
                                            <Text style={styles.noDataText1}>Tidak Ada Data Ditemukan</Text>
                                            <Text style={styles.noDataText2}>{serverResponse}. Harap periksa koneksi internet Anda.</Text>
                                        </View>
                                    </View>
                                    
                                ) : (
                                    <View>
                                        <FlatList
                                            data={dataAgenNotFollowing}
                                            keyExtractor={(item, index) => "notfollowing"+item.username+(item.id) + index}
                                            renderItem={renderItemAgenNotFollowing}
                                        />
                                    </View>
                                )
                            }
                        </View>
                    </View> 
                </View>
        </View>
    );
}

export default TentukanAgen;


const styles = StyleSheet.create({
    container :{
        flex:1,
        flexDirection:'column',
        paddingHorizontal:5,
        paddingTop:5,
    },
    formArea:{
        flex:1,
        paddingTop:10,
        paddingHorizontal:25,
        backgroundColor:"white",
    },
    formGroup:{
        marginBottom:20,
    },
    formLabel :{
        fontSize:17,
        fontWeight:'bold'
    },  
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"white",
        height:45,
        justifyContent:"center",
        marginTop:5
    },
    textInput:{
        borderWidth:1,
        borderTopWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
        borderColor:"lightgray",
        color:"black",
        fontSize:15,
        flex:1,
        paddingLeft:40,
    },
    flatList :{
        flex:1,
        flexDirection:'row',
        backgroundColor:'#fcfcfc',
        justifyContent:"space-between",
        padding:5,
        marginBottom:15
    },
    userDetailArea :{
        flex:1,
        backgroundColor:'transparent',
        justifyContent:"flex-start",
        alignItems:"flex-start",
        left:20
    },  
    btnLanjutkan: {
        backgroundColor:NAVY,
        alignItems:"center",
        height:40,
        borderRadius:10,
        justifyContent:"center",
        bottom: 7,
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
    noDataWrapper:{
        alignItems:"center", 
        justifyContent:"center",
        paddingTop:50
    },
    noDataText1:{
        fontSize:16,
        color:ORANGE,
        textAlign:"center",
        marginTop:20
    },
    noDataText2:{
        width:300,
        textAlign:"center",
        fontSize:12,
        color:"gray"
    },
    fotoProfil:{
        width:60,
        height:60,
        borderRadius:100/2,
    },
    usernameLabel :{
        fontSize:13,
        fontWeight:'700'
    },
    namaLengkapLabel : {
        fontSize:15,
        color:'grey',
        fontWeight:'400'
    },
    followingLabel : {
        fontSize:13,
        fontWeight:'300'
    }
})