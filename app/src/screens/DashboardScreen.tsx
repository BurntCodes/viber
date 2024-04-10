//Node Packages
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Local
import { styles } from '../styles/styles.js';
import Button from '../components/Button.tsx';

const DashboardScreen = () => {
    const [accessToken, setAccesstoken] = useState(null);

    useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('access_token');
                setAccesstoken(token);
            } catch (error) {
                console.error(error);
            }
        };

        getAccessToken();
    }, []);

    return (
        <View style={styles.container}>
            <Text>Access Token: {accessToken}</Text>
        </View>
    );
};

export default DashboardScreen;
