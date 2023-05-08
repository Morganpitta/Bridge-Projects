import { system, world, Vector, EntityHealthComponent, EntityDamageCause } from '@minecraft/server';


export function noLoner1() {
    const players = world.getAllPlayers();

    for (let index = 0; index < players.length; index++) {
        var hasNeighbor = false;
        for (let index2 = 0; index2 < players.length; index2++) {
            if (index == index2) continue;
            if ((players[index].getComponent("minecraft:health") as EntityHealthComponent).value != 0 &&
                (players[index2].getComponent("minecraft:health") as EntityHealthComponent).value != 0 &&
                players[index].dimension.id == players[index2].dimension.id &&
                Vector.distance(players[index].location, players[index2].location) < 15) {
                hasNeighbor = true;
                break;
            }
        }
        if (!hasNeighbor) {
            players[index].applyDamage(1, { cause: EntityDamageCause.void });
        }
    }
}

function areAllPlayersNearBy() {
    const players = world.getAllPlayers();

    let average = players[0].location;

    for (let index = 1; index < players.length; index++) {
        average.x += players[index].location.x;
        average.y += players[index].location.y;
        average.z += players[index].location.z;
    }

    average.x /= players.length;
    average.y /= players.length;
    average.z /= players.length;

    for (let index = 0; index < players.length; index++) {
        if ((players[index].getComponent("minecraft:health") as EntityHealthComponent).value != 0 &&
            Vector.distance(players[index].location, average) > 15 / 2) {
            return true;
        }
    }

    return false;
}

export function noLoner2() {
    if (areAllPlayersNearBy()) {
        const players = world.getAllPlayers();

        for (let index = 0; index < players.length; index++) {
            players[index].applyDamage(1, { cause: EntityDamageCause.void });
        }
    }
}