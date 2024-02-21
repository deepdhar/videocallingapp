import { ImageBackground, StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import bg from '../assets/images/ios-image.png'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Voximplant } from 'react-native-voximplant'


export default function IncomingCallScreen() {
    const [caller, setCaller] = useState('');
    const route = useRoute();
    const {call} = route.params;
    const navigation = useNavigation();

    useEffect(() => {
        setCaller(call.getEndpoints()[0].displayName)
        call.on(Voximplant.CallEvents.Disconnected, callEvent => {
            navigation.navigate('Contacts')
        });

        return () => {
            call.off(Voximplant.CallEvents.Disconnected);
        }
    },[])

    const onDecline = () => {
        call.decline();
    }

    const onAccept = () => {
        navigation.navigate('Calling', {
            call,
            isIncomingCall: true
        })
    }

    return (
        <ImageBackground source={bg} style={styles.background} resizeMode='cover'>
            <Text style={styles.name}>{caller}</Text>
            <Text style={styles.phoneNumber}>WhatsApp video...</Text>

            <View style={[styles.row, {marginTop: 'auto'}]}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="alarm" color="white" size={25} />
                    <Text style={styles.iconText}>Remind me</Text>
                </View>

                <View style={styles.iconContainer}>
                    <Entypo name="message" color="white" size={25} />
                    <Text style={styles.iconText}>Message</Text>
                </View>
            </View>

            <View style={[styles.row, {marginBottom: 30}]}>
                {/* Decline button */}
                <Pressable onPress={onDecline} style={styles.iconContainer}>
                    <View style={[styles.iconButtonContainer, {backgroundColor: '#f04741'}]}>
                        <Feather name="x" color="white" size={50} />
                    </View>
                    <Text style={styles.iconText}>Decline</Text>
                </Pressable>

                {/* Accept button */}
                <Pressable onPress={onAccept} style={styles.iconContainer}>
                    <View style={[styles.iconButtonContainer, {backgroundColor: '#146bf7'}]}>
                        <Entypo name="check" color="white" size={50} />
                    </View>
                    <Text style={styles.iconText}>Accept</Text>
                </Pressable>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    root: {
        height: '100%'
    },
    background: {
        flex: 1,
        alignItems: 'center',
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 100,
        marginBottom: 15
    },
    phoneNumber: {
        fontSize: 18,
        color: 'white'
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    iconContainer: {
        alignItems: 'center',
        marginVertical: 20
    },
    iconText: {
        color: 'white',
        marginTop: 5
    },
    iconButtonContainer: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 50,
        margin: 10
    }
})