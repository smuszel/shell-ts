import { FileSystemEntryInter } from './../intermediates/FileSystemEntryInter';
import { fullReaddir } from '../helpers';
import { flatten } from '../tools';

export default class LS {

    _shallow = (dirname = __dirname): Promise<FileSystemEntry[]> => {
        return fullReaddir(dirname);
    }

    _recursive = async (dirname = __dirname): Promise<FileSystemEntry[]> => {
        const fsEntries = await this._shallow(dirname);
        const files = fsEntries.filter(ent => ent.isFile);
        const directories = fsEntries.filter(ent => ent.isDirectory);
        const belowP = directories.map(dir => this._recursive(dir.absolutePath));
        const below = await Promise.all(belowP);
        const res = flatten([files, directories, below]);
        return res;
    }

    runningAlgorithm = this._shallow;

    get r() {
        this.runningAlgorithm = this._recursive;
        return this;
    }

    shx(p) {
        const result1 = this.runningAlgorithm(p);
        return new FileSystemEntryInter(result1);
    }
}
