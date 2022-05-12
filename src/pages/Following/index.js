/* eslint-disable prettier/prettier */
import React,{useEffect, useState} from 'react';
import {View, ScrollView, Text, TextInput, StyleSheet, Image, ActivityIndicator, useWindowDimensions, TouchableOpacity, RefreshControl, FlatList, Alert} from 'react-native';
import CONSTANTS from '../../assets/constants';
import SearchBar from '../../components/SearchBar/search_bar_following';
import AsyncStorage from '@react-native-community/async-storage';
import { TabView, TabBar } from 'react-native-tab-view';
import ProsesModal from '../../components/ProsesModal';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

const NAVY = CONSTANTS.COLOR.NAVY;
const ORANGE = CONSTANTS.COLOR.ORANGE;
const alert_title = CONSTANTS.MSG.ALERT_TITLE;
const base_url = CONSTANTS.CONFIG.BASE_URL;

const Following =  ({route, navigation}) => {
    let {username} = route.params;
    const [loadingVisible, setLoadingVisible] = useState(true);
    const [arrFollowing, setArrFollowing] = useState([]);
    const [arrFollowers, setArrFollowers] = useState([]);
    const [loadMore, setLoadMore] = useState(false);
    const [noMoreDataFollowing, setNoMoreDataFollowing] = useState(false);
    const [noMoreDataFollowers, setNoMoreDataFollowers] = useState(false);

    useEffect(()=>{
        setLoadingVisible(true);
        loadAllData();
    },[])

    const onRefresh = React.useCallback(() => {
        setLoadingVisible(true);
        loadAllData();
    }, []);

    useEffect(() => {
        if(loadMore){
            loadAllData();
            console.log("LOAD MORE DATA")
        }
    },[loadMore])

    const loadAllData = () => {
        const timeout = setTimeout(() => {
            setLoadingVisible(false);
            setLoadMore(false);
        }, 30000);
        let lastIdFollowing = ""
        let lastIdFollowers = "";
        if(arrFollowing.length > 0){
            lastIdFollowing = arrFollowing[arrFollowing.length -1 ].id
        }
        if(arrFollowers.length > 0){
            lastIdFollowers = arrFollowers[arrFollowers.length -1 ].id
        }
        const params = {
            username,
            lastIdFollowing,
            lastIdFollowers,
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
        fetch(base_url+'Following/get_api_all_followers_following',
        {
            method: 'post',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data; ',
            },
        })
        .then((response) => response.json())
        .then((json) => {
            var data1 = arrFollowing;
            json.following.forEach((value) =>{
                data1.push({
                    "id" : value.id, 
                    "username" : value.username, 
                    "username_edit" : value.username_edit, 
                    "nama_lengkap" : value.nama_lengkap, 
                    "foto_profil" : value.foto_profil,
                });
            });
            setArrFollowing(data1);
            var data2 = arrFollowers;
            json.followers.forEach((value) =>{
                data2.push({
                    "id" : value.id, 
                    "username" : value.username, 
                    "username_edit" : value.username_edit, 
                    "nama_lengkap" : value.nama_lengkap, 
                    "foto_profil" : value.foto_profil,
                });
            });
            setArrFollowers(data2);

            clearTimeout(timeout);
            setLoadingVisible(false);
            console.log(json);
            
            if(json.following.length == 0) setNoMoreDataFollowing(true);
            if(json.followers.length == 0) setNoMoreDataFollowers(true);
            setLoadMore(false);
        })
        .catch((error) => {
            clearTimeout(timeout);
            setLoadingVisible(false);
            setLoadMore(false);
            console.log(error);
        });
    }

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 1, title: 'Mengikuti' },
      { key: 2, title: 'Pengikut' }
    ]);
    const renderTabBar = props => (
        <TabBar
          {...props}
          keyboardDismissMode={"none"}
          indicatorStyle={{ backgroundColor: ORANGE }}
          style={{ backgroundColor: 'white' }}
          renderLabel={({ route, focused, color }) => (
            <Text style={{ color:ORANGE, margin: 5, fontSize:12 }}>
              {route.title}
            </Text>
          )}
        />
    );

    const _renderTabs = ({route}) => {
        switch (route.key) {
          case 1:
            return (
                <FlatList
                    data={arrFollowing}
                    keyExtractor={(item, index) => index}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                        refreshing={loadingVisible}
                        onRefresh={onRefresh}
                        />
                    }
                    onEndReached={()=> {
                        if(!noMoreDataFollowing) setLoadMore(true)
                        else setLoadMore(false)
                    }}
                    onEndReachedThreshold={0}
                    ListFooterComponent={renderFooter}
                    style={{flex:1, paddingHorizontal:10}}
                /> 
            )
      
          case 2:
            return (
                <FlatList
                    data={arrFollowers}
                    keyExtractor={(item, index) => index}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                        refreshing={loadingVisible}
                        onRefresh={onRefresh}
                        />
                    }
                    onEndReached={()=> {
                        if(!noMoreDataFollowers) setLoadMore(true)
                        else setLoadMore(false)
                    }}
                    onEndReachedThreshold={0}
                    ListFooterComponent={renderFooter}
                    style={{flex:1, paddingHorizontal:10}}
                />        
            )
        }
    }

    const renderItem = ({item,index}) => {
        let uri = '';
        if(item.foto_profil == 'default.png') uri = base_url+"assets/upload/file user/"+item.foto_profil;
        else uri = base_url+"assets/upload/file user/"+item.username+"/"+item.foto_profil;

        return (
            <TouchableOpacity style={styles.renderItemUserArea} key={item.index+""+index} onPress={()=>{
                //handleChange(item.username)
            }} >
                <Image style={styles.fotoProfil} source={{uri}} resizeMode="cover" resizeMethod="resize" />
                <View style={styles.detailUser}>
                    {/* <Text style={styles.usernameLabel} >{item.id}</Text> */}
                    <Text style={styles.usernameLabel} >{item.username_edit}</Text>
                    <Text style={styles.namaLengkapLabel} >{item.nama_lengkap}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const renderFooter = () => {
        try {
            // Check If Loading
            if (loadMore) {
                return (
                    <ActivityIndicator size={30} color={ORANGE} style={{marginTop:10}} />
                )
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    

    const layout = useWindowDimensions();
    return (
        <View style={{flex:1}} >
            <SearchBar title={username} navigation={navigation} refresh={false} />
            <TabView
                navigationState={{ index, routes }}
                renderScene={_renderTabs}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar}
            /> 
        </View>
    );
}   

export default Following;

const styles = StyleSheet.create({
    renderItemUserArea :{
        flexDirection:'row',
        backgroundColor:'#fcfcfc',
        justifyContent:"space-around",
        marginTop:12,
        paddingVertical:10,
        borderRadius:5
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
    fotoProfil:{
        width:50,
        height:50,
        borderRadius:120/2,
        alignItems:"flex-start",
    },
})
