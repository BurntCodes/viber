// Node packages
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Local
import { styles } from '../styles/styles.js';
import { login, generateSessionToken } from '../Api';
import Button from '../components/Button';

// Utilities
import { axiosInstance } from '../Utils';

const HomeScreen = () => {
    const [sessionToken, setSessionToken] = useState(null);

    useEffect(() => {
        const getSessionToken = async () => {
            try {
                // Grab the sessionToken from SecureStore
                const token = await SecureStore.getItemAsync('sessionToken');

                // Store the token in state
                setSessionToken(token);
            } catch (error) {
                console.error('error:', error);
            }
        };

        // Instantiate our axios instance
        axiosInstance
            .then(() => {
                getSessionToken();
            })
            .catch((error) => {
                console.error('Failed to set up axiosInstance:', error);
            });
    }, []);

    return (
        <View style={styles.container}>
            <Text>~~~ VIBER ~~~</Text>
            <Button onPress={login} title="Log In" />
            <StatusBar style="auto" />
        </View>
    );
};

export default HomeScreen;
