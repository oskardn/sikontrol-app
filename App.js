import React from "react";
import type { Node } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Sikontrol from "./src/components/Sikontrol";
import Settings from "./src/components/Settings";

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
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
