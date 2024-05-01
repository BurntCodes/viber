// Node Packages
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Local
import { styles } from '../styles/styles.js';
import Button from '../components/Button.tsx';
import { getUserDetails, getViberPlaylist } from '../Api';

// Utilities
import { axiosInstance } from '../Utils';

const DashboardScreen = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [viberPlaylist, setViberPlaylist] = useState(null);

    useEffect(() => {
        // Get accessToken from the secureStore and store it in state
        const getAccessToken = async () => {
            try {
                const tokenString = await SecureStore.getItemAsync(
                    'access_token'
                );

                let tokenObject;
                try {
                    tokenObject = JSON.parse(tokenString.trim());
                } catch (parseError) {
                    console.error('Error parsing tokenString:', parseError);
                    return;
                }
                setAccessToken(tokenObject);
            } catch (error) {
                console.error(error);
            }
        };

        getAccessToken();
    }, []);

    useEffect(() => {
        // Once we get an accessToken, get the user's details and store it in state
        const fetchUserDetails = async () => {
            try {
                const newDetails = await getUserDetails(accessToken);
                await setUserDetails(newDetails);
            } catch (error) {
                console.error('Error with fetchUserDtails', error);
            }
        };

        if (accessToken !== null && accessToken.access_token !== undefined) {
            fetchUserDetails();
        }
    }, [accessToken]);

    useEffect(() => {
        const fetchViberPlaylist = async () => {
            try {
                const fetchedViberPlaylist = await getViberPlaylist(
                    accessToken,
                    userDetails.id
                );
                await setViberPlaylist(fetchedViberPlaylist);
            } catch (error) {
                console.error('Error with fetchViberPlaylist', error);
            }
        };

        if (userDetails !== null && userDetails.id !== undefined) {
            fetchViberPlaylist();
        }
    }, [userDetails]);

    return (
        <View style={styles.container}>
            {/* <Text>Access Token: {userDetails}</Text> */}
        </View>
    );
};

export default DashboardScreen;
