import axios from 'axios';

export { getSpotifyToken };

const BASE_URL: string = 'http://127.0.0.1:5000';
const CLIENT_ID: string = '49cf60e6226342958c119f100d66bdf6';
const CLIENT_SECRET: string = 'd218b7960cd44529b7c4906aea895ad3';


interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

const getSpotifyToken = async () => {
    try {
        const response = await axios.post<SpotifyTokenResponse>(`${BASE_URL}/spotify_token`, {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        });
        console.log('Token:', response.data);
        return response.data; // Return the data obtained from the API call
    } catch (error) {
        console.log('Error fetching token:', error);
        console.log('test1');
        throw error; // Throw the error to be caught by the .catch block when the function is called
    }
}

getSpotifyToken()
    .then(data => {
        console.log('Token:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

