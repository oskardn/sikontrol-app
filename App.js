import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/components/Home";
import Settings from "./src/components/Settings";
import Sikontrol from "./src/components/Sikontrol";

const Stack = createNativeStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="Home"
					component={Home}
					options={{
						title: "Accueil",
						headerStyle: {
							backgroundColor: "#2e6abb",
						},
						headerTintColor: "#fff",
						headerTitleStyle: {
							fontWeight: "bold",
						},
					}}
				/>
				<Stack.Screen
					name="Settings"
					component={Settings}
					options={({ route }) => ({
						title: "Paramètres",
						headerStyle: {
							backgroundColor: "#2e6abb",
						},
						headerTintColor: "#fff",
						headerTitleStyle: {
							fontWeight: "bold",
						},
					})}
				/>
				<Stack.Screen
					name="Sikontrol"
					component={Sikontrol}
					options={{
						title: "Sikontrol",
						headerStyle: {
							backgroundColor: "#2e6abb",
						},
						headerTintColor: "#fff",
						headerTitleStyle: {
							fontWeight: "bold",
						},
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
