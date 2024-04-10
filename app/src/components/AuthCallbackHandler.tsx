import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const AuthCallbackHandler = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const handleDeepLink = async (event) => {
            const { url } = event;

            if (url) {
                const parsedUrl = new URL(url);
                const queryParams = Object.fromEntries(
                    parsedUrl.searchParams.entries()
                );
                const { success, access_token } = queryParams;

                if (success) {
                    await SecureStore.setItemAsync(
                        'access_token',
                        access_token
                    );

                    navigation.navigate('Dashboard');
                }
            }
        };

        Linking.addEventListener('url', handleDeepLink);

        // Clean up event listener
        return () => {
            Linking.removeEventListener('url', handleDeepLink);
        };
    }, []);

    return null;
};

export default AuthCallbackHandler;
