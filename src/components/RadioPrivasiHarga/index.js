/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { View, Text,  StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import CONSTANTS from '../../assets/constants';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const NAVY = CONSTANTS.COLOR.NAVY;
const base_url = CONSTANTS.CONFIG.BASE_URL;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;

const RadioPrivasiHarga = (props) => {
    useEffect(()=> {
        if(props.startCekPrivasiHarga){
            cekPrivasiHarga()
        }
    },[props.startCekPrivasiHarga])

    const cekPrivasiHarga = () => {
        props.setLoadingVisible(true);
        const timeout = setTimeout(() => {
            props.setLoadingVisible(false);
        }, 30000);

        const params = {
            id_do_ppks:props.id_do_ppks,
            id_reseller_do:props.id_reseller_do,
            type:props.type,
        }
        console.log(params);
        
        const createFormData = (body) => {
            const data = new FormData();
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            return data;
        }
        const formData = createFormData(params);
        fetch(base_url+'PrivasiHarga/get_api_cek_privasi_harga',
        {
            method: 'post',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data; ',
            },
        })
        .then((response) => response.json())
        .then((json) => {
            clearTimeout(timeout);
            props.setLoadingVisible(false);
            props.setPrivasiHarga(json.privasi_harga)
            props.setStartCekPrivasiHarga(false);
        })
        .catch((error) => {
            clearTimeout(timeout);
            props.setLoadingVisible(false);
            console.log(error);
        });
    }

    const updatePrivasiHarga = (value) => {
        props.setLoadingVisible(true);
        const timeout = setTimeout(() => {
            props.setLoadingVisible(false);
        }, 30000);

        const params = {
            id_do_ppks:props.id_do_ppks,
            privasi_harga:value,
        }
        console.log(params);
        
        const createFormData = (body) => {
            const data = new FormData();
            Object.keys(body).forEach(key => {
                data.append(key, body[key]);
            });
            return data;
        }
        const formData = createFormData(params);
        fetch(base_url+'PemilikDo/get_api_update_privasi_harga',
        {
            method: 'post',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data; ',
            },
        })
        .then((response) => response.json())
        .then((json) => {
            clearTimeout(timeout);
            cekPrivasiHarga();
        })
        .catch((error) => {
            clearTimeout(timeout);
            props.setLoadingVisible(false);
            console.log(error);
        });
    }

    const radio_props = [
        {label: 'Publik', value: 'Publik' },
        {label: 'Pengikut Saya', value: 'Pengikut Saya' },
        {label: 'Pengikut Saya Kecuali ...', value: 'Pengikut_kecuali' },
        {label: 'Hanya Kepada ...', value: 'Hanya_kepada' },
    ];

    return(
        <View>
             <View style={styles.privasiHarga}>
                <View>
                    <Text style={[{marginBottom:20}]}>Siapa saja yang dapat melihat dan mengetahui perubahan harga dari DO ini</Text>
                    {props.privasiHarga != null && (
                    <RadioForm
                        formHorizontal={false}
                        animation={true}
                        >
                        {
                            radio_props.map((obj, i) => (
                            <RadioButton labelHorizontal={true} key={i} style={{marginBottom:20}} >
                                <RadioButtonInput
                                obj={obj}
                                index={i}
                                isSelected={props.privasiHarga === obj.value }
                                onPress={(value) => {
                                    props.setPrivasiHarga(value)
                                    if(i == 0 && props.edit){
                                        updatePrivasiHarga("Publik");
                                    }
                                    else if(i == 1 && props.edit){
                                        updatePrivasiHarga("Pengikut Saya");
                                    }
                                    else if(i == 2){
                                        props.navigation.navigate("ShowHargaKecuali", {
                                            id_do_ppks:props.id_do_ppks, 
                                            id_reseller_do:props.id_reseller_do, 
                                            currentUser:props.currentUser,
                                            showEditPemilikDoModal:props.setModalVisible, 
                                            type:props.type,
                                            setPrivasiHarga:props.setPrivasiHarga
                                        });
                                        props.setModalVisible(false);
                                    }
                                    else if(i == 3){
                                        props.navigation.navigate("ShowHargaKepada", {
                                            id_do_ppks:props.id_do_ppks, 
                                            id_reseller_do:props.id_reseller_do, 
                                            currentUser:props.currentUser,
                                            showEditPemilikDoModal:props.setModalVisible, 
                                            type:props.type,
                                            setPrivasiHarga:props.setPrivasiHarga
                                        });
                                        props.setModalVisible(false);
                                    }
                                }}
                                borderWidth={1}
                                buttonInnerColor={ORANGE}
                                buttonOuterColor={props.privasiHarga === obj.value ? ORANGE : '#000'}
                                buttonSize={15}
                                buttonOuterSize={30}
                                buttonStyle={{}}
                                buttonWrapStyle={{borderColor:ORANGE,marginLeft: 10}}
                                />
                                <RadioButtonLabel
                                obj={obj}
                                index={i}
                                labelHorizontal={true}
                                onPress={(value) => {
                                    props.setPrivasiHarga(value)
                                    if(i == 0 && props.edit){
                                        updatePrivasiHarga("Publik");
                                    }
                                    else if(i == 1 && props.edit){
                                        updatePrivasiHarga("Pengikut Saya");
                                    }
                                    else if(i == 2){
                                        props.navigation.navigate("ShowHargaKecuali", {
                                            id_do_ppks:props.id_do_ppks, 
                                            id_reseller_do:props.id_reseller_do, 
                                            currentUser:props.currentUser,
                                            showEditPemilikDoModal:props.setModalVisible, 
                                            type:props.type,
                                            setPrivasiHarga:props.setPrivasiHarga
                                        });
                                        props.setModalVisible(false);
                                    }
                                    else if(i == 3){
                                        props.navigation.navigate("ShowHargaKepada", {
                                            id_do_ppks:props.id_do_ppks, 
                                            id_reseller_do:props.id_reseller_do, 
                                            currentUser:props.currentUser,
                                            showEditPemilikDoModal:props.setModalVisible, 
                                            type:props.type,
                                            setPrivasiHarga:props.setPrivasiHarga
                                        });
                                        props.setModalVisible(false);
                                    }
                                }}
                                labelStyle={{fontSize: 15, color: 'black'}}
                                labelWrapStyle={{}}
                                />
                            </RadioButton>
                            ))
                        }  
                        </RadioForm>
                    )}    
                </View>
            </View>
        </View>
    )
}

export default RadioPrivasiHarga;

const styles = StyleSheet.create({
    
})