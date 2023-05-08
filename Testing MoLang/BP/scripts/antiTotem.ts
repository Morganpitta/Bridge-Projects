import { world, system, Player, EntityDamageCause, EquipmentSlot, ItemStack, MinecraftItemTypes } from "@minecraft/server";

var timeSinceTotemPop = {};
const minTotemTickThreshold = 5;
var susPlayers = [];

world.events.entityHurt.subscribe((event) => {
    const player = event.hurtEntity as Player;

    if (event.damageSource.cause == EntityDamageCause.none && event.damage < 0) {
        timeSinceTotemPop[player.name] = minTotemTickThreshold;
    }
}, { entityTypes: ["minecraft:player"] });

system.runInterval(() => {
    Object.keys(timeSinceTotemPop).forEach((name) => {
        let player = [...world.getPlayers()].find(player => player.name === name);

        const offHandItem = player.getComponent("minecraft:equipment_inventory").getEquipment(EquipmentSlot.offhand) as ItemStack;
        const hasTotemInOffHand = offHandItem != null && offHandItem.typeId == MinecraftItemTypes.totemOfUndying.id;

        if (hasTotemInOffHand) {
            console.warn(name + ": " + timeSinceTotemPop[name])
            susPlayers.push({ player: name, ticks: timeSinceTotemPop[name] });
            delete timeSinceTotemPop[name];
        }

        timeSinceTotemPop[name]--;
        if (timeSinceTotemPop[name] == 0)
            delete timeSinceTotemPop[name];
    });
});