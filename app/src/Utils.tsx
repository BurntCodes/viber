// Node packages
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

/**
 * Sets up and configures a base Axios instance with error handling.
 * @param {string} sessionToken - The session token to be included in the headers.
 * @returns {AxiosInstance} - The configured Axios instance.
 */
export const configureAxiosInstance = (sessionToken: string): AxiosInstance => {
    const axiosInstance = axios.create({});

    // Set default headers
    axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

    // Set Session Token in headers
    if (sessionToken) {
        axiosInstance.defaults.headers.common[
            'Authorization'
        ] = `Bearer ${sessionToken}`;
    }

    // Set up the error interceptor
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error('Axios Error: ', error);

            if (error.response) {
                console.error('Response Data: ', error.response.data);
                console.error('Response Status: ', error.response.status);
                console.error('Response Headers: ', error.response.headers);
            } else if (error.request) {
                console.error('No Response received', error.request);
            } else {
                console.error('Error: ', error.message);
            }

            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

/**
 * Generates a session token and sets up Axios instance with it.
 * @returns {Promise<AxiosInstance>} - A Promise that resolves with the configured Axios instance.
 */
export const setupAxiosInstance = async (): Promise<AxiosInstance> => {
    try {
        // Generate a session token
        const url: string =
            'http://192.168.20.15:5000/auth/generate_session_token';
        const response = await axios.get(url);
        const sessionToken: string = response.data.session_token;

        // Store the session token in SecureStore
        await SecureStore.setItemAsync('sessionToken', sessionToken);

        // Set up Axios instance with the generated session token
        const axiosInstance: AxiosInstance =
            configureAxiosInstance(sessionToken);

        console.log(
            'Session token generated and Axios instance set up successfully.\nsessionToken: ',
            sessionToken
        );

        return axiosInstance;
    } catch (error) {
        console.error(
            'Failed to generate session token or set up Axios instance:',
            error
        );
        throw error;
    }
};

// Set up Axios instance
const axiosInstance: Promise<AxiosInstance> = setupAxiosInstance();

export { axiosInstance };
