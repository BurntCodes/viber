// Node packages
import querystring from 'querystring';
import { Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import { axiosInstance } from './Utils.tsx';

// TODO: Store these somewhere
const BASE_URL: string = 'http://192.168.20.15:5000';
const CLIENT_ID: string = '49cf60e6226342958c119f100d66bdf6';
const CLIENT_SECRET: string = 'd218b7960cd44529b7c4906aea895ad3';

interface AdminTokenRequestData {
    client_id: string;
    client_secret: string;
}

interface AdminTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export const getAdminToken = async (axios: AxiosInstance) => {
    const url: string = `${BASE_URL}/auth/get_admin_token`;
    const data: AdminTokenRequestData = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
    };

    try {
        const response: AxiosResponse<AdminTokenResponse> = await axios.post(
            url,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Stack Trace:', error.stack);
        console.error(error);
    }
};

/**
 * Redirect the user to the spotify login url
 */
/*
-- A typical successful login:
-      User is redirected to the spotify login url
-      User logs in and accepts the access request
-      User is then redirected via deeplink to the Dashboard Screen
*/
export const login = async () => {
    const sessionToken = await SecureStore.getItemAsync('sessionToken');
    const url: string = `${BASE_URL}/auth/get_auth_code?client_id=${CLIENT_ID}&session_token=${sessionToken}`;

    try {
        Linking.openURL(url).catch((error) =>
            console.error('Failed to redirect:', error)
        );
    } catch (error) {
        console.error('Stack Trace:', error.stack);
        console.error(error);
    }
};

export const getUserDetails = async (accessToken) => {
    const url: string = `${BASE_URL}/spotify/get_user_details`;
    const headers = {
        Authorization: `Bearer ${accessToken.access_token}`,
    };

    try {
        const response: AxiosResponse<AdminTokenResponse> = await axios.get(
            url,
            { headers }
        );
        console.log('\ngetUserDetails response: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Stack Trace:', error.stack);
        console.error(error);
    }
};
