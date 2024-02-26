import { StyleSheet } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import CallScreen from './screens/CallScreen'
import CallingScreen from './screens/CallingScreen'
import { createStackNavigator } from '@react-navigation/stack'
import ContactScreen from './screens/ContactScreen'
import IncomingCallScreen from './screens/IncomingCallScreen'
import LoginScreen from './screens/LoginScreen'

const Stack = createStackNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator >
                <Stack.Screen name='Login' component={LoginScreen} options={{headerShown: false}}/>
                <Stack.Screen name='Contacts' component={ContactScreen}  />
                <Stack.Group screenOptions={{headerShown: false}}>
                    <Stack.Screen name='Call' component={CallScreen} />
                    <Stack.Screen name='Calling' component={CallingScreen} />
                    <Stack.Screen name='IncomingCall' component={IncomingCallScreen} />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({})