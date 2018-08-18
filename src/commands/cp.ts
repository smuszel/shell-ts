import { flatten } from './../tools';
import { resolve, basename } from 'path';
import * as fs from 'fs';
import { exists, existsAsDirectory, isDirectory } from '../helpers';


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

//     const triesOverwriting = await exists(destination);

//     if(triesOverwriting) {
//         throw new Error('Overwite attempt');
//     } else {
//     const p = fs.promises.copyFile(source, destination);
//     return p;
// }
//     async shx(source, destination): Promise<void> {
//         const p = fs.promises.copyFile(source, destination);
//         return p;
//     }
}

class CpRecursiveForce {
    async shx(source, destination): Promise<any> {
        const sourceIsDirectory = await existsAsDirectory(source);
        
        if (sourceIsDirectory) {
            const destinationExists = await exists(destination);

            if (destinationExists) {
                const destinationIsDirectory = await isDirectory(destination);

                if (destinationIsDirectory) {
                    const subentries = await fs.promises.readdir(source);

                    const newDestinationPath = n => resolve(destination, n);
                    const newSourcePath = n => resolve(source, n);

                    const ps = subentries.map(n => this.shx(newSourcePath(n), newDestinationPath(n)));
                    const p = Promise.all(ps);
                    return p;
                } else {
                    // then destination must be a file
                    await fs.promises.unlink(destination);
                    // now destination has to be created
                    const makeDir = fs.promises.mkdir(destination);
                    const readDir = fs.promises.readdir(source);

                    const [_, subentries] = await Promise.all([makeDir, readDir]);

                    const newDestinationPath = n => resolve(destination, n);
                    const newSourcePath = n => resolve(source, n);

                    const ps = subentries.map(n => this.shx(newSourcePath(n), newDestinationPath(n)));
                    const p = Promise.all(ps);
                    return p;

                }
            } else {
                // then destination has to be created
                const makeDir = fs.promises.mkdir(destination);
                const readDir = fs.promises.readdir(source);

                const [_, subentries] = await Promise.all([makeDir, readDir]);

                const newDestinationPath = n => resolve(destination, n);
                const newSourcePath = n => resolve(source, n);

                const ps = subentries.map(n => this.shx(newSourcePath(n), newDestinationPath(n)));
                const p = Promise.all(ps);
                return p;
            }

        } else {
            const p = fs.promises.copyFile(source, destination);
            return p;
        }


        const p = fs.promises.copyFile(source, destination);
        return p;
    }
}

class CpRecursiveInteractive {
}

