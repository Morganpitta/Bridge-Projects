import { world } from "@minecraft/server";

function getBlockTranslatable(block) {
    const blockModId = block.typeId.split(":")[0];
    const blockId = block.typeId.split(":")[1];
    const text = `tile.${blockModId == "minecraft" ? "" : blockModId + "."}${blockId}.name`;
    return {
        rawtext: [
            { translate: text }
        ]
    }
}

world.events.itemUseOn.subscribe((event) => {
    const item = event.item;
    const player = event.source;
    const block = player.dimension.getBlock(event.getBlockLocation());

    if (item.type == null) {
        player.runCommand(`titleraw @s actionbar ${JSON.stringify(getBlockTranslatable(block))}`);
        //player.onScreenDisplay.setActionBar(JSON.stringify(getBlockTranslatable(block)));
    }
});
