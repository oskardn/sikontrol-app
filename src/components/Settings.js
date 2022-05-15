import React, { useCallback } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import AlertSystem from "../function/Alert";
import AsyncStorage from "@react-native-community/async-storage";

const Separator = () => <View style={oStyles.separator} />;

const Settings = () => {
	let sTokenSettings, nPortSettings, nIpSettings;
	let sTypeErreur, sMessageErreur, sBoutonErreur;

	const vSaveItem = useCallback(async (vStorageKey, vValue) => {
		try {
			await AsyncStorage.setItem(vStorageKey, vValue);
		} catch (vError) {
			console.warn(vError);
		}
	});

	function vSubmit(vStorageKey, vValue) {
		if (vValue) {
			switch (vStorageKey) {
				case "token":
					vSaveItem(vStorageKey, vValue);

					sTypeErreur = "Succès";
					sMessageErreur = "Le token à bien été mis à jour";
					sBoutonErreur = "OK";

					AlertSystem(sTypeErreur, sMessageErreur, sBoutonErreur);
					break;
				case "ip":
					const sValidIp =
						/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

					if (sValidIp.test(vValue) == true) {
						vSaveItem(vStorageKey, vValue);

						sTypeErreur = "Succès";
						sMessageErreur = "L'IP à bien été mis à jour";
						sBoutonErreur = "OK";

						AlertSystem(sTypeErreur, sMessageErreur, sBoutonErreur);
					} else {
						sTypeErreur = "Erreur";
						sMessageErreur = "Veuillez renseigner un IP valide";
						sBoutonErreur = "OK";

						AlertSystem(sTypeErreur, sMessageErreur, sBoutonErreur);
					}
					break;
				case "port":
					if (vValue >= 1 && vValue <= 65535) {
						vSaveItem(vStorageKey, vValue);

						sTypeErreur = "Succès";
						sMessageErreur = "Le port à bien été mis à jour";
						sBoutonErreur = "OK";

						AlertSystem(sTypeErreur, sMessageErreur, sBoutonErreur);
					} else {
						sTypeErreur = "Erreur";
						sMessageErreur =
							"Veuillez renseigner un Port entre 1 et 65535";
						sBoutonErreur = "OK";

						AlertSystem(sTypeErreur, sMessageErreur, sBoutonErreur);
					}
					break;
				default:
					return;
					break;
			}
		} else {
			sTypeErreur = "Erreur";
			sMessageErreur = "Veuillez renseigner une valeur";
			sBoutonErreur = "OK";

			AlertSystem(sTypeErreur, sMessageErreur, sBoutonErreur);
		}
	}

	return (
		<View style={[oStyles.container, { flexDirection: "column" }]}>
			<View style={{ alignItems: "center" }}>
				<TextInput
					secureTextEntry={true}
					placeholder="Token"
					onChangeText={(sValue) => (sTokenSettings = sValue)}
					style={oStyles.dropdownBtnStyle}
				/>
				<Separator />
				<Button
					title="Mettre à jour le token"
					color={"#2e6abb"}
					onPress={() => {
						vSubmit("token", sTokenSettings);
					}}
				/>
			</View>

			<Separator />

			<View style={{ alignItems: "center" }}>
				<TextInput
					keyboardType="number-pad"
					secureTextEntry={false}
					placeholder="IP"
					onChangeText={(nValue) => (nIpSettings = nValue)}
					style={oStyles.dropdownBtnStyle}
				/>
				<Separator />
				<Button
					title="Mettre à jour l'IP"
					color={"#2e6abb"}
					onPress={() => {
						vSubmit("ip", nIpSettings);
					}}
				/>
			</View>

			<Separator />

			<View style={{ alignItems: "center" }}>
				<TextInput
					keyboardType="number-pad"
					secureTextEntry={false}
					placeholder="Port"
					onChangeText={(nValue) => (nPortSettings = nValue)}
					style={oStyles.dropdownBtnStyle}
				/>
				<Separator />
				<Button
					title="Mettre à jour le port"
					color={"#2e6abb"}
					onPress={() => {
						vSubmit("port", nPortSettings);
					}}
				/>
			</View>
		</View>
	);
};

export default Settings;

const oStyles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},

	separator: {
		marginVertical: 8,
		borderBottomColor: "transparent",
		borderBottomWidth: StyleSheet.hairlineWidth,
	},

	textButtonColor: {
		color: "#222222",
	},

	dropdownBtnStyle: {
		width: "80%",
		height: 50,
		backgroundColor: "#FFF",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#444",
	},

	dropdownBtnTxtStyle: {
		color: "#222",
		textAlign: "left",
	},

	dropdownDropdownStyle: {
		backgroundColor: "#fff",
	},

	dropdownRowStyle: {
		backgroundColor: "#fff",
		borderBottomColor: "#222",
	},

	dropdownRowTxtStyle: {
		color: "#222",
		textAlign: "center",
	},
});
