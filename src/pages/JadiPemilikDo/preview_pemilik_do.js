/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */

import React from 'react';
import { View, StyleSheet, } from 'react-native';
import CONSTANTS from '../../assets/constants';
import SearchBar from '../../components/SearchBar/search_bar_jadi_pemilik_do';
import DetailPemilikDo from '../../components/DetailPemilikDo';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const DANGER = CONSTANTS.COLOR.DANGER;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const PreviewPemilikDo = ({route, navigation}) => {
    let {username, id_ppks, nama_do, tanggal_perubahan_harga, hargaDoPPKS, keterangan_biaya_bongkar, keterangan_harga} = route.params;

    return(
        <View style={{flex:1}}>
            <SearchBar title={"Preview Pemilik Do"} refresh={false} navigation={navigation} />
            <DetailPemilikDo username={username} id_ppks={id_ppks} nama_do={nama_do} tanggal_perubahan_harga={tanggal_perubahan_harga} hargaDoPPKS={hargaDoPPKS} keterangan_biaya_bongkar={keterangan_biaya_bongkar} keterangan_harga={keterangan_harga} navigation={navigation} />
        </View>
    )
}

export default PreviewPemilikDo;

const styles = StyleSheet.create({
    container:{
        marginTop:15,
        marginHorizontal:15,
        padding:10,
        backgroundColor:'white',
    },
})