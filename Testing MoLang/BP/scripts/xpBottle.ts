import { world, ItemStack, MinecraftItemTypes } from "@minecraft/server"

world.events.itemUse.subscribe((event) => {
    let item = event.item;
    const player = event.source;
    const block = player.getBlockFromViewDirection({ maxDistance: 400 });

    if (item != null && item.typeId == "minecraft:glass_bottle" && (player.level > 0 || player.xpEarnedAtCurrentLevel > 7)) {
        if (item.amount == 1) item = null;
        else {
            item.amount--;
        }

        player.getComponent("minecraft:inventory").container.addItem(new ItemStack(MinecraftItemTypes.experienceBottle));
        if (player.xpEarnedAtCurrentLevel < 9) {
            player.addLevels(-1);
            player.addExperience(player.totalXpNeededForNextLevel - (9 - player.xpEarnedAtCurrentLevel));
        }
        else player.addExperience(-9);

        player.getComponent("minecraft:equipment_inventory").setEquipment("mainhand", item);

        player.runCommand("playsound random.levelup @a ~ ~ ~");
        player.runCommand("playsound random.potion.brewed @a ~ ~ ~");
    }
});
