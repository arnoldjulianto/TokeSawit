/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, RefreshControl, FlatList, ActivityIndicator } from 'react-native';
import CONSTANTS from '../../assets/constants';
import nextIcon from '../../assets/icon/next.png';
import SearchBar from '../../components/SearchBar/search_bar_jadi_pemilik_do';
import Icon from 'react-native-vector-icons/FontAwesome5';

const DANGER = CONSTANTS.COLOR.DANGER;
const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const ResellerDo = ({route, navigation}) => {
    let {username} = route.params;
    const [loadingVisible, setLoadingVisible] = useState(true);
    const [searchParam, setSearchParam] = useState("");
    const [arrFollowing, setArrFollowing] = useState([]);
    const [loadMore, setLoadMore] = useState(false);
    const [noMoreDataFollowing, setNoMoreDataFollowing] = useState(false);

    useEffect(()=>{
        //if(searchParam != ""){
            console.log(searchParam)
            setArrFollowing([]);
                const delayDebounceFn = setTimeout(() => {
                loadAllData()
            }, 500)
            return () => clearTimeout(delayDebounceFn)
        //}
        
    },[searchParam])

    const onRefresh = React.useCallback(() => {
        loadAllData();
    }, []);

    const loadAllData = () => {
        setLoadingVisible(true);
        const timeout = setTimeout(() => {
            setLoadingVisible(false);
            setLoadMore(false);
        }, 30000);

        const params = {
            searchParam,
            currentUser:username
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
        fetch(base_url+'Following/get_api_search_agen',
        {
            method: 'post',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data; ',
            },
        })
        .then((response) => response.json())
        .then((json) => {
            setArrFollowing(json.following);
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(json)
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            setLoadMore(false);
            console.log(error);
        });
    }

    const loadUsersDOPPKS = (username, username_edit, nama_lengkap) => {
        navigation.navigate("UsersDOPPKS", {username, username_edit, nama_lengkap})
    }

    const renderItem = ({item,index}) => {
        let uri = '';
        if(item.foto_profil == 'default.png') uri = base_url+"assets/upload/file user/"+item.foto_profil;
        else uri = base_url+"assets/upload/file user/"+item.username+"/"+item.foto_profil;

        return (
            <TouchableOpacity style={styles.renderItemUserArea} key={item.username+index} onPress={()=>{
                loadUsersDOPPKS(item.username, item.username_edit, item.nama_lengkap)
            }} >
                <Image style={styles.fotoProfil} source={{uri}} resizeMode="cover" resizeMethod="resize" />
                <View style={styles.detailUser}>
                    <Text style={styles.usernameLabel} >{item.username_edit}</Text>
                    <Text style={styles.namaLengkapLabel} >{item.nama_lengkap}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return(
        <View style={{flex:1}}>
            <SearchBar title={"Pilih Agen DO"} refresh={false} navigation={navigation} />
            <View style={styles.container} >
                <View style={styles.segmenWrapper} >
                    <View style={styles.inputWrapper}>
                        <Icon name="search" type="ionicon" size={20} color="gray" style={{position:"absolute", left:10,bottom:10}} />
                        <TextInput style={styles.textInput} placeholder="Cari nama, username, no hp, email" placeholderTextColor= 'gray' value={searchParam} onChangeText = { (value) => {setSearchParam(value)} } 
                        />
                    </View>
                    
                    <FlatList
                            data={arrFollowing}
                            keyExtractor={(item, index) => index}
                            renderItem={renderItem}
                            refreshControl={
                                <RefreshControl
                                refreshing={loadingVisible}
                                onRefresh={onRefresh}
                                />
                            }
                            style={{flex:1, paddingHorizontal:10}}
                    /> 
                </View>
            </View>    
        </View>
    )
}
export default ResellerDo;

const styles = StyleSheet.create({
    container : {
        flex:1,
        paddingHorizontal:5,
        paddingTop:10
    },
    segmenWrapper :{
        flex:1
    },
    renderItemUserArea :{
        flexDirection:'row',
        backgroundColor:'#fcfcfc',
        justifyContent:"space-between",
        marginTop:12,
        paddingVertical:10,
        borderRadius:5,
        paddingHorizontal:10
    },
    detailUser :{
        flex:0.5,
        backgroundColor:'transparent',
        justifyContent:"center",
        alignItems:"flex-start",
    }, 
    usernameLabel :{
        fontSize:13,
        color:'grey',
        fontWeight:'400'
    },
    namaLengkapLabel : {
        fontSize:15,
        color:'black',
        fontWeight:'700'
    },
    fotoProfil:{
        width:60,
        height:60,
        borderRadius:120/2,
        justifyContent:"center",
    },
    actionArea :{
        flex:0.1,
        backgroundColor:'transparent',
        justifyContent:"center",
        alignItems:"flex-start",
    }, 
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"white",
        height:45,
        justifyContent:"center",
        color:"black",
        borderWidth:0.3,
        borderRadius:5
    },
    textInput:{
        borderColor:"black",
        color:"black",
        borderRadius:5,
        fontSize:13,
        flex:1,
        marginLeft:35,
    },
})