/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';
import foto from '../../assets/img/poto.jpg';
const StylingComponent = () =>{
    return(
      <View>
        <View style={{padding:12, backgroundColor:'#F2F2F2', width:172, borderRadius:8}}>
            <Image source={foto} style={{width:158, height:100, borderRadius:8}} />
            <Text style={{fontSize:14, fontWeight:'bold', marginTop:10}}>New Macbook Pro 2021</Text>
            <Text style={{fontSize:12, marginTop:10, color:'darkorange'}}>Rp 21.000.000</Text>
            <Text style={{fontSize:12, marginTop:12}}>Palembang</Text>
            <View style={{backgroundColor:'#6FCF97', paddingVertical:6, borderRadius:8, marginTop:20 }}>
              <Text style={{fontSize:14, fontWeight:'600', color:'white', textAlign:'center'}}>BELI</Text>
            </View>
        </View>
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
    text : {
      fontSize :18,
      fontWeight: 'bold',
      color:'#10Ac84'
    }
  })

export default StylingComponent;