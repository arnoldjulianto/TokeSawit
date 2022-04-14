/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, TextInput, Image } from 'react-native';
import CONSTANTS from '../../assets/constants';
import SearchBar from '../../components/SearchBar/search_bar_jadi_pemilik_do';
import Icon from 'react-native-vector-icons/FontAwesome5';
import iconNext from '../../assets/icon/next.png';
import iconVerified from '../../assets/icon/verified.png';
import iconBan from '../../assets/icon/ban.png';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const DANGER = CONSTANTS.COLOR.DANGER;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const AddDoSaya = ({route, navigation}) => {
    let {username, id_ppks} = route.params;
    const [searchParam, setSearchParam] = useState("");
    const [checkText, setCheckText] = useState("");
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [validNamaDo, setValidNamaDo] = useState();

    useEffect(()=>{
        console.log(id_ppks)
        setCheckText("");
        setValidNamaDo();
        let timeout = setTimeout(()=>{
            cekNamaDo();
        },400)
        
        return () => clearTimeout(timeout);
    },[searchParam])

    const cekNamaDo = () => {
        setLoadingVisible(true);
        const timeout = setTimeout(() => {
            setLoadingVisible(false);
        }, 30000);

        const params = {
            username,
            id_ppks,
            searchParam
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
        fetch(base_url+'PemilikDo/get_api_cek_nama_do',
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
            setCheckText(json.msg)
            if(json.response == 1) setValidNamaDo(true);
            else setValidNamaDo(false);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(error);
            setCheckText("Terjadi Kesalahan Saat Menghubungi Server");
        });
    }

    const loadTentukanBiayaBongkar = () => {
        navigation.navigate("BiayaBongkar", {username,id_ppks,nama_do:searchParam})
    }

    return(
        <View style={{flex:1}}>
            <SearchBar title={"Tulis Nama Do Anda"} refresh={false} navigation={navigation} />
            <View style={styles.container}>
                <View style={styles.formGroup}>
                    <View style={styles.inputWrapper}>
                        {/* <Icon name="search" type="ionicon" size={20} color="gray" style={{position:"absolute", left:10,bottom:10}} /> */}
                        <TextInput style={styles.textInput} placeholder="Masukkan Nama Do" placeholderTextColor= 'gray' value={searchParam} onChangeText = { (value) => {setSearchParam(value.toUpperCase())} } autoFocus={true} 
                        />
                        {loadingVisible && (
                            <ActivityIndicator size={22} color={ORANGE} style={{right:20}} />
                        )}
                    </View>
                </View>
                
                <View style={styles.formGroup}>
                    <View style={{flexDirection:'row', justifyContent:'space-between',padding:10}} >
                        <Text style={{flex:3}}>{checkText}</Text>
                        <View style={{flex:1,alignItems:'flex-start'}}>
                            {validNamaDo && (
                                <Image source={iconVerified} style={styles.btnLanjutkanIcon}  />
                            )}

                            {validNamaDo == false && (
                                <Image source={iconBan} style={styles.btnLanjutkanIcon}  />
                            )}
                        </View>
                    </View>
                </View>    
                
                {validNamaDo && (
                    <View style={styles.formGroup}>
                        <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {loadTentukanBiayaBongkar()} }>
                            <View style={{flexDirection:"row",justifyContent:'center'}}>
                                <Text style={styles.btnLanjutkanLabel}>Lanjutkan</Text>
                                <Image source={iconNext} style={styles.btnLanjutkanIcon}  />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
                
            </View>
        </View>
    );
}

export default AddDoSaya;

const styles = StyleSheet.create({
    container:{
        marginTop:15,
        marginHorizontal:15,
        padding:20,
        backgroundColor:'white',
    },
    formGroup :{
        marginBottom:10
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
        borderBottomWidth:0.5,
        borderColor:"black",
        color:"black",
        borderRadius:5,
        fontSize:15,
        flex:1,
        marginHorizontal:10,
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
})