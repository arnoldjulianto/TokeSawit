/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React,{useEffect, useState} from 'react';
import {View, ScrollView, Text, TextInput, StyleSheet, Image, ActivityIndicator, RefreshControl, TouchableOpacity, Dimensions, FlatList} from 'react-native';
import SearchBar from '../../components/SearchBar/search_bar_jadi_pemilik_do';
import ViewInputDoPPKS from '../../components/InputDoPPKS';


const InputDoPPKS = ({route, navigation}) => {
    let {username} = route.params;
    

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

    return(
        <View style={{flex:1}}>
            <SearchBar title={"Pilih PPKS"} refresh={false} navigation={navigation} />
           <ViewInputDoPPKS username={username} navigation={navigation} />
        </View>
    );
}
export default InputDoPPKS;

