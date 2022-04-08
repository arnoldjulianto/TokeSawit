/* eslint-disable prettier/prettier */

// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from 'react';
import {ReportDanaMasukKeluarContext} from '../../../components/Context';
import Index from './index';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import CONSTANTS from '../../../assets/constants';
import { Alert } from 'react-native';
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const ContextReportDanaMasukKeluar = ({route, navigation}) => {
    const [danaMasukKeluar, setDanaMasukKeluar] = useState([]);
    const [showLoading,setShowLoading] = useState(true);
    const [refreshing, setRefreshing] = React.useState(true);
    let day   = new Date().getDate();
    let month = new Date().getMonth()+1;
    let year  = new Date().getFullYear();
    if(day.toString().length == 1 ) day = "0"+day;
    if(month.toString().length == 1 ) month = "0"+month;
    const [tanggal_transaksi1, setTanggalTransaksi1] = useState(year+"-"+month+"-01");
    const [tanggal_transaksi2, setTanggalTransaksi2] = useState(year+"-"+month+"-"+day);
    const [tanggal_nota1, setTanggalNota1] = useState(year+"-"+month+"-01");
    const [tanggal_nota2, setTanggalNota2] = useState(year+"-"+month+"-"+day);
    const [tanggal_input1, setTanggalInput1] = useState(year+"-"+month+"-01");
    const [tanggal_input2, setTanggalInput2] = useState(year+"-"+month+"-"+day);
    const [pelaksana, setPelaksana] = useState("");
    const [id_satuan, setIdSatuan] = useState("");
    const [jenis_dana, setJenisDana] = useState("");
    const [jenis_tanggal, setJenisTanggal] = useState("");
    const [search, setSearch] = useState("");
    const [typingTimeout, setTypingTimeout] = useState(0);
    const reportDanaMasukKeluarContext = React.useMemo(() => ({
        getReportDanaMasukKeluar : async (tanggal_transaksi1, tanggal_transaksi2, tanggal_nota1, tanggal_nota2, tanggal_input1, tanggal_input2, jenis_tanggal, jenis_dana, pelaksana,id_satuan, search, showLoading, refreshing) => {
            setTanggalTransaksi1(tanggal_transaksi1);
            setTanggalTransaksi2(tanggal_transaksi2);
            setTanggalNota1(tanggal_nota1);
            setTanggalNota2(tanggal_nota2);
            setTanggalInput1(tanggal_input1);
            setTanggalInput2(tanggal_input2);
            setPelaksana(pelaksana);
            setIdSatuan(id_satuan);
            setJenisDana(jenis_dana);
            setJenisTanggal(jenis_tanggal);
            setSearch(search);
            setRefreshing(refreshing);
            setShowLoading(showLoading);
        },
        getReportDanaMasukKeluarSearch : async (search, showLoading, refreshing) => {
            setSearch(search);
            setRefreshing(refreshing);
            setShowLoading(showLoading);
        },
    }),[])

    useEffect (() => {
        if(refreshing) getData();
     },[tanggal_transaksi1, tanggal_transaksi2, tanggal_nota1, tanggal_input1, tanggal_input2, tanggal_nota2, , tanggal_input1, tanggal_input2, jenis_tanggal, jenis_dana, pelaksana,id_satuan, search, showLoading, refreshing]);

     const getData = async() => {
        console.log('Get Data . . .');
        let username = "";
        try{
            username = await AsyncStorage.getItem("username");
        }catch(e){
            console.log(e);
        }
        const params = {
            tanggal_transaksi1,
            tanggal_transaksi2,
            tanggal_nota1,
            tanggal_nota2,
            tanggal_input1,
            tanggal_input2,
            jenis_tanggal,
            jenis_dana,
            pelaksana,
            id_satuan,
            search,
            username,
        }
        console.log(params);
        Axios.get(base_url+'DanaMasukKeluar/get_api_dana_masuk_keluar', {params})
        .then(response => {
            setDanaMasukKeluar(response);
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

    return (
        <ReportDanaMasukKeluarContext.Provider value={reportDanaMasukKeluarContext}>
            <Index danaMasukKeluar={danaMasukKeluar} navigation={navigation} showLoading={showLoading} refreshing={refreshing}  />
        </ReportDanaMasukKeluarContext.Provider>
    );

}
export default ContextReportDanaMasukKeluar;