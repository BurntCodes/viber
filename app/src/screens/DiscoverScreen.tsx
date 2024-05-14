// Node Packages
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Local
import { styles } from '../styles/styles';
import { getUserData, getViberData, getTrackStack } from '../Api';

// Components
import Button from '../components/Button';
import TrackContainer from '../components/TrackContainer';

// Utilities
import { axiosInstance } from '../Utils';

type UserData = {};

type SpotifyData = {
    viberPlaylist: any | null;
    trackStack: any | null;
    seeds: any;
};

type AppData = {
    accessToken: string | null;
    userData: UserData | null;
    spotifyData: SpotifyData | null;
};

const DiscoverScreen = () => {
    const [isDataReady, setIsDataReady] = useState(false);
    const [isLoading, setIsLoading] = useState(null);
    const [appData, setAppData] = useState<AppData>({
        accessToken: null,
        userData: null,
        spotifyData: {
            viberPlaylist: null,
            trackStack: [],
            seeds: [],
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // First get the user's accessToken
                const tokenString = await SecureStore.getItemAsync(
                    'access_token'
                );
                if (tokenString) {
                    const tokenObject = JSON.parse(tokenString.trim());

                    // Then get their userData
                    const userData = await getUserData(tokenObject);

                    // Then get their spotifyData
                    let spotifyData = null;
                    if (userData?.id) {
                        const viberData = await getViberData(
                            tokenObject,
                            userData.id
                        );
                        const trackStack = await getTrackStack();
                        spotifyData = {
                            viberPlaylist: viberData.viberPlaylist,
                            trackStack: viberData.recData.tracks,
                            seeds: viberData.recData.seeds,
                        };
                    }

                    // Update appData with all fetched data
                    setAppData({
                        accessToken: tokenObject,
                        userData: userData,
                        spotifyData: spotifyData,
                    });

                    setIsDataReady(true);
                }
            } catch (error) {
                console.error('Error fetching appData', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log('appData', JSON.stringify(appData, null, 4));
    }, [appData]);

    return isDataReady ? (
        <View style={styles.container}>
            <TrackContainer appData={appData} setAppData={setAppData} />
        </View>
    ) : null;
};

export default DiscoverScreen;
