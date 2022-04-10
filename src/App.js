/* eslint-disable prettier/prettier */
import React,{Component} from 'react';
import Router from './config/router';
import { View } from 'react-native';
import NotifService from '../NotifService';
import AsyncStorage from '@react-native-community/async-storage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      local_notif_status : true
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
    console.log("DAPAT NOTIF : "+notif.title)
    console.log("Notif :");
    console.log(notif.bigPictureUrl);
    if(this.state.local_notif_status == true){
        this.notif.localNotif('sample.mp3', notif);
        this.state.local_notif_status = false;
        AsyncStorage.setItem("local_notif_status", "false");
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