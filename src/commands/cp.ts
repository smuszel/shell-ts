import { resolve } from 'path';
import * as fs from 'fs';
import { exists, isDirectory } from '../helpers';


export default class Cp {
    get f() {
        return new CpForce();
    }

    get r() {
        return new CpRecursive();
    }

    get rf() {
        return new CpRecursiveForce();
    }

    get ri() {
        return new CpRecursiveInteractive();
    }

    async shx(source, destination): Promise<void> {
        const triesOverwriting = await exists(destination);

        if (triesOverwriting) {
            throw new Error('Overwite attempt');
        } else {
            const p = fs.promises.copyFile(source, destination);
            return p;
        }
    }
}

class CpForce {
    async shx(source, destination): Promise<void> {
        const p = fs.promises.copyFile(source, destination);
        return p;
    }
}

class CpRecursive {
}

class CpRecursiveForce {

    private async justCopyFile(source, destination) {
        const p = fs.promises.copyFile(source, destination);
        return p;
    }

    private async copyAllSubentries(source, subentries, destination) {
        const newDestinationPath = n => resolve(destination, n);
        const newSourcePath = n => resolve(source, n);

        const ps = subentries.map(n => this._execute(newSourcePath(n), newDestinationPath(n)));
        const p = Promise.all(ps);

        return p;
    }

    private async readSourceDirectory(source) {
        return fs.promises.readdir(source);
    }

    private async ensureDestinationIsDirectory(destination) {
        const destinationIsPresent = await exists(destination);

        if (destinationIsPresent) {
            const destinationIsDirectory = await isDirectory(destination);

            if (destinationIsDirectory) {
                return;
            } else {
                await fs.promises.unlink(destination);
                return fs.promises.mkdir(destination);
            }

        } else {
            return fs.promises.mkdir(destination);
        }
    }

    private async recursiveCopyDirectory(source, destination) {
        const ens = this.ensureDestinationIsDirectory(destination);
        const rd = this.readSourceDirectory(source);

        const [_, subentries] = await Promise.all([ens, rd]);

        return this.copyAllSubentries(source, subentries, destination);
    }

    private async _execute(source, destination) {
        const sourceIsDirectory = await isDirectory(source);

        if (sourceIsDirectory) {
            return this.recursiveCopyDirectory(source, destination);
        } else {
            return this.justCopyFile(source, destination);
        }
    }

    async shx(source: string, destination: string): Promise<any> {
        const sourceDoesExist = await exists(source);

        if (sourceDoesExist) {
            return this._execute(source, destination)
        } else {
            console.log('source not found');
        }
    }
}

class CpRecursiveInteractive {
}