import { system, world, Vector } from '@minecraft/server';


function multiply(vector: Vector, variable: number) {
    return new Vector(vector.x * variable, vector.y * variable, vector.z * variable);
}

function add(vector1: Vector, vector2: Vector) {
    return new Vector(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
}

function rotateX(vector: Vector, angle: number) {
    return new Vector(vector.x + angle, vector.y, vector.z);
}

function shoot(entityType: string, shooter: Entity, angle: number) {
    let offset = multiply(shooter.getViewDirection(), 1 + Vector.distance(new Vector(0, 0, 0), shooter.getVelocity()));
    offset.y += 1.7;
    let entity = shooter.dimension.spawnEntity(entityType, add(shooter.location, offset));
    let velocity = multiply(shooter.getViewDirection(), 4);
    velocity = rotateX(velocity, angle);
    world.sendMessage(velocity.x + " " + velocity.y + " " + velocity.z);
    entity.applyImpulse(velocity);
    entity.setRotation(-shooter.getRotation().x, -shooter.getRotation().y);
}


world.events.itemUse.subscribe((event) => {
    if (event.item.typeId == "morgan:gun") {
        shoot("minecraft:arrow", event.source, 10);
    }
});
