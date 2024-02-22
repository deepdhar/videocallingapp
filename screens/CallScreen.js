import { Alert, PermissionsAndroid, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CallActionButtons from '../components/CallActionButtons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Voximplant } from 'react-native-voximplant'


export default function CallScreen() {
    const [localVideoStreamId, setLocalVideoStreamId] = useState('');
    const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');
    const [permissionGranted, setPermissionGranted] = useState(false)


    const voximplant = Voximplant.getInstance();
    const navigation = useNavigation();
    const route = useRoute();

    const {call: incomingCall, isIncomingCall} = route?.params;

    const endpoint = useRef(null);

    // Permissions
    useEffect(() => {
        const getPermissions = async () => {
            const granted = await PermissionsAndroid.requestMultiple(permissions);
            const recordAudioGranted = granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
            const cameraGranted = granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
            if(!cameraGranted || !recordAudioGranted) {
                Alert.alert('Permissions not granted for camera or audio or both');
            } else {
                setPermissionGranted(true);
            }
        };
        if(Platform.OS === 'android') {
            getPermissions();
        } else {
            setPermissionGranted(true);
        }
    },[])


    useEffect(() => {
        if(!permissionGranted) {
            return;
        }

        const callSettings = {
            video: {
                sendVideo: true,
                receiveVideo: true,
            }
        }

        const answerCall = async () => {
            subscribeToCallEvents();
            endpoint.current = call.current.getEndpoints()[0];
            subscribeToEndpointEvent();
            call.current.answer(callSettings)
        }

        const subscribeToCallEvents = () => {
            call.current.on(Voximplant.CallEvents.Failed, callEvent => {
                showError(callEvent.reason);
            });
            call.current.on(Voximplant.CallEvents.ProgressToneStart, callEvent => {
                setCallStatus('ringing...');
            });
            call.current.on(Voximplant.CallEvents.Connected, callEvent => {
                setCallStatus('connected')
            });
            call.current.on(Voximplant.CallEvents.Disconnected, callEvent => {
                navigation.navigate('Contacts')
            });
            call.current.on(Voximplant.CallEvents.LocalVideoStreamAdded, callEvent => {
                setLocalVideoStreamId(callEvent.videoStream.id);
            });
            call.current.on(Voximplant.CallEvents.EndpointAdded, callEvent => {
                endpoint.current = callEvent.endpoint;
                subscribeToEndpointEvent();
            })
        }

        const subscribeToEndpointEvent = async () => {
            endpoint.current.on(Voximplant.EndpointEvents.RemoteVideoStreamAdded, endpointEvent => {
                setRemoteVideoStreamId(endpointEvent.videoStream.id);
            })
        }

        answerCall();

        return () => {
            call.current.off(Voximplant.CallEvents.Failed);
            call.current.off(Voximplant.CallEvents.ProgressToneStart);
            call.current.off(Voximplant.CallEvents.Connected);
            call.current.off(Voximplant.CallEvents.Disconnected);
        }

    },[permissionGranted]);

    const onHangupPress = () => {
        call.current.hangup();
    }

    return (
        <View
            style={{height: '100%', backgroundColor: '#7b4e80',}}
        >
            <Pressable onPress={()=>navigation.goBack()} style={styles.backButton}>
                <MaterialIcons name='arrow-back-ios-new' color='white' size={30}/>
            </Pressable>

            <Voximplant.VideoView
                videoStreamId={remoteVideoStreamId}
                style={styles.remoteVideo}
            />

            <Voximplant.VideoView
                videoStreamId={localVideoStreamId}
                style={styles.localVideo}
            />

            {/* <View style={styles.cameraPreview}>
                <Text style={styles.name}>{user!=null ? user.user_display_name : ''}</Text>
                <Text style={styles.phoneNumber}>{callStatus}</Text>
            </View> */}

            <CallActionButtons onHangupPress={onHangupPress}/>

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