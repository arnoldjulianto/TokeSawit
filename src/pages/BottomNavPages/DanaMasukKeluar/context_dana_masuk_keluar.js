/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {DanaMasukKeluarContext} from '../../../components/Context';
import { View, Alert, Platform } from 'react-native';
import CONSTANTS from '../../../assets/constants';
import FormDanaMasukKeluar from './form_dana_masuk_keluar';
import ProsesModal from '../../../components/ProsesModal';
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const ContextDanaMasukKeluar = ({route, navigation}) => {
    const { no_dana_masuk_keluar1, title } = route.params;
    const [modalVisible, setModalVisible] = useState(false);

    const [refreshForm, setRefreshForm] = useState(false);
    const [tanggal_transaksi, setTanggalTransaksi] = useState("");
    const [tanggal_nota, setTanggalNota] = useState("");
    const [jenis_dana, setJenisDana] = useState("");
    const [pelaksana, setPelaksana] = useState("");
    const [quantity, setQuantity] = useState("");
    const [id_satuan, setIdSatuan] = useState("");
    const [nilai, setNilai] = useState("");
    const [keterangan_dana_masuk_keluar, setKeteranganDanaMasukKeluar] = useState("");
    const [file_dana_masuk_keluar, setFileDanaMasukKeluar] = useState("");
    const [prosesSimpan, setProsesSimpan] = useState(false);

    useEffect (async() => {
        if(prosesSimpan){
            if(tanggal_transaksi == ""){
                Alert.alert(alert_title, "Tanggal Transaksi Belum Dipilih");
            }
            else if(tanggal_nota == ""){
                Alert.alert(alert_title, "Tanggal Nota Tidak Boleh Kosong");
            }
            else if(jenis_dana == ""){
                Alert.alert(alert_title, "Jenis Dana Tidak Boleh Kosong");
            }
            else if(pelaksana == "" || pelaksana == null ){
                Alert.alert(alert_title, "Pelaksana Tidak Boleh Kosong");
            }
            else if(quantity == ""){
                Alert.alert(alert_title, "Quantity Tidak Boleh Kosong");
            }
            else if(id_satuan == ""){
                Alert.alert(alert_title, "Satuan Tidak Boleh Kosong");
            }
            else if(nilai == ""){
                Alert.alert(alert_title, "Nilai Tidak Boleh Kosong");
            }
            else {
                let username = "";
                try{
                    username = await AsyncStorage.getItem("username");
                }catch(e){
                    console.log(e);
                }
                Alert.alert(
                    alert_title,
                    "Simpan ke Database?",
                    [
                    {
                        text: "Simpan",
                        onPress: () => prosesSimpanDb(username),
                        style: "default",
                    },
                    {
                        text: "Batal",
                        style: "cancel",
                    },
                    ],
                    {
                    cancelable: true
                    }
                );
            }
            setProsesSimpan(false);
        }
    },[tanggal_transaksi, tanggal_nota,  jenis_dana, pelaksana, quantity, id_satuan, nilai, keterangan_dana_masuk_keluar, file_dana_masuk_keluar, prosesSimpan]);


    //API & CONTEXT
    const danaMasukKeluarContext = React.useMemo(() => ({
        getDataForm : (tanggal_transaksi, tanggal_nota,  jenis_dana, pelaksana, quantity, id_satuan, nilai, keterangan_dana_masuk_keluar, file_dana_masuk_keluar, prosesSimpan) => {
            setTanggalTransaksi(tanggal_transaksi);
            setTanggalNota(tanggal_nota);
            setJenisDana(jenis_dana);
            setPelaksana(pelaksana);
            setQuantity(quantity);
            setIdSatuan(id_satuan);
            setNilai(nilai);
            setKeteranganDanaMasukKeluar(keterangan_dana_masuk_keluar);
            setFileDanaMasukKeluar(file_dana_masuk_keluar);
            setProsesSimpan(prosesSimpan);
            setRefreshForm(false);
        },
    }),[])
    const prosesSimpanDb = (username) => {
        setModalVisible(true);
        const params = {
            no_dana_masuk_keluar : no_dana_masuk_keluar1,
            tanggal_transaksi,
            tanggal_nota,
            jenis_dana,
            pelaksana,
            quantity,
            id_satuan,
            nilai,
            keterangan_dana_masuk_keluar,
            file_dana_masuk_keluar,
            username,
        }
        
        const createFormData = (file_dana_masuk_keluar, body) => {
            const data = new FormData();
            if(file_dana_masuk_keluar == "" ){
            }
            else {
                if(file_dana_masuk_keluar.fileName) {
                    data.append("file_dana_masuk_keluar", {
                    name: file_dana_masuk_keluar.fileName,
                    type: file_dana_masuk_keluar.type,
                    uri:
                        Platform.OS === "android" ? file_dana_masuk_keluar.uri : file_dana_masuk_keluar.uri.replace("file://", "")
                    });
                }
            }
            Object.keys(body).forEach(key => {
              data.append(key, body[key]);
            });
            console.log(data);
            return data;
        };

        Axios.post(base_url+'DanaMasukKeluar/api_add_post', createFormData(file_dana_masuk_keluar, params) )
        .then(response => {
            if(response.data[0].response == 1){
                Alert.alert(alert_title, ""+response.data[0].msg);
                setRefreshForm(true);
                setModalVisible(false);
            }
            else{
                Alert.alert(alert_title, ""+response.data[0].msg);
                setModalVisible(false);
            }
        })
        .catch(function (error) {
            Alert.alert(alert_title, "Terjadi Kesalahan\n"+error);
            setModalVisible(false);
        })
        setProsesSimpan(false);
    }
    //API & CONTEXT
    return(
        <DanaMasukKeluarContext.Provider value={danaMasukKeluarContext}>
            <View style={{flex:1}}>
                <FormDanaMasukKeluar no_dana_masuk_keluar={no_dana_masuk_keluar1} title={title} navigation={navigation} refreshForm={refreshForm}  />
            </View>    
            <View>
                <ProsesModal setModalVisible={setModalVisible} modalVisible={modalVisible} /> 
            </View>
        </DanaMasukKeluarContext.Provider>      
    );

}

export default ContextDanaMasukKeluar;


