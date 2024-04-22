// Node packages
import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

import { styles } from '../styles/styles.js';

const Button = (props) => {
    const { onPress, title } = props;
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
};

export default Button;
