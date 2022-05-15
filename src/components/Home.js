import React, { useCallback, useState } from "react";
import { Button, StatusBar, View } from "react-native";

import AsyncStorage from "@react-native-community/async-storage";

import AlertSystem from "../function/Alert";

const Home = ({ navigation }) => {
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
		<View>
			<Button title="Connexion" onPress={vConnection} />

			<Button
				title="Paramètres"
				onPress={() => {
					navigation.navigate("Settings");
				}}
			/>
		</View>
	);
};

export default Home;
