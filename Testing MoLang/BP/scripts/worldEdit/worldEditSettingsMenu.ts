
import { Player } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { WorldEditState, WorldEditSettings, SphereState, FillState, HollowSphereState, getPlayerWorldEditSettings, getPlayerWorldEditState, setPlayerWorldEditSettings, setPlayerWorldEditState } from "./worldEditSettings.js"

export function openMaxDistanceMenu(player: Player) {
    let menu = new ModalFormData()
    menu.title("Max Axe Distance");
    menu.slider("Max Distance", 0, 400, 1, getPlayerWorldEditSettings(player).maxDistance);

    menu.show(player).then(response => {
        if (response.canceled) return;

        let [maxDistance] = response.formValues;

        getPlayerWorldEditSettings(player).setMaxDistance(maxDistance);
    }).catch((error) => {
        console.error(error, error.stack);
    });
}

const axeStates: String[] = ["Fill", "Sphere", "Hollow Sphere"];

function getAxeStateIndex(state: String) {
    return axeStates.indexOf(state);
}

function setAxeStateFromIndex(player: Player, index: number) {
    let nameState = axeStates[index];

    if (getPlayerWorldEditState(player).toString() == nameState)
        return;

    switch (nameState) {
        case "Fill":
            setPlayerWorldEditState(player, new FillState(player));
            break;

        case "Sphere":
            setPlayerWorldEditState(player, new SphereState(player));
            break;

        case "Hollow Sphere":
            setPlayerWorldEditState(player, new HollowSphereState(player));
            break;
    }
}

export function openAxeSettingsMenu(player: Player) {
    let menu = new ModalFormData();
    menu.title("Change Axe Mode");
    menu.dropdown("Axe Mode", axeStates, getAxeStateIndex(getPlayerWorldEditState(player).toString()));
    getPlayerWorldEditState(player).addStateSettings(menu);

    menu.show(player).then(response => {
        if (response.canceled) return;

        let [state] = response.formValues;


        setAxeStateFromIndex(player, state);
    }).catch((error) => {
        console.error(error, error.stack);
    });
}

export function openSettingsMenu(player: Player) {
    let settingsMenu = new ActionFormData();
    settingsMenu.title("World Edit");
    settingsMenu.button("Max Axe Distance");
    settingsMenu.button("Change Axe Mode");

    settingsMenu.show(player).then(response => {
        if (response.canceled) return;

        let buttonNumber = response.selection;
        switch (buttonNumber) {
            case (0):
                openMaxDistanceMenu(player);
                break;

            case (1):
                openAxeSettingsMenu(player);
                break;
        }
    }).catch((error) => {
        console.error(error, error.stack);
    });
}