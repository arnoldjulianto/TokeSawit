/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import iconCameraPurple from '../../../assets/icon/camera-purple.png';
import iconInvoiceGreen from '../../../assets/icon/invoice-green.png';
import iconListRed from '../../../assets/icon/list-red.png';
import iconShoppingCartBlue from '../../../assets/icon/shopping-cart-blue.png';
import iconCashierMachineBlack from '../../../assets/icon/cashier-machine-black.png';
import iconLoanYellow from '../../../assets/icon/loan-yellow.png';
import iconPeopleListPink from '../../../assets/icon/people-list-pink.png';
import CONSTANTS from '../../../assets/constants';
import SearchBar from '../../../components/SearchBar/search_bar_beranda';
import AsyncStorage from '@react-native-community/async-storage';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const Beranda = (props) => {

    const launchImageLibrary = async () => {
        const options = {
            usedCameraButton: true,
            allowedVideo: false,
            allowedPhotograph: true, // for camera : allow this option when you want to take a photos
            allowedVideoRecording: false, //for camera : allow this option when you want to recording video.
            maxVideoDuration: 60, //for camera : max video recording duration
            numberOfColumn: 3,
            maxSelectedAssets: 20,
            singleSelectedMode: false,
            doneTitle: 'Lanjutkan',
            isPreview: true,
            mediaType: 'image',
            isExportThumbnail: true,
        }
        const response = await MultipleImagePicker.openPicker(options);
        console.log(response);
        const params = {
            'all_file_klaim_do' : response
        }
        props.navigation.navigate('FotoKlaimDo', params);
    }

    const getUser = async () => {
        try {
          const value = await AsyncStorage.getItem('username');
          if (value === null) {
            // We have data!!
            props.navigation.navigate("Login");
          }
          else{
            launchImageLibrary()
          }
        } catch (error) {
          // Error retrieving data
          console.log(error)
        }
    };

    return(
        <View>
            <SearchBar />
            <ScrollView style={styles.container}>
                <View style={styles.topArea}>
                    <Text></Text>
                </View>
                <View style={styles.menuArea}>
                    <View style={styles.menuRow}>
                        <TouchableOpacity style={styles.btnMenu} onPress={()=> {getUser()} }>
                            <View style={styles.btnMenu}>
                                <Image source={iconCameraPurple} style={styles.btnMenuIcon}  />
                                <Text style={styles.btnMenuLabel}>Jual Do</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnMenu} onPress={()=> {} }>
                            <View style={styles.btnMenu}>
                                <Image source={iconShoppingCartBlue} style={styles.btnMenuIcon}  />
                                <Text style={styles.btnMenuLabel}>Beli Do</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnMenu} onPress={()=> {} }>
                            <View style={styles.btnMenu}>
                                <Image source={iconListRed} style={styles.btnMenuIcon}  />
                                <Text style={styles.btnMenuLabel}>Rekap Do Saya</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnMenu} onPress={()=> {} }>
                            <View style={styles.btnMenu}>
                                <Image source={iconInvoiceGreen} style={styles.btnMenuIcon}  />
                                <Text style={styles.btnMenuLabel}>Buat {'\n'} Invoice</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.menuRow}>
                        <TouchableOpacity style={styles.btnMenu} onPress={()=> {} }>
                            <View style={styles.btnMenu}>
                                <Image source={iconCashierMachineBlack} style={styles.btnMenuIcon}  />
                                <Text style={styles.btnMenuLabel}>Bayar Invoice</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnMenu} onPress={()=> {} }>
                            <View style={styles.btnMenu}>
                                <Image source={iconLoanYellow} style={styles.btnMenuIcon}  />
                                <Text style={styles.btnMenuLabel}>Kasih Deposit</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnMenu} onPress={()=> {} }>
                            <View style={styles.btnMenu}>
                                <Image source={iconPeopleListPink} style={styles.btnMenuIcon}  />
                                <Text style={styles.btnMenuLabel}>Daftar Hutang</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </ScrollView>
        </View>
    )
}
export default Beranda;

const styles = StyleSheet.create({
    container :{
        top:0
    },
    topArea:{
        backgroundColor:ORANGE,
        height:120,
    },
    menuArea :{
        marginTop:20,
        backgroundColor:'white',
        height:190,
        top:-80,
        marginHorizontal:20,
        borderRadius:10,
        padding:10
    },
    menuRow :{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        marginBottom:90
    },
    btnMenu: {
        backgroundColor:'transparent',
        alignItems:"center",
        height:80,
        width:90,
        justifyContent:"center",
    },
    btnMenuIcon : {
        width:36,
        height:36,
        marginTop:1
    },
    btnMenuLabel : {
        fontSize:11,
        color:'grey',
        textAlign: 'center',
        marginTop:5
    },
    noDataWrapper:{
        alignItems:"center", 
        justifyContent:"center",
        paddingTop:50
    },
})