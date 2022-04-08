/* eslint-disable prettier/prettier */
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import cart from '../../assets/icon/shopping-cart.png';

 const Position = () =>  {
    return (
        <View style={styles.wrapper} > 
            <View style={styles.cartWrapper}>
                <Image source={cart} style={styles.iconCart} />
                <Text style={styles.notif}>10</Text>
            </View>
            <Text style={styles.text}>Keranjang Belanja Anda</Text>
        </View>
    );
};

export default Position;

const styles = StyleSheet.create({
    wrapper : {padding: 20, alignItems: 'center'},
    cartWrapper : {
        borderWidth:1,
        borderColor:'#439BD1',
        width:93,
        height:93,
        borderRadius:93 / 2,
        justifyContent:'center',
        alignItems:'center',
        position:'relative',
    },
    iconCart : {
        width : 50,
        height : 50,
    },
    text :{
        fontSize:14,
        color:'#777777',
        fontWeight:'700',
        marginTop:8,
    },
    notif : {
        fontSize:12,
        fontWeight:'500',
        color:'white',
        backgroundColor:'darkorange',
        width:24,
        height:24,
        borderRadius:25,
        alignItems:'center',
        padding:4,
        position:'absolute',
        top:0,
        right:0,
    },
});

