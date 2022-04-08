/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Text, TextInput, View, Image} from 'react-native';
import foto from '../../assets/img/poto.jpg';
const SampleComponent = () => {
    return(
      <View>
            <View style={{width:100, height:50, backgroundColor:'tomato'}} />
            <Text>Hai Arnold TES</Text>
            <Home/>
            <Poto/>
            <TextInput style={{borderWidth:1, margin:10}} />
            <BoxGreen/>
      </View>
    );
  }

  const Home = () => {
    return <Text>Hai Adelin Natalia Mabuka</Text>
  };
  
  const Poto = () => {
    return <Image source={{uri:'https://placeimg.com/100/100/tech'}} style={{width:100, height:100}} />
  };
  
  class BoxGreen extends Component {
    render(){
      return <Text>Component Dari Class</Text>
    }
    
  }

  export default SampleComponent;  