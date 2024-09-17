// Node Packages
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

// Local
import { styles } from '../styles/styles.js';
import { addToPlaylist, getNewRecs } from '../Api';

const TrackContainer = ({ appData, setAppData }) => {
    const [trackStack, setTrackStack] = useState(
        appData.spotifyData.trackStack
    );

    if (trackStack.length === 0) {
        return null;
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [likedTracks, setLikedTracks] = useState([]);

    const viberPlaylist = appData.spotifyData.viberPlaylist;

    const onSwipe = (event) => {
        const { translationX, translationY, velocityX, velocityY, state } =
            event.nativeEvent;

        // console.log('translationX: ', translationX);
        // console.log('translationY: ', translationY);
        // console.log('velocityX: ', velocityX);
        // console.log('velocityY: ', velocityY);
        // console.log('state: ', state);
        // console.log('State.END: ', State.END);
        // console.log('=======');

        if (state === State.END) {
            // determine if a left or right swipe was detected
            const isLeftSwipe =
                translationX < -50 || (translationX < 0 && velocityX < -100);
            const isRightSwipe =
                translationX > 50 || (translationX > 0 && velocityX > 100);

            if (isLeftSwipe || isRightSwipe) {
                handleSwipe(isRightSwipe);
            }
        }
    };

    const handleSwipe = (isRightSwipe) => {
        dropTrack();
        if (isRightSwipe) {
            addToPlaylist(appData.accessToken, trackStack[0], viberPlaylist);
        }

        if (trackStack.length <= 3) {
            fetchNewRecs();
        }
    };

    const dropTrack = () => {
        // console.log('initial stack: ', trackStack);
        setTrackStack((prevStack) => prevStack.slice(1));
        // console.log('new stack:', trackStack);
    };

    const fetchNewRecs = () => {
        console.log('less than 3 tracks left');
        console.log('initial seeds: ', appData.spotifyData.seeds);
        const newRecs = getNewRecs(
            appData.accessToken,
            appData.spotifyData.seeds
        );
        console.log('new recs: ', newRecs);
        console.log('\nHERE\n');
        // setTrackStack((prevTrackStack) => [
        //     ...prevTrackStack,
        //     ...newRecs,
        // ]);
    };

    const renderTrackDetails = (track) => {
        return (
            <View style={styles.trackDetails}>
                <Text style={styles.text}>{track.artists[0].name}</Text>
                <Text style={styles.text}>{track.name}</Text>
            </View>
        );
    };

    return (
        <View style={styles.trackDetailsContainer}>
            <PanGestureHandler onHandlerStateChange={onSwipe}>
                <Animated.View style={styles.trackDetails}>
                    {trackStack.length > 0 && renderTrackDetails(trackStack[0])}
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
};

export default TrackContainer;
