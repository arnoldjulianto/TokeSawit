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
      notif_navigation : ""
    };

    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
  }

  // componentDidMount(){
  //   const unsubscribe = messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //     console.log('Your message was handled in background');
  //   });
  //   return unsubscribe;
  // }


  onRegister(token) {
    this.setState({registerToken: token.token, fcmRegistered: true});
    AsyncStorage.setItem("deviceToken", token.token);
  }

  onNotif(notif) {
    if(typeof notif.data.navigation !=="undefined"){
      console.log("NAVIGATION : "+notif.data.navigation)
      this.notif_navigation = notif.data.navigation
    }
    if(!notif.userInteraction) this.notif.localNotif('sample.mp3', notif);
    else{
        RootNavigation.navigate(this.notif_navigation);
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



export default App;