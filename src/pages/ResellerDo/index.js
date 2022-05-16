/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import CONSTANTS from '../../assets/constants';
import nextIcon from '../../assets/icon/next.png';
import SearchBar from '../../components/SearchBar/search_bar_jadi_pemilik_do';

const DANGER = CONSTANTS.COLOR.DANGER;
const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;

const ResellerDo = ({route, navigation}) => {
    let {username} = route.params;

    return(
        <View style={{flex:1}}>
            <SearchBar title={"Pilih Produk"} refresh={false} navigation={navigation} />
            <View style={styles.container} >
                <View style={styles.segmenWrapper} >
                    
                </View>
            </View>    
        </View>
    )
}
export default ResellerDo;

const styles = StyleSheet.create({
    container : {
        flex:1,
        paddingHorizontal:5,
        paddingTop:30
    },
})