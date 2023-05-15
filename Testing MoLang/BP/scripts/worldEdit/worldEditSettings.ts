import { MinecraftBlockTypes, Player, Vector, Block, } from "@minecraft/server"
import { generateSphere, generateHollowSphere, circle, BlockMix, fill, clearActiveSphereHandlers } from "./shapes.js";
import { ModalFormData, ActionFormData } from "@minecraft/server-ui";

export class WorldEditMode {
    player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    toString(): String {
        return "";
    }

    rightClickAction(block: Block) {

    }

    addEditModeSettingsButton(menu: ActionFormData) {
        menu.button(this.toString() + " Mode Settings");
    }

    createEditModeSettings(): ModalFormData {
        let menu = new ModalFormData();
        menu.title(this.toString() + " Mode Settings");

        return menu;
    }

    updateEditModeSettings(formData: any[]): any[] {
        return formData;
    }
}

export class SphereMode extends WorldEditMode {
    size: number;
    blockMix: BlockMix;

    constructor(player: Player) {
        super(player);
        this.setSize(5);
        this.setBlockMix(new BlockMix({ blockType: MinecraftBlockTypes.stone, weight: 1 }));
    }

    toString(): String {
        return "Sphere";
    }

    setSize(size: number) {
        this.size = size;
    }

    setBlockMix(blockMix: BlockMix) {
        this.blockMix = blockMix;
    }

    rightClickAction(block: Block) {
        generateSphere(this.player.dimension, block.location, this.size, this.blockMix);
    }

    createEditModeSettings(): ModalFormData {
        let menu = super.createEditModeSettings() as ModalFormData;
        menu.slider("Sphere Radius", 1, 100, 1, this.size);

        return menu;
    }

    updateEditModeSettings(formData: any[]): any[] {
        formData = super.updateEditModeSettings(formData);

        this.setSize(formData.shift());

        return formData;
    }
}

export class HollowSphereMode extends SphereMode {
    thickness: number;

    constructor(player: Player) {
        super(player);
        this.setSize(5);
        this.setBlockMix(new BlockMix({ blockType: MinecraftBlockTypes.stone, weight: 1 }));
    }

    toString(): String {
        return "Hollow Sphere";
    }

    setThickness(thickness: number) {
        this.thickness = thickness;
    }

    rightClickAction(block: Block) {
        generateHollowSphere(this.player.dimension, block.location, this.size, this.thickness, this.blockMix);
    }

    createEditModeSettings(): ModalFormData {
        let menu = super.createEditModeSettings() as ModalFormData;
        menu.slider("Sphere Thickness", 1, 100, 1, this.thickness);

        return menu;
    }

    updateEditModeSettings(formData: any[]): any[] {
        formData = super.updateEditModeSettings(formData);

        this.setThickness(formData.shift());

        return formData;
    }
}

export class FillMode extends WorldEditMode {
    startPosition: Vector;
    endPosition: Vector;
    blockMix: BlockMix;
    firstClick: boolean;

    constructor(player: Player) {
        super(player);

        this.startPosition = null;
        this.endPosition = null;

        this.setBlockMix(new BlockMix({ blockType: MinecraftBlockTypes.stone, weight: 1 }));

        this.firstClick = true;
    }

    toString(): String {
        return "Fill";
    }

    setBlockMix(blockMix) {
        this.blockMix = blockMix;
    }

    rightClickAction(block) {
        if (this.firstClick == true) {
            this.startPosition = block.location;
            this.player.sendMessage(`First Position: (${block.location.x}, ${block.location.y}, ${block.location.z})`);
        }
        else {
            this.endPosition = block.location;
            this.player.sendMessage(`Second Position: (${block.location.x}, ${block.location.y}, ${block.location.z})`);
        }

        this.firstClick = !this.firstClick;
    }

    fill() {
        if (this.startPosition != null && this.endPosition != null) {
            let filled = fill(
                this.player.dimension,
                this.startPosition,
                this.endPosition,
                this.blockMix
            );

            this.player.sendMessage(`Filled ${filled} blocks`);
        }
    }
}

export class WorldEditSettings {
    mode: WorldEditMode;
    maxDistance: number;

    constructor(mode: WorldEditMode, maxDistance: number = null) {
        this.setMode(mode);
        this.setMaxDistance(maxDistance);
    }

    setMode(mode: WorldEditMode) {
        this.mode = mode;
    }

    setMaxDistance(maxDistance: number) {
        if (maxDistance == null && this.maxDistance == null) {
            this.maxDistance = 400
        }
        else {
            this.maxDistance = maxDistance;
        }
    }
}


var playerWorldEditSettings: { [id: string]: WorldEditSettings } = {};
export function getPlayerWorldEditSettings(player: Player): WorldEditSettings {
    if (playerWorldEditSettings[player.id] == undefined) {
        playerWorldEditSettings[player.id] = new WorldEditSettings(new FillMode(player));
    }

    return playerWorldEditSettings[player.id];
}

export function getPlayerWorldEditMode(player: Player): WorldEditMode {
    return getPlayerWorldEditSettings(player).mode;
}

export function setPlayerWorldEditSettings(player: Player, settings: WorldEditSettings) {
    playerWorldEditSettings[player.id] = settings;
}

export function setPlayerWorldEditMode(player: Player, mode: WorldEditMode) {
    getPlayerWorldEditSettings(player).setMode(mode);
}