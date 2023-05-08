import { world } from '@minecraft/server';

export function explode(event) {
    if (event.message == "explode" || event.message == "hi") {
        event.sender.dimension.createExplosion(event.sender.location, 10, { breaksBlocks: true, allowUnderwater: true });
    }
}