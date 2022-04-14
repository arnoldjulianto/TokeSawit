/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import CONSTANTS from '../../assets/constants';
import SearchBar from '../../components/SearchBar/search_bar_jadi_pemilik_do';
import iconNext from '../../assets/icon/next.png';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const DANGER = CONSTANTS.COLOR.DANGER;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const TentukanBiayaBongkar = ({route, navigation}) => {
    let {username, id_ppks, nama_do} = route.params;
    const [keterangan_biaya_bongkar, setKetBiayaBongkar] = useState("");
    const [labelBtn, setLabelBtn] = useState("Lewati");

    useEffect(()=>{
        if(keterangan_biaya_bongkar == '') setLabelBtn("Lewati");
        else setLabelBtn("Lanjutkan")
    },[keterangan_biaya_bongkar])

    const loadInputHargaDoPPKS = () => {
        navigation.navigate("InputHargaDoPPKS", {username, id_ppks, nama_do, keterangan_biaya_bongkar} );
    }

    return(
        <View style={{flex:1}}>
            <SearchBar title={"Biaya Bongkar"} refresh={false} navigation={navigation} />
            <View style={styles.container}>
                <View style={styles.formGroup}>
                    <Text>
                        LEWATI Jika Tidak Ada Biaya Bongkar.{"\n"}
                        Jika Ada, Tuliskan Pada Kolom Deskripsi.{"\n"}
                    </Text>
                    <Text>* Contoh :{"\n"}
                        - Bak Mati Rp 100.000 / Do{"\n"}
                        - Dump Truk Rp 20.000 / Do{"\n"}
                        atau{"\n"}
                    " Rp 25 / Kg x Tonase Kotor "{"\n"}
                    </Text>
                    <View style={styles.inputWrapper}>
                        <TextInput style={styles.textInput} placeholder="Deskripsikan . . ." placeholderTextColor= 'gray' value={keterangan_biaya_bongkar} onChangeText = { (value) => {setKetBiayaBongkar(value)} } autoFocus={true}  multiline={true} numberOfLines={4}
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {loadInputHargaDoPPKS()} }>
                        <View style={{flexDirection:"row",justifyContent:'center'}}>
                            <Text style={styles.btnLanjutkanLabel}>{labelBtn}</Text>
                            <Image source={iconNext} style={styles.btnLanjutkanIcon}  />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default TentukanBiayaBongkar;

const styles = StyleSheet.create({
    container:{
        marginTop:15,
        marginHorizontal:15,
        padding:10,
        backgroundColor:'white',
    },
    formGroup :{
        marginBottom:20,
        backgroundColor:'white',
        justifyContent:"flex-start",
    },
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent:"flex-start",
        color:"black"
    },
    textInput:{
        flex:1,
        borderWidth:0.5,
        borderColor:"black",
        color:"black",
        fontSize:13,
        marginHorizontal:10,
        height: 200,
        justifyContent: "flex-start",
        textAlignVertical: 'top'
    },
    btnLanjutkan: {
        backgroundColor:NAVY,
        alignItems:"center",
        height:40,
        borderRadius:10,
        justifyContent:"center",
        
    },
    btnLanjutkanIcon : {
        width:23,
        height:23,
        marginHorizontal:6,
        marginTop:1
    },
    btnLanjutkanLabel : {
        fontSize:15,
        color:'white'
    },
})