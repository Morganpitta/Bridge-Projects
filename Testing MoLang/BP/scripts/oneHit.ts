import { world, Entity, Player, EntityEquipmentInventoryComponent, EquipmentSlot, ItemStack, ItemDurabilityComponent, EntityEventOptions } from '@minecraft/server';

function damageArmor(reference: { entity: Entity }, equipmentSlot: EquipmentSlot) {
    const equipment = reference.entity.getComponent("minecraft:equipment_inventory") as EntityEquipmentInventoryComponent;
    let armor = equipment.getEquipment(equipmentSlot) as ItemStack;
    if (armor != null && armor.hasComponent("minecraft:durability")) {
        const durability = armor.getComponent("minecraft:durability") as ItemDurabilityComponent;
        if (durability.damage + 25 > durability.maxDurability) {
            armor = null;
        }
        else {
            durability.damage = durability.damage + 25;
        }
        equipment.setEquipment(equipmentSlot, armor);
        return true;
    }
    return false;
}

export function oneHit(event) {
    let entity = event.hurtEntity as Player;
    const damage = event.damageSource;

    if (damage.cause != "void") {
        if (damageArmor({ entity }, EquipmentSlot.feet)) return;
        else if (damageArmor({ entity }, EquipmentSlot.head)) return;
        else if (damageArmor({ entity }, EquipmentSlot.legs)) return;
        else if (damageArmor({ entity }, EquipmentSlot.chest)) return;
        //world.sendMessage(damage.cause);
        //world.sendMessage("Owchies");
        entity.runCommand("kill");
    }
};