/* eslint-disable prettier/prettier */
import React,{Component} from 'react';
import Router from './config/router';
import { View } from 'react-native';
import NotifService from '../NotifService';
import AsyncStorage from '@react-native-community/async-storage';
import * as RootNavigation from './pages/BottomNavStackNavigatorPages/HomeStackNavigator/RootNavigation.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notif_navigation : "",
      notif_screen : "",
    };

    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
  }

  componentDidMount(){
    // codePush.sync({
    //   updateDialog: false,
    //   installMode: codePush.InstallMode.IMMEDIATE,
    //   minimumBackgroundDuration: 60 * 10
    // });
  }

  onRegister(token) {
    this.setState({registerToken: token.token, fcmRegistered: true});
    AsyncStorage.setItem("deviceToken", token.token);
  }

  onNotif(notif) {
    if(typeof notif.data.navigation !=="undefined"){
      this.notif_navigation = notif.data.navigation
    }
    if(typeof notif.data.screen !=="undefined") {
      this.notif_screen = notif.data.screen
    }
    if(!notif.userInteraction) this.notif.localNotif('sample.mp3', notif);
    else{
        if(this.notif_screen !="") {
            RootNavigation.navigate(this.notif_navigation, {screen:this.notif_screen});
        }
        else RootNavigation.navigate(this.notif_navigation);
    }
  }

  render(){
    return (
      <View style={{flex:1}}>
        <Router/>
      </View>
    );
  }
};



//export default codePush(codePushOptions)(App);
export default App;