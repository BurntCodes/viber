// Node Packages
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

// Local
import { styles } from '../styles/styles.js';

const TrackContainer = ({ appData, setAppData }) => {
    const trackStack = appData.spotifyData.viberPlaylist.newRecs[0].tracks;
    if (trackStack.length === 0) {
        return null;
    }

    const swiperRef = useRef(null); // Base ref for the swiper
    // const [likedTracks, setLikedTracks] = useState([]);
    // const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

    // const handleSwipeRight = (index) => {
    //     const currentTrack = trackStack[currentTrackIndex];
    //     setLikedTracks((prevLikedTracks) => [...prevLikedTracks, currentTrack]);
    //     setCurrentTrackIndex(index + 1);
    // };

    // const handleSwipeLeft = (index) => {
    //     setCurrentTrackIndex(index + 1);
    // };

    return (
        <Swiper
            ref={swiperRef}
            loop={false}
            showsPagination={false}
            onIndexChanged={(index) => console.log('Swiped to index', index)}
        >
            {trackStack.map((track, index) => (
                <View key={index} style={styles.container}>
                    <Text style={styles.artistName}>
                        {track.artists[0].name}
                    </Text>
                    <Text style={styles.songName}>{track.name}</Text>
                </View>
            ))}
        </Swiper>
    );
};

export default TrackContainer;
