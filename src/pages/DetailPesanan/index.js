/* eslint-disable prettier/prettier */
import React,{Component} from 'react';
import {View, ScrollView, Text} from 'react-native';
import Icon  from 'react-native-vector-icons/FontAwesome';


class DetailPesanan extends Component {
    render(){
        return (
        <View style={{flex:1}} >
             <ScrollView >
                 <Icon name="arrow-left" type="ionicon" size={26} color="#000" onPress={() => this.props.navigation.goBack()} />
                 <Text onPress={() => this.props.navigation.navigate('DetailPesanan')} >Ini Halaman Detail Pesanan</Text>
             </ScrollView>
        </View>
        );
    };
};

export default DetailPesanan;