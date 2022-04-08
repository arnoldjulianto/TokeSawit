/* eslint-disable prettier/prettier */

import React from 'react';
import { View } from 'react-native';
import HomeStackNavigator from '../../pages/BottomNavStackNavigatorPages/HomeStackNavigator';

const Router = () => {
    return (
        <View style={{flex:1}}>
            <HomeStackNavigator />
        </View>
    );
}

export default Router;
