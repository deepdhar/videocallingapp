import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState, useEffect } from 'react';
import dummyContacts from '../assets/data/contacts.json';
import { useNavigation } from '@react-navigation/native';
import { Voximplant } from 'react-native-voximplant'


export default function ContactScreen() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredContacts, setFilteredContacts] = useState(dummyContacts)

    const navigation = useNavigation();
    const voximplant = Voximplant.getInstance();

    useEffect(() => {
        voximplant.on(Voximplant.ClientEvents.IncomingCall, (incomingCallEvent) => {
            navigation.navigate('IncomingCall', {call: incomingCallEvent.call})
        })

        return () => {
            voximplant.off(Voximplant.ClientEvents.IncomingCall)
        }
    },[])

    useEffect(()=>{
        const newContact = dummyContacts.filter(
            contact => contact.user_display_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredContacts(newContact)
    },[searchTerm])
    
    const callUser = user => {
        navigation.navigate('Calling', {user})
    }

    return (
        <View style={styles.page}>
            <TextInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                style={styles.searchInput} 
                placeholder='Search...'
                placeholderTextColor='gray'
            />
            <FlatList
                data={filteredContacts}
                renderItem={({item})=>(
                    <Pressable onPress={() => callUser(item)}>
                        <Text style={styles.contactName}>{item.user_display_name}</Text>
                    </Pressable>
                )}
                ItemSeparatorComponent={()=>
                    <View style={styles.separator}/>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        padding: 15,
        backgroundColor: 'white',
        flex: 1
    },
    contactName: {
        color: 'black',
        fontSize: 16,
        marginVertical: 15,
        paddingHorizontal: 5
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#f0f0f0'
    },
    searchInput: {
        backgroundColor: '#dedede',
        color: 'black',
        padding: 12,
        borderRadius: 30,
        marginBottom: 10
    }
})