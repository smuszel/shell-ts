import { promises as fsp } from 'fs';
import { exists } from '../helpers';
import { join, basename } from 'path';

class Mv {

    get f() {
        return new MvForce();
    }

    async shx(source, destination): Promise<void> {
        const destinationExists = await exists(destination);
        
        if (destinationExists) {
            const destinationStat = await fsp.stat(destination);
            if (destinationStat.isFile()) {
                throw new Error('override attempt');
            } else {
                const sourceBasename = basename(source);
                const newDest = join(destination, sourceBasename);
                
                return this.shx(source, newDest);
            }
        } else {
            return fsp.rename(source, destination);
        }
    }
}

class MvForce {
    async shx(source, destination): Promise<void> {
        const destinationExists = await exists(destination);

        if (destinationExists) {
            const destinationStat = await fsp.stat(destination);
            if (destinationStat.isDirectory()) {
                const sourceBasename = basename(source);
                const newDest = join(destination, sourceBasename);

                return this.shx(source, newDest);
            }
        }
        
        return fsp.rename(source, destination);
    }
}

export default new Mv();