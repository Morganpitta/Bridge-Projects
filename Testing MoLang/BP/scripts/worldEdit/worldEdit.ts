import { world, MinecraftItemTypes, MinecraftBlockTypes, Player, ItemStack, Vector, Block, MinecraftEnchantmentTypes, Enchantment } from "@minecraft/server"
import { generateSphere, generateHollowSphere, circle, BlockMix, fill, clearActiveSphereHandlers } from "./shapes.js";
import { WorldEditMode, WorldEditSettings, SphereMode, FillMode, HollowSphereMode, getPlayerWorldEditSettings, getPlayerWorldEditMode, setPlayerWorldEditSettings, setPlayerWorldEditMode } from "./worldEditSettings.js"
import { openSettingsMenu } from "./worldEditSettingsMenu.js";

const AxeName = "World Edit Axe";
const AxeLore = "Right click to interact";

const DiamondName = "World Edit Settings";
const DiamondLore = "Right click to open settings";

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
                getPlayerWorldEditSettings(player).mode.rightClickAction(block);
        }
        else if (
            item.type == MinecraftItemTypes.diamond &&
            item.nameTag == DiamondName &&
            item.getLore()[0] == DiamondLore
        ) {
            openSettingsMenu(player);
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
            setPlayerWorldEditMode(player, new SphereMode(player));
            event.cancel = true;
        }

        if (message.startsWith("!spheresize")) {
            message = message.slice(11);
            let mode = getPlayerWorldEditMode(player);

            if (!(mode instanceof SphereMode || mode instanceof HollowSphereMode)) {
                setPlayerWorldEditMode(player, new SphereMode(player));
            }

            getPlayerWorldEditMode(player).setSize(parseInt(message));

            event.cancel = true;
        }

        if (message.startsWith("!fill")) {
            message = message.slice(11);
            let mode = getPlayerWorldEditMode(player);

            if (!(mode instanceof FillMode)) {
                setPlayerWorldEditMode(player, new FillMode(player));
            }
            else {
                mode.fill();
            }

            event.cancel = true;
        }
    }
});