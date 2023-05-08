
import { entities } from "./entityList.js";
import { plantBlocks } from "./blockList.js";
import { world, Vector, EntityTypes, Block, MinecraftBlockTypes } from '@minecraft/server';

const allowBossMobs = false;

let spawnableEntities = entities.summonable;

if (!allowBossMobs) {
    spawnableEntities = entities.summonableWithoutBossMobs;
}

function randomEntity() {
    const random = Math.floor(Math.random() * spawnableEntities.length);

    return spawnableEntities[random];
}

export function randomEntityOnBlockBroken(event) {
    const block = event.block as Block;

    if (block.typeId in plantBlocks)
        return;

    const entityType = randomEntity();
    let entity = event.dimension.spawnEntity(entityType, block.location);
    entity.applyImpulse(new Vector(0, 0.2, 0));
}