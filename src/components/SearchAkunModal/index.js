/* eslint-disable prettier/prettier */
import React, {useEffect, useState } from 'react';
import { Modal, View, StyleSheet, ActivityIndicator, Text, BackHandler, TextInput, FlatList, TouchableOpacity, Image} from "react-native";
import CONSTANTS from '../../assets/constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SearchBar from '../SearchBar/search_bar_search_akun';

const ORANGE = CONSTANTS.COLOR.ORANGE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const SearchAkunModal = (props) => {
    const [searchParam, setSearchParam] = useState("");
    const [arrUser, setArrUser] = useState([]);
    const [loadingVisible, setLoadingVisible] = useState(false);

    useEffect(()=>{
        if(searchParam != ""){
            loadUser();
        }
        else setArrUser([])
        console.log(props.currentUser)
    },[searchParam])

    const loadUser = () => {
        setLoadingVisible(true);
        const timeout = setTimeout(() => {
            setLoadingVisible(false);
        }, 30000);

        const params = {
            searchParam
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
        fetch(base_url+'User/get_api_search_akun',
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
            setLoadingVisible(false);
            setArrUser(json.user);
            console.log(json);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(error);
        });
    }

    const loadLihatProfil = (currentUser, username) => {
        //console.log(currentUser, username)
        props.navigation.navigate("LihatProfil", {currentUser, username, setModalVisible:props.setModalVisible});
        props.setModalVisible(false);
    }

    const renderItemUser = ({ item, index }) => {
        let uri = '';
        if(item.foto_profil == 'default.png') uri = base_url+"assets/upload/file user/"+item.foto_profil;
        else uri = base_url+"assets/upload/file user/"+item.username+"/"+item.foto_profil;
        return (
            <TouchableOpacity style={styles.renderItemArea} key={item.username+index} onPress={()=>{
                loadLihatProfil(props.currentUser, item.username)
            }} >
                <Image style={styles.fotoProfil} source={{uri}} resizeMode="cover" resizeMethod="resize" />
                <View style={styles.detailUser}>
                    <Text style={styles.usernameLabel} >{item.username}</Text>
                    <Text style={styles.namaLengkapLabel} >{item.nama_lengkap}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return(
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.modalVisible}
                onRequestClose={() => {
                    console.log("back");
                    props.setModalVisible(false); 
                }}
            >
                <SearchBar title={""} refresh={false} onBack={props.setModalVisible} />
                <View style={styles.modalView}>
                    <View style={styles.inputWrapper}>
                        <Icon name="search" type="ionicon" size={20} color="gray" style={{position:"absolute", left:10,bottom:10}} />
                        <TextInput style={styles.textInput} placeholder="Cari PPKS, Do, Agen" placeholderTextColor= 'gray' value={searchParam} onChangeText = { (value) => {setSearchParam(value)} } autoFocus={true} 
                        />
                    </View>
                    <View>
                        {arrUser.length > 0 && (
                            <FlatList
                                data={arrUser}
                                keyExtractor={(item, index) => (item.id) + index}
                                renderItem={renderItemUser}
                            />
                        )}
                    </View>
                    {loadingVisible && (
                        <View >
                            <ActivityIndicator size={50} color={ORANGE} />
                        </View>
                    )}
                </View>
            </Modal>   
        </View>
    )
}
export default SearchAkunModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"white",
        height:45,
        justifyContent:"center",
        color:"black"
    },
    textInput:{
        borderTopWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
        borderWidth:0.3,
        borderColor:"black",
        color:"black",
        borderRadius:5,
        fontSize:13,
        flex:1,
        marginHorizontal:35,
    },
    renderItemArea :{
        flexDirection:'row',
        backgroundColor:'#fcfcfc',
        justifyContent:"space-around",
        marginTop:20
    },
    detailUser :{
        flex:0.7,
        backgroundColor:'transparent',
        justifyContent:"center",
        alignItems:"flex-start",
    },  
    fotoProfil:{
        width:60,
        height:60,
        borderRadius:120/2,
        alignItems:"flex-start",
    },
    usernameLabel :{
        fontSize:13,
        color:'grey',
        fontWeight:'400'
    },
    namaLengkapLabel : {
        fontSize:15,
        color:'black',
        fontWeight:'700'
    },
    modalView: {
        flex:1,
        //backgroundColor: "rgba(000, 000, 000, 0.6)",
        backgroundColor: "white",
        borderRadius: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        paddingVertical:20,
        paddingHorizontal:10
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