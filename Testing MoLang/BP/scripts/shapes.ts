import { Dimension, Vector, BlockType } from "@minecraft/server"

export function sphereSlice(dimension: Dimension, center: Vector, radiusSquared: number, blockType: BlockType) {
    for (let x = center.x - radius; x < center.x + radius; x++) {
        let zOffset = Math.sqrt(radiusSquared - x * x);
        dimension.fillBlocks(new Vector(x, center.y, center.z - zOffset), new Vector(x, center.y, center.z + zOffset), blockType);
    }
}