/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {BukaTutupBukuContext} from '../../../components/Context';
import { View, Alert, Platform } from 'react-native';
import CONSTANTS from '../../../assets/constants';
import FormBukaTutupBuku from './form_buka_tutup_buku';
import ProsesModal from '../../../components/ProsesModal';
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const ContextBukaTutupBuku = ({route, navigation}) => {
    const { no_buka_tutup_buku1, title } = route.params;
    const [no_buka_tutup_buku, setNoBukaTutupBuku] = useState(no_buka_tutup_buku1);
    const [modalVisible, setModalVisible] = useState(false);
    const [id_detail_buka_tutup_buku, setIdDetailBukaTutupBuku] = useState("");
    const [tanggal_buka_tutup_buku, setTanggalBukaTutupBuku] = useState("");
    const [jam_buka_tutup_buku, setJamBukaTutupBuku] = useState("");
    const [jenis_buka_tutup_buku, setJenisBukaTutupBuku] = useState("");
    const [file_buka_tutup_buku1, setFileBukaTutupBuku1] = useState("");
    const [file_buka_tutup_buku2, setFileBukaTutupBuku2] = useState("");
    const [prosesSimpan, setProsesSimpan] = useState(false);
    const [nominal, setNominal] = useState([500]);
    const [jumlah, setJumlah] = useState([""]);
    const [total, setTotal] = useState([""]);
    const [refreshForm, setRefreshForm] = useState(false);

    const cekDataJumlahLembar = () => {
        let i = 0;
        let cek = "false";
        for(i = 0; i <= jumlah.length; i++){
            if(jumlah[i] == "") {
                cek = i;
                break;
            }
            else{
                cek = "true";
            }
        }
        return cek;
    }

    const cekDataTotal = () => {
        let i = 0;
        let cek = "false";
        for(i = 0; i <= total.length; i++){
            if(total[i] == "") {
                cek = i;
                break;
            }
            else{
                cek = "true";
            }
        }
        return cek;
    }

    useEffect (async() => {
        if(prosesSimpan){
            if(jenis_buka_tutup_buku == ""){
                Alert.alert(alert_title, "Buka / Tutup Buku Belum Dipilih");
            }
            else if(tanggal_buka_tutup_buku == ""){
                Alert.alert(alert_title, "Tanggal Transaksi Tidak Boleh Kosong");
            }
            else if(jam_buka_tutup_buku == ""){
                Alert.alert(alert_title, "Jam Transaksi Tidak Boleh Kosong");
            }
            else if(nominal.length == 0 || jumlah.length == 0 || total.length == 0  ){
                Alert.alert(alert_title, "Detail Buka / Tutup Buku Tidak Boleh Kosong");
            }
            else {
                const cek1 = cekDataJumlahLembar();
                const cek2 = cekDataTotal();
                console.log(cek1);
                if(cek1 != "true" ){
                    Alert.alert(alert_title, "Jumlah Pada Baris Ke - "+(cek1+1)+" Tidak Boleh Kosong");
                }
                else if (cek2 != "true" ){
                    Alert.alert(alert_title, "Total Pada Baris Ke - "+(cek2+1)+" Tidak Boleh Kosong");
                }
                else if(file_buka_tutup_buku1 == ""){
                    Alert.alert(alert_title, "Foto 1 Tidak Boleh Kosong");
                }
                else if(file_buka_tutup_buku2 == ""){
                    Alert.alert(alert_title, "Foto 2 Tidak Boleh Kosong");
                }
                //ALL CHECK IS TRUE
                else{
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
                //ALL CHECK IS TRUE
            }
            setProsesSimpan(false);
        }
    },[tanggal_buka_tutup_buku, jam_buka_tutup_buku, jenis_buka_tutup_buku, file_buka_tutup_buku1, file_buka_tutup_buku2, nominal, jumlah, total, prosesSimpan]);

    const createFormData = (file_buka_tutup_buku1,file_buka_tutup_buku2, body) => {
        const data = new FormData();
        if(file_buka_tutup_buku1 == "" ){
        }
        else {
            if(file_buka_tutup_buku1.fileName) {
                data.append("file_buka_tutup_buku1", {
                name: file_buka_tutup_buku1.fileName,
                type: file_buka_tutup_buku1.type,
                uri:
                    Platform.OS === "android" ? file_buka_tutup_buku1.uri : file_buka_tutup_buku1.uri.replace("file://", "")
                });
            }
        }
        if(file_buka_tutup_buku2 == "" ){
        }
        else {
            if(file_buka_tutup_buku2.fileName) {
                data.append("file_buka_tutup_buku2", {
                name: file_buka_tutup_buku2.fileName,
                type: file_buka_tutup_buku2.type,
                uri:
                    Platform.OS === "android" ? file_buka_tutup_buku2.uri : file_buka_tutup_buku2.uri.replace("file://", "")
                });
            }
        }
        Object.keys(body).forEach(key => {
          data.append(key, body[key]);
        });
        console.log(data);
        return data;
    };
    var jsonIdDetailBukaTutupBuku = JSON.stringify(id_detail_buka_tutup_buku);
    var jsonNominal = JSON.stringify(nominal);
    var jsonJumlah = JSON.stringify(jumlah);
     //API & CONTEXT
     const prosesSimpanDb = (username) => {
        setModalVisible(true);
        const params = {
            no_buka_tutup_buku : no_buka_tutup_buku1,
            jenis_buka_tutup_buku,
            tanggal_buka_tutup_buku,
            jam_buka_tutup_buku,
            id_detail_buka_tutup_buku: jsonIdDetailBukaTutupBuku,
            nominal: jsonNominal,
            jumlah : jsonJumlah,
            file_buka_tutup_buku1,
            file_buka_tutup_buku2,
            username,
        }
        
        Axios.post(base_url+'BukaTutupBuku/api_add_post', createFormData(file_buka_tutup_buku1,file_buka_tutup_buku2, params) )
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

    const bukaTutupBukuContext = React.useMemo(() => ({
        getDataForm : (jenis_buka_tutup_buku, tanggal_buka_tutup_buku, jam_buka_tutup_buku, file_buka_tutup_buku1, file_buka_tutup_buku2, prosesSimpan) => {
            setJenisBukaTutupBuku(jenis_buka_tutup_buku);
            setTanggalBukaTutupBuku(tanggal_buka_tutup_buku);
            setJamBukaTutupBuku(jam_buka_tutup_buku);
            setFileBukaTutupBuku1(file_buka_tutup_buku1);
            setFileBukaTutupBuku2(file_buka_tutup_buku2);
            setProsesSimpan(prosesSimpan);
            setRefreshForm(false);
        },
        getDataDetail : (id_detail_buka_tutup_buku, nominal, jumlah, total ) => {
            setIdDetailBukaTutupBuku(id_detail_buka_tutup_buku);
            setNominal(nominal);
            setJumlah(jumlah);
            setTotal(total);
            setRefreshForm(false);
        },
    }),[])
    //API & CONTEXT
    
    return(
        <BukaTutupBukuContext.Provider value={bukaTutupBukuContext}>
            <View style={{flex:1}}>
                <FormBukaTutupBuku no_buka_tutup_buku={no_buka_tutup_buku1} title={title} navigation={navigation} refreshForm={refreshForm}  />
            </View>    
            <View>
                <ProsesModal setModalVisible={setModalVisible} modalVisible={modalVisible} /> 
            </View>
        </BukaTutupBukuContext.Provider>      
    );
}

export default ContextBukaTutupBuku;