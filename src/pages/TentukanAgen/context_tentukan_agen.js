/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {TentukanAgenContext} from '../../components/Context';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text } from 'react-native';
import CONSTANTS from '../../assets/constants';
import ProsesModal from '../../components/ProsesModal';
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
import Index from './index';

const ContextTentukanAgen = ({route, navigation}) => {
    let {file_klaim_do} = route.params;
    const closeAlert = () => {
        console.log("alert close");
       //setAlert(false);
    }
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(true);

    const tentukanAgenContext = React.useMemo(() => ({
    }),[])

    return(
        <TentukanAgenContext.Provider value={tentukanAgenContext}>
            <View style={{flex:1}}>
                <Index navigation={navigation} refreshing={refreshing} file_klaim_do={file_klaim_do} />
            </View>    

            <View>
                <ProsesModal setModalVisible={setModalVisible} modalVisible={modalVisible} /> 
            </View>
        </TentukanAgenContext.Provider>      
    );
}

export default ContextTentukanAgen;