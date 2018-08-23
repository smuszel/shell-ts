import { zipWith } from '../tools';
import * as fs from 'fs';
import * as path from 'path';

const fsp = fs.promises;

interface FileSystemEntry {
    absolutePath: string;
    isDirectory: boolean;
    isFile: boolean;

    dev: number;
    ino: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    size: number;
    blksize: number;
    blocks: number;
    atimeMs: number;
    mtimeMs: number;
    ctimeMs: number;
    birthtimeMs: number;
    atime: Date;
    mtime: Date;
    ctime: Date;
    birthtime: Date;
}

const endpoint = async dirname => {
    const names = await fsp.readdir(dirname);
    const absolutePaths = names.map(ent => path.resolve(dirname, ent));
    const stats = await Promise.all(absolutePaths.map(ent => fsp.stat(ent)));
    const create = (s, ent) => ({
        ...s,
        absolutePath: ent,
        isFile: s.isFile(),
        isDirectory: s.isDirectory(),
    });

    const fsEntries = zipWith(stats, absolutePaths, create);

    return fsEntries as FileSystemEntry[];
};

const fullReaddir_segregate = async dirname => {
    const fsEntries = await endpoint(dirname);
    const directories = fsEntries.filter(ent => ent.isDirectory);
    const files = fsEntries.filter(ent => ent.isFile);
    
    return [directories, files]
}

const fullReaddir_segregate_getNames = async dirname => {
    const [directories, files] = await fullReaddir_segregate(dirname);
    const directoriesNames = directories.map(ent => ent.absolutePath);
    const filesNames = files.map(ent => ent.absolutePath);

    return [directoriesNames, filesNames];
}

const level2 = { getNames: fullReaddir_segregate_getNames };
const level1 = Object.assign(fullReaddir_segregate, level2);
const fullReaddir = Object.assign(endpoint, { segregate: level1 });

export default fullReaddir;