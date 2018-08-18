import { zipWith } from './tools';
import { promises as fs } from 'fs';
import * as path from 'path';

export const fullReaddir = async dirname => {
    const names = await fs.readdir(dirname);
    const absolutePaths = names.map(ent => path.resolve(dirname, ent));
    const stats = await Promise.all(absolutePaths.map(ent => fs.stat(ent)));
    const create = (s, ent) => ({
        ...s,
        absolutePath: ent,
        isFile: s.isFile(),
        isDirectory: s.isDirectory()
    });
    const fsEntries = zipWith(stats, absolutePaths, create);
    return fsEntries as FileSystemEntry[];
}