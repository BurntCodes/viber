// Node packages
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// React components
import { getSpotifyToken } from './src/Api.tsx';
import { styles } from './src/styles/styles.js';

// Utilites
import { axiosInstance } from './src/Utils.tsx';

const App = () => {
    useEffect(() => {
        getSpotifyToken(axiosInstance);
    }, []);

    return (
        <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
            <StatusBar style="auto" />
        </View>
    );
};

export default App;
