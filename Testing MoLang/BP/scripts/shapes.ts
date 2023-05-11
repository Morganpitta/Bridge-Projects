import { system, world, Dimension, Vector, BlockType, MinecraftItemTypes, MinecraftBlockTypes } from "@minecraft/server"

export function circle(dimension: Dimension, center: Vector, radius: number, blockMix: BlockType) {
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
            blockMix
        );
        //dimension.runCommand(`fill ${Math.floor(x)} ${Math.floor(center.y)} ${Math.floor(center.z - zOffset)} ${Math.floor(x)} ${Math.floor(center.y)} ${Math.floor(center.z + zOffset)} ${blockMix.id}`);
    }
}

class BlockMix {
    constructor(...args: { blockType: BlockType, weight: undefined | number }[]) {
        let cumulative = 0;
        args.forEach((option) => {
            if (option.weight != undefined)
                cumulative += option.weight;
        });

        args.forEach((option) => {
            if (option.weight == undefined)
                option.weight = cumulative / args.length;
        });
        this.options = args;
    }

    getBlock(): BlockType {
        let random = Math.random();
        let cumulative = 0;
        for (let index = 0; index < this.options.length; index++) {
            cumulative += this.options[index].weight;
            if (cumulative > random) return this.options[index].blockType;
        }

        return null;
    }
}

var activeSphereHandlers = [];
class SphereHandler {
    constructor(dimension: Dimension, center: Vector, radius: number, blockMix: BlockMix) {
        this.dimension = dimension;
        this.center = center;
        this.radiusCeiled = Math.ceil(radius);
        this.radiusSquared = radius * radius;
        this.blockMix = blockMix;
        this.fillPosition = new Vector(0, 0, 0);
    }

    validFillPosition() {
        return this.fillPosition.lengthSquared() <= this.radiusSquared;
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
        while (!this.validFillPosition()) {
            if (!this.iterateFillPosition()) {
                return false;
            }
        }

        let blockPosition = Vector.add(this.center, { x: this.fillPosition.x, y: this.fillPosition.y, z: this.fillPosition.z });
        let blockType = this.blockMix.getBlock();
        if (blockPosition.y > - 64 && blockPosition.y < 320 && blockType != null) this.dimension.getBlock(blockPosition).setType(blockType);

        blockType = this.blockMix.getBlock();
        blockPosition = Vector.add(this.center, { x: -this.fillPosition.x, y: this.fillPosition.y, z: this.fillPosition.z });
        if (blockPosition.y > - 64 && blockPosition.y < 320 && blockType != null) this.dimension.getBlock(blockPosition).setType(blockType);

        blockType = this.blockMix.getBlock();
        blockPosition = Vector.add(this.center, { x: this.fillPosition.x, y: -this.fillPosition.y, z: this.fillPosition.z });
        if (blockPosition.y > - 64 && blockPosition.y < 320 && blockType != null) this.dimension.getBlock(blockPosition).setType(blockType);

        blockType = this.blockMix.getBlock();
        blockPosition = Vector.add(this.center, { x: -this.fillPosition.x, y: -this.fillPosition.y, z: this.fillPosition.z });
        if (blockPosition.y > -64 && blockPosition.y < 320 && blockType != null) this.dimension.getBlock(blockPosition).setType(blockType);

        blockType = this.blockMix.getBlock();
        blockPosition = Vector.add(this.center, { x: this.fillPosition.x, y: this.fillPosition.y, z: -this.fillPosition.z });
        if (blockPosition.y > - 64 && blockPosition.y < 320 && blockType != null) this.dimension.getBlock(blockPosition).setType(blockType);

        blockType = this.blockMix.getBlock();
        blockPosition = Vector.add(this.center, { x: -this.fillPosition.x, y: this.fillPosition.y, z: -this.fillPosition.z });
        if (blockPosition.y > - 64 && blockPosition.y < 320 && blockType != null) this.dimension.getBlock(blockPosition).setType(blockType);

        blockType = this.blockMix.getBlock();
        blockPosition = Vector.add(this.center, { x: this.fillPosition.x, y: -this.fillPosition.y, z: -this.fillPosition.z });
        if (blockPosition.y > - 64 && blockPosition.y < 320 && blockType != null) this.dimension.getBlock(blockPosition).setType(blockType);

        blockType = this.blockMix.getBlock();
        blockPosition = Vector.add(this.center, { x: -this.fillPosition.x, y: -this.fillPosition.y, z: -this.fillPosition.z });
        if (blockPosition.y > - 64 && blockPosition.y < 320 && blockType != null) this.dimension.getBlock(blockPosition).setType(blockType);

        if (!this.iterateFillPosition()) {
            return false;
        }

        return true;
    }
};

class HollowSphereHandler extends SphereHandler {
    constructor(dimension: Dimension, center: Vector, radius: number, hollowRadius: number, blockMix: BlockMix) {
        super(dimension, center, radius, blockMix);
        this.hollowRadiusSquared = hollowRadius * hollowRadius;
    }

    validFillPosition() {
        return super.validFillPosition() && this.fillPosition.lengthSquared() > this.hollowRadiusSquared;
    }
}

export function generateSphere(dimension: Dimension, center: Vector, radius: number, blockMix: BlockMix) {
    radius -= 0.5;

    activeSphereHandlers.push(new SphereHandler(dimension, center, radius, blockMix));
}

export function generateHollowSphere(dimension: Dimension, center: Vector, radius: number, blockMix: BlockMix) {
    radius -= 0.5;

    activeSphereHandlers.push(new HollowSphereHandler(dimension, center, radius, radius - 2, blockMix));
}

var size = 4;
world.events.itemUse.subscribe((event) => {
    const item = event.item;
    const player = event.source;
    const block = player.getBlockFromViewDirection({ maxDistance: 400 });

    if (item.type == MinecraftItemTypes.woodenAxe && player.isOp()) {
        generateHollowSphere(player.dimension, block.location, size, new BlockMix({ blockType: MinecraftBlockTypes.seaLantern, weight: 0.1 }));
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