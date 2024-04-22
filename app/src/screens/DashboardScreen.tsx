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
    const [accessToken, setAccessToken] = useState({});
    const [userDetails, setUserDetails] = useState({});
    const [viberPlaylist, setViberPlaylist] = userState({});

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
                if (
                    accessToken !== null &&
                    accessToken.access_token !== undefined
                ) {
                    const newDetails = await getUserDetails(accessToken);
                    console.log('\nnewDetails: ', newDetails);
                    console.log('typeOf newDetails', typeof newDetails);
                    await setUserDetails(newDetails);
                    console.log('\nuserDetails:', userDetails);
                }
            } catch (error) {
                console.error('Error with fetchUserDtails', error);
            }
        };

        fetchUserDetails();
    }, [accessToken]);

    useEffect(() => {
        const fetchViberPlaylist = async () => {
            try {
                const fetchedViberPlaylist = await getViberPlaylist(
                    accssToken,
                    userDetails.user_id // !! Check this
                );
                console.log('fetchedViberPlayist: ', fetchViberPlaylist);
                await setViberPlaylist(fetchedViberPlaylist);
            } catch (error) {
                console.error('Error with fetchViberPlaylist', error);
            }
        };

        fetchViberPlaylist();
    }, [userDetails]);

    useEffect(() => {
        console.log('\nuserDetails:', userDetails);
    }, [userDetails]);

    return (
        <View style={styles.container}>
            {/* <Text>Access Token: {userDetails}</Text> */}
        </View>
    );
};

export default DashboardScreen;
