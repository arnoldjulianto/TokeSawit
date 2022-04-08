/* eslint-disable prettier/prettier */
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Animated, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, Alert } from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import CONSTANTS from '../../../assets/constants';
import NoData from '../../../assets/img/no data.svg';
import { ReportDanaMasukKeluarContext } from '../../../components/Context';
import SearchBar from '../../../components/SearchBar';
import DataDanaMasukKeluar from './data_dana_masuk_keluar';
import Loading from './loading';
import ProsesModal from '../../../components/ProsesModal';
import Axios from 'axios';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import {Picker} from '@react-native-picker/picker';

const DANGER =CONSTANTS.COLOR.DANGER;
const NAVY =CONSTANTS.COLOR.NAVY;
const ORANGE =CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;


const DanaMasukKeluar =(props)=> {
    const { getReportDanaMasukKeluar } = React.useContext(ReportDanaMasukKeluarContext);
    const [toggleSearchBar, setToggleSearchBar] = useState(true);
    const [offset, setOffSet] = useState(0);
    const base_url = CONSTANTS.CONFIG.BASE_URL;
    let day   = new Date().getDate();
    let month = new Date().getMonth()+1;
    let year  = new Date().getFullYear();
    if(day.toString().length == 1 ) day = "0"+day;
    if(month.toString().length == 1 ) month = "0"+month;
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [jenis_datepicker, setJenisDatePicker] = useState("");
    let radio_props = [
        {label: 'Dana Masuk', value: 'Dana Masuk' },
        {label: 'Dana Keluar', value: 'Dana Keluar' },
        {label: 'Semua', value: '' },
    ];
    let radio_props1 = [
        {label: 'Tanggal Transaksi', value: 'tanggal_transaksi' },
        {label: 'Tanggal Nota', value: 'tanggal_nota' },
        {label: 'Tanggal Input', value: 'tanggal_input' }
    ];
    const [tanggal_transaksi1, setTanggalTransaksi1] = useState(year+"-"+month+"-01");
    const [tanggal_transaksi2, setTanggalTransaksi2] = useState(year+"-"+month+"-"+day);
    const [tanggal_nota1, setTanggalNota1] = useState(year+"-"+month+"-01");
    const [tanggal_nota2, setTanggalNota2] = useState(year+"-"+month+"-"+day);
    const [tanggal_input1, setTanggalInput1] = useState(year+"-"+month+"-01");
    const [tanggal_input2, setTanggalInput2] = useState(year+"-"+month+"-"+day);
    const [jenis_dana, setJenisDana] = useState("");
    const [jenis_tanggal, setJenisTanggal] = useState("tanggal_transaksi");
    const [search, setSearch] = useState("");
    const [prosesSearch, setProsesSearch] = useState(false);
    const [id_satuan, setIdSatuan] = useState("");
    const [pelaksana, setPelaksana] = useState("");
    const [data_satuan, setDataSatuan] = useState([]);
    const [data_pelaksana, setDataPelaksana] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    
    //DATEPICKER
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    
    const showDatePicker = (a, mode) => {
        if(a == "tanggal_transaksi1" ) {
            setDate(new Date(tanggal_transaksi1));
        }
        else if(a == "tanggal_transaksi2" ) {
            setDate(new Date(tanggal_transaksi2));
        }
        else if(a == "tanggal_nota1" ) {
            setDate(new Date(tanggal_nota1));
        }
        else if(a == "tanggal_nota2" ) {
            setDate(new Date(tanggal_nota2));
        }
        else if(a == "tanggal_input1" ) {
            setDate(new Date(tanggal_input1));
        }
        else if(a == "tanggal_input2" ) {
            setDate(new Date(tanggal_input2));
        }
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
        setDate(date);
        if(jenis_datepicker == "tanggal_transaksi1" ) {
           setTanggalTransaksi1(year+"-"+month+"-"+day);
           setDate(new Date(tanggal_transaksi1));
        }
        else if(jenis_datepicker == "tanggal_transaksi2" ) {
            setTanggalTransaksi2(year+"-"+month+"-"+day);
            setDate(new Date(tanggal_transaksi2));
        }
        else if(jenis_datepicker == "tanggal_nota1" ) {
            setTanggalNota1(year+"-"+month+"-"+day);
            setDate(new Date(tanggal_nota1));
        }
        else if(jenis_datepicker == "tanggal_nota2" ) {
            setTanggalNota2(year+"-"+month+"-"+day);
            setDate(new Date(tanggal_nota2));
        }
        else if(jenis_datepicker == "tanggal_input1" ) {
            setTanggalInput1(year+"-"+month+"-"+day);
            setDate(new Date(tanggal_input1));
        }
        else if(jenis_datepicker == "tanggal_input2" ) {
            setTanggalInput2(year+"-"+month+"-"+day);
            setDate(new Date(tanggal_input2));
        }
   };
   //DATEPICKER

   const onRefresh = React.useCallback(() => {
        getReportDanaMasukKeluar(tanggal_transaksi1, tanggal_transaksi2, tanggal_nota1, tanggal_nota2, tanggal_input1, tanggal_input2, jenis_tanggal, jenis_dana, pelaksana,id_satuan, search, true, true)
        getDataSatuan();
        setProsesSearch(false);
        
   }, [tanggal_transaksi1, tanggal_transaksi2,tanggal_nota1, tanggal_nota2,tanggal_input1, tanggal_input2, jenis_tanggal, jenis_dana, pelaksana, id_satuan,search]);

    useEffect (() => {
        const loadPage = props.navigation.addListener('focus', () => {
            setToggleSearchBar(true);
            onRefresh()
        });
        return loadPage;
    },[props.navigation, tanggal_transaksi1, tanggal_transaksi2, tanggal_nota1, tanggal_nota2, tanggal_input1, tanggal_input2, jenis_tanggal, jenis_dana, pelaksana, id_satuan, search]);

    useEffect (() => {
        if(prosesSearch == true) {
            setToggleSearchBar(true);
            onRefresh();
        }
    },[tanggal_transaksi1, tanggal_transaksi2, tanggal_nota1, tanggal_nota2, tanggal_input1, tanggal_input2, jenis_tanggal, jenis_dana, pelaksana, id_satuan, search, prosesSearch]);

    const handleOnScroll = (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        //const dif = currentOffset - (offset || 0);
        setOffSet(currentOffset);
        var direction = currentOffset > offset ? 'down' : 'up';
        if (direction == 'down' ) {
            //props.navigation.setOptions({tabBarVisible: false});
            setToggleSearchBar(false);
        }
        else {
           // props.navigation.setOptions({tabBarVisible: true});
            setToggleSearchBar(true);
        }
        console.log('dif=',offset+"  "+"currentOffset="+currentOffset);
    }   
    
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchBarHeight, setSearchBarHeight] = useState(65);
    const [iconShowSearch, setIconShowSearch] = useState("chevron-down");
    const [showFilter, setShowFilter] = useState(false);
    const [marginBot, setMarginBot] = useState(0)
    const handleSearchBar = () =>{
        if(showSearchBar && setShowFilter ){
            setShowSearchBar(false);
            setShowFilter(false);
            setIconShowSearch("chevron-down");
            setSearchBarHeight(65);
            setMarginBot(0);
        }
        else{
            setShowSearchBar(true);
            setShowFilter(true);
            setIconShowSearch("chevron-up");
            setSearchBarHeight(490);
            setMarginBot(50);
        }
    }

    const renderItem = ({ item }) => {
        let file_dana_masuk_keluar ="";
        if(item.file_dana_masuk_keluar != "") {
            file_dana_masuk_keluar = base_url+"assets/upload/file dana masuk keluar/"+item.file_dana_masuk_keluar
        }
        return (
            <View >
                <DataDanaMasukKeluar no_dana_masuk_keluar={item.no_dana_masuk_keluar}
                 tanggal_transaksi={item.tanggal_transaksi} tanggal_nota={item.tanggal_nota} waktu_input_dana_masuk_keluar={item.waktu_input_dana_masuk_keluar} jenis_dana={item.jenis_dana} pelaksana={item.pelaksana} nilai={item.nilai} keterangan_dana_masuk_keluar={item.keterangan_dana_masuk_keluar}  quantity={item.quantity} id_satuan={item.id_satuan} nama_satuan={item.nama_satuan} file_dana_masuk_keluar={file_dana_masuk_keluar} username={item.username} navigation={props.navigation} onRefresh={onRefresh}  />
            </View>
        );
    }

    const [loading, setLoading] = useState(false)
    const dropdownController = useRef(null)
    const searchRef = useRef(null)

    const getSuggestions = useCallback(async (q) => {
        setPelaksana(q);
        setLoading(true);
        const params = {
            search : q
        }
        Axios.get(base_url+'DanaMasukKeluar/api_get_autocomplete_data_pelaksana', {params})
        .then(response => {
            setDataPelaksana(response.data);
            setLoading(false)
            console.log(data_pelaksana);
        })
        .catch(function (error) {
            Alert.alert(alert_title, "Terjadi Kesalahan\n"+error);
            setModalVisible(false);
        })
    }, [])

    const setSelectedItem = (item) => {
        if(item != null){
            //alert("selected!"+item.id)
            setPelaksana(item.title);
            console.log(pelaksana);
        }
    }

    //API & CONTEXT
    const getDataSatuan = () => {
        if(id_satuan == "") {
            setModalVisible(true);
            Axios.get(base_url+'DanaMasukKeluar/api_get_data_satuan')
            .then(response => {
                setDataSatuan(response.data);
                console.log(response.data);
                getDataPelaksana();
            })
            .catch(function (error) {
                Alert.alert(alert_title, "Terjadi Kesalahan\n"+error);
                setModalVisible(false);
            })
        }
    }

    const getDataPelaksana = () => {
        setModalVisible(true);
        Axios.get(base_url+'DanaMasukKeluar/api_get_data_pelaksana')
        .then(response => {
            setDataPelaksana(response.data);
            setModalVisible(false);
            console.log(data_pelaksana);
        })
        .catch(function (error) {
            Alert.alert(alert_title, "Terjadi Kesalahan\n"+error);
            setModalVisible(false);
        })
    }
    //API & CONTEXT
    const showBottomNavigation = () => {
        props.navigation.setOptions({tabBarVisible: true});
    }
    const hideBottomNavigation = () => {
        props.navigation.setOptions({tabBarVisible: false});
    }

    let view = '';

    if(props.showLoading){ 
        view = 
            <View >
                <Loading />
                <Loading />
                <Loading />
                <Loading />
                <Loading />
                <Loading />
            </View>;
    }
    else{
        if(!props.danaMasukKeluar.data){
            view = 
            <View style={{flex:1}}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                        refreshing={props.refreshing}
                        onRefresh={onRefresh}
                        />
                    }
                >
                    <View style={styles.noDataWrapper}>
                        <NoData width={250} height={150} />
                        <Text style={styles.noDataText1}>Tidak Ada Data Ditemukan</Text>
                        <Text style={styles.noDataText2}>Terjadi Kesalahan Pada Server Saat Mengambil Data</Text>
                    </View>
                </ScrollView>
            </View>
        }
        else {
            if(props.danaMasukKeluar.data.length == 0) {
                view = 
                <View style={{flex:1}}>
                         {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                            maximumDate={new Date()}
                            />
                        )}
                        <Animated.View style={{backgroundColor:DANGER,height:searchBarHeight}}>
                            
                            {showSearchBar && (
                            // <ScrollView>    
                            <View style={{marginBottom:0}}>
                                    
                                    <View style={styles.formGroup} >
                                        <Text style={styles.searchLabel}>Pelaksana</Text>
                                            <AutocompleteDropdown
                                                onFocus={hideBottomNavigation}
                                                onBlur={showBottomNavigation}
                                                clearOnFocus={true}
                                                closeOnBlur={false}
                                                closeOnSubmit={true}
                                                onSelectItem={(item) => setSelectedItem(item)}
                                                //onChangeText={getSuggestions}
                                                dataSet={data_pelaksana}
                                                initialValue={pelaksana}
                                                ref={searchRef}
                                                controller={(controller) => {
                                                dropdownController.current = controller
                                                }}
                                                suggestionsListMaxHeight={Dimensions.get("window").height * 0.2}
                                                loading={loading}
                                                useFilter={false} // prevent rerender twice
                                                textInputProps={{
                                                    onChangeText:getSuggestions,
                                                    value:pelaksana,
                                                    style: {
                                                        borderWidth:1,
                                                        borderColor:"white",
                                                        color:"white",
                                                        borderRadius:5,
                                                        fontSize:15,
                                                        backgroundColor:"transparent"
                                                    }
                                                }}
                                                rightButtonsContainerStyle={{
                                                    borderRadius: 25,
                                                    right: 8,
                                                    height: 30,
                                                    top: 10,
                                                    alignSelfs: "center",
                                                    backgroundColor: "transparent"
                                                }}
                                                inputContainerStyle={{
                                                    backgroundColor: "transparent",
                                                    color:"white"
                                                }}
                                                suggestionsListContainerStyle={{
                                                    backgroundColor: "white",
                                                    color:"white"
                                                }}
                                                containerStyle={{ flexGrow: 1, flexShrink: 1 }}
                                                renderItem={(item, text) => (
                                                    <Text style={{ color: NAVY, padding: 15 }}>{item.title}</Text>
                                                )}
                                                ChevronIconComponent={
                                                    <Icon name="chevron-down" type="ionicon" size={18} color="white" />
                                                }
                                                ClearIconComponent={
                                                    <Icon name="close" type="ionicon" size={18} color="white" />
                                                }
                                                inputHeight={45}
                                                // showChevron={true}
                                                showClear={false}
                                            /> 
                                    </View>

                                    <View style={styles.formGroup} >
                                        <Text style={styles.searchLabel}>Satuan</Text>
                                        <TouchableOpacity style={styles.selectSatuan}>
                                            <Picker
                                                selectedValue={id_satuan}
                                                style={{ height: 50, width:"100%", color:"white" }}
                                                onValueChange={(itemValue) => setIdSatuan(itemValue)}
                                            >
                                                <Picker.Item label={"--SEMUA--"} value={""} />
                                                {
                                                    data_satuan.map((data) => (
                                                        <Picker.Item label={data.nama_satuan} value={data.id_satuan} />
                                                    ))
                                                }
                                            </Picker>
                                        </TouchableOpacity>
                                    </View>  

                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                        <View style={styles.formGroup} >
                                            <Text style={styles.searchLabel}>Berdasarkan Tanggal <Text style={{fontSize:13,fontStyle:"italic",color:DANGER}}>* (pilih salah satu)</Text></Text>
                                                <RadioForm
                                                formHorizontal={true}
                                                animation={true}
                                                >
                                                {
                                                    radio_props1.map((obj, i) => (
                                                    <RadioButton labelHorizontal={true} key={i} >
                                                        <RadioButtonInput
                                                        obj={obj}
                                                        index={i}
                                                        isSelected={jenis_tanggal === obj.value }
                                                        onPress={(value) => setJenisTanggal(value)}
                                                        borderWidth={1}
                                                        buttonInnerColor={'yellow'}
                                                        buttonOuterColor={jenis_tanggal === obj.value ? '' : 'white'}
                                                        buttonSize={20}
                                                        buttonOuterSize={20}
                                                        buttonStyle={{}}
                                                        buttonWrapStyle={{marginLeft: 10}}
                                                        />
                                                        
                                                        <RadioButtonLabel
                                                        obj={obj}
                                                        index={i}
                                                        labelHorizontal={true}
                                                        onPress={(value) => setJenisTanggal(value)}
                                                        labelStyle={{fontSize: 15, color: 'white'}}
                                                        labelWrapStyle={{}}
                                                        />
                                                    </RadioButton>
                                                    ))
                                                }  
                                                </RadioForm>
                                        </View>
                                    </ScrollView> 
                                    
                                    {jenis_tanggal == "tanggal_transaksi" && (
                                        <View style={styles.dateTimeWrapper}>
                                            <View style={{flex:1,height:40,marginRight:20}} >
                                                <Text style={styles.searchLabel}>Mulai Tanggal</Text>
                                                <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_transaksi1");showDatePicker("tanggal_transaksi1", "date" )} }  >
                                                    <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_transaksi1} onChangeText={(value) => setTanggalTransaksi1(value) } editable={false} />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{flex:1,height:40}} >
                                                <Text style={styles.searchLabel}>Hingga Tanggal</Text>
                                                <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_transaksi2");showDatePicker("tanggal_transaksi2", "date" )} } >
                                                    <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_transaksi2} onChangeText={(value) => setTanggalTransaksi2(value) } editable={false} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        )
                                    }

                                    {jenis_tanggal == "tanggal_nota" && (
                                        <View style={styles.dateTimeWrapper}>
                                            <View style={{flex:1,height:40,marginRight:20}} >
                                                <Text style={styles.searchLabel}>Mulai Tanggal</Text>
                                                <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_nota1");showDatePicker("tanggal_nota1", "date" )} }  >
                                                    <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_nota1} onChangeText={(value) => setTanggalNota1(value) } editable={false} />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{flex:1,height:40}} >
                                                <Text style={styles.searchLabel}>Hingga Tanggal</Text>
                                                <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_nota2");showDatePicker("tanggal_nota2", "date" )} } >
                                                    <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_nota2} onChangeText={(value) => setTanggalNota2(value) } editable={false} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        )
                                    }

                                    {jenis_tanggal == "tanggal_input" && (
                                        <View style={styles.dateTimeWrapper}>
                                            <View style={{flex:1,height:40,marginRight:20}} >
                                                <Text style={styles.searchLabel}>Mulai Tanggal</Text>
                                                <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_input1");showDatePicker("tanggal_input1", "date" )} }  >
                                                    <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_input1} onChangeText={(value) => setTanggalInput1(value) } editable={false} />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{flex:1,height:40}} >
                                                <Text style={styles.searchLabel}>Hingga Tanggal</Text>
                                                <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_input2");showDatePicker("tanggal_input2", "date" )} } >
                                                    <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_input2} onChangeText={(value) => setTanggalInput2(value) } editable={false} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        )
                                    }

                                    <View style={styles.formGroup} >
                                        <Text style={styles.searchLabel}>Jenis Dana <Text style={{fontSize:13,fontStyle:"italic",color:DANGER}}>* (pilih salah satu)</Text></Text>
                                            <RadioForm
                                            formHorizontal={true}
                                            animation={true}
                                            >
                                            {
                                                radio_props.map((obj, i) => (
                                                <RadioButton labelHorizontal={true} key={i} >
                                                    <RadioButtonInput
                                                    obj={obj}
                                                    index={i}
                                                    isSelected={jenis_dana === obj.value }
                                                    onPress={(value) => setJenisDana(value)}
                                                    borderWidth={1}
                                                    buttonInnerColor={'yellow'}
                                                    buttonOuterColor={jenis_dana === obj.value ? '' : 'white'}
                                                    buttonSize={20}
                                                    buttonOuterSize={20}
                                                    buttonStyle={{}}
                                                    buttonWrapStyle={{marginLeft: 10}}
                                                    />
                                                    
                                                    <RadioButtonLabel
                                                    obj={obj}
                                                    index={i}
                                                    labelHorizontal={true}
                                                    onPress={(value) => setJenisDana(value)}
                                                    labelStyle={{fontSize: 15, color: 'white'}}
                                                    labelWrapStyle={{}}
                                                    />
                                                </RadioButton>
                                                ))
                                            }  
                                            </RadioForm>
                                    </View>
                            </View>
                            //</ScrollView>
                            )}
                            <View style={styles.bottButtonWrapper}>
                                {showFilter && (
                                    <View style={styles.filterData} >
                                        <TouchableOpacity onPress={() => setProsesSearch(true) } style={styles.btnFilterData}>
                                            <Icon name="filter" type="ionicon" size={22} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                                <View style={styles.hideSearch} >
                                    <TouchableOpacity onPress={() => handleSearchBar() } style={styles.btnHideSearchBar}>
                                        <Icon name={iconShowSearch} type="ionicon" size={22} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                refreshing={props.refreshing}
                                onRefresh={onRefresh}
                                />
                            }
                        >
                            <View style={styles.noDataWrapper}>
                                <NoData width={250} height={150} />
                                <Text style={styles.noDataText1}>Tidak Ada Data Ditemukan</Text>
                                <Text style={styles.noDataText2}>Gunakan Kategori Pencarian Lain Atau Tekan Tombol Tambah di Pojok Kanan Atas Untuk Menambah Data Dana Masuk / Keluar</Text>
                            </View>
                        </ScrollView>
                    </View>    
            }
            else{
                view = 
                <View style={{flex:1}}>
                         {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                            maximumDate={new Date()}
                            />
                        )}
                        <Animated.View style={{backgroundColor:DANGER,height:searchBarHeight}}>
                            {showSearchBar && (
                            // <ScrollView>    
                            <View style={{marginBottom:0}}>
                                    
                                    <View style={styles.formGroup} >
                                        <Text style={styles.searchLabel}>Pelaksana</Text>
                                            <AutocompleteDropdown
                                                onFocus={hideBottomNavigation}
                                                onBlur={showBottomNavigation}
                                                clearOnFocus={true}
                                                closeOnBlur={false}
                                                closeOnSubmit={true}
                                                onSelectItem={(item) => setSelectedItem(item)}
                                                //onChangeText={getSuggestions}
                                                dataSet={data_pelaksana}
                                                initialValue={pelaksana}
                                                ref={searchRef}
                                                controller={(controller) => {
                                                dropdownController.current = controller
                                                }}
                                                suggestionsListMaxHeight={Dimensions.get("window").height * 0.2}
                                                loading={loading}
                                                useFilter={false} // prevent rerender twice
                                                textInputProps={{
                                                    onChangeText:getSuggestions,
                                                    value:pelaksana,
                                                    style: {
                                                        borderWidth:1,
                                                        borderColor:"white",
                                                        color:"white",
                                                        borderRadius:5,
                                                        fontSize:15,
                                                        backgroundColor:"transparent"
                                                    }
                                                }}
                                                rightButtonsContainerStyle={{
                                                    borderRadius: 25,
                                                    right: 8,
                                                    height: 30,
                                                    top: 10,
                                                    alignSelfs: "center",
                                                    backgroundColor: "transparent"
                                                }}
                                                inputContainerStyle={{
                                                    backgroundColor: "transparent",
                                                    color:"white"
                                                }}
                                                suggestionsListContainerStyle={{
                                                    backgroundColor: "white",
                                                    color:"white"
                                                }}
                                                containerStyle={{ flexGrow: 1, flexShrink: 1 }}
                                                renderItem={(item, text) => (
                                                    <Text style={{ color: NAVY, padding: 15 }}>{item.title}</Text>
                                                )}
                                                ChevronIconComponent={
                                                    <Icon name="chevron-down" type="ionicon" size={18} color="white" />
                                                }
                                                ClearIconComponent={
                                                    <Icon name="close" type="ionicon" size={18} color="white" />
                                                }
                                                inputHeight={45}
                                                // showChevron={true}
                                                showClear={false}
                                            /> 
                                    </View>

                                    <View style={styles.formGroup} >
                                        <Text style={styles.searchLabel}>Satuan</Text>
                                        <TouchableOpacity style={styles.selectSatuan}>
                                            <Picker
                                                selectedValue={id_satuan}
                                                style={{ height: 50, width:"100%", color:"white" }}
                                                onValueChange={(itemValue) => setIdSatuan(itemValue)}
                                            >
                                                <Picker.Item label={"--SEMUA--"} value={""} />
                                                {
                                                    data_satuan.map((data) => (
                                                        <Picker.Item label={data.nama_satuan} value={data.id_satuan} />
                                                    ))
                                                }
                                            </Picker>
                                        </TouchableOpacity>
                                    </View>  

                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                        <View style={styles.formGroup} >
                                            <Text style={styles.searchLabel}>Berdasarkan Tanggal <Text style={{fontSize:13,fontStyle:"italic",color:DANGER}}>* (pilih salah satu)</Text></Text>
                                                <RadioForm
                                                formHorizontal={true}
                                                animation={true}
                                                >
                                                {
                                                    radio_props1.map((obj, i) => (
                                                    <RadioButton labelHorizontal={true} key={i} >
                                                        <RadioButtonInput
                                                        obj={obj}
                                                        index={i}
                                                        isSelected={jenis_tanggal === obj.value }
                                                        onPress={(value) => setJenisTanggal(value)}
                                                        borderWidth={1}
                                                        buttonInnerColor={'yellow'}
                                                        buttonOuterColor={jenis_tanggal === obj.value ? '' : 'white'}
                                                        buttonSize={20}
                                                        buttonOuterSize={20}
                                                        buttonStyle={{}}
                                                        buttonWrapStyle={{marginLeft: 10}}
                                                        />
                                                        
                                                        <RadioButtonLabel
                                                        obj={obj}
                                                        index={i}
                                                        labelHorizontal={true}
                                                        onPress={(value) => setJenisTanggal(value)}
                                                        labelStyle={{fontSize: 15, color: 'white'}}
                                                        labelWrapStyle={{}}
                                                        />
                                                    </RadioButton>
                                                    ))
                                                }  
                                                </RadioForm>
                                        </View>
                                    </ScrollView> 
                                    
                                    {jenis_tanggal == "tanggal_transaksi" && (
                                        <View style={styles.dateTimeWrapper}>
                                            <View style={{flex:1,height:40,marginRight:20}} >
                                                <Text style={styles.searchLabel}>Mulai Tanggal</Text>
                                                <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_transaksi1");showDatePicker("tanggal_transaksi1", "date" )} }  >
                                                    <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_transaksi1} onChangeText={(value) => setTanggalTransaksi1(value) } editable={false} />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{flex:1,height:40}} >
                                                <Text style={styles.searchLabel}>Hingga Tanggal</Text>
                                                <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_transaksi2");showDatePicker("tanggal_transaksi2", "date" )} } >
                                                    <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_transaksi2} onChangeText={(value) => setTanggalTransaksi2(value) } editable={false} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        )
                                    }

                                    {jenis_tanggal == "tanggal_nota" && (
                                        <View style={styles.dateTimeWrapper}>
                                            <View style={{flex:1,height:40,marginRight:20}} >
                                                <Text style={styles.searchLabel}>Mulai Tanggal</Text>
                                                <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_nota1");showDatePicker("tanggal_nota1", "date" )} }  >
                                                    <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_nota1} onChangeText={(value) => setTanggalNota1(value) } editable={false} />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{flex:1,height:40}} >
                                                <Text style={styles.searchLabel}>Hingga Tanggal</Text>
                                                <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_nota2");showDatePicker("tanggal_nota2", "date" )} } >
                                                    <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_nota2} onChangeText={(value) => setTanggalNota2(value) } editable={false} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        )
                                    }

                                    {jenis_tanggal == "tanggal_input" && (
                                        <View style={styles.dateTimeWrapper}>
                                            <View style={{flex:1,height:40,marginRight:20}} >
                                                <Text style={styles.searchLabel}>Mulai Tanggal</Text>
                                                <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_input1");showDatePicker("tanggal_input1", "date" )} }  >
                                                    <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_input1} onChangeText={(value) => setTanggalInput1(value) } editable={false} />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{flex:1,height:40}} >
                                                <Text style={styles.searchLabel}>Hingga Tanggal</Text>
                                                <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal_input2");showDatePicker("tanggal_input2", "date" )} } >
                                                    <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal_input2} onChangeText={(value) => setTanggalInput2(value) } editable={false} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        )
                                    }

                                    <View style={styles.formGroup} >
                                        <Text style={styles.searchLabel}>Jenis Dana <Text style={{fontSize:13,fontStyle:"italic",color:DANGER}}>* (pilih salah satu)</Text></Text>
                                            <RadioForm
                                            formHorizontal={true}
                                            animation={true}
                                            >
                                            {
                                                radio_props.map((obj, i) => (
                                                <RadioButton labelHorizontal={true} key={i} >
                                                    <RadioButtonInput
                                                    obj={obj}
                                                    index={i}
                                                    isSelected={jenis_dana === obj.value }
                                                    onPress={(value) => setJenisDana(value)}
                                                    borderWidth={1}
                                                    buttonInnerColor={'yellow'}
                                                    buttonOuterColor={jenis_dana === obj.value ? '' : 'white'}
                                                    buttonSize={20}
                                                    buttonOuterSize={20}
                                                    buttonStyle={{}}
                                                    buttonWrapStyle={{marginLeft: 10}}
                                                    />
                                                    
                                                    <RadioButtonLabel
                                                    obj={obj}
                                                    index={i}
                                                    labelHorizontal={true}
                                                    onPress={(value) => setJenisDana(value)}
                                                    labelStyle={{fontSize: 15, color: 'white'}}
                                                    labelWrapStyle={{}}
                                                    />
                                                </RadioButton>
                                                ))
                                            }  
                                            </RadioForm>
                                    </View>
                            </View>
                            //</ScrollView>
                            )}
                            <View style={styles.bottButtonWrapper}>
                                {showFilter && (
                                    <View style={styles.filterData} >
                                        <TouchableOpacity onPress={() => setProsesSearch(true) } style={styles.btnFilterData}>
                                            <Icon name="filter" type="ionicon" size={22} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                                <View style={styles.hideSearch} >
                                    <TouchableOpacity onPress={() => handleSearchBar() } style={styles.btnHideSearchBar}>
                                        <Icon name={iconShowSearch} type="ionicon" size={22} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>

                        <Animated.FlatList
                            data={props.danaMasukKeluar.data}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            onScroll={(e) => handleOnScroll(e)}
                            style={{/*transform: [{ translateY: searchBarAnim1 }], flexGrow:0, height:1000*/flex:1, marginBottom:8}}
                            navigation={props.navigation}
                            refreshControl={
                                <RefreshControl
                                refreshing={props.refreshing}
                                onRefresh={onRefresh}
                                />
                            }
                        />
                    </View>;
            }
        }
    }

    return (
        <View style={{flex:1}}>
            <SearchBar navigation={props.navigation} toggleSearchBar={toggleSearchBar} searchLabel="Ketik Disini Untuk Mencari Sesuatu" goTo="CariDanaMasukKeluar" />
            {view}
        </View>
    );

}

export default DanaMasukKeluar;

const styles = StyleSheet.create({
    noDataWrapper:{
        flex:1,
        alignItems:"center", 
        justifyContent:"center",
        paddingTop:200
    },
    bottButtonWrapper : {
        flex:1,
        flexDirection:"row",
        justifyContent :"space-between",
    },
    btnFilterData :{
        alignItems:"center", 
        justifyContent:"center", 
        backgroundColor:NAVY, 
        padding:5, 
        borderRadius:10,
        marginTop:20,
    },
    filterData:{
        flex:1,
        paddingHorizontal:12,
    },
    btnHideSearchBar :{
        alignItems:"center", 
        justifyContent:"center", 
        backgroundColor:ORANGE, 
        padding:5, 
        borderRadius:10,
        marginTop:20,
    },
    hideSearch:{
        flex:1,
        paddingHorizontal:12,
    },
    pelaksanaWrapper : {
        flex:1,
        flexDirection:"row",
        justifyContent :"space-between",
    },
    selectSatuan : {
        borderWidth:1, 
        alignItems:'center', 
        justifyContent:'center',
        borderColor:"white",
        borderRadius:5,
        flex:1,
        paddingVertical:20
    },
    noDataText1:{
        fontSize:16,
        color:DANGER,
        textAlign:"center",
        marginTop:20
    },
    noDataText2:{
        width:300,
        textAlign:"center",
        fontSize:12,
        color:"gray"
    },
    formGroup:{
        paddingHorizontal:12,
        marginTop:20
    },
    searchArea:{
        paddingHorizontal:12,
        marginTop:20,
        backgroundColor:DANGER
    },
    dateTimeWrapper : {
        flexDirection:"row",
        justifyContent :"space-between",
        paddingHorizontal:12,
        marginTop:10,
        marginBottom:30,
    },
    datePicker:{
        borderWidth:1,
        color:"white",
        borderRadius:5,
        fontSize:15,
        borderColor:"white"
    },
    textInput:{
        borderWidth:1,
        borderColor:"gray",
        color:"black",
        borderRadius:5,
        fontSize:15
    },
    formLabel : {
        color:'black',
        fontSize:15,
        marginBottom:10
    },
    searchLabel : {
        color:'white',
        fontSize:15,
        marginBottom:10
    },
    
});