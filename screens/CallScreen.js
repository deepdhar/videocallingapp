import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CallActionButtons from '../components/CallActionButtons'

export default function CallScreen() {
    return (
        <View style={{flex: 1, backgroundColor: '#7b4e80'}}>
            <View style={styles.cameraPreview}>
                
            </View>

            <CallActionButtons/>
        </View>
    )
}

const styles = StyleSheet.create({
    cameraPreview: {
        width: 100,
        height: 150,
        backgroundColor: '#ffff6e',
        position: 'absolute',
        right: 20,
        top: 100,
        borderRadius: 10
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 50,
        marginBottom: 15
    },
    phoneNumber: {
        fontSize: 18,
        color: 'white'
    },
})