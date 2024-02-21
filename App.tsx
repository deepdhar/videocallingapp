import React from 'react';
import { SafeAreaView } from 'react-native';
import Navigation from './navigation';

function App(): React.JSX.Element {

    return (
        <SafeAreaView style={{flex: 1}}>
            <Navigation/>
        </SafeAreaView>
    );
}

export default App;
