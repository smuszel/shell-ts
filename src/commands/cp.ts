import { join } from 'path';
import { promises as fsp, constants } from 'fs';
import { zipWith } from '../tools';

const DONT_OVERWIRTE = constants.COPYFILE_EXCL;

const ensureDirectory = (path: string) =>
    fsp.mkdir(path).catch(() => undefined);

const _cp = (sourcePath: string, destinationPath: string) => 
    fsp.copyFile(sourcePath, destinationPath, DONT_OVERWIRTE);

const _force = (sourcePath: string, destinationPath: string) => 
    fsp.copyFile(sourcePath, destinationPath);

const _recursive = async (sourcePath: string, destinationPath: string) => {
    const helper = async (s, d) => {
        await ensureDirectory(d);
        const sourceContents = await fsp.readdir(s);
        const sourceContentPaths = sourceContents.map(n => join(s, n));
        const destinationPaths = sourceContents.map(n => join(d, n));

        const ps = zipWith(sourceContentPaths, destinationPaths, _recursive);
        await Promise.all(ps);
    }

    const sourceStat = await fsp.stat(sourcePath);
    
    if (sourceStat.isDirectory()) {
        return helper(sourcePath, destinationPath);
    } else {
        return _cp(sourcePath, destinationPath);
    }
};

const _recursiveForce = async (sourcePath: string, destinationPath: string) => {
    const helper = async (s, d) => {
        await ensureDirectory(d);
        const sourceContents = await fsp.readdir(s);
        const sourceContentPaths = sourceContents.map(n => join(s, n));
        const destinationPaths = sourceContents.map(n => join(d, n));
        const ps = zipWith(sourceContentPaths, destinationPaths, _recursiveForce);

        await Promise.all(ps);
    }

    const sourceStat = await fsp.stat(sourcePath);
    
    if (sourceStat.isDirectory()) {
        return helper(sourcePath, destinationPath);
    } else {
        return _force(sourcePath, destinationPath);
    }
};

const cp = Object.assign(_cp, {
    r: _recursive,
    f: _force,
    rf: _recursiveForce
});

export default cp;