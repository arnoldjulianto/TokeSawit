/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, RefreshControl, FlatList, ScrollView } from 'react-native';
import CONSTANTS from '../../assets/constants';
import nextIcon from '../../assets/icon/next.png';
import SearchBar from '../../components/SearchBar/search_bar_jadi_pemilik_do';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NoData from '../../assets/img/no data.svg';

const DANGER = CONSTANTS.COLOR.DANGER;
const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const UsersDOPPKS = ({route, navigation}) => {
    let {username,username_edit, nama_lengkap} = route.params;
    const [arrListDo, setArrListDo] = useState([]);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [header1focus, setHeader1Focus] = useState(true);
    const [header2focus, setHeader2Focus] = useState(false);
    const [header3focus, setHeader3Focus] = useState(false);
    const [iconSort, setIconSort] = useState("sort-alpha-down");
    useEffect(()=>{
        loadListDoUser();
    },[])

    const onRefresh = React.useCallback(() => {
        loadListDoUser();
    }, []);

    const sortHeader = (value) =>{
        setIconSort("sort-alpha-down");
        if (value == 1) {
            let data = arrListDo;
            data.sort((a, b) => {
                let fa = a.nama_ppks.toLowerCase(),
                fb = b.nama_ppks.toLowerCase();
                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            })
            setArrListDo(data);
            setHeader1Focus(true);
            setHeader2Focus(false);
            setHeader3Focus(false);
            cekSorting(value);
        }
        else if (value == 2) {
            let data = arrListDo;
            data.sort((a, b) => {
                let fa = a.nama_do.toLowerCase(),
                fb = b.nama_do.toLowerCase();
                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            })
            setArrListDo(data);
            setHeader1Focus(false);
            setHeader2Focus(true);
            setHeader3Focus(false);
            cekSorting(value);
        }
        else if (value == 3) {
            let data = arrListDo;
            data.sort((a, b) => {
                return parseInt(a.harga) - parseInt(b.harga);
            })
            setArrListDo(data);
            setHeader1Focus(false);
            setHeader2Focus(false);
            setHeader3Focus(true);
            cekSorting(value);
        }
    }

    const cekSorting = (value) =>{
        if(value == 1 ){
            if(header1focus){
               sortPPKS(true);
            }
        }
        else if(value == 2 ){
            if(header2focus){
                sortNamaDo(true);
            }
        }
        else if(value == 3 ){
            if(header3focus){
                sortHarga(true);
            }
        }   
    }

    const sortPPKS = (changeIcon) => {
        let data = arrListDo;
        if(iconSort == 'sort-alpha-down') {
            if(changeIcon) setIconSort("sort-alpha-down-alt");
            data.sort((a, b) => {
                let fa = a.nama_ppks.toLowerCase(),
                fb = b.nama_ppks.toLowerCase();
                if (fa < fb) {
                    if(changeIcon) return 1;
                    else return -1;
                }
                if (fa > fb) {
                    if(changeIcon) return -1;
                    else return 1;
                }
                return 0;
            })
        }
        else {
            if(changeIcon) setIconSort("sort-alpha-down");
            data.sort((a, b) => {
                let fa = a.nama_ppks.toLowerCase(),
                fb = b.nama_ppks.toLowerCase();
                if (fa < fb) {
                    if(changeIcon)  return 1;
                    else return -1;
                }
                if (fa > fb) {
                    if(changeIcon)  return 1;
                    else return -1;
                }
                return 0;
            })
        }
        setArrListDo(data);
    }

    const sortNamaDo = (changeIcon) => {
        let data = arrListDo;
        if(iconSort == 'sort-alpha-down') {
            if(changeIcon) setIconSort("sort-alpha-down-alt");
            
            data.sort((a, b) => {
                let fa = a.nama_do.toLowerCase(),
                fb = b.nama_do.toLowerCase();
                if (fa < fb) {
                    return changeIcon ? 1 : -1;
                }
                if (fa > fb) {
                    return changeIcon ? -1 : 1;
                }
                return 0;
            })
        }
        else {
            if(changeIcon) setIconSort("sort-alpha-down");
            data.sort((a, b) => {
                let fa = a.nama_do.toLowerCase(),
                fb = b.nama_do.toLowerCase();
                if (fa < fb) {
                    return changeIcon ? -1 : 1;
                }
                if (fa > fb) {
                    return changeIcon ? 1 : -1;
                }
                return 0;
            })
        }
        setArrListDo(data);
    }

    const sortHarga = (changeIcon) => {
        let data = arrListDo;
        if(iconSort == 'sort-alpha-down') {
            if(changeIcon) setIconSort("sort-alpha-down-alt");
            data.sort((a, b) => {
                if(changeIcon) return parseInt(b.harga) - parseInt(a.harga);
                else return parseInt(a.harga) - parseInt(b.harga);
            })
        }
        else {
            if(changeIcon) setIconSort("sort-alpha-down");
            data.sort((a, b) => {
                if(changeIcon) return parseInt(a.harga) - parseInt(b.harga);
                else return parseInt(b.harga) - parseInt(a.harga);
            })
        }
        setArrListDo(data);
    }

    const loadListDoUser = () => {
        setLoadingVisible(true);
        const timeout = setTimeout(() => {
            setLoadingVisible(false);
        }, 30000);

        const params = {
            username
        }
        console.log(params);
        
        const createFormData = (body) => {
            const data = new FormData();
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            return data;
        }
        const formData = createFormData(params);
        fetch(base_url+'PemilikDo/get_api_list_do',
        {
            method: 'post',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data; ',
            },
        })
        .then((response) => response.json())
        .then((json) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            if(json.response == 1){
                const data = [];
                json.list_do.forEach((value)=>{
                    data.push({
                        data_id : value.id_do_ppks,    
                        id_ppks : value.id_ppks,    
                        nama_ppks : value.nama_ppks,    
                        nama_do : value.nama_do,    
                        keterangan_biaya_bongkar : value.keterangan_biaya_bongkar,    
                        keterangan_harga : value.keterangan_harga,    
                        harga : value.harga,    
                        tanggal_perubahan_harga : value.tanggal_perubahan_harga,    
                        privasi_harga : value.privasi_harga,    
                        type : "Pemilik DO",    
                    });
                })

                json.list_reseller.forEach((value)=>{
                    data.push({
                        data_id : value.id_reseller_do,    
                        id_ppks : value.id_ppks,    
                        nama_ppks : value.nama_ppks,    
                        nama_do : value.nama_do,    
                        keterangan_biaya_bongkar : value.keterangan_biaya_bongkar,    
                        keterangan_harga : value.keterangan_harga,    
                        harga : value.harga,    
                        tanggal_perubahan_harga : value.tanggal_perubahan_harga,    
                        privasi_harga : value.privasi_harga,    
                        type : "Reseller DO"
                    });
                })
                setArrListDo(data);
            }
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(error);
        });
    }

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

    const loadTentukanFee = (id, type, harga) => {
        navigation.navigate("FeeResellerDO",{id,username,username_edit, type, harga, nama_lengkap});
    }

    const renderItemListDo = ({item, index}) => {    
        let bulan = item.tanggal_perubahan_harga.substr(5,2);
        if(bulan == "01") bulan = "Januari";
        else if(bulan == "02") bulan = "Februari";
        else if(bulan == "03") bulan = "Maret";
        else if(bulan == "04") bulan = "April";
        else if(bulan == "05") bulan = "Mei";
        else if(bulan == "06") bulan = "Juni";
        else if(bulan == "07") bulan = "Juli";
        else if(bulan == "08") bulan = "Agustus";
        else if(bulan == "09") bulan = "September";
        else if(bulan == "10") bulan = "Oktober";
        else if(bulan == "11") bulan = "November";
        else if(bulan == "12") bulan = "Desember";

        return(
            <TouchableOpacity style={styles.renderItemArea} onPress={() => {
                loadTentukanFee(item.data_id, item.type, item.harga, nama_lengkap)
            }} >
                <Text style={styles.namaPPKSLabel}>{item.nama_ppks.toUpperCase()}</Text>
                <Text style={styles.namaDoLabel}>{item.nama_do}</Text>
                <Text style={styles.hargaLabel}>Rp {formatRupiah(item.harga)}
                    {"\n"}
                    <Text style={{marginTop:5, fontSize:14, color:ORANGE}}>{item.tanggal_perubahan_harga.substr(8,2)+" "+bulan+" "+item.tanggal_perubahan_harga.substr(2,2)}</Text>
                </Text>
            </TouchableOpacity>
        )
    }

    return(
        <View style={{flex:1}}>
            <SearchBar title={"Pilih Produk "+nama_lengkap} refresh={false} navigation={navigation} />
            <ScrollView 
                refreshControl={
                <RefreshControl
                refreshing={loadingVisible}
                onRefresh={onRefresh}
                />
            }>
                <View style={styles.container} >
                    <View style={styles.segmenWrapper} >
                        {!loadingVisible && arrListDo.length == 0 && (
                            <View style={styles.noDataWrapper}>
                                <NoData width={250} height={150} />
                                <Text style={styles.noDataText1}>Tidak Ada Data Ditemukan</Text>
                                <Text style={styles.noDataText2}>Tarik Ke Bawah Untuk Me-Refresh</Text>
                            </View>
                        )}

                        {!loadingVisible && arrListDo.length > 0 && (
                            <View>
                                <View style={styles.headerItemArea} >
                                    <TouchableOpacity style={styles.headerItem1} onPress={()=> sortHeader(1) } >
                                        <Text style={styles.headerLabel1}>PPKS</Text>
                                        {header1focus && (
                                            <Icon name={iconSort} type="ionicon" size={20} color="white"  />
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.headerItem2} onPress={()=> sortHeader(2) } >
                                        <Text style={styles.headerLabel2}>Nama Do</Text>
                                        {header2focus && (
                                            <Icon name={iconSort}  type="ionicon" size={20} color="white"  />
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.headerItem3} onPress={()=> sortHeader(3) } >
                                        <Text style={styles.headerLabel3}>Harga </Text>
                                        {header3focus && (
                                            <Icon name={iconSort}  type="ionicon" size={20} color="white"  />
                                        )}
                                    </TouchableOpacity>     
                                </View>

                                <FlatList
                                    data={arrListDo}
                                    extraData={arrListDo}
                                    keyExtractor={(item, index) => (item.id_do_ppks) + index}
                                    renderItem={renderItemListDo}
                                    style={{flex:1}}
                                />
                            </View>
                        )}    
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default UsersDOPPKS;

const styles = StyleSheet.create({
    container : {
        flex:1,
        paddingHorizontal:5,
        paddingTop:10
    },
    noDataWrapper:{
        alignItems:"center", 
        justifyContent:"center",
        paddingTop:50
    },
    noDataText1:{
        fontSize:16,
        color:ORANGE,
        textAlign:"center",
        marginTop:20
    },
    noDataText2:{
        width:300,
        textAlign:"center",
        fontSize:12,
        color:"gray"
    },
    headerItemArea:{
        flexDirection:'row',
        justifyContent:'space-around',
        backgroundColor:ORANGE,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
    },
    headerItem1 : {
        flex:0.8,
        flexDirection:'row',
        height:50,
        justifyContent:'center', 
        alignItems:'center', 
        padding:10
    }, 
    headerItem2 : {
        flex:0.8,
        flexDirection:'row',
        height:50,
        justifyContent:'center', 
        alignItems:'center', 
        padding:10
    },
    headerItem3 : {
        flex:0.7,
        flexDirection:'row',
        height:50,
        justifyContent:'center', 
        alignItems:'center', 
        padding:10
    },  
    headerLabel1 :{
        flex:0.8,
        color:'white',
        fontSize:14,
        fontWeight:'600',
        textAlign: "center",
        backgroundColor:'transparent'
    },
    headerLabel2 :{
        flex:0.8,
        color:'white',
        fontSize:14,
        fontWeight:'600',
        textAlign: "center",
        backgroundColor:'transparent'
    },
    headerLabel3 :{
        flex:0.6,
        color:'white',
        fontSize:14,
        fontWeight:'600',
        textAlign: "center",
        backgroundColor:'transparent'
    },
    renderItemArea:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#fcfcfcfc',
        paddingVertical:20,
        borderWidth:0.5,
        marginBottom:10
    },
    btnItemIcon:{
        width:22,
        height:22,
    },
    namaPPKSLabel :{
        flex:0.8,
        color:'black',
        fontSize:14,
        fontWeight:'500',
        textAlign: "center",
        backgroundColor:'transparent'
    },
    namaDoLabel :{
        flex:0.8,
        color:'black',
        fontSize:14.5,
        backgroundColor:"transparent",
        textAlign: "center"
    },
    hargaLabel :{
        flex:0.6,
        color:'black',
        fontSize:18,
        textAlign: "center",
        fontWeight:'500'
    },
})