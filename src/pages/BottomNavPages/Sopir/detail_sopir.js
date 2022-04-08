/* eslint-disable prettier/prettier */
import React, { useEffect, useState }  from 'react';
import Axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import CONSTANTS from '../../../assets/constants';
import ProsesModal from '../../../components/ProsesModal';
const base_url = CONSTANTS.CONFIG.BASE_URL;
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
const DetailSopir = ({route, navigation } ) => {
    let day   = new Date().getDate();
    let month = new Date().getMonth()+1;
    let year  = new Date().getFullYear();
    if(month.toString().length == 1 ) month = "0"+month;

    const { id_register_sopir1, title } = route.params;
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [id_register_sopir, setIdRegisterSopir] = useState(id_register_sopir1);
    const [nama_unik, setNamaUnik] = useState("");
    const [tempat_lahir, setTempatLahir] = useState("");
    const [no_hp, setNoHp] = useState("");
    const [tanggal_lahir, setTanggalLahir] = useState(year+"-"+month+"-"+day);
    const [jenis_kelamin, setJenisKelamin] = useState("Laki-laki");
    const [no_sim, setNoSIM] = useState("");
    const [jenis_sim, setJenisSIM] = useState("A");
    const [tanggal_pembuatan_sim, setTanggalPembuatanSIM] = useState(year+"-"+month+"-"+day);
    const [tanggal_berakhir_sim, setTanggalBerakhirSIM] = useState(year+"-"+month+"-"+day);
    const [jenis_datepicker, setJenisDatePicker] = useState("");
    const [file_sopir, setFileSopir] = useState("");
    const [file_sim, setFileSIM] = useState("");
    const [file_ktp, setFileKTP] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    useEffect (() => {
        getDetailSopir();
    },[id_register_sopir]);

    const getDetailSopir = () => {
        const params = {
            id_register_sopir,
        }
        setModalVisible(true);
        Axios.get(base_url+'Sopir/get_api_detail_sopir', {params})
        .then(response => {
            setIdRegisterSopir(response.data[0].id_register_sopir);
            setNamaUnik(response.data[0].nama_unik);
            setTempatLahir(response.data[0].tempat_lahir);
            let tanggal_lahir1 = year+"-"+month+"-"+day;
            if( response.data[0].tanggal_lahir != "0000-00-00" ) tanggal_lahir1 = response.data[0].tanggal_lahir ;
            setTanggalLahir(tanggal_lahir1);
            setNoHp(response.data[0].no_hp);
            setJenisKelamin(response.data[0].jenis_kelamin);
            setNoSIM(response.data[0].no_sim);
            setJenisSIM(response.data[0].jenis_sim);
            let tanggal_pembuatan_sim1 = year+"-"+month+"-"+day;
            if( response.data[0].tanggal_pembuatan_sim != "0000-00-00" ) tanggal_pembuatan_sim1 = response.data[0].tanggal_pembuatan_sim;
            setTanggalPembuatanSIM(tanggal_pembuatan_sim1);
            let tanggal_berakhir_sim1 = year+"-"+month+"-"+day;
            if( response.data[0].tanggal_berakhir_sim != "0000-00-00" ) tanggal_berakhir_sim1 = response.data[0].tanggal_berakhir_sim;
            setTanggalBerakhirSIM(tanggal_berakhir_sim1);
            let file_sopir,file_sim,file_ktp ="";
            if(response.data[0].file_sopir != "") {
                file_sopir = base_url+"assets/upload/file sopir/"+response.data[0].file_sopir
            }else file_sopir="";
            if(response.data[0].file_sim != "") {
                file_sim = base_url+"assets/upload/file sim/"+response.data[0].file_sim
            }else file_sim="";
            if(response.data[0].file_ktp != "") {
                file_ktp = base_url+"assets/upload/file ktp/"+response.data[0].file_ktp
            }else file_ktp="";
            setFileSopir(file_sopir);
            setFileSIM(file_sim);
            setFileKTP(file_ktp);
            setModalVisible(false);
        }).catch(function (error) {
            Alert.alert("Pesan Dari AdminBES", "Terjadi Kesalahan"+error);
            setModalVisible(false);
        })
    };

    
    return (
        <View style={styles.container}>
            <ProsesModal setModalVisible={setModalVisible} modalVisible={modalVisible} />
            <Image source={{uri : file_sopir}} style={styles.sopirFoto} resizeMethod="resize"  />
            <View style={styles.profilWrapper}>
                <Text style={styles.text}>Nama Lengkap : {nama_unik}</Text>
            </View>
        </View>
    );
    
};

export default DetailSopir;

const styles = StyleSheet.create({
    container :{
        paddingVertical : 50,
        alignItems:"center",
        justifyContent: "center"
    },
    profilWrapper :{
        marginTop:20,
        borderWidth:1,
        alignItems:"center",
        justifyContent: "center"
    },
    text : {
        textAlign:"center"
    },
    sopirFoto : {
        width:150,
        height:150,
        borderRadius:150,
        justifyContent:'center',
    },
});