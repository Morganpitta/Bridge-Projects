import { world, system, Vector, MinecraftBlockTypes, Block } from "@minecraft/server";

export function worldDecay() {
    const players = world.getAllPlayers();

    const player = players[Math.floor(Math.random() * players.length)];

    const center = player.location;

    const block = new Vector(
        Math.floor(Math.random() * 16 + center.x - 8),
        0,
        Math.floor(Math.random() * 16 + center.z - 8)
    );

    player.dimension.runCommand("/fill " + block.x + " -64 " + block.z + " " + block.x + " 319 " + block.z + " air");
}

/*
var chosenLocation = new Vector(0, - 65, 0);
var chosenDimension = null;

system.runInterval((event) => {
while (chosenLocation.y >= -64 && chosenDimension != null) {
    console.warn(chosenLocation.x + ", " + chosenLocation.y + ", " + chosenLocation.z);
    const block = chosenDimension.getBlock(chosenLocation) as Block;
    chosenLocation.y -= 1;

    if (block.typeId == "minecraft:air") continue;
    block.setType(MinecraftBlockTypes.get("minecraft:air"));
    return;
}

const players = world.getAllPlayers();

const player = players[Math.floor(Math.random() * players.length)];

const center = player.location;

chosenLocation = new Vector(
    Math.floor(Math.random() * 16 + center.x - 8),
    319,
    Math.floor(Math.random() * 16 + center.z - 8)
);

chosenDimension = player.dimension;
});
*/