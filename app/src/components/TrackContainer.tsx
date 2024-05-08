// Node Packages
import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

// Local
import { styles } from '../styles/styles.js';

const TrackContainer = ({ trackStack }) => {
    if (trackStack.length === 0) {
        return null;
    }

    const swiperRef = useRef(null); // Base ref for the swiper

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
