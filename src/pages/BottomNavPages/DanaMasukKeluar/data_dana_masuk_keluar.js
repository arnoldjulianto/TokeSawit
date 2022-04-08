/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
import Axios from 'axios';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CONSTANTS from '../../../assets/constants';
import ProsesModal from '../../../components/ProsesModal';

const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const DANGER = CONSTANTS.COLOR.DANGER;
const NAVY = CONSTANTS.COLOR.NAVY;
const PRIMARY = CONSTANTS.COLOR.PRIMARY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const formatAngka = (angka) => {
	if(angka != "") {
        let separator, prefix = "";
		let number_string = angka.replace(/[^,\d]/g, '').toString(),
		split   	= number_string.split(','),
		sisa     	= split[0].length % 3,
		rupiah     	= split[0].substr(0, sisa),
		ribuan     	= split[0].substr(sisa).match(/\d{3}/gi);
	 
		// tambahkan titik jika yang di input sudah menjadi angka ribuan
		if(ribuan){
			separator = sisa ? '.' : '';
			rupiah += separator + ribuan.join('.');
		}
		rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
		if(angka < 0) {
			rupiah = "-"+rupiah;
		}
		return prefix == undefined ? rupiah : (rupiah ? '' + rupiah : '');
	}
	else{
        let prefix, rupiah = "";
		return prefix == undefined ? rupiah : (rupiah ? '' + rupiah : '');
	}
}

const DataBukaTutupBuku = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    let file ="";
    if(props.file_dana_masuk_keluar != "" ) file = props.file_dana_masuk_keluar;
    const deleteData = (no_dana_masuk_keluar) => {
        Alert.alert(
            alert_title,
            "Apakah Anda Yakin Ingin Menghapus Data dengan No. "+no_dana_masuk_keluar+" ?",
            [
            {
                text: "Hapus",
                onPress: () => prosesDelete(no_dana_masuk_keluar),
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
    
    const prosesDelete = (no_dana_masuk_keluar) => {
        setModalVisible(true);
        const params = {
            no_dana_masuk_keluar
        }
        Axios.get(base_url+'DanaMasukKeluar/api_delete_dana_masuk_keluar', {params})
        .then(response => {
            console.log(response)
            if(response.data.response == 1){
                Alert.alert(alert_title, "Data Berhasil Dihapus");
            }
            else{
                Alert.alert(alert_title, "Data Gagal Dihapus");
            }
            setModalVisible(false);
            props.onRefresh();
        })
    }

    const RenderFoto = (props) => {
        if(props.src != "") {
            if(props.src.uri) {
                return (
                    <Image style={styles.tampungFoto} source={{uri: props.src.uri}} resizeMethod="resize"  />
                )
            }
            else{
                return (
                    <Image style={styles.tampungFoto} source={{uri: props.src}} resizeMethod="resize"  />
                )
            }
        }
        else {
            return (
                <View/>
            )
        }
    }

    return (
		<View style={styles.container}>
             
			<View style={styles.contentRow}>
				<Text style={styles.text}>No.</Text>
				<Text style={styles.textPemisah}> : </Text>
				<Text style={styles.textDanger}>{props.no_dana_masuk_keluar}</Text>
			</View>

			<View style={styles.contentRow}>
				<Text style={styles.text}>Jenis Dana</Text>
				<Text style={styles.textPemisah}> : </Text>
				<Text style={styles.textDanger}>{props.jenis_dana}</Text>
			</View>

			<View style={styles.contentRow}>
				<Text style={styles.text}>Tanggal Transaksi</Text>
				<Text style={styles.textPemisah}> : </Text>
				<Text style={styles.textDanger}>{props.tanggal_transaksi}</Text>
			</View>

			<View style={styles.contentRow}>
				<Text style={styles.text}>Tanggal Nota</Text>
				<Text style={styles.textPemisah}> : </Text>
				<Text style={styles.textDanger}>{props.tanggal_nota}</Text>
			</View>

			<View style={styles.contentRow}>
				<Text style={styles.text}>Tanggal & Waktu Input</Text>
				<Text style={styles.textPemisah}> : </Text>
				<Text style={styles.textDanger}>{props.waktu_input_dana_masuk_keluar.substr(0,10)} {props.waktu_input_dana_masuk_keluar.substr(11,5)}</Text>
			</View>

			<View style={styles.contentRow}>
				<Text style={styles.text}>Pelaksana</Text>
				<Text style={styles.textPemisah}> : </Text>
				<Text style={styles.textDanger}>{props.pelaksana}</Text>
			</View>

			<View style={styles.contentRow}>
				<Text style={styles.text}>Quantity</Text>
				<Text style={styles.textPemisah}> : </Text>
				<Text style={styles.textDanger}>{formatAngka(props.quantity)+" "+props.nama_satuan}</Text>
			</View>

			<View style={styles.contentRow}>
				<Text style={styles.text}>Nilai</Text>
				<Text style={styles.textPemisah}> : </Text>
				<Text style={styles.textDanger}>{"Rp "+formatAngka(props.nilai)}</Text>
			</View>

			<View style={styles.contentRow}>
				<Text style={styles.text}>Keterangan</Text>
				<Text style={styles.textPemisah}> : </Text>
				<Text style={styles.textDanger}>{props.keterangan_dana_masuk_keluar}</Text>
			</View>

			<View style={styles.contentRow}>
                <Text style={styles.text}>Diinput Oleh</Text>
                <Text style={styles.textPemisah}> : </Text>
                <Text style={styles.textDanger}>{props.username}</Text>
            </View > 

            <View style={styles.contentRow}>
                <RenderFoto src={file} /> 
            </View>  

            <View style={styles.contentRow}>
                <TouchableOpacity style={styles.btnEdit} onPress={() => props.navigation.navigate('ContextDanaMasukKeluar', {
                        no_dana_masuk_keluar1: props.no_dana_masuk_keluar,
                        title: 'Form Ubah Dana Masuk / Keluar'
                }) } >
                        <Icon name="edit" type="ionicon" size={26} color="white"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnDelete} onPress={() => deleteData(props.no_dana_masuk_keluar) } >
                        <Icon name="trash" type="ionicon" size={26} color="white"/>
                </TouchableOpacity>
            </View>
            <ProsesModal setModalVisible={setModalVisible} modalVisible={modalVisible} />
		</View>	
    );

}

export default DataBukaTutupBuku;


const styles = StyleSheet.create({
    container : {
        flexDirection:'column',
        marginTop:20,
        marginHorizontal:8,
        padding:15,
        backgroundColor:'white',
        borderRadius:10,
    },
    contentRow :{
        flexDirection : "row",
        justifyContent : "space-between",
        //alignItems : "center"
    },
    tampungFoto:{
        width:"100%",
        height:130,
        borderRadius:8,
        marginVertical:20,
    },
    text : {
        flex:1,
        fontSize:14,
        color:NAVY,
        textAlign:"left"
    },
    textPemisah : {
        width:50,
        fontSize:14,
        color:NAVY,
        textAlign:"center"
    },
    textDanger : {
        flex:1,
        fontSize:14,
        color:DANGER,
        textAlign:"left"
    },
    btnEdit :{
        flex:1,
        justifyContent : "space-between",
        alignItems : "center",
        backgroundColor : NAVY,
        marginHorizontal:10,
        paddingVertical:5,
        marginTop:10,
        borderRadius:10
    },
    btnDelete :{
        flex:1,
        justifyContent : "space-between",
        alignItems : "center",
        backgroundColor : ORANGE,
        marginHorizontal:10,
        paddingVertical:5,
        marginTop:10,
        borderRadius:10
    }
})