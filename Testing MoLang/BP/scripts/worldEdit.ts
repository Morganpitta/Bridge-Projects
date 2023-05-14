import { world, MinecraftItemTypes, MinecraftBlockTypes, Player, ItemStack, Vector, Block, MinecraftEnchantmentTypes, Enchantment } from "@minecraft/server"
import { generateSphere, generateHollowSphere, circle, BlockMix, fill, clearActiveSphereHandlers } from "./shapes.js";
import { openSettingsMenu } from "./worldEditSettingsMenu.js";

const AxeName = "World Edit Axe";
const AxeLore = "Right click to interact";

const DiamondName = "World Edit Settings";
const DiamondLore = "Right click to open settings";

class WorldEditState {
    player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    rightClickAction(block: Block) {

    }
}

class WorldEditSettings {
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

class SphereState extends WorldEditState {
    size: number;
    blockMix: BlockMix;

    constructor(player: Player) {
        super(player);
        this.setSize(5);
        this.setBlockMix(new BlockMix({ blockType: MinecraftBlockTypes.stone, weight: 1 }));
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
}

class FillState extends WorldEditState {
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


var playerWorldEditSettings: { [id: string]: WorldEditSettings } = {};
function getPlayerWorldEditSettings(player: Player): WorldEditSettings {
    if (playerWorldEditSettings[player.id] == undefined) {
        playerWorldEditSettings[player.id] = new WorldEditSettings(new FillState(player));
    }

    return playerWorldEditSettings[player.id];
}

function getPlayerWorldEditState(player: Player): WorldEditState {
    return getPlayerWorldEditSettings(player).state;
}

function setPlayerWorldEditSettings(player: Player, settings: WorldEditSettings) {
    playerWorldEditSettings[player.id] = settings;
}

function setPlayerWorldEditState(player: Player, state: WorldEditState) {
    getPlayerWorldEditSettings(player).setState(state);
}


var size = 4;
world.events.itemUse.subscribe((event) => {
    const item = event.item;
    const player = event.source;

    if (player instanceof Player &&
        player?.isOp()
    ) {
        const settings = getPlayerWorldEditSettings(player);

        if (
            item.type == MinecraftItemTypes.woodenAxe &&
            item.nameTag == AxeName &&
            item.getLore()[0] == AxeLore
        ) {
            const block = player.getBlockFromViewDirection({ maxDistance: settings.maxDistance });

            if (block != null)
                getPlayerWorldEditSettings(player).state.rightClickAction(block);
        }
        else if (
            item.type == MinecraftItemTypes.diamond &&
            item.nameTag == DiamondName &&
            item.getLore()[0] == DiamondLore
        ) {
            openSettingsMenu
        }
    }
});

world.events.beforeChat.subscribe((event) => {
    const player = event.sender;

    if (player.isOp()) {
        let message = event.message.toLowerCase();

        if (message == "!worldedit") {
            const axe = new ItemStack(MinecraftItemTypes.woodenAxe);
            axe.nameTag = AxeName;
            axe.setLore([AxeLore]);
            axe.keepOnDeath = true;
            const diamond = new ItemStack(MinecraftItemTypes.diamond);
            diamond.getComponent("minecraft:enchantments").enchantments.addEnchantment(new Enchantment(MinecraftEnchantmentTypes.knockback, 2));
            diamond.nameTag = DiamondName;
            diamond.setLore([DiamondLore]);
            diamond.keepOnDeath = true;
            player.getComponent("minecraft:inventory").container.addItem(axe);
            player.getComponent("minecraft:inventory").container.addItem(diamond);
            event.cancel = true;
        }

        if (message.startsWith("!setmaxdistance")) {
            message = message.slice(15);
            getPlayerWorldEditSettings(player).setMaxDistance(parseInt(message));

            event.cancel = true;
        }

        if (message == "!stop") {
            clearActiveSphereHandlers()
            event.cancel = true;
        }

        if (message == "!sphere") {
            setPlayerWorldEditState(player, new SphereState(player));
            event.cancel = true;
        }

        if (message.startsWith("!spheresize")) {
            message = message.slice(11);
            let state = getPlayerWorldEditState(player);

            if (!(state instanceof SphereState)) {
                setPlayerWorldEditState(player, new SphereState(player));
            }

            event.cancel = true;
        }

        if (message.startsWith("!fill")) {
            message = message.slice(11);
            let state = getPlayerWorldEditState(player);

            if (!(state instanceof FillState)) {
                setPlayerWorldEditState(player, new FillState(player));
            }
            else {
                state.fill();
            }

            event.cancel = true;
        }
    }
});