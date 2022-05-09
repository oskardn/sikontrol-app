/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
    Alert,
    Button,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
import SelectDropdown from 'react-native-select-dropdown'
import Slider from '@react-native-community/slider';
import io from 'socket.io-client';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}): Node => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
        <Text
            style={[
            styles.sectionTitle,
            {
                color: isDarkMode ? Colors.white : Colors.black,
            },
            ]}>
            {title}
        </Text>
        <Text
            style={[
            styles.sectionDescription,
            {
                color: isDarkMode ? Colors.light : Colors.dark,
            },
            ]}>
            {children}
        </Text>
        </View>
    );
};

const App: () => Node = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    const sTokenJSON = "1234";

    const nIp = "192.168.230.156", nPort = 3000;
    const sUrl = `ws://${nIp}:${nPort}`;

    const ioSocket = io.connect(sUrl, {
        auth: {
            token: sTokenJSON,
        },
        withCredentials: true,
        transports: ['websocket'],
        reconnectionAttempts: 15
    });

    let aApp = [], sActualApp;

    ioSocket.on('aSessions', (aSessions) => {
        aSessions.forEach((sValue) => {
            if (sValue.name  && sValue.pid) {
                aApp.push(sValue.name);
            };
        });
    });

    return (
        <View style={[styles.container, {flexDirection: "column"}]}>
            <View>
                <Button
                    title="Précédent"
                    onPress={() => ioSocket.emit("ioActions", {
                        action: "vPrevious"
                    })}
                />
            </View>
            <View>
                <Button
                    title="Play et Pause"
                    onPress={() => ioSocket.emit("ioActions", {
                        action: "vPlayPause"
                    })}
                />
            </View>
            <View>
                <Button
                    title="Suivant"
                    onPress={() => ioSocket.emit("ioActions", {
                        action: "vNext"
                    })}
                />
            </View>

            <View>
                <Slider
                    minimumValue={0}
                    maximumValue={1}
                    step={0.01}
                    value={1}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    onValueChange={(value) => ioSocket.emit('ioVolumeMaster', {
                        action: 'vMaster',
                        volume: value * 100
                    })}
                />
            </View>

            <View>
                <SelectDropdown
                    data={aApp}
                    onSelect={(sSelectedApp, nIndex) => {
                        sActualApp = sSelectedApp;
                    }}
                    buttonTextAfterSelection={(sSelectedApp, nIndex) => {
                        return sSelectedApp
                    }}
                    rowTextForSelection={(sSelectedApp, nIndex) => {
                        return sSelectedApp
                    }}
                    style={styles.rtlSwitchContainer}
                />
            </View>

            <View>
                <Slider
                    minimumValue={0}
                    maximumValue={1}
                    step={0.01}
                    value={1}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    onValueChange={(value) => ioSocket.emit('ioVolumeApps', {
                        action: sActualApp,
                        volume: value * 100
                    })}
                />
            </View>
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    rtlSwitchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        paddingTop: 20,
    },
});

export default App;
