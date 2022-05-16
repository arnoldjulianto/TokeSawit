/* eslint-disable prettier/prettier */
import React, {useEffect, useState } from 'react';
import { Modal, View, StyleSheet, ActivityIndicator, Text, BackHandler, TextInput, FlatList, TouchableOpacity, Image, useWindowDimensions, ScrollView} from "react-native";
import CONSTANTS from '../../assets/constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SearchBar from '../SearchBar/search_bar_search_akun';
import { TabView, TabBar } from 'react-native-tab-view';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const SearchAkunModal = (props) => {
    const [searchParam, setSearchParam] = useState("");
    const [arrCariTerbaru, setArrCariTerbaru] = useState([]);
    const [arrProduk, setArrProduk] = useState([]);
    const [arrNamaDo, setArrNamaDo] = useState([]);
    const [arrUser, setArrUser] = useState([]);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [header1focus, setHeader1Focus] = useState(true);
    const [header2focus, setHeader2Focus] = useState(false);
    const [header3focus, setHeader3Focus] = useState(false);
    const [header4focus, setHeader4Focus] = useState(false);
    const [iconSort, setIconSort] = useState("sort-alpha-down");

    useEffect(() => {
        if(props.modalVisible){
            setSearchParam("");
            console.log(searchParam)
            setArrCariTerbaru([]);
            setArrProduk([]);
            setArrNamaDo([]);
            setArrUser([]);
            const delayDebounceFn = setTimeout(() => {
                loadCariTerbaru()
            }, 500)
            return () => clearTimeout(delayDebounceFn)
        }
    },[props.modalVisible])

    useEffect(()=>{
        if(searchParam != ""){
            console.log(searchParam)
            setArrCariTerbaru([]);
            setArrProduk([]);
            setArrNamaDo([]);
            setArrUser([]);
            const delayDebounceFn = setTimeout(() => {
                loadAllData()
            }, 500)
            return () => clearTimeout(delayDebounceFn)
        }
        else{
            console.log(searchParam)
            setArrCariTerbaru([]);
            setArrProduk([]);
            setArrNamaDo([]);
            setArrUser([]);
            const delayDebounceFn = setTimeout(() => {
                loadCariTerbaru()
            }, 500)
            return () => clearTimeout(delayDebounceFn)
        }
    },[searchParam])


    const loadCariTerbaru = () => {
        setLoadingVisible(true);

        const timeout = setTimeout(() => {
            setLoadingVisible(false);
        }, 30000);

        const params = {
            searchParam,
            currentUser:props.currentUser
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
        fetch(base_url+'Pencarian/get_api_history_pencarian',
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
            setArrCariTerbaru(json.cari_terbaru);
            console.log(json);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(error);
        });
    }

    const loadAllData = () => {
        setLoadingVisible(true);

        const timeout = setTimeout(() => {
            setLoadingVisible(false);
        }, 30000);

        const params = {
            searchParam,
            currentUser:props.currentUser
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
        fetch(base_url+'Pencarian/get_api_pencarian',
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
            setArrProduk(json.produk);
            setArrNamaDo(json.nama_do);
            setArrUser(json.user);
            console.log(json);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(error);
        });
    }

    const loadLihatProfil = (currentUser, username) => {
        //console.log(currentUser, username)
        props.navigation.navigate("LihatProfil", {currentUser, username, setModalVisible:props.setModalVisible});
        props.setModalVisible(false);
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

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 1, title: 'Semua' },
      { key: 2, title: 'Orang' },
      { key: 3, title: 'Produk' },
    //   { key: 3, title: 'Nama Do' },
    ]);

    const layout = useWindowDimensions();
    const renderTabBar = props => (
        <TabBar
          {...props}
          keyboardDismissMode={"none"}
          indicatorStyle={{ backgroundColor: ORANGE }}
          style={{ backgroundColor: 'white' }}
          renderLabel={({ route, focused, color }) => (
            <Text style={{ color:ORANGE, margin:0, fontSize:11 }}>
              {route.title}
            </Text>
          )}
        />
    );

    const sortHeader = (value) =>{
        setIconSort("sort-alpha-down");
        if (value == 1) {
            let data = arrProduk;
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
            setArrProduk(data);
            setHeader1Focus(true);
            setHeader2Focus(false);
            setHeader3Focus(false);
            cekSorting(value);
        }
        else if (value == 2) {
            let data = arrProduk;
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
            setArrProduk(data);
            setHeader1Focus(false);
            setHeader2Focus(true);
            setHeader3Focus(false);
            cekSorting(value);
        }
        else if (value == 3) {
            let data = arrProduk;
            data.sort((a, b) => {
                return parseInt(a.harga) - parseInt(b.harga);
            })
            setArrProduk(data);
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
        let data = arrProduk;
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
        setArrProduk(data);
    }

    const sortNamaDo = (changeIcon) => {
        let data = arrProduk;
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
        setArrProduk(data);
    }

    const sortHarga = (changeIcon) => {
        let data = arrProduk;
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
        setArrProduk(data);
    }

    const _renderTabs = ({route}) => {
        switch (route.key) {
            case 1:
            return (
                <ScrollView>
                    {arrCariTerbaru.length > 0 && (
                        <View style={styles.segmenWrapper}>
                            <Text style={styles.segmenTitle}>Terbaru</Text>
                            <FlatList
                                data={arrCariTerbaru}
                                keyExtractor={(item, index) => (item.id) + index}
                                renderItem={renderItemCariTerbaru}
                                maxToRenderPerBatch={5} 
                                updateCellsBatchingPeriod={20}
                            />
                        </View>
                    )}

                    {arrUser.length > 0 && (
                        <View style={styles.segmenWrapper}>
                            <Text style={styles.segmenTitle}>Orang</Text>
                                <FlatList
                                    data={arrUser}
                                    keyExtractor={(item, index) => (item.id) + index}
                                    renderItem={renderItemUser}
                                    maxToRenderPerBatch={5} updateCellsBatchingPeriod={20}
                                />
                        </View>
                    )}
                    
                    {arrProduk.length > 0 && (
                        <View style={styles.segmenWrapper}>
                            <Text style={styles.segmenTitle}>Produk</Text>
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

                                <TouchableOpacity style={styles.headerItem4} onPress={()=> {} } >
                                    <Text style={styles.headerLabel3}>Pemilik Do </Text>
                                    {header4focus && (
                                        <Icon name={iconSort}  type="ionicon" size={20} color="white"  />
                                    )}
                                </TouchableOpacity>  
                            </View>

                            <FlatList
                                data={arrProduk}
                                keyExtractor={(item, index) => (item.id) + index}
                                renderItem={renderItemProduk}
                                maxToRenderPerBatch={5} 
                                updateCellsBatchingPeriod={20}
                            />
                        </View>
                    )}

                    {/* {arrNamaDo.length > 0 && (
                        <View style={styles.segmenWrapper}>
                            <Text style={styles.segmenTitle}>Nama Do</Text>
                            <FlatList
                                data={arrNamaDo}
                                keyExtractor={(item, index) => (item.id) + index}
                                renderItem={renderItemNamaDo}
                                maxToRenderPerBatch={5} 
                                updateCellsBatchingPeriod={20}
                                numColumns={4}
                            />
                        </View>
                    )} */}

                    
                </ScrollView>    
            )
            
            // case 2:
            // return (
            //     <View style={{flex:1}} >
            //         {arrCariTerbaru.length > 0 && (
            //             <FlatList
            //                 data={arrCariTerbaru}
            //                 keyExtractor={(item, index) => (item.id) + index}
            //                 renderItem={renderItemCariTerbaru}
            //                 maxToRenderPerBatch={5} updateCellsBatchingPeriod={20}
            //             />
            //         )}
            //     </View>        
            // )

            case 2:
            return (
                <View style={{flex:1}} >
                    {arrUser.length > 0 && (
                        <FlatList
                            data={arrUser}
                            keyExtractor={(item, index) => (item.id) + index}
                            renderItem={renderItemUser}
                            maxToRenderPerBatch={5} updateCellsBatchingPeriod={20}
                        />
                    )}
                </View>        
            )

            // case 3:
            // return (
            //     <View style={{flex:1, padding:20}} >
            //         {arrNamaDo.length > 0 && (
            //         <FlatList
            //             data={arrNamaDo}
            //             keyExtractor={(item, index) => (item.id) + index}
            //             renderItem={renderItemNamaDo}
            //             maxToRenderPerBatch={5} 
            //             updateCellsBatchingPeriod={20}
            //             numColumns={4}
            //         />
            //         )}
            //     </View>        
            // )

            case 3:
            
            return (
                <View style={{flex:1, paddingTop:20}}>
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

                        <TouchableOpacity style={styles.headerItem4} onPress={()=> {}} >
                            <Text style={styles.headerLabel3}>Pemilik Do </Text>
                            {header4focus && (
                                <Icon name={iconSort}  type="ionicon" size={20} color="white"  />
                            )}
                        </TouchableOpacity>  
                    </View>

                    <FlatList
                        data={arrProduk}
                        keyExtractor={(item, index) => (item.id) + index}
                        renderItem={renderItemProduk}
                        maxToRenderPerBatch={5} updateCellsBatchingPeriod={20}
                    /> 
                </View>  
            )
        }
    }

    const renderItemCariTerbaru = ({item, index}) => {
        return(
            <TouchableOpacity style={styles.renderItemCariTerbaruArea} key={index} onPress={() => setSearchParam(item.teks) } >
                <Text style={{flex:1, justifyContent:'flex-start', marginLeft:10}}>{item.teks}</Text>
            </TouchableOpacity>
        )
        
    }

    const renderItemProduk = ({ item, index }) => {
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
        let uri = '';
        if(item.foto_profil == 'default.png') uri = base_url+"assets/upload/file user/"+item.foto_profil;
        else uri = base_url+"assets/upload/file user/"+item.username+"/"+item.foto_profil;
        return (
            <TouchableOpacity style={styles.renderItemProdukArea} key={item.username+index} onPress={()=>{
                
            }} >
                <Text style={styles.namaPPKSLabel}>{item.nama_ppks.toUpperCase()}</Text>
                <Text style={styles.namaDoLabel}>{item.nama_do}</Text>
                {item.harga != '0' && (
                    <View>
                        <Text style={styles.hargaLabel}>Rp {formatRupiah(item.harga)}
                            {"\n"}
                            <Text style={{marginTop:5, color:ORANGE}}>{item.tanggal_perubahan_harga.substr(8,2)+" "+bulan+" "+item.tanggal_perubahan_harga.substr(2,2)}</Text>
                        </Text>
                    </View>
                )}

                {item.harga == '0' && (
                    <Text style={styles.hargaLabel}>
                    </Text>
                )}

                <View style={styles.detailUserSm}>
                    <Image style={styles.fotoProfilSm} source={{uri}} resizeMode="cover" resizeMethod="resize" />
                    <Text style={styles.usernameLabelSm} >{item.username_edit}</Text>
                    <Text style={styles.namaLengkapLabelSm} >{item.nama_lengkap}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const renderItemNamaDo = ({item, index}) => {
        return(
            <TouchableOpacity key={index} style={styles.renderItemNamaDoArea}>
                <Text style={styles.namaDoSoloLabel}>{item.nama_do}</Text>
            </TouchableOpacity>
        );
    }

    const renderItemUser = ({ item, index }) => {
        let uri = '';
        if(item.foto_profil == 'default.png') uri = base_url+"assets/upload/file user/"+item.foto_profil;
        else uri = base_url+"assets/upload/file user/"+item.username+"/"+item.foto_profil;
        return (
            <TouchableOpacity style={styles.renderItemUserArea} key={item.username+index} onPress={()=>{
                loadLihatProfil(props.currentUser, item.username)
            }} >
                <Image style={styles.fotoProfil} source={{uri}} resizeMode="cover" resizeMethod="resize" />
                <View style={styles.detailUser}>
                    <Text style={styles.usernameLabel} >{item.username_edit}</Text>
                    <Text style={styles.namaLengkapLabel} >{item.nama_lengkap}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const simpanHistory = (value) => {
        const params = {
            searchParam:value,
            username:props.currentUser
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
        fetch(base_url+'Pencarian/get_api_simpan_history',
        {
            method: 'post',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data; ',
            },
        })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
        })
        .catch((error) => {
            console.log(error);
        });
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
                <SearchBar title={"Pencarian"} refresh={false} onBack={props.setModalVisible} />
                <View style={styles.modalView}>
                    <View style={styles.inputWrapper}>
                        <Icon name="search" type="ionicon" size={20} color="gray" style={{position:"absolute", left:10,bottom:10}} />
                        <TextInput style={styles.textInput} placeholder="Cari Sesuatu Disini . . ." placeholderTextColor= 'gray' value={searchParam} onChangeText = { (value) => {setSearchParam(value)} } onEndEditing={(e)=> {
                            simpanHistory(e.nativeEvent.text);
                        }} 
                        />
                    </View>
                    <TabView
                        swipeEnabled={true}
                        navigationState={{ index, routes }}
                        renderScene={_renderTabs}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={renderTabBar}
                        lazy={false}
                     />
                    
                    {loadingVisible && (
                        <View >
                            <ActivityIndicator size={50} color={ORANGE} />
                        </View>
                    )}
                </View>
            </Modal>   
        </View>
    )
}
export default SearchAkunModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    segmenWrapper : {
        backgroundColor:'white',
        paddingVertical:20,
        paddingHorizontal:5,
        marginTop:5,
        marginBottom:10,
        borderRadius:10
    },
    segmenTitle :{
        fontSize:14,
        fontWeight:'700',
        color:'black',
        marginBottom:10
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
    renderItemCariTerbaruArea :{
        backgroundColor:'#fcfcfc',
        justifyContent:"space-around",
        marginVertical:10,
        borderBottomWidth:0.3,
        paddingVertical:10
    },
    renderItemProdukArea :{
        flexDirection:'row',
        backgroundColor:'#fcfcfc',
        justifyContent:"space-between",
        marginTop:10,
        marginBottom:5,
        borderBottomWidth:0.3,
        paddingVertical:5,
        alignItems:'center',
    },
    renderItemNamaDoArea :{
        flex:1,
        backgroundColor:'transparent',
        justifyContent:"center",
        marginVertical:10,
        borderWidth:0.3,
        alignItems:'center',
        height:40,
        marginHorizontal:10
    },
    renderItemUserArea :{
        flexDirection:'row',
        backgroundColor:'#fcfcfc',
        justifyContent:"space-between",
        marginTop:10,
        marginBottom:10,
        borderWidth:0.3,
        paddingVertical:10,
        borderRadius:10,
        paddingHorizontal:10
    },
    detailUser :{
        flex:0.7,
        backgroundColor:'transparent',
        justifyContent:"center",
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
    fotoProfil:{
        width:50,
        height:50,
        borderRadius:120/2,
        alignItems:"flex-start",
    },
    fotoProfilSm:{
        width:40,
        height:40,
        borderRadius:40,
        alignItems:"center",
    },
    detailUserSm :{
        flex:1,
        backgroundColor:'transparent',
        justifyContent:"center",
        alignItems:"center",
    },
    usernameLabelSm :{
        fontSize:12,
        color:'grey',
        fontWeight:'400'
    },
    namaLengkapLabelSm : {
        fontSize:12,
        color:'black',
        fontWeight:'700'
    },
    headerItemArea:{
        flexDirection:'row',
        justifyContent:'space-around',
        backgroundColor:ORANGE,
        borderTopLeftRadius:5,
        borderTopRightRadius:5
    },
    headerItem1 : {
        flex:0.8,
        flexDirection:'row',
        height:60,
        justifyContent:'center', 
        alignItems:'center', 
        padding:10
    }, 
    headerItem2 : {
        flex:0.8,
        flexDirection:'row',
        height:60,
        justifyContent:'center', 
        alignItems:'center', 
        padding:10
    },
    headerItem3 : {
        flex:0.7,
        flexDirection:'row',
        height:60,
        justifyContent:'center', 
        alignItems:'center', 
        padding:10
    },  
    headerItem4 : {
        flex:1,
        flexDirection:'row',
        height:60,
        justifyContent:'center', 
        alignItems:'center', 
        padding:10
    },  
    headerLabel1 :{
        flex:0.8,
        color:'white',
        fontSize:12,
        fontWeight:'600',
        textAlign: "center",
        backgroundColor:'transparent'
    },
    headerLabel2 :{
        flex:0.8,
        color:'white',
        fontSize:12,
        fontWeight:'600',
        textAlign: "center",
        backgroundColor:'transparent'
    },
    headerLabel3 :{
        flex:0.6,
        color:'white',
        fontSize:12,
        fontWeight:'600',
        textAlign: "center",
        backgroundColor:'transparent'
    },
    headerLabel4 :{
        flex:1,
        color:'white',
        fontSize:12,
        fontWeight:'600',
        textAlign: "center",
        backgroundColor:'transparent'
    },
    namaPPKSLabel :{
        flex:0.8,
        color:'black',
        fontSize:13,
        fontWeight:'500',
        textAlign: "center",
        backgroundColor:'transparent'
    },
    namaDoLabel :{
        flex:0.8,
        color:'black',
        fontSize:13,
        backgroundColor:"transparent",
        textAlign: "center"
    },
    namaDoSoloLabel :{
        color:ORANGE,
        fontSize:11,
        backgroundColor:"transparent",
        textAlign: "center",
        justifyContent:'center'
    },
    hargaLabel :{
        flex:0.8,
        color:'black',
        fontSize:13,
        textAlign: "center"
    },
    modalView: {
        flex:1,
        //backgroundColor: "rgba(000, 000, 000, 0.6)",
        backgroundColor: "#fcfcfcfc",
        borderRadius: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        paddingVertical:20,
        paddingHorizontal:10
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