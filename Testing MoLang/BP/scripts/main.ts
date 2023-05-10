import { randomEntityOnBlockBroken } from "./randomEntityOnBlockBroken.js";
import { explode } from "./explode.js";
import { randomBlockOnEntityDeath } from "./randomBlockOnEntityDeath.js";
import { everyBlockYouLookAtRandomises } from "./everyBlockYouLookAtRandomises.js";
import { oneHit } from "./oneHit.js";
import { noLoner1, noLoner2 } from "./noLoner.js";
import { worldDecay } from "./worldDecay.js";
import "./shapes.js";
import "./blockInteractName.js"
import { world, system, EntityFrictionModifierComponent, EntityInventoryComponent, ItemStack, MinecraftItemTypes, MinecraftEffectTypes } from "@minecraft/server";
import "./antiTotem.js";


export var randomEntityOnBlockBrokenActive = false;
export var explodeActive = false;
export var randomBlockOnEntityDeathActive = false;
export var oneHitActive = false;
export var noLoner1Interval = null;
export var noLoner2Interval = null;
export var everyBlockYouLookAtRandomisesInterval = null;
export var worldDecayInterval = null;

world.events.itemCompleteCharge.subscribe((event) => {
    const item = event.itemStack;

    event.source.addEffect(MinecraftEffectTypes.regeneration, 3 * 20, 2, false);
});



system.runInterval(() => {
    const players = world.getAllPlayers();

    players.forEach((player) => {

        /*
        const inventory = player.getComponent("minecraft:inventory") as EntityInventoryComponent;
 
        inventory.container.setItem(0, new ItemStack(MinecraftItemTypes.stone, 64));
 
        if (player.location.y < -70) {
            player.teleportFacing(new Vector(67.5, -63, -247), player.dimension, new Vector(67.5, -63, -249));
            const entity = player as Entity;
 
            entity.dimension.fillBlocks(new Vector(66, -64, -255), new Vector(68, -60, -252), MinecraftBlockTypes.air);
            entity.dimension.fillBlocks(new Vector(66, -63, -300), new Vector(68, -60, -240), MinecraftBlockTypes.air);
        }
        const location = player.location;
 
        location.y -= 1;
        */

        //world.sendMessage(player.dimension.getBlock(location).typeId);
    });
});



world.events.beforeChat.subscribe((event) => {
    if (event.sender.isOp()) {
        let message = event.message;

        if (message == "!list") {
            event.sender.sendMessage("randomEntityOnBlockBroken (1) \nexplode (2) \nrandomBlockOnEntityDeath (3) \noneHit (4) \nnoLoner1 (5) \nnoLoner2 (6) \neveryBlockYouLookAtRandomises (7) \nworldDecay (8)");
            event.cancel = true;
        }

        if (message == "!shard") {
            let player = event.sender;

            const inventory = player.getComponent("minecraft:inventory") as EntityInventoryComponent;

            const shard = new ItemStack(MinecraftItemTypes.amethystShard, 1);

            shard.nameTag = "Shard";

            shard.keepOnDeath = true;

            inventory.container.addItem(shard);
        }

        if (message.startsWith("!toggle ")) {
            message = message.slice(8);

            switch (message) {
                case "1":
                case "randomEntityOnBlockBroken":
                    if (randomEntityOnBlockBrokenActive) {
                        world.events.blockBreak.unsubscribe(randomEntityOnBlockBroken);
                        randomEntityOnBlockBrokenActive = false;
                        event.sender.sendMessage("randomEntityOnBlockBroken De-activated");
                    }
                    else {
                        world.events.blockBreak.subscribe(randomEntityOnBlockBroken);
                        randomEntityOnBlockBrokenActive = true;
                        event.sender.sendMessage("randomEntityOnBlockBroken Activated");
                    }
                    event.cancel = true;

                    break;

                case "2":
                case "explode":
                    if (explodeActive) {
                        world.events.chat.unsubscribe(explode);
                        explodeActive = false;
                        event.sender.sendMessage("explode De-activated");
                    }
                    else {
                        world.events.chat.subscribe(explode);
                        explodeActive = true;
                        event.sender.sendMessage("explode Activated");
                    }
                    event.cancel = true;

                    break;

                case "3":
                case "randomBlockOnEntityDeath":
                    if (randomBlockOnEntityDeathActive) {
                        world.events.entityDie.unsubscribe(randomBlockOnEntityDeath);
                        randomBlockOnEntityDeathActive = false;
                        event.sender.sendMessage("randomBlockOnEntityDeath De-activated");
                    }
                    else {
                        world.events.entityDie.subscribe(randomBlockOnEntityDeath);
                        randomBlockOnEntityDeathActive = true;
                        event.sender.sendMessage("randomBlockOnEntityDeath Activated");
                    }
                    event.cancel = true;

                    break;

                case "4":
                case "oneHit":
                    if (oneHitActive) {
                        world.events.entityHurt.unsubscribe(oneHit);
                        oneHitActive = false;
                        event.sender.sendMessage("oneHit De-activated");
                    }
                    else {
                        world.events.entityHurt.subscribe(oneHit, { entityTypes: ["minecraft:player"] });
                        oneHitActive = true;
                        event.sender.sendMessage("oneHit Activated");
                    }
                    event.cancel = true;

                    break;

                case "5":
                case "noLoner1":
                    if (noLoner1Interval) {
                        system.clearRun(noLoner1Interval);
                        noLoner1Interval = null;
                        event.sender.sendMessage("noLoner1 De-activated");
                    }
                    else {
                        noLoner1Interval = system.runInterval(noLoner1);
                        event.sender.sendMessage("noLoner1 Activated");
                    }
                    event.cancel = true;

                    break;

                case "6":
                case "noLoner2":
                    if (noLoner2Interval) {
                        system.clearRun(noLoner2Interval);
                        noLoner2Interval = null;
                        event.sender.sendMessage("noLoner2 De-activated");
                    }
                    else {
                        noLoner2Interval = system.runInterval(noLoner2);
                        event.sender.sendMessage("noLoner2 Activated");
                    }
                    event.cancel = true;

                    break;

                case "7":
                case "everyBlockYouLookAtRandomises":
                    if (everyBlockYouLookAtRandomisesInterval) {
                        system.clearRun(everyBlockYouLookAtRandomisesInterval);
                        everyBlockYouLookAtRandomisesInterval = null;
                        event.sender.sendMessage("everyBlockYouLookAtRandomises De-activated");
                    }
                    else {
                        everyBlockYouLookAtRandomisesInterval = system.runInterval(everyBlockYouLookAtRandomises);
                        event.sender.sendMessage("everyBlockYouLookAtRandomises Activated");
                    }
                    event.cancel = true;

                    break;

                case "8":
                case "worldDecay":
                    if (worldDecayInterval) {
                        system.clearRun(worldDecayInterval);
                        worldDecayInterval = null;
                        event.sender.sendMessage("worldDecay De-activated");
                    }
                    else {
                        worldDecayInterval = system.runInterval(worldDecay, 5);
                        event.sender.sendMessage("worldDecay Activated");
                    }
                    event.cancel = true;

                    break;

                case "9":
                case "slippy":
                    const players = world.getAllPlayers();
                    players.forEach((player) => {
                        const friction = player.getComponent("minecraft:friction_modifier") as EntityFrictionModifierComponent;
                        if (friction == null) {
                            console.warn("heasfadwd");
                        }
                        friction.value = 0;
                    });
                    event.cancel = true;

                    break;


            }
        }
    }

});