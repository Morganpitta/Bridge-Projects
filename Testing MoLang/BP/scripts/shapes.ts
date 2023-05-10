import { system, world, Dimension, Vector, BlockType, MinecraftItemTypes, MinecraftBlockTypes } from "@minecraft/server"

export function circle(dimension: Dimension, center: Vector, radius: number, blockType: BlockType) {
    for (let x = -radius; x <= radius; x++) {
        let zOffset = Math.sqrt(radius * radius - x * x);
        dimension.fillBlocks(
            new Vector(
                Math.floor(center.x + x),
                Math.floor(center.y),
                Math.floor(center.z - zOffset)
            ),
            new Vector(
                Math.floor(center.x + x),
                Math.floor(center.y),
                Math.ceil(center.z + zOffset)
            ),
            blockType
        );
        //dimension.runCommand(`fill ${Math.floor(x)} ${Math.floor(center.y)} ${Math.floor(center.z - zOffset)} ${Math.floor(x)} ${Math.floor(center.y)} ${Math.floor(center.z + zOffset)} ${blockType.id}`);
    }
}


var activeSphereHandlers = [];
class SphereHandler {
    constructor(dimension: Dimension, center: Vector, radius: number, blockType: BlockType) {
        this.dimension = dimension;
        this.center = center;
        this.radiusCeiled = Math.ceil(radius);
        this.radiusSquared = radius * radius;
        this.blockType = blockType;
        this.fillPosition = new Vector(0, 0, 0);
    }

    iterateFillPosition() {
        this.fillPosition.x++;
        if (this.fillPosition.x > this.radiusCeiled) {
            this.fillPosition.x = 0;
            this.fillPosition.y++;
        }
        if (this.fillPosition.y > this.radiusCeiled) {
            this.fillPosition.y = 0;
            this.fillPosition.z++;
        }
        if (this.fillPosition.z > this.radiusCeiled) {
            this.fillPosition.z = 0;
            return false;
        }
        return true;
    }

    fillNextBlock() {
        while (this.fillPosition.lengthSquared() > this.radiusSquared) {
            if (!this.iterateFillPosition()) {
                return false;
            }
        }


        let block = this.dimension.getBlock(Vector.add(this.center, { x: this.fillPosition.x, y: this.fillPosition.y, z: this.fillPosition.z }));
        if (block != null) block.setType(this.blockType);


        block = this.dimension.getBlock(Vector.add(this.center, { x: -this.fillPosition.x, y: this.fillPosition.y, z: this.fillPosition.z }));
        if (block != null) block.setType(this.blockType);


        block = this.dimension.getBlock(Vector.add(this.center, { x: this.fillPosition.x, y: -this.fillPosition.y, z: this.fillPosition.z }));
        if (block != null) block.setType(this.blockType);


        block = this.dimension.getBlock(Vector.add(this.center, { x: -this.fillPosition.x, y: -this.fillPosition.y, z: this.fillPosition.z }));
        if (block != null) block.setType(this.blockType);


        block = this.dimension.getBlock(Vector.add(this.center, { x: this.fillPosition.x, y: this.fillPosition.y, z: -this.fillPosition.z }));
        if (block != null) block.setType(this.blockType);


        block = this.dimension.getBlock(Vector.add(this.center, { x: -this.fillPosition.x, y: this.fillPosition.y, z: -this.fillPosition.z }));
        if (block != null) block.setType(this.blockType);


        block = this.dimension.getBlock(Vector.add(this.center, { x: this.fillPosition.x, y: -this.fillPosition.y, z: -this.fillPosition.z }));
        if (block != null) block.setType(this.blockType);


        block = this.dimension.getBlock(Vector.add(this.center, { x: -this.fillPosition.x, y: -this.fillPosition.y, z: -this.fillPosition.z }));
        if (block != null) block.setType(this.blockType);

        if (!this.iterateFillPosition()) {
            return false;
        }

        return true;
    }
};

export function generateSphere(dimension: Dimension, center: Vector, radius: number, blockType: BlockType) {
    radius -= 0.5;

    activeSphereHandlers.push(new SphereHandler(dimension, center, radius, blockType));
}

var size = 4;
world.events.itemUse.subscribe((event) => {
    const item = event.item;
    const player = event.source;
    const block = player.getBlockFromViewDirection({ maxDistance: 400 });

    if (item.type == MinecraftItemTypes.woodenAxe) {
        generateSphere(player.dimension, block.location, size, MinecraftBlockTypes.bedrock);
    }
});

system.runInterval(() => {
    for (let index = 0; index < activeSphereHandlers.length; index++) {
        let done = false;
        do {
            if (!activeSphereHandlers[index].fillNextBlock()) {
                activeSphereHandlers.splice(index--, 1);
                done = true;
            }
        } while (!done && activeSphereHandlers[index].fillPosition.x > 1);
    }
});

world.events.beforeChat.subscribe((event) => {
    if (event.sender.isOp()) {
        let message = event.message;

        if (message == "!stop") {
            activeSphereHandlers = [];
            event.cancel = true;
        }

        if (message.startsWith("!size")) {
            size = parseInt(message.slice(5));
            event.cancel = true;
        }
    }
});