/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */

import React from 'react';
import { View } from 'react-native';
import SearchBar from '../../components/SearchBar/search_bar_jadi_pemilik_do';
import ViewInputHargaDoPPKS from '../../components/InputHargaDoPPKS';

const InputHargaDoPPKS = ({route, navigation}) => {
    let {username, id_ppks, nama_do, keterangan_biaya_bongkar} = route.params;
    return(
        <View style={{flex:1}}>
            <SearchBar title={"Tentukan Harga"} refresh={false} navigation={navigation} />
            <ViewInputHargaDoPPKS username={username} id_ppks={id_ppks} nama_do={nama_do} keterangan_biaya_bongkar={keterangan_biaya_bongkar} navigation={navigation} />   
        </View>
    )
}
export default InputHargaDoPPKS;

