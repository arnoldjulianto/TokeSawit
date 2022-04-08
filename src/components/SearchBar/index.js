/* eslint-disable prettier/prettier */
import { useRoute } from '@react-navigation/native';
import React, { useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import SearchBarBeranda from './search_bar_beranda';
import SearchBarDanaMasukKeluar from './search_bar_dana_masuk_keluar';

const SearchBar = (props) => {
    const route = useRoute();
    let goTo ="";
    if(route.name == "Beranda"){
        return (
            <SearchBarBeranda page={route.name} navigation={props.navigation} searchLabel={props.searchLabel} toggleSearchBar={props.toggleSearchBar}  />
        );
    }
    else if(route.name == "Dana Masuk / Keluar"){
        return (
            <SearchBarDanaMasukKeluar page={route.name} navigation={props.navigation} searchLabel={props.searchLabel} toggleSearchBar={props.toggleSearchBar}  />
        );
    }
};

export default SearchBar;

const styles = StyleSheet.create({
    
});
