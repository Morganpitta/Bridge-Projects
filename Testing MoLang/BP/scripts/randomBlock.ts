import { MinecraftBlockTypes } from '@minecraft/server';
import { nonFullBlocks } from "./blockList.js";

const allowInvalidBlocks = false;

export var blocks = MinecraftBlockTypes.getAllBlockTypes();

if (!allowInvalidBlocks) {
    blocks = blocks.filter((filter) => {
        if (filter.id.startsWith("minecraft:element") ||
            (filter.id.startsWith("minecraft:hard") && filter.id.includes("glass")) ||
            filter.id.startsWith("minecraft:colored_torch") ||
            filter.id == "minecraft:reserved6" ||
            filter.id.startsWith("minecraft:info_update") ||
            filter.id.startsWith("minecraft:chemical_heat") ||
            filter.id.startsWith("minecraft:chalkboard") ||
            filter.id.startsWith("minecraft:board") ||
            filter.id.startsWith("minecraft:chemistry_table") ||
            filter.id.startsWith("minecraft:underwater_torch") ||
            filter.id.includes("cherry") ||
            (filter.id.includes("bamboo") && !(filter.id == "minecraft:bamboo" || filter.id == "minecraft:bamboo_sapling")) ||
            filter.id.includes("sign") ||
            filter.id.includes("stairs") ||
            filter.id.includes("slab") ||
            filter.id.includes("door") ||
            (filter.id.includes("coral") && !filter.id.includes("block")) ||
            filter.id.includes("fence") ||
            filter.id.includes("wall") ||
            filter.id.includes("candle") ||
            filter.id.includes("button") ||
            filter.id.includes("pressure_plate")) return false;
        return true;
    });

    blocks = blocks.filter(block => !nonFullBlocks.includes(block.id));
}

export function randomBlock() {
    const random = Math.floor(Math.random() * blocks.length);

    return blocks[random];
}
