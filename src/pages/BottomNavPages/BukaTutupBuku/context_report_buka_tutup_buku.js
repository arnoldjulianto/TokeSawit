/* eslint-disable prettier/prettier */

// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from 'react';
import {ReportBukaTutupBukuContext} from '../../../components/Context';
import Index from './index';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import CONSTANTS from '../../../assets/constants';
import { Alert } from 'react-native';
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const ContextReportBukaTutupBuku = ({route, navigation}) => {
    const [bukaTutupBuku, setBukaTutupBuku] = useState([]);
    const [showLoading,setShowLoading] = useState(true);
    const [refreshing, setRefreshing] = React.useState(true);
    let day   = new Date().getDate();
    let month = new Date().getMonth()+1;
    let year  = new Date().getFullYear();
    if(day.toString().length == 1 ) day = "0"+day;
    if(month.toString().length == 1 ) month = "0"+month;
    const [tanggal1, setTanggal1] = useState(year+"-"+month+"-01");
    const [tanggal2, setTanggal2] = useState(year+"-"+month+"-"+day);
    const [jenis_buka_tutup_buku, setJenisBukaTutupBuku] = useState("");
    const [search, setSearch] = useState("");
    const [typingTimeout, setTypingTimeout] = useState(0);
    const reportBukaTutupBukuContext = React.useMemo(() => ({
        getReportBukaTutupBuku : async (tanggal1, tanggal2, jenis_buka_tutup_buku, search, showLoading, refreshing) => {
            setTanggal1(tanggal1);
            setTanggal2(tanggal2);
            setJenisBukaTutupBuku(jenis_buka_tutup_buku);
            setSearch(search);
            setRefreshing(refreshing);
            setShowLoading(showLoading);
        },
        getReportBukaTutupBukuSearch : async (search, showLoading, refreshing) => {
            setSearch(search);
            setRefreshing(refreshing);
            setShowLoading(showLoading);
        },
    }),[])

    useEffect (() => {
       if(refreshing) getData();
    },[tanggal1, tanggal2, jenis_buka_tutup_buku, search, showLoading, refreshing]);


    const getData = async() => {
        console.log('Get Data . . .');
        let username = "";
        try{
            username = await AsyncStorage.getItem("username");
        }catch(e){
            console.log(e);
        }
        const params = {
            tanggal1,
            tanggal2,
            jenis_buka_tutup_buku,
            username,
            search
        }
        console.log(params);
        Axios.get(base_url+'BukaTutupBuku/get_api_buka_tutup_buku', {params})
        .then(response => {
            setBukaTutupBuku(response);
            setShowLoading(false);
            setRefreshing(false);
            console.log('Data Retrieved')
        })
        .catch(function (error) {
            Alert.alert(alert_title, "Terjadi Kesalahan\n"+error);
            setShowLoading(false);
            setRefreshing(false);
        })
    }

    //API & CONTEXT

    return (
        <ReportBukaTutupBukuContext.Provider value={reportBukaTutupBukuContext}>
            <Index bukaTutupBuku={bukaTutupBuku} navigation={navigation} showLoading={showLoading} refreshing={refreshing}  />
        </ReportBukaTutupBukuContext.Provider>
    );

}
export default ContextReportBukaTutupBuku;