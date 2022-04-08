/* eslint-disable prettier/prettier */
import Axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View, Animated, Alert } from 'react-native';
import CONSTANTS from '../../../assets/constants';
import NoData from '../../../assets/img/no data.svg';
import SearchBar from '../../../components/SearchBar';
import DataSopir from './data_sopir';
import Loading from './loading';

const base_url = CONSTANTS.CONFIG.BASE_URL;

const Sopir = ({navigation}) => {
    const [sopir, setSopir] = useState([]);
    const [showLoading,setShowLoading] = useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [toggleSearchBar, setToggleSearchBar] = useState(true);
    const [offset, setOffSet] = useState(0);
    
    const onRefresh = React.useCallback(() => {
      setShowLoading(true);  
      setRefreshing(true);
      setSopir([]);
      getData();
    }, []);

    useEffect (() => {
        const loadPage = navigation.addListener('focus', () => {
            setToggleSearchBar(true);
            onRefresh()
        });
        return loadPage;
    },[navigation]);

    const getData = () => {
        Axios.get(base_url+'Sopir/get_api_sopir')
        .then(response => {
            setSopir(response);
            setShowLoading(false);
            setRefreshing(false);
        })
        .catch(function (error) {
            Alert.alert("Pesan Dari AdminBES", "Terjadi Kesalahan"+error);
            setShowLoading(false);
            setRefreshing(false);
        })
    }
    
    
    const handleOnScroll = (event) => {
        // const currentOffset = event.nativeEvent.contentOffset.y;
        // //const dif = currentOffset - (offset || 0);
        // setOffSet(currentOffset);
        // var direction = currentOffset > offset ? 'down' : 'up';
        // if (direction == 'down' ) {
        //     navigation.setOptions({tabBarVisible: false});
        //     setToggleSearchBar(false);
        // }
        // else {
        //     navigation.setOptions({tabBarVisible: true});
        //     setToggleSearchBar(true);
        // }
        // console.log('dif=',offset+"  "+"currentOffset="+currentOffset);
    }   
    
    let searchBarAnim = useRef(new Animated.Value(-60)).current;
    if (toggleSearchBar  ) {
        Animated.timing(searchBarAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start()
    } else {
        Animated.timing(searchBarAnim, {
            toValue: -65,
            duration: 200,
            useNativeDriver: true,
        }).start()
    }

    const renderItem = ({ item }) => {
        let file_sopir,file_sim,file_ktp ="";
        if(item.file_sopir != "") {
            file_sopir = base_url+"assets/upload/file sopir/"+item.file_sopir
        }else file_sopir="";
        if(item.file_sim != "") {
            file_sim = base_url+"assets/upload/file sim/"+item.file_sim
        }else file_sim="";
        if(item.file_ktp != "") {
            file_ktp = base_url+"assets/upload/file ktp/"+item.file_ktp
        }else file_ktp="";
        return (
            <View >
                <DataSopir id_register_sopir={item.id_register_sopir}  nama_unik={item.nama_unik} tempat_lahir={item.tempat_lahir} tanggal_lahir={item.tanggal_lahir} no_hp={item.no_hp} jenis_kelamin={item.jenis_kelamin} no_sim={item.no_sim} jenis_sim={item.jenis_sim} tanggal_pembuatan_sim={item.tanggal_pembuatan_sim} tanggal_berakhir_sim={item.tanggal_berakhir_sim}  file_sopir={file_sopir} file_sim={file_sim} file_ktp={file_ktp} navigation={navigation} getData={getData} onRefresh={onRefresh}  />
            </View>
        );
    }

    if(showLoading){
        return(
            <View style={{flex:1}} >
                <SearchBar navigation={navigation} toggleSearchBar={toggleSearchBar} searchLabel="Cari Nama, NIK, atau Lainnya" goTo="CariSopir" />
                <View >
                    <Loading />
                    <Loading />
                    <Loading />
                    <Loading />
                    <Loading />
                    <Loading />
                </View>
            </View>
        );
    }
    else{
        if(sopir.data.length == 0) {
            return(
                <View style={{flex:1}}>
                    <SearchBar navigation={navigation} toggleSearchBar={toggleSearchBar} searchLabel="Cari Nama, NIK, atau Lainnya" goTo="CariSopir" />
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                />
                            }
                        >
                            <View style={styles.noDataWrapper}>
                                <NoData width={250} height={150} />
                                <Text style={styles.noDataText1}>Tidak Ada Data Ditemukan</Text>
                                <Text style={styles.noDataText2}>Gunakan Tombol Tambah di Pojok Kanan Atas Untuk Menambah Data Sopir</Text>
                            </View>
                        </ScrollView>
                </View>
            )
        }
        else{
            return(
                <View style={{flex:1}}>
                    <SearchBar navigation={navigation} toggleSearchBar={toggleSearchBar} style={{flex:1}} searchLabel="Cari Nama, NIK, atau Lainnya" goTo="CariSopir" />
                    <Animated.FlatList
                        data={sopir.data}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        onScroll={(e) => handleOnScroll(e)}
                        style={{ transform: [{ translateY: searchBarAnim }], flex:1 }}
                        navigation={navigation}
                        getData={getData}
                        refreshControl={
                            <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            />
                        }
                    />
                </View>
            );
        }
    }
};



export default Sopir;

const styles = StyleSheet.create({
    loading : {
        backgroundColor:"white",
        height:100,
        marginTop:20,
        marginBottom:5,
        marginHorizontal:8,
        padding:15,
        justifyContent: 'space-around',
    },
    container:{
        paddingHorizontal : 10,
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
})