/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import foto from '../../assets/img/poto.jpg';
class Flexbox extends Component{
    constructor(props){
        super(props)
        this.state = {
            subscriber : 200.000
        }
        console.log('======> CONSTRUCTOR')
    }

    componentDidMount(){
        console.log('======> COMPONEN DID MOUNT')
        setTimeout( () => {
            this.setState({
                subscriber : 500
            });
        },2000)
    }

    componentDidUpdate(){
        console.log('======> COMPONEN DID UPDATE')
    }

    componentWillUnmount(){
        console.log('======> COMPONEN WILL UNMOUNT')
    }

    render(){
        console.log('======> RENDER')
        return(
            <View> 
                <View style={{
                    flexDirection:'row', 
                    backgroundColor:'#F2F2F2', 
                    alignItems:'flex-start',
                    justifyContent: 'space-between'
                
                }}>
                    {/* <View style={{backgroundColor:'red', flex:2, height:50}}/>
                    <View style={{backgroundColor:'yellow', flex:2, height:100}}/>
                    <View style={{backgroundColor:'green', flex:3, height:150}}/>
                    <View style={{backgroundColor:'blue', flex:4, height:200}}/>
                    */}
                    <View style={{backgroundColor:'red',   width:50, height:50}}/>
                    <View style={{backgroundColor:'yellow', width:50, height:50}}/>
                    <View style={{backgroundColor:'green',  width:50, height:50}}/>
                    <View style={{backgroundColor:'blue',   width:50, height:50}}/>
                </View> 

                <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                    <Text>Beranda</Text>
                    <Text>Booking Panen</Text>
                    <Text>Histori Transaksi</Text>
                    <Text>Profil</Text>
                </View>

                <View style={{flexDirection:'row', alignItems:'center', marginTop:20}}>
                    <Image source={foto} style={{width:100, height:100, borderRadius:50, marginRight:14}} />
                    <View>
                        <Text style={{fontSize:18, fontWeight:'bold'}}>M. Arnold Julianto</Text>
                         <Text>{this.state.subscriber} Subscriber</Text>
                    </View>
                </View>
                
            </View>
        );
    }
}

export default Flexbox;