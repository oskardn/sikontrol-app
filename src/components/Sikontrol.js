import React from "react";
import { Appearance, Button, StyleSheet, useColorScheme, View } from "react-native";

import io from "socket.io-client";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SelectDropdown from "react-native-select-dropdown";
import Slider from "@react-native-community/slider";

const Separator = () => <View style={oStyles.separator} />;

const colorScheme = Appearance.getColorScheme();

let vDefaultBackgroundColor = "#fff";
let vDefaultSliderBackgroundColor = "#222";
let vDefaultSelectTextColor = "#222";
let vDefaultSelectBackgroundColor = "#fff";

if (colorScheme === 'dark') {
	vDefaultBackgroundColor = "#222";
	vDefaultSliderBackgroundColor = "#fff";
	vDefaultSelectTextColor = "#fff";
	vDefaultSelectBackgroundColor = "#222";
}

const Sikontrol = ({ route, navigation }) => {
	let nIp = route.params.nIp,
		nPort = Number(route.params.nPort),
		sToken = route.params.sToken;

	const sUrl = `ws://${nIp}:${nPort}`;

	const ioSocket = io.connect(sUrl, {
		auth: {
			token: sToken,
		},
		withCredentials: true,
		transports: ["websocket"],
		reconnectionAttempts: 15,
	});

	let aApp = [],
		sActualApp;

	ioSocket.once("aSessions", (aSessions) => {
		aSessions.forEach((sValue) => {
			if (sValue.name && sValue.pid) {
				if (aApp.includes(sValue.name) !== true) {
					aApp.push(sValue.name);
				}
			}
		});
	});

	return (
		<View style={[oStyles.container, { flexDirection: "column", flex: 1, backgroundColor: vDefaultBackgroundColor }]}>
			<View style={[oStyles.center, { flexDirection: "row" }]}>
				<View style={{ width: "33%" }}>
					<Button
						title="Précédent"
						color={"#2e6abb"}
						onPress={() =>
							ioSocket.emit("ioActions", {
								action: "vPrevious",
							})
						}
					/>
				</View>

				<View style={{ width: "33%" }}>
					<Button
						title="Play / Pause"
						color={"#2e6abb"}
						onPress={() =>
							ioSocket.emit("ioActions", {
								action: "vPlayPause",
							})
						}
					/>
				</View>

				<View style={{ width: "33%" }}>
					<Button
						title="Suivant"
						color={"#2e6abb"}
						onPress={() =>
							ioSocket.emit("ioActions", {
								action: "vNext",
							})
						}
					/>
				</View>
			</View>

			<Separator />

			<View style={[oStyles.center, { flexDirection: "row", flex: 0.075 }]}>
				<View style={{ width: "80%" }}>
					<Slider
						minimumValue={0}
						maximumValue={1}
						step={0.01}
						value={1}
						minimumTrackTintColor={vDefaultSliderBackgroundColor}
						maximumTrackTintColor="#000000"
						onValueChange={(value) =>
							ioSocket.emit("ioVolumeMaster", {
								action: "vMaster",
								volume: value * 100,
							})
						}
					/>
				</View>

				<View style={{ width: "20%" }}>
					<Button
						title="MUTE"
						color={"#2e6abb"}
						onPress={() =>
							ioSocket.emit("ioMasterMute", {
								action: "vMuteMaster",
							})
						}
					/>
				</View>
			</View>

			<Separator />

			<View style={{ alignItems: "center" }}>
				<SelectDropdown
					data={aApp}
					onSelect={(sSelectedApp) => {
						sActualApp = sSelectedApp;
					}}
					defaultButtonText={"Sélectionner..."}
					buttonTextAfterSelection={(sSelectedApp) => {
						return sSelectedApp;
					}}
					rowTextForSelection={(sSelectedApp) => {
						return sSelectedApp;
					}}
					buttonStyle={oStyles.dropdownBtnStyle}
					buttonTextStyle={oStyles.dropdownBtnTxtStyle}
					renderDropdownIcon={(isOpened) => {
						return (
							<FontAwesome
								name={isOpened ? "chevron-up" : "chevron-down"}
								color={vDefaultSelectTextColor}
								size={18}
							/>
						);
					}}
					dropdownIconPosition={"right"}
					dropdownStyle={oStyles.dropdownDropdownStyle}
					rowStyle={oStyles.dropdownRowStyle}
					rowTextStyle={oStyles.dropdownRowTxtStyle}
				/>
			</View>

			<Separator />

			<View style={[oStyles.center, { flexDirection: "row", flex: 0.075 }]}>
				<View style={{ width: "80%" }}>
					<Slider
						minimumValue={0}
						maximumValue={1}
						step={0.01}
						value={1}
						minimumTrackTintColor={vDefaultSliderBackgroundColor}
						maximumTrackTintColor="#000000"
						onValueChange={(value) =>
							ioSocket.emit("ioVolumeApps", {
								action: sActualApp,
								volume: Number(value),
							})
						}
					/>
				</View>

				<View style={{ width: "20%" }}>
					<Button
						title="MUTE"
						color={"#2e6abb"}
						onPress={() =>
							ioSocket.emit("ioMuteButton", {
								vApp: sActualApp,
							})
						}
					/>
				</View>
			</View>
		</View>
	);
};

export default Sikontrol;

const oStyles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},

	center: {
		justifyContent: "space-between",
	},

	separator: {
		marginVertical: 8,
		borderBottomColor: "transparent",
		borderBottomWidth: StyleSheet.hairlineWidth,
	},

	dropdownBtnStyle: {
		width: "80%",
		height: 50,
		backgroundColor: vDefaultSelectBackgroundColor,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: vDefaultSelectTextColor,
	},

	dropdownBtnTxtStyle: {
		color: vDefaultSelectTextColor,
		textAlign: "left",
	},

	dropdownDropdownStyle: {
		backgroundColor: vDefaultSelectBackgroundColor,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: vDefaultSelectTextColor,
	},

	dropdownRowStyle: {
		backgroundColor: vDefaultSelectBackgroundColor,
		borderBottomColor: "#000",
	},

	dropdownRowTxtStyle: {
		color: vDefaultSelectTextColor,
		textAlign: "center",
	},
});
