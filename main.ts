import { promises as fs } from 'fs';
import * as path from 'path';
import { flatten } from './tools';

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

const zipWith = (a1, a2, f) => a1.map((x, i) => f(x, a2[i]));

const helpers = {
    fullReaddir: async dirname => {
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
}

class LS {

    shallow(dirname = __dirname): Promise<FileSystemEntry[]> {
        return helpers.fullReaddir(dirname);
    }


    async recursive(dirname = __dirname): Promise<FileSystemEntry[]> {
        const fsEntries = await this.shallow(dirname);
        const files = fsEntries.filter(ent => ent.isFile);
        const directories = fsEntries.filter(ent => ent.isDirectory);
        const belowP = directories.map(dir => this.recursive(dir.absolutePath));
        const below = await Promise.all(belowP);
        const res = flatten([files, directories, below]);
        return res;
    }
}

class Shell {
    get ls() {
        return new LS();
    }
}

const main = async () => {
    const $ = new Shell();
    const res = await $.ls.recursive('./testdir');

    console.log(res);
}; main();





