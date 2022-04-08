/* eslint-disable prettier/prettier */
import React,{Component} from 'react';
import Router from './config/router';
import { View } from 'react-native';
import NotifService from '../NotifService';

class App extends Component {
  render(){
    return (
      <View style={{flex:1}}>
        <Router/>
      </View>
    );
  }
};



export default App;