// Node packages
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Local
import { login, getAdminToken, generateState } from './src/Api.tsx';

// Screens
import HomeScreen from './src/screens/HomeScreen.tsx';

// Utilities
import { axiosInstance } from './src/Utils.tsx';

const Stack = createNativeStackNavigator();

const App = () => {
    useEffect(() => {
        generateState(axiosInstance);
        login(axiosInstance);
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="HomeScreen">
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
