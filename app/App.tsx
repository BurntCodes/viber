// Node packages
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';

// Utilities
import AuthCallbackHandler from './src/components/AuthCallbackHandler';

// TODO:
// // TODO -- add a button that triggers the login logic
// // TODO -- get state session token working in api calls in auth.py
// // TODO -- test checking secure store on home page - display contents
// TODO -- figure out how to set a route for the deeplink in handle_auth_callback()
//         TODO -- have that route redirect to Discoverscreen via Navigation
// TODO -- generic error handler in Utils.tsx
// TODO -- typescipt-ify everything
// TODO -- Fix typescript errors in editor
// TODO -- add comments everywhere
// TODO -- Token refresh
// TODO -- better solution to storing session tokens than a dictionary in memory (auth.py)

const Stack = createNativeStackNavigator();
const prefix = Linking.createURL('/');

const linking = {
    prefixes: ['viber://'],
    config: {
        screens: {
            DiscoverScreen: 'discover',
        },
    },
};

const App = () => {
    return (
        <GestureHandlerRootView>
            <NavigationContainer linking={linking}>
                <AuthCallbackHandler />
                <AppNavigator />
            </NavigationContainer>
        </GestureHandlerRootView>
    );
};

const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Discover" component={DiscoverScreen} />
        </Stack.Navigator>
    );
};

export default App;
