/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../assets/constants';
import iconNext from '../../assets/icon/next.png';
import SearchBar from '../../components/SearchBar/search_bar_klaim_do';
import FitImage from 'react-native-fit-image';
import ImageZoom from 'react-native-image-pan-zoom';
import { ScrollView } from 'react-native-gesture-handler';
const NAVY = CONSTANTS.COLOR.NAVY;


const KlaimDo =({route, navigation})=> {
    let {file_klaim_do} = route.params;
    const [imageHeight, setImageHeight] = useState(0);
    const [imageWidth, setImageWidth] = useState(0);
    const [zoomPaddingVertical, setZoomPaddingVertical] = useState(0);

    useEffect(() => {
        console.log(file_klaim_do)
        getImageSize();
    },[file_klaim_do]);

    const getImageSize = () => {
        Image.getSize(file_klaim_do.uri, (width, height) => {
            if(width > height ) {
                height = Dimensions.get('window').height
                setZoomPaddingVertical(500);
            }
            else if (width < height){
                height = Dimensions.get('window').height
            }
            setImageHeight(height);
            setImageWidth(width);
            console.log("Width :"+width)
            console.log("Height :"+height)
        });
    }

    const submitHandler = () =>{
        const params = {
            file_klaim_do
        }
        navigation.navigate('LengkapiDataKlaimDo', params);
    }
    
    return(
        <View style={{flex:1}}>
            <SearchBar navigation={navigation}  title={"Preview Foto Do"} />
            <View style={styles.tampungFotoWrapper}>
                <ImageZoom cropWidth={Dimensions.get('window').width}
                    cropHeight={imageHeight}
                    style={{backgroundColor:'black',paddingTop:zoomPaddingVertical}}
                    imageWidth={Dimensions.get('window').width}
                    imageHeight={imageHeight}
                >
                    <FitImage source={{uri: file_klaim_do.uri}} resizeMode="contain"  />
                </ImageZoom>   
            </View>
        </View>
    );
}

export default KlaimDo;


const styles = StyleSheet.create({
    container :{
        flex:1,
        flexDirection:'column',
        paddingHorizontal:0,
        paddingTop:0,
    },
    tampungFotoWrapper: {
        alignItems:"center",
        marginBottom:10,
        position: 'relative',
    },
    tampungFoto :{
        width:400,
        height:400,
    },
    btnLanjutkan: {
        backgroundColor:NAVY,
        alignItems:"center",
        height:40,
        borderRadius:10,
        justifyContent:"center",
        bottom: 2,
    },
    btnLanjutkanIcon : {
        width:23,
        height:23,
        marginHorizontal:6,
        marginTop:1
    },
    btnLanjutkanLabel : {
        fontSize:15,
        color:'white'
    },
})