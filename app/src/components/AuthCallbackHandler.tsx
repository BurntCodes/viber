import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AuthCallbackHandler = () => {
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
                }
            }
        };

        Linking.addEventListener('url', handleDeepLink);
    }, []);
};

export default AuthCallbackHandler;
