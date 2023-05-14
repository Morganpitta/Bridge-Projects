import { MinecraftBlockTypes, Player, Vector, Block, } from "@minecraft/server"
import { generateSphere, generateHollowSphere, circle, BlockMix, fill, clearActiveSphereHandlers } from "./shapes.js";
import { ModalFormData } from "@minecraft/server-ui";

export class WorldEditState {
    player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    toString(): String {
        return "";
    }

    rightClickAction(block: Block) {

    }

    addStateSettings(menu: ModalFormData) {

    }
}

export class SphereState extends WorldEditState {
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

    addStateSettings(menu: ModalFormData) {

    }
}

export class HollowSphereState extends SphereState {
    constructor(player: Player) {
        super(player);
        this.setSize(5);
        this.setBlockMix(new BlockMix({ blockType: MinecraftBlockTypes.stone, weight: 1 }));
    }

    toString(): String {
        return "Hollow Sphere";
    }

    rightClickAction(block: Block) {
        generateHollowSphere(this.player.dimension, block.location, this.size, this.blockMix);
    }
}

export class FillState extends WorldEditState {
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

    addStateSettings(menu: ModalFormData) {
        menu.toggle("adafasfcagv");
    }
}

export class WorldEditSettings {
    state: WorldEditState;
    maxDistance: number;

    constructor(state: WorldEditState, maxDistance: number = null) {
        this.setState(state);
        this.setMaxDistance(maxDistance);
    }

    setState(state: WorldEditState) {
        this.state = state;
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
        playerWorldEditSettings[player.id] = new WorldEditSettings(new FillState(player));
    }

    return playerWorldEditSettings[player.id];
}

export function getPlayerWorldEditState(player: Player): WorldEditState {
    return getPlayerWorldEditSettings(player).state;
}

export function setPlayerWorldEditSettings(player: Player, settings: WorldEditSettings) {
    playerWorldEditSettings[player.id] = settings;
}

export function setPlayerWorldEditState(player: Player, state: WorldEditState) {
    getPlayerWorldEditSettings(player).setState(state);
}