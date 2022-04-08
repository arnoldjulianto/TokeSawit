/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import iconSearch from '../../../assets/icon/search.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import CONSTANTS from '../../../assets/constants';
import Axios from 'axios';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
import NoData from '../../../assets/img/no data.svg';
import DataSopir from './data_sopir';
import Loading from './loading';

const base_url = CONSTANTS.CONFIG.BASE_URL;

const CariSopir = ({route,navigation }) => {
    const [sopir, setSopir] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    let  searchLabel ="Cari Nama, NIK, atau Lainnya";
    const [showLoading,setShowLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(0);

    const onRefresh = React.useCallback((value) => {
        setSearchValue(value);
        clearTimeout(typingTimeout);
        setTypingTimeout(
            setTimeout(() => {
                setShowLoading(true);  
                setRefreshing(true);
                setSopir([]);
                searchData(value);
            },500)
        );
    }, [searchValue]);

    useEffect (() => {
        const loadPage = navigation.addListener('focus', () => {
            onRefresh()
        });
        return loadPage;
    },[navigation]);
    
    const searchData = (a) => {
        const params = {
            searchValue : a,
        }
        Axios.get(base_url+'Sopir/get_api_search_sopir', {params})
        .then(response => {
            if(response.data.length > 0) {
                setSopir(response);
            }
            else{
                setSopir([]);
            }
            setShowLoading(false);
            setRefreshing(false);
        });
    }

    return (
        <View style={{flex:1}}>
            <View style={styles.searchBarWrapper}>
                <View style={styles.searchBarTopWrapper}>
                    <TouchableOpacity onPress={() => navigation.goBack() } >
                            <Icon name="arrow-left" type="ionicon" size={26} color="white" style={{marginRight:15, marginLeft:0,marginTop:5}} />
                    </TouchableOpacity>
                    <View style={styles.searchBarInputWrapper}>
                        <Image source={iconSearch} style={styles.searchBarIcon}/>
                        <TextInput style={styles.searchBarInput} placeholder={searchLabel} placeholderTextColor="gray" autoFocus={true} onChangeText={(value) => onRefresh(value) } value={searchValue}  ></TextInput>
                    </View>
                </View>
            </View>
            <ListSopir navigation={navigation} sopir={sopir} showLoading={showLoading} refershing={refreshing} onRefresh={onRefresh} />
        </View>
    );
}

const DataNotFound = (props) =>{
    return(
        <View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                    refreshing={props.refreshing}
                    onRefresh={props.onRefresh}
                    />
                }
            >
                <View style={styles.noDataWrapper}>
                    <NoData width={250} height={150} />
                    <Text style={styles.noDataText1}>Tidak Ada Data Ditemukan</Text>
                    <Text style={styles.noDataText2}>Gunakan Kolom Pencarian Untuk Mencari Data Sopir Dengan Kata Kunci Lain</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const ListSopir = (props) => {
    if(props.showLoading ){
        return(
            <View style={{flex:1}} >
                <Loading />
                <Loading />
                <Loading />
                <Loading />
                <Loading />
                <Loading />
            </View>
        );
    }
    else{
        if(!props.sopir.data){
            return(
                <View >
                    <DataNotFound refreshing={props.refreshing} onRefresh={props.onRefresh} />
                </View>
            )
        }else{
            if(props.sopir.data.length <= 0 ) {
                return(
                    <View >
                        <DataNotFound refreshing={props.refreshing} onRefresh={props.onRefresh} />
                    </View>
                )
            }
            else{
                return(
                    <View style={{flex:1}}>
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                refreshing={props.refreshing}
                                onRefresh={props.onRefresh}
                                />
                            }
                        >
                        {
                            props.sopir.data.map(data => {
                                let file_sopir,file_sim,file_ktp ="";
                                if(data.file_sopir != "") {
                                    file_sopir = base_url+"assets/upload/file sopir/"+data.file_sopir
                                }else file_sopir="";
                                if(data.file_sim != "") {
                                    file_sim = base_url+"assets/upload/file sim/"+data.file_sim
                                }else file_sim="";
                                if(data.file_ktp != "") {
                                    file_ktp = base_url+"assets/upload/file ktp/"+data.file_ktp
                                }else file_ktp="";
                                return <DataSopir id_register_sopir={data.id_register_sopir} navigation={props.navigation} nama_unik={data.nama_unik} tempat_lahir={data.tempat_lahir} tanggal_lahir={data.tanggal_lahir} no_hp={data.no_hp} jenis_kelamin={data.jenis_kelamin} no_sim={data.no_sim} jenis_sim={data.jenis_sim} tanggal_pembuatan_sim={data.tanggal_pembuatan_sim} tanggal_berakhir_sim={data.tanggal_berakhir_sim}  file_sopir={file_sopir} file_sim={file_sim} file_ktp={file_ktp} getData={props.getData} onRefresh={props.onRefresh} />
                            })
                        }
                        </ScrollView>
                    </View>
                );
            }
        }
    }
    
}

export default CariSopir;

const styles = StyleSheet.create({
    searchBarWrapper : {
        height:54,
        backgroundColor:'#009933',
        padding:10,
    },
    searchBarTopWrapper : {
        flexDirection : 'row',
    },
    searchBarTopIcon : {
        width:23,
        height:23,
        marginHorizontal:6,
        marginTop:7
    },
    searchBarInputWrapper : {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius:5,
        backgroundColor:"#fff",
        height:38,
        flex:1,
        marginLeft:0
    },
    searchBarIcon : {
        marginLeft:10,
        height: 20,
        width: 20,
        position:'relative',
    },
    searchBarInput : {
        flex:1,
        fontSize:12,
        fontWeight : '100',
        color:'gray',
        paddingLeft:10,
    },
    noDataWrapper:{
        flex:1,
        alignItems:"center", 
        justifyContent:"center",
        paddingTop:200
    },
    noDataText1:{
        fontSize:16,
        color:"#dc3545",
        textAlign:"center",
        marginTop:20
    },
    noDataText2:{
        width:300,
        textAlign:"center",
        fontSize:12,
        color:"gray"
    },
});