import { promises as fsp } from 'fs';
import { join, basename } from 'path';

const _mv = async (sourcePath: string, destinationPath: string): Promise<void> => {
    const destinationStat = await fsp.stat(destinationPath)
        .catch(() => fsp.rename(sourcePath, destinationPath));
    
    if (destinationStat && destinationStat.isDirectory()) {
        const sourceBasename = basename(sourcePath);
        const newDestinationPath = join(destinationPath, sourceBasename);

        return _mv(sourcePath, newDestinationPath);
    }
}

const _force = async (sourcePath: string, destinationPath: string): Promise<void> => {
    const destinationStat = await fsp.stat(destinationPath)
        .catch(() => fsp.rename(sourcePath, destinationPath));
    
    if (destinationStat && destinationStat.isDirectory()) {
        const sourceBasename = basename(sourcePath);
        const newDestinationPath = join(destinationPath, sourceBasename);

        return _force(sourcePath, newDestinationPath);
    } else if (destinationStat && destinationStat.isFile()) {
        return fsp.rename(sourcePath, destinationPath);
    } 
}

const mv = Object.assign(_mv, {
    f: _force
})

export default mv;