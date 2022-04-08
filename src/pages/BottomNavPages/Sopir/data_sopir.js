/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
import Axios from 'axios';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CONSTANTS from '../../../assets/constants';
import ProsesModal from '../../../components/ProsesModal';

const base_url = CONSTANTS.CONFIG.BASE_URL;

const DataSopir = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const deleteData = (id_register_sopir) => {
        Alert.alert(
            "Pesan Dari AdminBES",
            "Apakah Anda Yakin Ingin Menghapus Data?",
            [
            {
                text: "Hapus",
                onPress: () => prosesDelete(id_register_sopir),
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
    
    const prosesDelete = (id_register_sopir) => {
        setModalVisible(true);
        const params = {
            id_register_sopir
        }
        Axios.get(base_url+'Sopir/api_delete_sopir', {params})
        .then(response => {
            console.log(response)
            if(response.data.response == 1){
                Alert.alert("Pesan Dari AdminBES", "Data Berhasil Dihapus");
            }
            else{
                Alert.alert("Pesan Dari AdminBES", "Data Gagal Dihapus");
            }
            setModalVisible(false);
            props.onRefresh();
        })
    }

    return (
        <View style={styles.dataSopirWrapper}>
            <Image source={{uri : props.file_sopir}} style={styles.sopirFoto} resizeMethod="resize"  />
            <View style={styles.sopirContent}>
                <Text style={styles.sopirNama}>{props.nama_unik}</Text>
                <Text style={{fontSize:14,color:'firebrick'}}>{props.no_hp}</Text>
                <TouchableOpacity style={styles.btnDetail}  onPress={() => props.navigation.navigate("DetailSopir", {
                        id_register_sopir1: props.id_register_sopir,
                      }) 
                    } >
                    <Icon name="info" size={18} color="white"></Icon>
                    <Text style={{color:"white",fontSize:13, marginLeft:10}}>Detail</Text>
                </TouchableOpacity>
            </View >

            <View style={styles.aksi}>
                <TouchableOpacity style={styles.btnEdit} 
                    onPress={() => props.navigation.navigate("FormSopir", {
                        id_register_sopir1: props.id_register_sopir,
                        title: 'Form Ubah Data Sopir',
                      }) 
                    }  
                >
                     <Icon name="edit" size={23} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnDelete} onPress={() => deleteData(props.id_register_sopir) } >
                    <Icon name="trash" size={23} color="white"   />
                </TouchableOpacity>
                <ProsesModal setModalVisible={setModalVisible} modalVisible={modalVisible} />
            </View >
        </View>
    );
};

export default DataSopir;

const styles = StyleSheet.create({
    dataSopirWrapper : {
        flexDirection:'row',
        justifyContent: 'space-around',
        marginBottom:20,
        marginHorizontal:8,
        padding:15,
        backgroundColor:'white',
        borderRadius:10,
    },
    sopirContent : {
        flex:1,
        marginHorizontal:20,
    },
    sopirFoto : {
        width:70,
        height:70,
        borderRadius:70,
        justifyContent:'center',
    },
    sopirNama : {
        fontSize:15,
        fontWeight:'bold',
        fontFamily:'Georgia'
    },
    sopirNoHp : {
        fontSize:15,
        fontFamily:'Georgia',
        color:'darkred'
    },

    sopirAksi : {
        alignItems:'center',
        justifyContent: 'space-between',
    },
    btnDetail :{
        flexDirection:"row",
        position:'relative',
        right:1,
        width:100,
        height:33,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'lightseagreen',
        marginTop:10,
    },
    btnEdit :{
        position:'relative',
        right:1,
        width:33,
        height:33,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#17a2b8',
        marginBottom:13,
    },
    btnDelete :{
        position:'relative', 
        right:1, 
        width:33,
        height:33,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#dc3545'
    },
})