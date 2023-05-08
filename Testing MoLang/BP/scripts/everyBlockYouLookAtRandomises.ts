	
import { randomBlock } from "./randomBlock.js";
import { nonFullBlocks } from "./blockList.js";
import { system, world, Block } from '@minecraft/server';

let previousPlayerBlockPosition = {};

export const currentInvalidBlocks = [

];

export function everyBlockYouLookAtRandomises(event) {
    const players = world.getAllPlayers();
    players.forEach((player) => {
        const block = player.getBlockFromViewDirection();

        if (block == null) return;

        if (!(player.id in previousPlayerBlockPosition)) {
            previousPlayerBlockPosition[player.id] = block.location;
            return;
        }

        const previousBlock = world.getDimension(player.dimension.id).getBlock(previousPlayerBlockPosition[player.id])

        if (previousBlock == null) {
            previousPlayerBlockPosition[player.id] = block.location;
            return;
        }

        if (!(previousBlock.location.x == block.location.x && previousBlock.location.y == block.location.y && previousBlock.location.z == block.location.z)) {
            const blockType = randomBlock();
            if (previousBlock.type.id != "minecraft:air" && previousBlock.type.id != "minecraft:obsidian" && previousBlock.type.id != "minecraft:end_portal_frame" && previousBlock.type.id != "minecraft:end_portal" && previousBlock.type.id != "minecraft:portal")
                previousBlock.setType(blockType);
            previousPlayerBlockPosition[player.id] = block.location;
        }
    });
}

world.events.itemUseOn.subscribe((event) => {
    const item = event.item;
    const player = event.source;
    const block = player.dimension.getBlock(event.getBlockLocation());

    if (item.nameTag == "Shard" && !currentInvalidBlocks.includes(block.typeId) && !nonFullBlocks.includes(block.typeId)) {
        world.sendMessage(block.typeId);
        currentInvalidBlocks.push(block.typeId);
    }
});

world.events.beforeChat.subscribe((event) => {
    if (event.message == "!log") {
        let log = "[\n";
        currentInvalidBlocks.forEach((block) => {
            log += '    "' + block + '",\n';
        });
        console.warn(log + "]");
    }

    if (event.message == "!cl") {
        world.sendMessage(currentInvalidBlocks[currentInvalidBlocks.length - 1]);
        currentInvalidBlocks.pop();
    }
});