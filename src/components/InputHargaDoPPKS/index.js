/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, TextInput, Image, Platform } from 'react-native';
import MaskInput from 'react-native-mask-input';
import CONSTANTS from '../../assets/constants';
import SearchBar from '../../components/SearchBar/search_bar_jadi_pemilik_do';
import iconNext from '../../assets/icon/next.png';
import iconCalendar from '../../assets/icon/calendar.png';
import DateTimePicker from '@react-native-community/datetimepicker';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const DANGER = CONSTANTS.COLOR.DANGER;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const InputHargaDoPPKS = (props) => {
    const [hargaDoPPKS, setHargaDoPPKS] = useState("");
    const [keterangan_harga, setKetHargaDoPPKS] = useState("");
    const [inputHarga, setInputHarga] = useState();
    const [inputDeskripsi, setInputDeskripsi] = useState();
    let day   = new Date().getDate();
    let month = new Date().getMonth()+1;
    let year  = new Date().getFullYear();
    if(day.toString().length == 1 ) day = "0"+day;
    if(month.toString().length == 1 ) month = "0"+month;
    const [tanggal_perubahan_harga, setTanggalPerubahanHarga] = useState(year+"-"+month+"-"+day);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    useEffect(() => {
        if(props.edit) {
            setHargaDoPPKS(props.hargaDoPPKS)
            setKetHargaDoPPKS(props.keterangan_harga)
            setTanggalPerubahanHarga(props.tanggal_perubahan_harga)
            setDate(new Date(props.tanggal_perubahan_harga))
        }
    },[])
    

    const formatRupiah = (angka, prefix) => {
        if(angka != "") {
            var number_string = angka.replace(/[^,\d]/g, '').toString(),
            split   		= number_string.split(','),
            sisa     		= split[0].length % 3,
            rupiah     		= split[0].substr(0, sisa),
            ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);
         
            // tambahkan titik jika yang di input sudah menjadi angka ribuan
            if(ribuan){
                let separator = sisa ? '.' : '';
                rupiah += separator + ribuan.join('.');
            }
            rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
            if(angka < 0) {
                rupiah = "-"+rupiah;
            }
            return prefix == undefined ? rupiah : (rupiah ? '' + rupiah : '');
        }
        else{
            return prefix == undefined ? rupiah : (rupiah ? '' + rupiah : '');
        }
    }

    const loadPreviewPemilikDo = () => {
        if(props.username != null && props.id_ppks != null && props.nama_do != null && tanggal_perubahan_harga != null && hargaDoPPKS != 0 && props.keterangan_biaya_bongkar != null ){
            const params = {username:props.username, id_ppks:props.id_ppks, nama_do:props.nama_do, tanggal_perubahan_harga, hargaDoPPKS, keterangan_biaya_bongkar:props.keterangan_biaya_bongkar, keterangan_harga};
            console.log(params)
            props.navigation.navigate("PreviewPemilikDo", params )
        }
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatePicker = (mode) => {
        showMode(mode);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        day   = currentDate.getDate();
        month = currentDate.getMonth()+1;
        year  = currentDate.getFullYear();
        
        if(month.toString().length == 1 ) month = "0"+month;
        if(day.toString().length == 1 ) day = "0"+day;
        setDate(currentDate);
        setTanggalPerubahanHarga(year+"-"+month+"-"+day);
        console.log("Currend Date" + currentDate)
    };

    return (
        <View style={{flex:1}}>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    //maximumDate={new Date()}
                    />
            )}
            <View style={styles.container}>
                <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Tentukan Harga Untuk Tanggal </Text>
                    
                    <View style={styles.inputWrapper}>
                        
                        <MaskInput
                            value={tanggal_perubahan_harga}
                            onChangeText={(masked, unmasked) => {
                                setTanggalPerubahanHarga(masked);
                                const d = new Date(masked);
                                setDate(d);
                            }}
                            mask={[/\d/, /\d/,/\d/, /\d/, '-', /\d/, /\d/,'-', /\d/, /\d/]}
                            style={styles.maskInput}
                            keyboardType="numeric"
                            placeholder="Tahun-bulan-tanggal" placeholderTextColor= 'gray'
                            blurOnSubmit={false} onSubmitEditing={()=> inputHarga.focus()} returnKeyType="next" autoFocus={true}
                        />
                        <TouchableOpacity style={styles.btnCalendar} onPress={()=> {showDatePicker('date')} }>
                            <View style={{flexDirection:"row",justifyContent:'space-around'}}>
                                <Image source={iconCalendar} style={styles.btnCalendarIcon}  />
                                <Text style={{fontSize:12,fontStyle:'italic', marginLeft:5,marginTop:5}}>* format tahun-bulan-tanggal</Text>
                            </View>
                        </TouchableOpacity>
                    </View>    
                </View>

                <View style={styles.formGroup}>
                    <View style={styles.inputWrapper}>
                        <Text style={{fontSize:22}}>Rp</Text>
                        <TextInput style={styles.textInput} placeholder="" placeholderTextColor= 'gray' value={hargaDoPPKS} onChangeText = { (value) => {setHargaDoPPKS(formatRupiah(value))} }  keyboardType="numeric" blurOnSubmit={false} onSubmitEditing={()=> inputDeskripsi.focus()} returnKeyType="next" ref={(input) => setInputHarga(input) }
                        />
                        <Text style={{flex:1,fontSize:22}}>/ Kg</Text>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>
                        Isi kolom deskripsi jika ada ketentuan perubahan harga.{"\n"}{"\n"}
                        * Contoh : {"\n"}
                        "Harga dipotong Rp 100 / Kg jika masuk <Text style={{fontWeight:'bold'}}>Kategori B</Text>"
                    </Text>
                </View>

                <View style={styles.formGroup}>
                    <View style={styles.inputWrapper}>
                        <TextInput style={styles.textArea} placeholder="Deskripsikan . . ." placeholderTextColor= 'gray' value={keterangan_harga} onChangeText = { (value) => {setKetHargaDoPPKS(value)} } multiline={true} numberOfLines={4} ref={(input) => setInputDeskripsi(input) }
                        />
                    </View>
                </View>
                
                {!props.edit && (
                    <View style={styles.formGroup}>
                        <TouchableOpacity style={styles.btnLanjutkan} onPress={()=> {loadPreviewPemilikDo()} }>
                            <View style={{flexDirection:"row",justifyContent:'center'}}>
                                <Text style={styles.btnLanjutkanLabel}>Lanjutkan</Text>
                                <Image source={iconNext} style={styles.btnLanjutkanIcon}  />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
                

            </View>
        </View>
    );

}

export default InputHargaDoPPKS;

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
    formLabel : {
        color:'black',
        fontSize:14,
        fontWeight:'400'
    },
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:"center",
        color:"black"
    },
    maskInput:{
        flex:1,
        borderBottomWidth:0.5,
        borderColor:"black",
        color:"black",
        fontSize:17,
        marginHorizontal:10,
        height:50,
        justifyContent: "flex-start",
        fontWeight:'400',
        textAlign:'center'
    },
    textInput:{
        flex:1,
        borderBottomWidth:0.5,
        borderColor:"black",
        color:"black",
        fontSize:22,
        marginHorizontal:10,
        height:50,
        justifyContent: "flex-start",
        fontWeight:'600',
        textAlign:'center'
    },
    textArea:{
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
    btnCalendar: {
        flex:1,
        backgroundColor:'transparent',
        alignItems:"flex-start",
        height:40,
        borderRadius:10,
        justifyContent:"center",
        
    },
    btnCalendarIcon : {
        width:23,
        height:23,
        marginTop:10
    },
    btnCalendarLabel : {
        fontSize:15,
        color:'white'
    },
})