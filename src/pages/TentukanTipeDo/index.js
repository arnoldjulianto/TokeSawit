/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import CONSTANTS from '../../assets/constants';
import nextIcon from '../../assets/icon/next.png';
import SearchBar from '../../components/SearchBar/search_bar_jadi_pemilik_do';

const DANGER = CONSTANTS.COLOR.DANGER;
const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;

const TentukanTipeDo = ({route, navigation}) => {
    let {username} = route.params;

    const loadDoPPKS = () => {
        navigation.navigate("InputDoPPKS",{username});
    }

    const loadResellerDo = () => {
        navigation.navigate("ResellerDo",{username});
    }

    return (
        <View style={{flex:1}}>
            <SearchBar title={"Pilih Salah Satu"} refresh={false} navigation={navigation} />
            <View style={styles.container} >
                <View style={styles.segmenWrapper} >
                    <TouchableOpacity style={styles.btnPilihan} onPress={()=> loadDoPPKS()} >
                        <Text style={styles.btnPilihanLabel} >PEMILIK DO</Text>
                        <Image source={nextIcon} style={styles.btnPilihanIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnPilihan} onPress={()=> loadResellerDo()}  >
                        <Text style={styles.btnPilihanLabel} >RESELLER AGEN DO LAIN</Text>
                        <Image source={nextIcon} style={styles.btnPilihanIcon} />
                    </TouchableOpacity>
                </View>
                
            </View>
        </View>
    )
}

export default TentukanTipeDo;

const styles = StyleSheet.create({
    container : {
        flex:1,
        paddingHorizontal:5,
        paddingTop:30
    },
    segmenWrapper:{
        paddingHorizontal:20,
        backgroundColor:'white',
        flexDirection:'column',
        justifyContent:"center"
    },
    btnPilihan:{
        height:40,
        backgroundColor:ORANGE,
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:20,
        borderRadius:5,
        marginVertical:20,
        flexDirection:'row'
    },
    btnPilihanLabel : {
        color:"white"
    },
    btnPilihanIcon : {
        width:30,
        height:30
    }
})