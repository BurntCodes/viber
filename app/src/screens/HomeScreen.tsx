// Node packages
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

// Local
import { styles } from '../styles/styles.js';
import { login, getAdminToken, generateState } from '../Api.tsx';

// Utilities
import { axiosInstance } from '../Utils.tsx';

const HomeScreen = () => {
    useEffect(() => {
        generateState(axiosInstance);
        login();
    }, []);

    return (
        <View style={styles.container}>
            <Text>~~~ VIBER ~~~</Text>
            <StatusBar style="auto" />
        </View>
    );
};

export default HomeScreen;
