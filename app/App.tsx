// Node packages
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';

// Local
import { login, getAdminToken, generateState } from './src/Api.tsx';

// Screens
import HomeScreen from './src/screens/HomeScreen.tsx';

// Utilities
import { axiosInstance } from './src/Utils.tsx';
import AuthCallbackHandler from './src/components/AuthCallbackHandler.tsx';

// TODO:
// TODO -- add a button that triggers the login logic
// TODO -- get state session token working in api calls in auth.py
// TODO -- test checking secure store on home page - display contents
// TODO -- figure out how to set a route for the deeplink in handle_auth_callback()
//         TODO -- have that route redirect to DashboardScreen via Navigation
// TODO -- generic error handler in Utils.tsx
// TODO -- typescipt-ify everything
// TODO -- add comments everywhere

const Stack = createNativeStackNavigator();
const prefix = Linking.createURL('/');

const App = () => {
    const linking = {
        prefixes: [prefix],
    };

    useEffect(() => {
        generateState(axiosInstance);
        login();
    }, []);

    return (
        <NavigationContainer linking={linking}>
            <AuthCallbackHandler />
            <AppNavigator />
        </NavigationContainer>
    );
};

const AppNavigator = () => {
    useEffect(() => {
        // Handle navigation events or conditions here if needed
    }, []);

    return (
        <Stack.Navigator initialRouteName="HomeScreen">
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            {/* Other screens */}
        </Stack.Navigator>
    );
};

export default App;
