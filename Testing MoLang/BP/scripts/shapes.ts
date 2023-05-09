import { Dimension, Vector, BlockType } from "@minecraft/server"

export function sphereSlice(dimension: Dimension, center: Vector, radius: number, blockType: BlockType) {
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

export function sphere(dimension: Dimension, center: Vector, radius: number, blockType: BlockType) {
    for (let y = -radius; y <= radius; y++) {
        let sliceRadius = Math.sqrt(radius * radius - y * y);
        sphereSlice(dimension, new Vector(center.x, center.y + y, center.z), sliceRadius, blockType);
    }
}