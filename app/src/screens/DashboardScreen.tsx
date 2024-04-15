//Node Packages
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Local
import { styles } from '../styles/styles.js';
import Button from '../components/Button.tsx';
import { getUserDetails } from '../Api';

// Utilities
import { axiosInstance } from '../Utils';

const DashboardScreen = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const getAccessToken = async () => {
            try {
                const tokenString = await SecureStore.getItemAsync(
                    'access_token'
                );
                const token = JSON.parse(tokenString);
                setAccessToken(token);
            } catch (error) {
                console.error(error);
            }
        };

        getAccessToken();
    }, []);

    useEffect(() => {
        if (accessToken !== null) {
            if (accessToken.access_token !== undefined) {
                const newDetails = getUserDetails(accessToken);
                console.log('\nnewDetails: ', newDetails);
                setUserDetails(newDetails);
                console.log('\nuserData:', userDetails);
            }
        }
    }, [accessToken]);

    return (
        <View style={styles.container}>
            {/* <Text>Access Token: {userDetails}</Text> */}
        </View>
    );
};

export default DashboardScreen;
