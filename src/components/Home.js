import React, { useCallback } from "react";
import { Appearance, Button, Image, StyleSheet, Text, View } from "react-native";
import Zeroconf from "react-native-zeroconf";

import AsyncStorage from "@react-native-community/async-storage";

import AlertSystem from "../function/Alert";

const Separator = () => <View style={oStyles.separator} />;

const colorScheme = Appearance.getColorScheme();

let vDefaultBackgroundColor = "#fff";
let sAppNameColor = "#222";

if (colorScheme === 'dark') {
	vDefaultBackgroundColor = "#222";
	sAppNameColor = "#fff";
}

const Home = ({ navigation }) => {
	const zeroconf = new Zeroconf();

	let sTypeErreur, sMessageErreur, sBoutonErreur;

	const vConnection = useCallback(async () => {
		let vStoredItem;

		try {
			const aKeys = ["ip", "port", "token"];
			const aSavedKeys = await AsyncStorage.multiGet(aKeys);

			vStoredItem = aSavedKeys;

			let aMissingSettings = [];

			if (vStoredItem[0][1] == null) {
				aMissingSettings.push("IP");
			}
			if (vStoredItem[1][1] == null) {
				aMissingSettings.push("Port");
			}
			if (vStoredItem[2][1] == null) {
				aMissingSettings.push("Token");
			}

			if (aMissingSettings.length > 0) {
				sTypeErreur = "Erreur";
				sMessageErreur = `Vous avez des paramètres manquant. Veuillez mettre à jours vos paramètres suivants :\n\n${aMissingSettings.join(
					"\n"
				)}`;
				sBoutonErreur = "OK";

				AlertSystem(sTypeErreur, sMessageErreur, sBoutonErreur);
			} else {
				navigation.navigate("Sikontrol", {
					nIp: vStoredItem[0][1],
					nPort: vStoredItem[1][1],
					sToken: vStoredItem[2][1],
				});
			}
		} catch (vError) {
			console.warn(vError);
		}
	}, []);

	return (
		<View style={{ alignItems: "center", flex: 1, backgroundColor: vDefaultBackgroundColor }}>
			<Separator />

			<Image source={require("../img/logo.png")} />

			<Separator />

			<Text style={{ color: sAppNameColor }}>Sikontrol</Text>

			<Separator />

			<View style={{ width: "33%" }}>
				<Button
					title="Connexion"
					onPress={vConnection}
					color={"#2e6abb"} />
			</View>

			<Separator />

			<View style={{ width: "33%" }}>
				<Button
					title="Paramètres"
					onPress={() => {
						navigation.navigate("Settings");
					}}
					color={"#2e6abb"}
				/>
			</View>
		</View>
	);
};

export default Home;

const oStyles = StyleSheet.create({
	separator: {
		marginVertical: 8,
		borderBottomColor: "transparent",
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
});
