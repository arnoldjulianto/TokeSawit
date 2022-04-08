/* eslint-disable prettier/prettier */
import React from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import { StyleSheet } from 'react-native';

const Loading = () => {
    return(
        <ContentLoader 
            viewBox="-10 13 400 70"
            speed={1}
            backgroundColor={'gray'}
            foregroundColor={'white'}
            style={styles.loading}
        >
            <Rect x="0" y="0" rx="3" ry="3" width="330" height="12" />
            <Rect x="0" y="30" rx="3" ry="3" width="330" height="12" />
            <Rect x="0" y="60" rx="3" ry="3" width="330" height="12" />
            <Rect x="0" y="90" rx="3" ry="3" width="330" height="12" />
            <Rect x="0" y="120" rx="3" ry="3" width="330" height="12" />
            
            <Rect x="345" y="0" rx="3" ry="3" width="35" height="30" />
            <Rect x="345" y="50" rx="3" ry="3" width="35" height="30" />
            <Rect x="345" y="100" rx="3" ry="3" width="35" height="30" />
        </ContentLoader>
    );
}

export default Loading;

const styles = StyleSheet.create({
    loading : {
        backgroundColor:"white",
        height:170,
        marginTop:15,
        marginBottom:0,
        marginHorizontal:8,
        padding:15,
        justifyContent: 'space-around',
    },
});