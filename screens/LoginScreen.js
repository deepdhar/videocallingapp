import { Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Voximplant } from 'react-native-voximplant'
import { ACC_NAME, APP_NAME } from '../constants';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const voximplant = Voximplant.getInstance();
    const navigation = useNavigation();

    useEffect(() => {
        const connect = async () => {
            const status = await voximplant.getClientState();
            if(status === Voximplant.ClientState.DISCONNECTED) {
                await voximplant.connect();
            } else if(status ===  Voximplant.ClientState.LOGGED_IN) {
                redirectHome();
            }
        }

        connect();
    },[])

    const signIn =  async () => {
        try {
            const fqUsername = `${userName}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
            await voximplant.login(fqUsername, password);
            // redirect to home
            redirectHome()
        } catch(e) {
            console.log(e);
            Alert.alert(e.name, `Error code: ${e.code}`);
        }
    }

    const redirectHome = () => {
        navigation.reset({
            index: 0,
            routes: [
                {
                    name: 'Contacts',
                }
            ]
        })
    }

    return (
        <View style={styles.mainPage}>
            <View style={{
                position: 'absolute',
                height: 170,
                width: 170,
                backgroundColor: '#fcb1cf',
                top: -90,
                right: -50,
                borderRadius: 360
            }} />
            <View style={{
                position: 'absolute',
                height: 150,
                width: 150,
                backgroundColor: '#bd7994',
                top: -90,
                right: -40,
                borderRadius: 360
            }} />
            <View style={[styles.signInPage, styles.shadowProp]}>
                <Text style={styles.text}>Sign In</Text>
                <TextInput
                    value={userName}
                    onChangeText={setUserName}
                    placeholder='Username'
                    placeholderTextColor='gray'
                    style={styles.input}
                    autoCapitalize='none'
                />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder='Password'
                    placeholderTextColor='gray'
                    style={styles.input}
                    secureTextEntry
                />
                <Pressable onPress={()=>signIn()} style={styles.button}>
                    <Text style={{color: 'white', fontSize: 17}}>Sign in</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainPage: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    signInPage: {
        marginRight: 50,
        padding: 20,
        backgroundColor: 'white',
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        elevation: 20,
        height: 350,
        justifyContent: 'center'
    },
    text: {
        color: 'gray',
        marginLeft: 5,
        fontSize: 28,
        fontWeight: '600',
        paddingBottom: 30
    },
    input: {
        backgroundColor: '#ededed',
        color: 'black',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5
    },
    button: {
        backgroundColor: '#bd7994',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center'
    },
    shadowProp: {
        shadowColor: '#545454',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
})