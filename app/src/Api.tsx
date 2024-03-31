// Node packages
import querystring from 'querystring';

// Utilities
import { axiosInstance } from './Utils.tsx';

const BASE_URL: string = 'http://192.168.20.15:5000';
const CLIENT_ID: string = '49cf60e6226342958c119f100d66bdf6';
const CLIENT_SECRET: string = 'd218b7960cd44529b7c4906aea895ad3';

interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface SpotifyTokenRequestData {
    client_id: string;
    client_secret: string;
}

export const getSpotifyToken = async (axios: AxiosInstance) => {
    const url: string = `${BASE_URL}/auth/spotify_token`;
    const data: SpotifyTokenRequestData = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
    };

    try {
        const response: AxiosResponse<SpotifyTokenResponse> = await axios.post(
            url,
            data
        );

        console.log('Token:', response.data);
        return response.data;
    } catch (error) {
        console.error('Stack Trace:', error.stack);
        console.error(error);
    }
};
