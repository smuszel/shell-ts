import { zipWith } from '../tools';
import * as fs from 'fs';
import * as path from 'path';
import { Stats } from 'fs';

type FileSystemEntry = Stats & { absolutePath: string; }
const fsp = fs.promises; 

const extendWithPathname = (stats: Stats, absolutePath: string): FileSystemEntry =>
    Object.assign(stats, { absolutePath });

const _fullReaddir = async dirname => {
    const names = await fsp.readdir(dirname);
    const absolutePaths = names.map(ent => path.resolve(dirname, ent));
    const stats = await Promise.all(absolutePaths.map(ent => fsp.stat(ent)));
    const fsEntries = zipWith(stats, absolutePaths, extendWithPathname);

    return fsEntries;
};

const fullReaddir_segregate = async (dirname: string) => {
    const fsEntries = await _fullReaddir(dirname);
    const directories = fsEntries.filter(ent => ent.isDirectory());
    const files = fsEntries.filter(ent => ent.isFile());
    
    return [directories, files];
}

const fullReaddir_segregate_getPaths = async (dirname: string) => {
    const [directories, files] = await fullReaddir_segregate(dirname);
    const directoriesNames = directories.map(ent => ent.absolutePath);
    const filesNames = files.map(ent => ent.absolutePath);

    return [directoriesNames, filesNames];
}

const segregate = Object.assign(fullReaddir_segregate, {
    getPaths: fullReaddir_segregate_getPaths
});

const fullReaddir = Object.assign(_fullReaddir, {
    segregate
});

export default fullReaddir;