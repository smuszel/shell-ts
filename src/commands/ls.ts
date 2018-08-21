import { flatten } from '../tools';
import { promises as fs } from 'fs';
import { resolve } from 'path'; 
import { isDirectory, fullReaddir } from '../helpers';

class Ls {
    
   private  _shallow = async dirname => {
        const entryNames = await fs.readdir(dirname);
       const absoluteEntryPaths = entryNames.map(name => resolve(dirname, name));
       
        return absoluteEntryPaths;
    }

    get r() {
        return new LsRecursive();
    }

    shx = async (dirname = __dirname): Promise<string[]> => {
        const i = await isDirectory(dirname);
    
        if (i) {
            return this._shallow(dirname);
        } else {
            return [dirname];
        }
    }
}


class LsRecursive {

    private _recursive = async dirname => {
        const fsEntries = await fullReaddir(dirname);

        const directoryEntriesNames = fsEntries
            .filter(ent => ent.isDirectory)
            .map(ent => ent.absolutePath)
            ;
        
        const fileEntriesNames = fsEntries
            .filter(ent => ent.isFile)
            .map(ent => ent.absolutePath)
            ;

        const promisesBelow = directoryEntriesNames.map(n => this._recursive(n));
        const namesBelow = await Promise.all(promisesBelow);

        return [fileEntriesNames, directoryEntriesNames, namesBelow];
    }

    shx = async (dirname = __dirname): Promise<string[]> => {
        const i = await isDirectory(dirname);

        if (isDirectory) {
            const resNested = await this._recursive(dirname);
            const res = flatten(resNested);

            return res;
        } else {
            return [dirname];
        }
    }
}

export default new Ls();