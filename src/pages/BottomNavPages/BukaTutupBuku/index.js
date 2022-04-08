/* eslint-disable prettier/prettier */
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import CONSTANTS from '../../../assets/constants';
import NoData from '../../../assets/img/no data.svg';
import { ReportBukaTutupBukuContext } from '../../../components/Context';
import SearchBar from '../../../components/SearchBar';
import DataBukaTutupBuku from './data_buka_tutup_buku';
import Loading from './loading';


const DANGER = CONSTANTS.COLOR.DANGER;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
let searchBarMarginTop = 20;

const BukaTutupBuku =(props)=> {
    const { getReportBukaTutupBuku } = React.useContext(ReportBukaTutupBukuContext);
    const [toggleSearchBar, setToggleSearchBar] = useState(true);
    const [offset, setOffSet] = useState(0);
    const base_url = CONSTANTS.CONFIG.BASE_URL;
    let day   = new Date().getDate();
    let month = new Date().getMonth()+1;
    let year  = new Date().getFullYear();
    if(day.toString().length == 1 ) day = "0"+day;
    if(month.toString().length == 1 ) month = "0"+month;
    const [tanggal1, setTanggal1] = useState(year+"-"+month+"-01");
    const [tanggal2, setTanggal2] = useState(year+"-"+month+"-"+day);
    const [jenis_buka_tutup_buku, setJenisBukaTutupBuku] = useState("");
    const [search, setSearch] = useState("");
    let radio_props = [
        {label: 'Buka', value: 'Buka' },
        {label: 'Tutup', value: 'Tutup' },
        {label: 'Semua', value: '' }
    ];
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [jenis_datepicker, setJenisDatePicker] = useState("");
    const [prosesSearch, setProsesSearch] = useState(false);
    
    //DATEPICKER
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    
      const showDatePicker = (a, mode) => {
          //alert(jenis_datepicker)
          if(a == "tanggal1" ) {
            setDate(new Date(tanggal1));
          }
          else if(a == "tanggal2" ) {
            setDate(new Date(tanggal2));
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
        if(jenis_datepicker == "tanggal1" ) {
           setTanggal1(year+"-"+month+"-"+day);
           setDate(new Date(tanggal1));
        }
        else if(jenis_datepicker == "tanggal2" ) {
            setTanggal2(year+"-"+month+"-"+day);
            setDate(new Date(tanggal2));
         }
       //  setDate(date);
   };
   //DATEPICKER

   const onRefresh = React.useCallback(() => {
        getReportBukaTutupBuku(tanggal1, tanggal2, jenis_buka_tutup_buku, "", true, true);
        setProsesSearch(false);
    }, [tanggal1, tanggal2, jenis_buka_tutup_buku, search]);

    useEffect (() => {
        const loadPage = props.navigation.addListener('focus', () => {
            setToggleSearchBar(true);
            onRefresh()
        });
        return loadPage;
    },[props.navigation, tanggal1, tanggal2, jenis_buka_tutup_buku, search]);

    useEffect (() => {
        if(prosesSearch == true) {
            setToggleSearchBar(true);
            onRefresh();
        }
    },[tanggal1, tanggal2, jenis_buka_tutup_buku, search, prosesSearch]);

    const [searchBar ,setSearchBar] = useState(0);
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

    let searchBarAnim = useRef(new Animated.Value(0)).current;
    let searchBarAnim1 = useRef(new Animated.Value(0)).current;
    // if (toggleSearchBar  ) {
    //     Animated.timing(searchBarAnim, {
    //         toValue: 0,
    //         duration: 400,
    //         useNativeDriver: true,
    //     }).start();
    //     Animated.timing(searchBarAnim1, {
    //         toValue: 0,
    //         duration: 400,
    //         useNativeDriver: true,
    //     }).start();
    // } else {
    //     Animated.timing(searchBarAnim, {
    //         toValue: -300,
    //         duration: 400,
    //         useNativeDriver: true,
    //     }).start();
    //     Animated.timing(searchBarAnim1, {
    //         toValue: -150,
    //         duration: 400,
    //         useNativeDriver: true,
    //     }).start();
    // }

    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchBarHeight, setSearchBarHeight] = useState(65);
    //const [searchBarMarginTop, setSearchBarMarginTop] = useState(20);
    const [iconShowSearch, setIconShowSearch] = useState("chevron-down");
    const [showFilter, setShowFilter] = useState(false);
    const handleSearchBar = () =>{
        if(showSearchBar){
            setShowSearchBar(false);
            setShowFilter(false);
            setIconShowSearch("chevron-down");
            setSearchBarHeight(65);
            searchBarMarginTop = 0;
        }
        else{
            setShowSearchBar(true);
            setShowFilter(true);
            setIconShowSearch("chevron-up");
            setSearchBarHeight(225);
            searchBarMarginTop = 20;
        }
    }

    const renderItem = ({ item }) => {
        let file_buka_tutup_buku1, file_buka_tutup_buku2 ="";
        if(item.file_buka_tutup_buku1 != "") {
            file_buka_tutup_buku1 = base_url+"assets/upload/file buka tutup buku 1/"+item.file_buka_tutup_buku1
        }
        if(item.file_buka_tutup_buku2 != "") {
            file_buka_tutup_buku2 = base_url+"assets/upload/file buka tutup buku 2/"+item.file_buka_tutup_buku2
        }
        return (
            <View key={item.no_buka_tutup_buku} >
                <DataBukaTutupBuku no_buka_tutup_buku={item.no_buka_tutup_buku} waktu_buka_tutup_buku={item.waktu_buka_tutup_buku} username={item.username}  jenis_buka_tutup_buku={item.jenis_buka_tutup_buku} total={item.total} file_buka_tutup_buku1={file_buka_tutup_buku1} file_buka_tutup_buku2={file_buka_tutup_buku2}  navigation={props.navigation} onRefresh={onRefresh} key={item.no_buka_tutup_buku} />
            </View>
        );
    }
    
    let view ='';
    if(props.showLoading){
        view =  
        <View style={{flex:1}}>
            <Loading />
            <Loading />
            <Loading />
            <Loading />
            <Loading />
            <Loading />
        </View>;
    }
    else{
        if(!props.bukaTutupBuku.data){
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
            </View>;
        }
        else{
            if(props.bukaTutupBuku.data.length == 0) {
                view = 
                <View style={{flex:1}} >
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
                        <View>
                            <View style={styles.dateTimeWrapper}>
                                <View style={{flex:1,height:40,marginRight:20}} >
                                    <Text style={styles.searchLabel}>Mulai Tanggal</Text>
                                    <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal1");showDatePicker("tanggal1", "date" )} }  >
                                        <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal1} onChangeText={(value) => setTanggal1(value) } editable={false} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{flex:1,height:40}} >
                                    <Text style={styles.searchLabel}>Hingga Tanggal</Text>
                                    <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal2");showDatePicker("tanggal2", "date" )} } >
                                        <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal2} onChangeText={(value) => setTanggal2(value) } editable={false} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.formGroup} >
                                <Text style={styles.searchLabel}>Buka / Tutup Buku <Text style={{fontSize:13,fontStyle:"italic",color:DANGER}}>* (pilih salah satu)</Text></Text>
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
                                            isSelected={jenis_buka_tutup_buku === obj.value }
                                            onPress={(value) => setJenisBukaTutupBuku(value)}
                                            borderWidth={1}
                                            buttonInnerColor={'yellow'}
                                            buttonOuterColor={jenis_buka_tutup_buku === obj.value ? '' : 'white'}
                                            buttonSize={20}
                                            buttonOuterSize={20}
                                            buttonStyle={{}}
                                            buttonWrapStyle={{marginLeft: 10}}
                                            />
                                            
                                            <RadioButtonLabel
                                            obj={obj}
                                            index={i}
                                            labelHorizontal={true}
                                            onPress={(value) => setJenisBukaTutupBuku(value)}
                                            labelStyle={{fontSize: 15, color: 'white'}}
                                            labelWrapStyle={{}}
                                            />
                                        </RadioButton>
                                        ))
                                    }  
                                    </RadioForm>
                            </View>
                        </View>
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
                            <Text style={styles.noDataText2}>Gunakan Kategori Pencarian Lain Atau Tekan Tombol Tambah di Pojok Kanan Atas Untuk Menambah Data Buka / Tutup Buku</Text>
                        </View>
                    </ScrollView>
                </View>
            }
            else{
                view = 
                <View style={{flex:1}} >
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
                        <View>
                            <View style={styles.dateTimeWrapper}>
                                <View style={{flex:1,height:40,marginRight:20}} >
                                    <Text style={styles.searchLabel}>Mulai Tanggal</Text>
                                    <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal1");showDatePicker("tanggal1", "date" )} }  >
                                        <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal1} onChangeText={(value) => setTanggal1(value) } editable={false} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{flex:1,height:40}} >
                                    <Text style={styles.searchLabel}>Hingga Tanggal</Text>
                                    <TouchableOpacity onPress={() => {setJenisDatePicker("tanggal2");showDatePicker("tanggal2", "date" )} } >
                                        <TextInput style={styles.datePicker} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={tanggal2} onChangeText={(value) => setTanggal2(value) } editable={false} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.formGroup} >
                                <Text style={styles.searchLabel}>Buka / Tutup Buku <Text style={{fontSize:13,fontStyle:"italic",color:DANGER}}>* (pilih salah satu)</Text></Text>
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
                                            isSelected={jenis_buka_tutup_buku === obj.value }
                                            onPress={(value) => setJenisBukaTutupBuku(value)}
                                            borderWidth={1}
                                            buttonInnerColor={'yellow'}
                                            buttonOuterColor={jenis_buka_tutup_buku === obj.value ? '' : 'white'}
                                            buttonSize={20}
                                            buttonOuterSize={20}
                                            buttonStyle={{}}
                                            buttonWrapStyle={{marginLeft: 10}}
                                            />
                                            
                                            <RadioButtonLabel
                                            obj={obj}
                                            index={i}
                                            labelHorizontal={true}
                                            onPress={(value) => setJenisBukaTutupBuku(value)}
                                            labelStyle={{fontSize: 15, color: 'white'}}
                                            labelWrapStyle={{}}
                                            />
                                        </RadioButton>
                                        ))
                                    }  
                                    </RadioForm>
                            </View>
                            </View>
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
                        data={props.bukaTutupBuku.data}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        onScroll={(e) => handleOnScroll(e)}
                        style={{flex:1, marginBottom:8}}
                        navigation={props.navigation}
                        refreshControl={
                            <RefreshControl
                            refreshing={props.refreshing}
                            onRefresh={onRefresh}
                            />
                        }
                    />
                </View>
            }
        }
    }

    return(
        <View style={{flex:1}}>
            <SearchBar navigation={props.navigation} toggleSearchBar={toggleSearchBar} searchLabel="Ketik Disini Untuk Mencari Sesuatu" goTo="CariBukaTutupBuku" />
            {view}
        </View>
    );
};

export default BukaTutupBuku;


const styles = StyleSheet.create({
    noDataWrapper:{
        flex:1,
        alignItems:"center", 
        justifyContent:"center",
        paddingTop:200
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
    btnHideSearchBar :{
        alignItems:"center", 
        justifyContent:"center", 
        backgroundColor:ORANGE, 
        padding:5, 
        position:"relative",
        borderRadius:10,
        marginTop:searchBarMarginTop
    }
});