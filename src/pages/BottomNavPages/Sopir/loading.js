/* eslint-disable prettier/prettier */
import React from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import { StyleSheet } from 'react-native';

const Loading = () => {
    return(
        <ContentLoader 
            viewBox="-10 10 400 70"
            speed={1}
            backgroundColor={'gray'}
            foregroundColor={'white'}
            style={styles.loading}
        >
            <Circle cx="35" cy="45" r="35" />
            <Rect x="80" y="10" rx="4" ry="4" width="250" height="15" />
            <Rect x="80" y="35" rx="3" ry="3" width="250" height="8" />
            <Rect x="80" y="50" rx="3" ry="3" width="250" height="8" />
            <Rect x="80" y="63" rx="3" ry="3" width="100" height="30" />
        </ContentLoader>
    );
}

export default Loading;

const styles = StyleSheet.create({
    loading : {
        backgroundColor:"white",
        height:100,
        marginTop:20,
        marginBottom:5,
        marginHorizontal:8,
        padding:15,
        justifyContent: 'space-around',
    },
});