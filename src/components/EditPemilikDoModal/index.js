/* eslint-disable prettier/prettier */
import React, {useEffect, useState } from 'react';
import { Modal, View, StyleSheet, ActivityIndicator, Text, BackHandler, TextInput, FlatList, TouchableOpacity, Image, ScrollView, useWindowDimensions} from "react-native";
import CONSTANTS from '../../assets/constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SearchBar from '../SearchBar/search_bar_search_akun';
import DetailPemilikDo from '../DetailPemilikDo';
import { TabView, TabBar } from 'react-native-tab-view';
import InputDoPPKS from '../InputDoPPKS';
import InputHargaDoPPKS from '../InputHargaDoPPKS';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const SUCCESS = CONSTANTS.COLOR.SUCCESS;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const EditPemilikDoModal = (props) => {
    const [searchParam, setSearchParam] = useState("");
    const [arrUser, setArrUser] = useState([]);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [detailDoFlex, setDetailDoFlex] = useState(1);
    const [tabViewFlex, setTabViewFlex] = useState(0.5);
    const [textShowEdit, setTextShowEdit] = useState("Tampilan Penuh");

    
    

    const showEdit = () => {
        if(detailDoFlex == 1){
            setDetailDoFlex(0.01);
            setTabViewFlex(1);
            setTextShowEdit("Sembunyikan");
        }
        else{
            setDetailDoFlex(1);
            setTabViewFlex(1);
            setTextShowEdit("Tampilan Penuh");
        }
    }

    return(
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.modalVisible}
                onRequestClose={() => {
                    console.log("back");
                    props.setModalVisible(false); 
                }}
            >
                <SearchBar title={"Detail Do"} refresh={false} onBack={props.setModalVisible} />
                <View style={styles.modalView}>
                    <View style={{flex:detailDoFlex}}>
                        <DetailPemilikDo setModalVisible={props.setModalVisible} username={props.username} id_ppks={props.id_ppks} nama_do={props.nama_do} tanggal_perubahan_harga={props.tanggal_perubahan_harga} hargaDoPPKS={props.hargaDoPPKS} keterangan_biaya_bongkar={props.keterangan_biaya_bongkar} keterangan_harga={props.keterangan_harga} navigation={props.navigation} edit={true} />
                    </View>
                </View>
            </Modal>   
        </View>
    )

    
}
export default EditPemilikDoModal;

const styles = StyleSheet.create({
    container: {
        flex: 0,
    },
    tabView : {
        backgroundColor:'white',
        marginHorizontal:0,
        justifyContent:'flex-end'
    },
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"white",
        height:45,
        justifyContent:"center",
        color:"black"
    },
    textInput:{
        borderTopWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
        borderWidth:0.3,
        borderColor:"black",
        color:"black",
        borderRadius:5,
        fontSize:13,
        flex:1,
        marginHorizontal:35,
    },
    renderItemArea :{
        flexDirection:'row',
        backgroundColor:'#fcfcfc',
        justifyContent:"space-around",
        marginTop:20
    },
    detailUser :{
        flex:0.7,
        backgroundColor:'transparent',
        justifyContent:"center",
        alignItems:"flex-start",
    },  
    fotoProfil:{
        width:60,
        height:60,
        borderRadius:120/2,
        alignItems:"flex-start",
    },
    usernameLabel :{
        fontSize:13,
        color:'grey',
        fontWeight:'400'
    },
    namaLengkapLabel : {
        fontSize:15,
        color:'black',
        fontWeight:'700'
    },
    modalView: {
        flex:1,
        //backgroundColor: "rgba(000, 000, 000, 0.6)",
        backgroundColor: "white",
        borderRadius: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        paddingVertical:0,
        paddingHorizontal:0
    },
    modalTitle: {
        fontSize:17,
        justifyContent: "center",
        alignItems: "center",
        color:"white",
        textAlign: "center",
        marginLeft:10
    },
})

