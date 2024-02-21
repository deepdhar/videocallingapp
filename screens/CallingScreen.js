import { Alert, PermissionsAndroid, Pressable, StyleSheet, Text, View, Platform } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import CallActionButtons from '../components/CallActionButtons'
import { useNavigation, useRoute } from '@react-navigation/native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Voximplant } from 'react-native-voximplant'

const permissions = [
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.CAMERA,
]

export default function CallingScreen() {
    const [permissionGranted, setPermissionGranted] = useState(false)
    const [callStatus, setCallStatus] = useState('initializing...')
    const [localVideoStreamId, setLocalVideoStreamId] = useState('');
    const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');

    const navigation = useNavigation();
    const route = useRoute();

    const {user, call: incomingCall, isIncomingCall} = route?.params;

    const voximplant = Voximplant.getInstance();

    const call = useRef(incomingCall);
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

    // Make new call
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
        
        const makeCall = async () => {
            call.current = await voximplant.call(user.user_name, callSettings);
            // console.log(call);
            subscribeToCallEvents();
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

        const showError = (reason) => {
            Alert.alert(
                "Call failed",
                `Reason: ${reason}`, [
                    {
                        text: 'Ok',
                        onPress: navigation.navigate('Contacts'),
                    }
                ]
            )
        }

        if(isIncomingCall) {
            answerCall();
        } else {
            makeCall()
        }

        return () => {
            call.current.off(Voximplant.CallEvents.Failed);
            call.current.off(Voximplant.CallEvents.ProgressToneStart);
            call.current.off(Voximplant.CallEvents.Connected);
            call.current.off(Voximplant.CallEvents.Disconnected);
            endpoint.current.off(Voximplant.EndpointEvents.RemoteVideoStreamAdded)
        }
    
    },[permissionGranted])

    const onHangupPress = () => {
        call.current.hangup();
    }

    const onMicPress = () => {
        call.muteMicrophone();
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

            <View style={styles.cameraPreview}>
                <Text style={styles.name}>{user!=null ? user.user_display_name : ''}</Text>
                <Text style={styles.phoneNumber}>{callStatus}</Text>
            </View>

            <CallActionButtons onHangupPress={onHangupPress} onMicPress={onMicPress}/>

        </View>
    )
}

const styles = StyleSheet.create({
    cameraPreview: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        marginTop: 20
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
    backButton: {
        position: 'absolute',
        top: 30,
        left: 20
    },
    localVideo: {
        width: 100,
        height: 150,
        position: 'absolute',
        right: 20,
        top: 100,
        borderRadius: 10,
        backgroundColor: '#ffff6e'
    },
    remoteVideo: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 10,
        backgroundColor: ''
    }
})