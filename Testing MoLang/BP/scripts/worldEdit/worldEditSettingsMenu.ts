
import { Player } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { WorldEditMode, WorldEditSettings, SphereMode, FillMode, HollowSphereMode, getPlayerWorldEditSettings, getPlayerWorldEditMode, setPlayerWorldEditSettings, setPlayerWorldEditMode } from "./worldEditSettings.js"

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

const editModes: string[] = ["Fill", "Sphere", "Hollow Sphere"];

function getEditModeIndex(mode: string) {
    return editModes.indexOf(mode);
}

function setEditModeFromIndex(player: Player, index: number) {
    let modeName = editModes[index];

    if (getPlayerWorldEditMode(player).toString() == modeName)
        return;

    switch (modeName) {
        case "Fill":
            setPlayerWorldEditMode(player, new FillMode(player));
            break;

        case "Sphere":
            setPlayerWorldEditMode(player, new SphereMode(player));
            break;

        case "Hollow Sphere":
            setPlayerWorldEditMode(player, new HollowSphereMode(player));
            break;
    }
}

export function openAxeSettingsMenu(player: Player) {
    let menu = new ModalFormData();
    menu.title("Change Axe Mode");
    menu.dropdown("Axe Mode", editModes, getEditModeIndex(getPlayerWorldEditMode(player).toString()));

    menu.show(player).then(response => {
        if (response.canceled) return;

        let [mode] = response.formValues;


        setEditModeFromIndex(player, mode);
    }).catch((error) => {
        console.error(error, error.stack);
    });
}

export function openSettingsMenu(player: Player) {
    let settingsMenu = new ActionFormData();
    settingsMenu.title("World Edit");
    settingsMenu.button("Max Axe Distance");
    settingsMenu.button("Change Axe Mode");
    let mode = getPlayerWorldEditMode(player);
    mode.addEditModeSettingsButton(settingsMenu);

    settingsMenu.show(player).then(settingsMenuResponse => {
        if (settingsMenuResponse.canceled) return;

        let buttonNumber = settingsMenuResponse.selection;
        switch (buttonNumber) {
            case (0):
                openMaxDistanceMenu(player);
                break;

            case (1):
                openAxeSettingsMenu(player);
                break;

            case (2):
                let modeSettingsMenu = mode.createEditModeSettings();
                modeSettingsMenu.show(player).then(modeSettingsMenuResponse => {
                    if (modeSettingsMenuResponse.canceled) return;

                    mode.updateEditModeSettings(modeSettingsMenuResponse.formValues);
                }).catch((error) => {
                    console.error(error, error.stack);
                });
                break;
        }
    }).catch((error) => {
        console.error(error, error.stack);
    });
}