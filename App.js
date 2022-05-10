import React, { useState } from 'react';
import type {Node} from 'react';
import {
    Alert,
    Button,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import SelectDropdown from 'react-native-select-dropdown'

import Slider from '@react-native-community/slider';
import Config from "react-native-config";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import io from 'socket.io-client';

import {
    Colors, Header
} from 'react-native/Libraries/NewAppScreen';

const {width} = Dimensions.get('window');

const Separator = () => (
    <View style={Styles.separator} />
);

const Stack = createNativeStackNavigator();

const App: () => Node = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Sikontrol"
                    component={Sikontrol}
                    options={{
                        title: "Sikontrol",
                        headerStyle: {
                            backgroundColor: '#2e6abb'
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold'
                        }
                    }}
                />
                <Stack.Screen
                    name="Settings"
                    component={Settings}
                    options={({ route }) => ({
                        title: "Paramètres",
                        headerStyle: {
                            backgroundColor: '#2e6abb'
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold'
                        }
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const Settings = () => {
    let sToken;
    const [name, setName] = useState('')

    function submit (sToken) {
        if (sToken) {
            Alert.alert(sToken);
        }
    }

    return (
        <View style={[Styles.container, {flexDirection: "column"}]}>
            <View style={{alignItems: 'center'}}>
                <TextInput
                    secureTextEntry={true}
                    placeholder="Token"
                    onChangeText={(sValue) => sToken = sValue}
                    style={Styles.dropdownBtnStyle}
                />
                <Separator />
                <Button
                    title='Mettre à jour'
                    onPress={() => {submit(sToken)}}
                />
            </View>
        </View>
    );
};

const Sikontrol = ({ navigation }) => {
    const isDarkMode = useColorScheme() === 'dark';

    const sTokenJSON = Config.SERVER_TOKEN;

    const nIp = Config.SERVER_IP, nPort = Config.SERVER_PORT;
    const sUrl = `ws://${nIp}:${nPort}`;

    const ioSocket = io.connect(sUrl, {
        auth: {
            token: sTokenJSON,
        },
        withCredentials: true,
        transports: ['websocket'],
        reconnectionAttempts: 15
    });

    ioSocket.on('connect_error', () => {
        Alert.alert(
            "Serveur introuvable",
            "Le serveur n'est peut être pas démarré ou soit vous avez mal configuré les paramètres",
            [
                {
                    text: "OK",
                    onPress: () => console.log("OK Pressed")
                }
            ]
        );
    });

    let aApp = [], sActualApp;

    ioSocket.once('aSessions', (aSessions) => {
        aSessions.forEach((sValue) => {
            if (sValue.name  && sValue.pid) {
                aApp.push(sValue.name);
            };
        });
    });

    return (
        <View style={[Styles.container, {flexDirection: "column"}]}>
            <View style={{flexDirection: 'column', flex: 0.075}}>
                <Button
                    title="Précédent"
                    color={"#2e6abb"}
                    onPress={() => ioSocket.emit("ioActions", {
                        action: "vPrevious"
                    })}
                />
            </View>
            <View style={{flexDirection: 'column', flex: 0.075}}>
                <Button
                    title="Play / Pause"
                    color={"#2e6abb"}
                    onPress={() => ioSocket.emit("ioActions", {
                        action: "vPlayPause"
                    })}
                />
            </View>
            <View style={{flexDirection: 'column', flex: 0.075}}>
                <Button
                    title="Suivant"
                    color={"#2e6abb"}
                    onPress={() => ioSocket.emit("ioActions", {
                        action: "vNext"
                    })}
                />
            </View>

            <Separator />

            <View style={{flexDirection: 'column', flex: 0.075}}>
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
            <View style={{alignItems: 'center'}}>
                <SelectDropdown
                    data={aApp}
                    onSelect={(sSelectedApp) => {
                        sActualApp = sSelectedApp;
                    }}
                    defaultButtonText={'Sélectionner...'}
                    buttonTextAfterSelection={(sSelectedApp) => {
                        return sSelectedApp
                    }}
                    rowTextForSelection={(sSelectedApp) => {
                        return sSelectedApp
                    }}
                    buttonStyle={Styles.dropdownBtnStyle}
                    buttonTextStyle={Styles.dropdownBtnTxtStyle}
                    renderDropdownIcon={isOpened => {
                        return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                    }}
                    dropdownIconPosition={'right'}
                    dropdownStyle={Styles.dropdownDropdownStyle}
                    rowStyle={Styles.dropdownRowStyle}
                    rowTextStyle={Styles.dropdownRowTxtStyle}
                />
            </View>

            <Separator />

            <View style={{flexDirection: 'column', flex: 1}}>
                <Slider
                    minimumValue={0}
                    maximumValue={1}
                    step={0.01}
                    value={1}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    onValueChange={(value) => ioSocket.emit('ioVolumeApps', {
                        action: sActualApp,
                        volume: Number(value)
                    })}
                />
            </View>

            <View>
                <Button
                    title='Paramètres'
                    onPress={() => {
                        navigation.navigate('Settings');
                    }}
                />
            </View>
        </View>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    separator: {
        marginVertical: 8,
        borderBottomColor: 'transparent',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },

    textButtonColor: {
        color: "#222222"
    },

    dropdownBtnStyle: {
        width: '80%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },

    dropdownBtnTxtStyle: {
        color: '#222',
        textAlign: 'left'
    },

    dropdownDropdownStyle: {
        backgroundColor: '#fff'
    },
    
    dropdownRowStyle: {
        backgroundColor: '#fff',
        borderBottomColor: '#222'
    },

    dropdownRowTxtStyle: {
        color: '#222',
        textAlign: 'center'
    },
});

export default App;
