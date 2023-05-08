import { randomBlock } from "./randomBlock.js";

export function randomBlockOnEntityDeath(event) {
    const entity = event.deadEntity;

    const blockType = randomBlock();
    entity.dimension.getBlock(entity.location).setType(blockType);
}