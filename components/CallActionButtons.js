import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native';


export default function CallActionButtons({onHangupPress, onMicPress}) {

    const navigation = useNavigation();

    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    const onReverseCamera = () => {
        console.log('reversed camera')
    }

    const onToggleCamera = () => {
        setIsCameraOn(!isCameraOn);
    }

    const onToggleMicrophone = () => {
        onMicPress
        setIsMicOn(!isMicOn);
    }
    
    return (
        <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onReverseCamera} style={styles.iconButton}>
                <MaterialIcons name="camera-flip" size={30} color={'white'}/>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={onToggleCamera} 
                style={isCameraOn ? [styles.iconButton,{backgroundColor: '#4a4a4a'}] : [styles.iconButton,{backgroundColor: '#737070'}]}
            >
                {/* <MaterialIcons name={isCameraOn ? "camera-off" : "camera"} size={30} color={'white'}/> */}
                <MaterialIcons name={isCameraOn ? "video" : "video-off"} size={30} color={'white'}/>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={onToggleMicrophone}
                style={isMicOn ? [styles.iconButton,{backgroundColor: '#4a4a4a'}] : [styles.iconButton,{backgroundColor: '#737070'}]}
            >
                <MaterialIcons name={isMicOn ? "microphone" : 'microphone-off'} size={30} color={'white'}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={onHangupPress} style={[styles.iconButton, {backgroundColor: 'red'}]}>
                <MaterialIcons name="phone-hangup" size={30} color={'white'}/>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        backgroundColor: '#333333',
        padding: 20,
        paddingBottom: 40,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'space-between',
        marginTop: 'auto'
    },
    iconButton: {
        backgroundColor: '#4a4a4a',
        padding: 15,
        borderRadius: 50
    },
})