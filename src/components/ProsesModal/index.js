/* eslint-disable prettier/prettier */
import React, {useEffect } from 'react';
import { Modal, View, StyleSheet, ActivityIndicator, Text, BackHandler, Alert} from "react-native";
import CONSTANTS from '../../assets/constants';

const DANGER = CONSTANTS.COLOR.DANGER;

const ProsesModal = (props) => {
    return(
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.modalVisible}
                onRequestClose={() => {
                    console.log("back");
                }}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}></Text>
                    <ActivityIndicator size={70} color={DANGER} />
                </View>
            </Modal>   
        </View>
    )
}
export default ProsesModal;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop:0,
    },
    modalView: {
        flex:1,
        backgroundColor: "rgba(000, 000, 000, 0.6)",
        borderRadius: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        justifyContent: "center",
        alignItems: "center",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        fontSize:17,
        justifyContent: "center",
        alignItems: "center",
        color:"white",
        textAlign: "center",
        marginLeft:10
    },
})