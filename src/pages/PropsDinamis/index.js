/* eslint-disable prettier/prettier */
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const UserProfile = (props) => {
    return (
        <View style={styles.profileWrapper}>
            <Image source={{uri : props.uri}} style={styles.profileFoto}/>
            <View style={styles.profileContent}>
                <Text style={styles.profileNama}>{props.nama}</Text>
                <Text style={styles.profileTTL}>{props.ttl}</Text>
                <Text style={styles.profileJurusan}>{props.jurusan}</Text>
            </View >
        </View>
    );
};

 const PropsDinamis = () => {
    return (
        <View>
            {/* <View style={styles.toolbar}>
                <Text style={styles.titleApp}>Welcome, Arnold</Text>
            </View> */}
            <UserProfile nama="M. Arnold Julianto" ttl="Palembang, 07 Juli 1997" uri="https://instagram.fplm3-1.fna.fbcdn.net/v/t51.2885-15/e15/c0.280.720.720a/s150x150/119797924_3683584798320215_3932142917797674719_n.jpg?_nc_ht=instagram.fplm3-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=lDmy2k32GLwAX-59TaJ&edm=AGW0Xe4BAAAA&ccb=7-4&oh=2b2f8083b1f10dc7476dbbeb2ab023dd&oe=60F7759E&_nc_sid=acd11b" />
            <UserProfile nama="Adelin Natalia Mabuka" ttl="Palembang, 24 Desember 1997" uri="https://instagram.fplm3-1.fna.fbcdn.net/v/t51.2885-15/e35/c0.420.1080.1080a/s150x150/120740867_786338482150820_46381289199282984_n.jpg?_nc_ht=instagram.fplm3-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=8HR9TWex7lwAX8DPuWb&edm=AGW0Xe4BAAAA&ccb=7-4&oh=697c0ded190144061d8cef569706cb7d&oe=60F7AB68&_nc_sid=acd11b" />
            <UserProfile nama="Restu Amelia Sawitri" ttl="Jakarta, 01 Mei 1992" uri="https://instagram.fplm3-1.fna.fbcdn.net/v/t51.2885-15/e35/c0.420.1080.1080a/s150x150/116176007_417108292569868_6156946550882845600_n.jpg?_nc_ht=instagram.fplm3-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=dHhQf7BO1eIAX9tp4hK&edm=AGW0Xe4BAAAA&ccb=7-4&oh=093505a19641f615eaee5cfbfe96f7db&oe=60F7A474&_nc_sid=acd11b" />
            <UserProfile nama="Habiburahman"  ttl="Magelang, 15 Maret 1998" uri="https://instagram.fplm3-1.fna.fbcdn.net/v/t51.12442-15/e15/c0.280.720.720a/s150x150/104220950_149540769990453_6265226577640180017_n.jpg?_nc_ht=instagram.fplm3-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=hoKSKVr_35gAX-2gkUd&edm=AGW0Xe4BAAAA&ccb=7-4&oh=cc63206608d90e4c04bb1829e674b30a&oe=60F75DDA&_nc_sid=acd11b" />
            
        </View>
    );
};

const styles = StyleSheet.create({
    toolbar :{
        alignItems:'center',
        backgroundColor:'darkorange',
        marginBottom:20,
        top:0,
        paddingVertical:10,
    },
    titleApp : {
        fontSize:20,
        color:'white',
        fontWeight:'700',
        textAlign:'center',      
    },
    subtitleApp : {
        fontSize:14,
        color:'white',
        textAlign:'center',      
    },
    profileWrapper : {
        flexDirection:'row',
        justifyContent: 'space-between',
        marginBottom:20,
        padding:15
    },
    profileContent : {
        flex:1,
        marginLeft:20,
    },
    profileFoto : {
        width:70,
        height:70,
        borderRadius:70,
        justifyContent:'center'
    },
    profileNama : {
        fontSize:15,
        fontWeight:'bold',
        fontFamily:'Georgia'
    },
});

export default PropsDinamis;
