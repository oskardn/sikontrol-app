import React from "react";
import {
	Alert,
} from "react-native";

const AlertSystem = (sType, sMessage, sButton) => {
    Alert.alert(
        sType,
        sMessage,
        [
            {
                text: sButton
            }
        ]
    );
}

export default AlertSystem;