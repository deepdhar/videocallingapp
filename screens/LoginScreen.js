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
        <View style={styles.page}>
            <TextInput
                value={userName}
                onChangeText={setUserName}
                placeholder='username'
                style={styles.input}
                autoCapitalize='none'
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder='password'
                style={styles.input}
                secureTextEntry
            />
            <Pressable onPress={()=>signIn()} style={styles.button}>
                <Text style={{color: 'white', fontSize: 17}}>Sign in</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        padding: 15,
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: 'dodgerblue',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center'
    },
})