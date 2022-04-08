/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {BerandaContext} from '../../../components/Context';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text } from 'react-native';
import CONSTANTS from '../../../assets/constants';
import ProsesModal from '../../../components/ProsesModal';
import Index from './index';

const ContextBeranda = ({route, navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [dataPostinganSupplier, setPostinganSupplier] = useState([]);
    const [showLoading,setShowLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(true);
    
    const berandaContext = React.useMemo(() => ({
        getPostinganSupplier : () => {
            
        },
    }),[])

    return(
        <BerandaContext.Provider value={berandaContext}>
            <View style={{flex:1}}>
                <Index dataPostinganSupplier={dataPostinganSupplier} navigation={navigation} showLoading={showLoading} refreshing={refreshing}  />
            </View>    

            <View>
                <ProsesModal setModalVisible={setModalVisible} modalVisible={modalVisible} /> 
            </View>
        </BerandaContext.Provider>      
    );
}

export default ContextBeranda;