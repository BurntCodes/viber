// Node packages
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

// Local
import { styles } from '../styles/styles.js';

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text>~~~ VIBER ~~~</Text>
            <StatusBar style="auto" />
        </View>
    );
};

export default HomeScreen;
