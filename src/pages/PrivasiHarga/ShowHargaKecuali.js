/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, TouchableOpacity, ActivityIndicator,RefreshControl, Image, ScrollView,  FlatList, TextInput } from 'react-native';
import CONSTANTS from '../../assets/constants';
import SearchBar from '../../components/SearchBar/search_bar_privasi_harga';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const DANGER = CONSTANTS.COLOR.DANGER;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const ShowHargaKecuali = ({route, navigation}) => {
    let {currentUser} = route.params;
    const [searchParam, setSearchParam] = useState("");
    const [arrFollowers, setArrFollowers] = useState([]);
    const [loadingVisible, setLoadingVisible] = useState(false);

    useEffect(()=>{
        console.log(searchParam)
        setArrFollowers([]);
        const delayDebounceFn = setTimeout(() => {
            loadFollowers()
        }, 500)
        return () => clearTimeout(delayDebounceFn)
    },[searchParam])

    const loadFollowers = () => {
        setLoadingVisible(true);
        const timeout = setTimeout(() => {
            setLoadingVisible(false);
        }, 30000);

        const params = {
            searchParam,
            currentUser
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
        fetch(base_url+'Pencarian/get_api_all_followers',
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
            setArrFollowers(json.followers);
            console.log(json);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(error);
        });
    }

    const renderItemFollowers = ({item,index}) => {
        let uri = '';
        if(item.foto_profil == 'default.png') uri = base_url+"assets/upload/file user/"+item.foto_profil;
        else uri = base_url+"assets/upload/file user/"+item.username+"/"+item.foto_profil;
        return (
            <TouchableOpacity style={styles.renderItemUserArea} key={item.username+index} onPress={()=>{
                
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
        <View>
            <SearchBar title={"Sembunyikan Harga Dari..."} navigation={navigation} />
            <View style={styles.container} >
                <View style={styles.inputWrapper}>
                    <Icon name="search" type="ionicon" size={20} color="gray" style={{position:"absolute", left:10,bottom:10}} />
                    <TextInput style={styles.textInput} placeholder="Cari ..." placeholderTextColor= 'gray' value={searchParam} onChangeText = { (value) => {setSearchParam(value)} } 
                    />
                </View>

                <View style={styles.segmenWrapper}>
                    {loadingVisible && (
                        <View >
                            <ActivityIndicator size={50} color={ORANGE} />
                        </View>
                    )}
                    <FlatList
                        data={arrFollowers}
                        keyExtractor={(item, index) => index}
                        renderItem={renderItemFollowers}
                        maxToRenderPerBatch={5} updateCellsBatchingPeriod={20}
                    /> 
                </View>
            </View>    
        </View>
    )
}

export default ShowHargaKecuali;

const styles = StyleSheet.create({
    container: {
        paddingVertical:15,
        paddingHorizontal:10
    },
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"white",
        height:45,
        justifyContent:"center",
        color:"black",
    },
    textInput:{
        borderColor:"black",
        color:"black",
        borderRadius:5,
        fontSize:13,
        flex:1,
        marginLeft:35,
        borderBottomWidth:1,
    },
    segmenWrapper : {
        backgroundColor:'white',
        paddingVertical:20,
        paddingHorizontal:5,
        marginTop:5,
        marginBottom:10,
        borderRadius:5
    },
    segmenTitle :{
        fontSize:14,
        fontWeight:'700',
        color:'black',
        marginBottom:10
    },
    renderItemUserArea :{
        flexDirection:'row',
        backgroundColor:'#fcfcfc',
        justifyContent:"space-around",
        marginTop:12,
        borderWidth:0.3,
        paddingVertical:10,
        borderRadius:5
    },
    detailUser :{
        flex:0.7,
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
        width:50,
        height:50,
        borderRadius:120/2,
        alignItems:"flex-start",
    },
})