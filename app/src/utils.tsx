import axios, { AxiosInstance } from 'axios';

const setupAxiosInstance = () => {
    // Base Axios Instance
    const instance = axios.create({});

    // Set-up the error interceptor
    instance.interceptors.response.use(
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

    return instance;
};

export const axiosInstance: AxiosInstance = setupAxiosInstance();
