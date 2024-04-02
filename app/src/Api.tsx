// Node packages
import querystring from 'querystring';
import { Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AxiosResponse } from 'axios';
import axios from 'axios';
import { axiosInstance } from './Utils';

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

interface StateResponse {
    state: string;
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

export const login = async (axios: axiosInstance) => {
    const url: string = `${BASE_URL}/auth/get_auth_code?client_id=${CLIENT_ID}`;

    try {
        Linking.openURL(url)
            .then(() => {
                console.log(`Redirected successfully to ${url}`);
            })
            .catch((error) => console.error('Failed to redirect:', error));
    } catch (error) {
        console.error('Stack Trace:', error.stack);
        console.error(error);
    }
};

export const generateState = async (axios: AxiosInstance) => {
    const url: string = `${BASE_URL}/auth/generate_state`;

    try {
        const response: AxiosResponse<StateResponse> = await axios.get(url);
        session_token = response.data.session_token;
        await SecureStore.setItemAsync('session_token', session_token);
    } catch (error) {
        console.error('Stack Trace:', error.stack);
        console.error(error);
    }
};
