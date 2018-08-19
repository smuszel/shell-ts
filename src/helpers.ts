import { zipWith } from './tools';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const fsp = fs.promises;

export const fullReaddir = async dirname => {
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

export const isDirectory = dirname => {
    return fsp.stat(dirname).then(r => r.isDirectory());
};

export const exists = dirname => {
    return promisify(fs.exists)(dirname);
};

export const existsAsDirectory = async dirname => {
    const present = await exists(dirname);

    if (present) {
        return isDirectory(dirname);
    } else {
        return false;
    }
};
