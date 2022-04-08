/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IllustrationMyApp from '../../assets/img/undraw_my_app_re_gxtj.svg';

const ReactNativeSVG = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>Mempelajari penggunaan file SVG Dalam React Native</Text>
            <IllustrationMyApp width={250} height={150} />
        </View>
    );
};

export default ReactNativeSVG;

const styles = StyleSheet.create({
    container : {padding:20},
    textTitle : {textAlign:'center'},
});

