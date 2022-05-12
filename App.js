import React from 'react';
import type { Node } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import io from 'socket.io-client';

import {
    Colors, Header
} from 'react-native/Libraries/NewAppScreen';

const { width } = Dimensions.get('window');

const Separator = () => (
    <View style={oStyles.separator} />
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

const vStoreData = async (vStorageKey, sValue) => {
    try {
        await AsyncStorage.setItem(vStorageKey, sValue)
    } catch (vErr) {
        Alert.alert(vErr);
    };
};

const Settings = () => {
    let sToken, nPort, nIp;

    function vSubmit(vStorageKey, vValue) {
        if (vValue) {
            switch (vStorageKey) {
                case 'token':
                    vStoreData(vStorageKey, vValue);

                    Alert.alert(
                        "Succès",
                        "Le token à bien été mis à jour",
                        [
                            {
                                text: "OK",
                            }
                        ]
                    );
                    break;
                case 'ip':
                    const sValidIp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

                    if (sValidIp.test(vValue) == true) {
                        vStoreData(vStorageKey, vValue);

                        Alert.alert(
                            "Succès",
                            "L'IP à bien été mis à jour",
                            [
                                {
                                    text: "OK",
                                }
                            ]
                        );
                    } else {
                        Alert.alert(
                            "Erreur",
                            "Veuillez renseigner un IP valide",
                            [
                                {
                                    text: "OK",
                                }
                            ]
                        );
                    };
                    break;
                case 'port':
                    if (vValue >= 1 && vValue <= 65535) {
                        vStoreData(vStorageKey, vValue);

                        Alert.alert(
                            "Succès",
                            "Le port à bien été mis à jour",
                            [
                                {
                                    text: "OK",
                                }
                            ]
                        );
                    } else {
                        Alert.alert(
                            "Erreur",
                            "Veuillez renseigner un Port entre 1 et 65535",
                            [
                                {
                                    text: "OK",
                                }
                            ]
                        );
                    }
                    break;
                default:
                    return;
                    break;
            };
        } else {
            Alert.alert(
                "Erreur",
                "Veuillez renseigner une valeur",
                [
                    {
                        text: "OK",
                    }
                ]
            );
        }
    }

    return (
        <View style={[oStyles.container, { flexDirection: "column" }]}>
            <View style={{ alignItems: 'center' }}>
                <TextInput
                    secureTextEntry={true}
                    placeholder="Token"
                    onChangeText={(sValue) => sToken = sValue}
                    style={oStyles.dropdownBtnStyle}
                />
                <Separator />
                <Button
                    title='Mettre à jour le token'
                    color={"#2e6abb"}
                    onPress={() => { vSubmit('token', sToken) }}
                />
            </View>

            <Separator />

            <View style={{ alignItems: 'center' }}>
                <TextInput
                    keyboardType='number-pad'
                    secureTextEntry={false}
                    placeholder="IP"
                    onChangeText={(nValue) => nIp = nValue}
                    style={oStyles.dropdownBtnStyle}
                />
                <Separator />
                <Button
                    title="Mettre à jour l'IP"
                    color={"#2e6abb"}
                    onPress={() => { vSubmit('ip', nIp) }}
                />
            </View>

            <Separator />

            <View style={{ alignItems: 'center' }}>
                <TextInput
                    keyboardType='number-pad'
                    secureTextEntry={false}
                    placeholder="Port"
                    onChangeText={(nValue) => nPort = nValue}
                    style={oStyles.dropdownBtnStyle}
                />
                <Separator />
                <Button
                    title='Mettre à jour le port'
                    color={"#2e6abb"}
                    onPress={() => { vSubmit('port', nPort) }}
                />
            </View>
        </View>
    );
};

const Sikontrol = ({ navigation }) => {
    const isDarkMode = useColorScheme() === 'dark';

    let nIp, nPort, sToken;

    const vGetData = async (vStorageKey) => {
        try {
            const sValue = await AsyncStorage.getItem(vStorageKey);

            if (sValue !== null) {
                switch (vStorageKey) {
                    case "ip":
                        nIp = String(sValue);
                        break;
                    case "port":
                        nPort = Number(sValue);
                        break;
                    case "token":
                        sToken = String(sValue);
                        break;
                    default:
                        return;
                        break;
                };
            };
        } catch (vErr) {
            Alert.alert(vErr);
        };
    };

    vGetData("ip"); vGetData("port"); vGetData("token");

    const sUrl = `ws://${nIp}:${nPort}`;

    console.log(sToken);
    console.log(nIp);
    console.log(nPort);

    const ioSocket = io.connect(sUrl, {
        auth: {
            token: sToken,
        },
        withCredentials: true,
        transports: ['websocket'],
        reconnectionAttempts: 15,
        // reconnectionDelay: 2000
    });

    // ioSocket.on('connect_error', () => {
    //     Alert.alert(
    //         "Serveur introuvable",
    //         "Le serveur n'est peut être pas démarré ou soit vous avez mal configuré les paramètres",
    //         [
    //             {
    //                 text: "OK",
    //             }
    //         ]
    //     );
    // });

    let aApp = [], sActualApp;

    ioSocket.once('aSessions', (aSessions) => {
        aSessions.forEach((sValue) => {
            if (sValue.name && sValue.pid) {
                aApp.push(sValue.name);
            };
        });
    });

    return (
        <View style={[oStyles.container, { flexDirection: "column" }]}>
            <View style={{ flexDirection: 'column', flex: 0.075 }}>
                <Button
                    title="Précédent"
                    color={"#2e6abb"}
                    onPress={() => ioSocket.emit("ioActions", {
                        action: "vPrevious"
                    })}
                />
            </View>
            <View style={{ flexDirection: 'column', flex: 0.075 }}>
                <Button
                    title="Play / Pause"
                    color={"#2e6abb"}
                    onPress={() => ioSocket.emit("ioActions", {
                        action: "vPlayPause"
                    })}
                />
            </View>
            <View style={{ flexDirection: 'column', flex: 0.075 }}>
                <Button
                    title="Suivant"
                    color={"#2e6abb"}
                    onPress={() => ioSocket.emit("ioActions", {
                        action: "vNext"
                    })}
                />
            </View>

            <Separator />

            <View style={{ flexDirection: 'column', flex: 0.075 }}>
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
            <View style={{ alignItems: 'center' }}>
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
                    buttonStyle={oStyles.dropdownBtnStyle}
                    buttonTextStyle={oStyles.dropdownBtnTxtStyle}
                    renderDropdownIcon={isOpened => {
                        return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                    }}
                    dropdownIconPosition={'right'}
                    dropdownStyle={oStyles.dropdownDropdownStyle}
                    rowStyle={oStyles.dropdownRowStyle}
                    rowTextStyle={oStyles.dropdownRowTxtStyle}
                />
            </View>

            <Separator />

            <View style={{ flexDirection: 'column', flex: 1 }}>
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
                    color={"#2e6abb"}
                    onPress={() => {
                        navigation.navigate('Settings');
                    }}
                />
            </View>
        </View>
    );
};

const oStyles = StyleSheet.create({
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
